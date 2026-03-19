import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Message } from '@/types'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface ChatState {
  messages: Message[]
  activeRequestId: string | null
  isLoading: boolean
  channel: RealtimeChannel | null
  openChat: (requestId: string) => Promise<void>
  closeChat: () => void
  sendMessage: (requestId: string, senderId: string, text: string) => Promise<void>
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  activeRequestId: null,
  isLoading: false,
  channel: null,

  openChat: async (requestId) => {
    // Unsubscribe from previous channel
    get().closeChat()

    set({ isLoading: true, activeRequestId: requestId, messages: [] })

    // Fetch existing messages
    const { data, error } = await supabase
      .from('messages')
      .select('*, profiles(id, first_name, last_name, avatar_url)')
      .eq('request_id', requestId)
      .order('created_at', { ascending: true })

    if (!error) {
      set({ messages: (data as Message[]) ?? [] })
    }
    set({ isLoading: false })

    // Subscribe to new messages via Realtime
    const channel = supabase
      .channel(`messages:${requestId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `request_id=eq.${requestId}`,
        },
        async (payload) => {
          // Fetch the full row with profile join so UI has sender info
          const { data: msg } = await supabase
            .from('messages')
            .select('*, profiles(id, first_name, last_name, avatar_url)')
            .eq('id', payload.new['id'])
            .single()

          if (msg) {
            set((s) => ({
              messages: [...s.messages, msg as Message],
            }))
          }
        }
      )
      .subscribe()

    set({ channel })
  },

  closeChat: () => {
    const { channel } = get()
    if (channel) {
      supabase.removeChannel(channel)
    }
    set({ channel: null, activeRequestId: null, messages: [] })
  },

  sendMessage: async (requestId, senderId, text) => {
    const { error } = await supabase
      .from('messages')
      .insert({ request_id: requestId, sender_id: senderId, text })

    if (error) throw new Error(error.message)
    // Realtime subscription will push the new message into state automatically
  },
}))

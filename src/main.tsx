import { StrictMode, Component } from 'react'
import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import './styles/globals.css'
import { supabaseMisconfigured } from './lib/supabase'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif', gap: 12 }}>
          <h2 style={{ margin: 0 }}>Что-то пошло не так</h2>
          <p style={{ color: '#666', margin: 0 }}>{(this.state.error as Error).message}</p>
          <button onClick={() => window.location.reload()} style={{ padding: '8px 16px', cursor: 'pointer' }}>Перезагрузить</button>
        </div>
      )
    }
    return this.props.children
  }
}

if (supabaseMisconfigured) {
  console.warn('[StudyBuddy] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set. Copy .env.example to .env.local and fill in your values.')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

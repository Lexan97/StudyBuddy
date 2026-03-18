import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAuthStore } from '@/stores/authStore'

const LandingPage = lazy(() => import('@/pages/LandingPage'))
const AuthPage = lazy(() => import('@/pages/AuthPage'))
const FeedPage = lazy(() => import('@/pages/FeedPage'))
const CreateTaskPage = lazy(() => import('@/pages/CreateTaskPage'))
const TaskPage = lazy(() => import('@/pages/TaskPage'))
const ChatsPage = lazy(() => import('@/pages/ChatsPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const MyTasksPage = lazy(() => import('@/pages/MyTasksPage'))
const MyResponsesPage = lazy(() => import('@/pages/MyResponsesPage'))
const ReputationPage = lazy(() => import('@/pages/ReputationPage'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Загрузка...</p>
      </div>
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isInitialized = useAuthStore((s) => s.isInitialized)

  if (!isInitialized) return <PageLoader />
  if (!isAuthenticated) return <Navigate to="/auth" replace />
  return <>{children}</>
}

export default function App() {
  const initialize = useAuthStore((s) => s.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/create-task" element={<CreateTaskPage />} />
            <Route path="/task/:id" element={<TaskPage />} />
            <Route path="/chats" element={<ChatsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/my-tasks" element={<MyTasksPage />} />
            <Route path="/my-responses" element={<MyResponsesPage />} />
            <Route path="/reputation" element={<ReputationPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

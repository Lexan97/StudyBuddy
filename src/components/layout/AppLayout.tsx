import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { ToastContainer } from '@/components/shared/Toast'

export function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <MobileNav />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}

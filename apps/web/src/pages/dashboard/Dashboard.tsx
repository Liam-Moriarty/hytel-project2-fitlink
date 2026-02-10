import { Outlet } from 'react-router-dom'
import TraineeSidebar from '@/components/TraineeSidebar'
import TrainerSidebar from '@/components/TrainerSidebar'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

const Dashboard = () => {
  const { userData } = useAuthStore()
  const userRole = userData?.role

  return (
    <SidebarProvider>
      {/* Sidebar - conditional based on role */}
      {userRole === 'trainee' ? <TraineeSidebar /> : <TrainerSidebar />}

      {/* Main Content */}
      <SidebarInset>
        <div className="p-8 ">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Dashboard

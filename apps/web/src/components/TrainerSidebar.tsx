import { Link, useLocation } from 'react-router-dom'
import { LogOut, Dumbbell, ChevronRight, ChevronLeft } from 'lucide-react'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/lib/store/useAuthStore'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useSidebar } from '@/components/ui/sidebar'
import { getAvatarColor, navItemsTrainer } from '@/constants'

const TrainerSidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const clearAuth = useAuthStore(state => state.clearAuth)
  const userData = useAuthStore(state => state.userData)
  const { state, toggleSidebar } = useSidebar()
  const isCollapsed = state === 'collapsed'

  const userEmail = userData?.email || ''
  const userRole = userData?.role || ''

  const handleLogout = async () => {
    try {
      await signOut(auth)
      clearAuth()
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const getInitial = (email: string) => {
    return email.charAt(0).toUpperCase() || 'U'
  }

  const avatarColor = getAvatarColor(userEmail)
  const initial = getInitial(userEmail)

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b bg-background">
        <div className="flex items-center gap-3 p-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:h-12">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary transition-all duration-300 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8">
            <Dumbbell className="h-6 w-6 transition-all duration-300 group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <h1 className="text-xl font-bold text-primary">FitPro</h1>
            <p className="text-xs text-muted-foreground">Trainer Portal</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-background p-4 group-data-[collapsible=icon]:p-2">
        <SidebarMenu>
          {navItemsTrainer.map(item => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.name}
                  className={`
                    transition-all duration-300 ease-in-out
                    focus-visible:ring-0 focus-visible:ring-offset-0 
                    select-none active:bg-transparent
                    hover:bg-primary/10 hover:text-primary
                    data-[active=true]:bg-primary data-[active=true]:text-primary-foreground
                    data-[active=true]:hover:bg-primary/90
                  `}
                >
                  <Link to={item.path}>
                    <Icon
                      className={`${isActive ? 'text-primary-foreground' : 'text-foreground'}`}
                    />
                    <span className={`${isActive ? 'text-primary-foreground' : 'text-foreground'}`}>
                      {item.name}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="relative border-t bg-background">
        <div className="absolute -top-10 right-2">
          <SidebarMenuItem className="flex justify-start items-start">
            <SidebarMenuButton
              onClick={toggleSidebar}
              tooltip={isCollapsed ? 'Expand' : 'Collapse'}
              className="flex w-fit items-center justify-center text-primary hover:text-primary hover:bg-muted transition-all duration-300 border"
            >
              {isCollapsed ? (
                <ChevronRight className="h-6 w-6 shrink-0" />
              ) : (
                <ChevronLeft className="h-6 w-6 shrink-0" />
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </div>

        {/* User Profile Section */}
        <SidebarMenuItem>
          <div
            className="flex items-center gap-3 px-2 py-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
            title={isCollapsed ? `${userEmail}\n${userRole}` : ''}
          >
            {/* Profile Picture */}
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${avatarColor.bg} transition-all duration-300`}
            >
              <span className={`text-md font-semibold ${avatarColor.text}`}>{initial}</span>
            </div>

            {/* Email and Role - Hidden when collapsed */}
            <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-sm font-medium truncate text-foreground cursor-help">
                    {userEmail}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{userEmail}</p>
                </TooltipContent>
              </Tooltip>
              <span className="text-xs text-muted-foreground capitalize truncate">{userRole}</span>
            </div>
          </div>
        </SidebarMenuItem>

        {/* Logout button */}
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={handleLogout}
            tooltip="Log Out"
            className="text-red-400 hover:text-red-300 hover:bg-red-600/20 mb-2"
          >
            <LogOut />
            <span>Log Out</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  )
}

export default TrainerSidebar

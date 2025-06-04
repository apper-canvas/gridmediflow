import { useState } from 'react'
import AppHeader from '../organisms/AppHeader'
import AppSidebar from '../organisms/AppSidebar'
import MobileNavigation from '../organisms/MobileNavigation'

const DashboardTemplate = ({ children, navigation }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-surface-50">
      <AppHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <AppSidebar navigation={navigation} collapsed={sidebarCollapsed} />
      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="p-4 lg:p-6 space-y-6">
          {children}
        </div>
      </main>
      <MobileNavigation navigation={navigation} collapsed={sidebarCollapsed} />
    </div>
  )
}

export default DashboardTemplate
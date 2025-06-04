import { motion } from 'framer-motion'
import ApperIcon from '../ApperIcon'
import Button from '../atoms/Button'

const AppSidebar = ({ navigation, collapsed }) => {
  return (
    <aside className={`fixed top-16 left-0 bottom-0 bg-white border-r border-surface-200 transition-all duration-300 z-30 ${collapsed ? 'w-20' : 'w-64'} hidden lg:block`}>
      <nav className="p-4 space-y-2">
        {navigation.map((item) => (
          <Button
            key={item.name}
            whileHover={{ x: 4 }}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left ${
              item.active 
                ? 'bg-primary text-white shadow-lg' 
                : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
            }`}
            iconName={item.icon}
            iconSize={20}
          >
            {!collapsed && <span className="font-medium">{item.name}</span>}
          </Button>
        ))}
      </nav>
    </aside>
  )
}

export default AppSidebar
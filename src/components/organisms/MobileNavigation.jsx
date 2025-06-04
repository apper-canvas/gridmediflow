import ApperIcon from '../ApperIcon'
import Button from '../atoms/Button'

const MobileNavigation = ({ navigation, collapsed }) => {
  return (
    <div className={`fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity duration-300 ${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className={`fixed top-16 left-0 bottom-0 w-64 bg-white transform transition-transform duration-300 ${collapsed ? '-translate-x-full' : 'translate-x-0'}`}>
        <nav className="p-4 space-y-2">
          {navigation.map((item) => (
            <Button
              key={item.name}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left ${
                item.active 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
              }`}
              iconName={item.icon}
              iconSize={20}
            >
              <span className="font-medium">{item.name}</span>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default MobileNavigation
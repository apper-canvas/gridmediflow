import ApperIcon from '../ApperIcon'
import AppLogo from '../atoms/AppLogo'
import Avatar from '../atoms/Avatar'
import Button from '../atoms/Button'
import SearchBar from '../molecules/SearchBar'

const AppHeader = ({ onMenuToggle }) => {
  return (
    <header className="bg-white border-b border-surface-200 h-16 fixed top-0 left-0 right-0 z-40 medical-gradient">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center space-x-4">
          <Button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-surface-100 lg:hidden"
            iconName="Menu"
            iconSize={20}
          />
          <AppLogo />
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <SearchBar placeholder="Search patients by ID or name..." className="w-64 lg:w-80" />
          </div>
          
          <Button className="relative p-2 rounded-lg hover:bg-surface-100">
            <ApperIcon name="Bell" size={20} className="text-surface-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full"></span>
          </Button>
          
          <Avatar 
            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=32&h=32&fit=crop&crop=face"
            alt="Dr. Sarah Johnson"
            name="Dr. Johnson"
          />
        </div>
      </div>
    </header>
  )
}

export default AppHeader
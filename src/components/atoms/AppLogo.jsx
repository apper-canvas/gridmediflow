import ApperIcon from '../ApperIcon'

const AppLogo = ({ title = 'MediFlow', iconName = 'Heart', iconSize = 20, iconClassName = 'text-white' }) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
        <ApperIcon name={iconName} size={iconSize} className={iconClassName} />
      </div>
      <h1 className="text-xl font-bold text-surface-900 hidden sm:block">{title}</h1>
    </div>
  )
}

export default AppLogo
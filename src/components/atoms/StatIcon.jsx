import ApperIcon from '../ApperIcon'

const StatIcon = ({ iconName, size = 20, colorClass = 'bg-primary/10 text-primary' }) => {
  return (
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
      <ApperIcon name={iconName} size={size} />
    </div>
  )
}

export default StatIcon
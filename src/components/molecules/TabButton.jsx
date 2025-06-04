import ApperIcon from '../ApperIcon'
import { motion } from 'framer-motion'

const TabButton = ({ tab, activeTab, onClick }) => {
  return (
    <button
      key={tab.id}
      onClick={() => onClick(tab.id)}
      className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-all duration-200 ${
        activeTab === tab.id
          ? 'border-primary text-primary font-medium'
          : 'border-transparent text-surface-600 hover:text-surface-900 hover:border-surface-300'
      }`}
    >
      <ApperIcon name={tab.icon} size={18} />
      <span className="hidden sm:inline">{tab.label}</span>
    </button>
  )
}

export default TabButton
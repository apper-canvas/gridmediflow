import { motion } from 'framer-motion'
import StatIcon from '../atoms/StatIcon'
import ProgressBar from '../atoms/ProgressBar'

const QuickStatCard = ({ stat, index }) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent',
    error: 'bg-error/10 text-error'
  }

  const progressBarColorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
    error: 'bg-error'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="medical-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <StatIcon iconName={stat.icon} colorClass={colorClasses[stat.color]} />
        <span className="text-2xl font-bold text-surface-900">{stat.value}</span>
      </div>
      <h3 className="text-sm font-medium text-surface-600 mb-3">{stat.title}</h3>
      <ProgressBar progress={stat.progress} colorClass={progressBarColorClasses[stat.color]} />
    </motion.div>
  )
}

export default QuickStatCard
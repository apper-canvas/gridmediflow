import QuickStatCard from '../molecules/QuickStatCard'

const QuickStatsGrid = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {stats.map((stat, index) => (
        <QuickStatCard key={stat.title} stat={stat} index={index} />
      ))}
    </div>
  )
}

export default QuickStatsGrid
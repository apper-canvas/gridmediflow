import { motion } from 'framer-motion'
import Avatar from '../atoms/Avatar'
import Badge from '../atoms/Badge'
import ApperIcon from '../ApperIcon'

const PatientCard = ({ patient, index }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-success text-white'
      case 'inactive':
        return 'bg-surface-400 text-white'
      case 'critical':
        return 'bg-error text-white'
      default:
        return 'bg-primary text-white'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Never'
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch (error) {
      return 'Invalid Date'
    }
  }

  // Handle both database fields and legacy field names
  const patientName = patient?.Name || patient?.name || `${patient?.first_name || ''} ${patient?.last_name || ''}`.trim() || 'Unknown Patient'
  const patientEmail = patient?.email || 'No email'
  const patientPhone = patient?.phone || 'No phone'
  const patientAge = patient?.age ? `${patient.age} years` : 'Age unknown'
  const lastVisit = patient?.last_visit || patient?.lastVisit
  const bloodType = patient?.blood_type || patient?.bloodType || 'Unknown'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="medical-card p-4 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Avatar 
            name={patientName} 
            size="md" 
            src={patient?.avatar || patient?.AvatarUrl}
          />
          <div>
            <h3 className="font-semibold text-surface-900 group-hover:text-primary transition-colors">
              {patientName}
            </h3>
            <p className="text-sm text-surface-600">{patientEmail}</p>
          </div>
        </div>
        <Badge className={getStatusColor(patient?.status || 'active')}>
          {patient?.status || 'Active'}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Phone" size={14} className="text-surface-400" />
          <span className="text-surface-600">{patientPhone}</span>
        </div>
        <div className="flex items-center space-x-2">
          <ApperIcon name="MapPin" size={14} className="text-surface-400" />
          <span className="text-surface-600">{patientAge}</span>
        </div>
        <div className="flex items-center space-x-2">
          <ApperIcon name="Calendar" size={14} className="text-surface-400" />
          <span className="text-surface-600">Last visit: {formatDate(lastVisit)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <ApperIcon name="Heart" size={14} className="text-surface-400" />
          <span className="text-surface-600">{bloodType}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default PatientCard
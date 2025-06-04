import { motion } from 'framer-motion'
import Badge from '../atoms/Badge'
import ApperIcon from '../ApperIcon'

const PrescriptionItem = ({ prescription, index }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-success text-white'
      case 'inactive':
        return 'bg-surface-400 text-white'
      case 'renewed':
        return 'bg-primary text-white'
      case 'expired':
        return 'bg-error text-white'
      default:
        return 'bg-surface-400 text-white'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No date'
    
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
  const patientName = prescription?.Name || prescription?.patientName || 'Unknown Patient'
  const doctorName = prescription?.doctor_name || prescription?.doctorName || 'Unknown Doctor'
  const prescriptionStatus = prescription?.status || 'Unknown'
  const dateIssued = prescription?.date_issued || prescription?.dateIssued
  const duration = prescription?.duration || 'No duration'
  const medications = prescription?.medications || 'No medications listed'
  const dosage = prescription?.dosage

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="medical-card p-4"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-surface-900">
              {patientName}
            </h3>
            <Badge className={getStatusColor(prescriptionStatus)}>
              {prescriptionStatus}
            </Badge>
          </div>
          <p className="text-sm text-surface-600 mb-1">
            Dr. {doctorName}
          </p>
          <div className="flex items-center space-x-4 text-sm text-surface-500">
            <div className="flex items-center space-x-1">
              <ApperIcon name="Calendar" size={14} />
              <span>Issued: {formatDate(dateIssued)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="Clock" size={14} />
              <span>{duration}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-sm font-medium text-surface-700 mb-1">Medications:</p>
          <p className="text-sm text-surface-600 bg-surface-50 p-2 rounded">
            {medications}
          </p>
        </div>
        
        {dosage && (
          <div>
            <p className="text-sm font-medium text-surface-700 mb-1">Dosage:</p>
            <p className="text-sm text-surface-600">
              {dosage}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default PrescriptionItem
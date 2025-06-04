import { motion } from 'framer-motion'
import Badge from '../atoms/Badge'
import Button from '../atoms/Button'
import ApperIcon from '../ApperIcon'

const AppointmentItem = ({ appointment, index, updateAppointmentStatus, getTypeColor }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'bg-primary text-white'
      case 'completed':
        return 'bg-success text-white'
      case 'cancelled':
        return 'bg-error text-white'
      case 'rescheduled':
        return 'bg-accent text-white'
      default:
        return 'bg-surface-400 text-white'
    }
  }

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'No date set'
    
    try {
      const date = new Date(dateTimeString)
      return {
        date: date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        time: date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    } catch (error) {
      return { date: 'Invalid Date', time: '' }
    }
  }

  const handleStatusChange = (newStatus) => {
    if (updateAppointmentStatus) {
      updateAppointmentStatus(appointment.Id || appointment.id, newStatus)
    }
  }

  // Handle both database fields and legacy field names
  const patientName = appointment?.Name || appointment?.patientName || 'Unknown Patient'
  const doctorName = appointment?.doctor_name || appointment?.doctorName || 'Unknown Doctor'
  const appointmentType = appointment?.type || 'General'
  const appointmentStatus = appointment?.status || 'Unknown'
  const appointmentNotes = appointment?.notes
  const dateTime = formatDateTime(appointment?.date_time || appointment?.dateTime)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="medical-card p-4"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-surface-900">
              {patientName}
            </h3>
            <Badge className={`${getTypeColor(appointmentType)} text-white`}>
              {appointmentType}
            </Badge>
          </div>
          <p className="text-sm text-surface-600 mb-1">
            Dr. {doctorName}
          </p>
          <div className="flex items-center space-x-4 text-sm text-surface-500">
            <div className="flex items-center space-x-1">
              <ApperIcon name="Calendar" size={14} />
              <span>{dateTime.date}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="Clock" size={14} />
              <span>{dateTime.time}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <Badge className={getStatusColor(appointmentStatus)}>
            {appointmentStatus}
          </Badge>
          {appointmentStatus === 'Scheduled' && (
            <div className="flex space-x-1">
              <Button
                size="sm"
                onClick={() => handleStatusChange('Completed')}
                className="bg-success text-white hover:bg-success/90 text-xs px-2 py-1"
              >
                Complete
              </Button>
              <Button
                size="sm"
                onClick={() => handleStatusChange('Cancelled')}
                className="bg-error text-white hover:bg-error/90 text-xs px-2 py-1"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {appointmentNotes && (
        <div className="mt-3 p-2 bg-surface-50 rounded-lg">
          <p className="text-sm text-surface-600">{appointmentNotes}</p>
        </div>
      )}
    </motion.div>
  )
}

export default AppointmentItem
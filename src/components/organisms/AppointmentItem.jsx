import { motion } from 'framer-motion'
import Badge from '../atoms/Badge'
import Button from '../atoms/Button'

const AppointmentItem = ({ appointment, index, updateAppointmentStatus, getTypeColor }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-primary/10 text-primary'
      case 'in-progress': return 'bg-accent/10 text-accent'
      case 'completed': return 'bg-secondary/10 text-secondary'
      case 'cancelled': return 'bg-error/10 text-error'
      default: return 'bg-surface-200 text-surface-600'
    }
  }

  return (
    <motion.div
      key={appointment?.id || index}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="medical-card p-4 hover:shadow-medical-hover transition-all duration-200"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`w-3 h-3 rounded-full ${
              getTypeColor(appointment?.type) === 'primary' ? 'bg-primary' :
              getTypeColor(appointment?.type) === 'secondary' ? 'bg-secondary' :
              getTypeColor(appointment?.type) === 'error' ? 'bg-error' :
              'bg-accent'
            }`}></div>
            <h4 className="font-semibold text-surface-900">{appointment?.patientName || 'Unknown Patient'}</h4>
            <Badge className={getStatusColor(appointment?.status)}>
              {appointment?.status || 'scheduled'}
            </Badge>
          </div>
          <div className="text-sm text-surface-600 space-y-1">
            <p>Doctor: {appointment?.doctorName || 'N/A'}</p>
            <p>Time: {appointment?.dateTime ? new Date(appointment.dateTime).toLocaleString() : 'N/A'}</p>
            <p>Type: {appointment?.type || 'consultation'}</p>
            {appointment?.notes && <p>Notes: {appointment.notes}</p>}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mt-3 sm:mt-0">
          {appointment?.status === 'scheduled' && (
            &lt;&gt;
              <Button
                onClick={() => updateAppointmentStatus(appointment.id, 'in-progress')}
                className="px-3 py-1.5 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 text-sm"
              >
                Start
              </Button>
              <Button
                onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                className="px-3 py-1.5 bg-error/10 text-error rounded-lg hover:bg-error/20 text-sm"
              >
                Cancel
              </Button>
            &lt;/&gt;
          )}
          {appointment?.status === 'in-progress' && (
            <Button
              onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
              className="px-3 py-1.5 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 text-sm"
            >
              Complete
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default AppointmentItem
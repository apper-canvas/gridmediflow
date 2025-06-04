import { motion } from 'framer-motion'
import ApperIcon from '../ApperIcon'
import Button from '../atoms/Button'

const PatientCard = ({ patient, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="medical-card p-4 cursor-pointer group"
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
          <ApperIcon name="User" size={20} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-surface-900 truncate">
            {patient?.personalInfo?.firstName || 'N/A'} {patient?.personalInfo?.lastName || ''}
          </h4>
          <p className="text-sm text-surface-500">ID: {patient?.id || 'N/A'}</p>
        </div>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-surface-600">Age:</span>
          <span className="font-medium">{patient?.personalInfo?.age || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-surface-600">Blood Type:</span>
          <span className="font-medium text-error">{patient?.personalInfo?.bloodType || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-surface-600">Last Visit:</span>
          <span className="font-medium">{patient?.personalInfo?.lastVisit || 'N/A'}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-surface-200 flex space-x-2">
        <Button className="flex-1 text-xs bg-primary/10 text-primary py-2 px-3 rounded-lg hover:bg-primary/20">
          View Record
        </Button>
        <Button className="flex-1 text-xs bg-secondary/10 text-secondary py-2 px-3 rounded-lg hover:bg-secondary/20">
          Book Appt.
        </Button>
      </div>
    </motion.div>
  )
}

export default PatientCard
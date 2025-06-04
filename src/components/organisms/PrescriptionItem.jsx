import { motion } from 'framer-motion'
import Button from '../atoms/Button'

const PrescriptionItem = ({ prescription, index }) => {
  return (
    <motion.div
      key={prescription?.id || index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="medical-card p-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-surface-900 mb-2">{prescription?.patientName || 'Unknown Patient'}</h4>
          <div className="text-sm text-surface-600 space-y-1">
            <p>Doctor: {prescription?.doctorName || 'N/A'}</p>
            <p>Medications: {prescription?.medications?.map(med => med.name).join(', ') || 'N/A'}</p>
            <p>Date: {prescription?.dateIssued ? new Date(prescription.dateIssued).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-3 sm:mt-0">
          <Button className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 text-sm">
            View
          </Button>
          <Button className="px-3 py-1.5 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 text-sm">
            Refill
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default PrescriptionItem
import { motion } from 'framer-motion'
import ApperIcon from '../ApperIcon'
import Card from '../atoms/Card'
import Button from '../atoms/Button'
import ErrorDisplay from '../molecules/ErrorDisplay'
import PatientCard from '../molecules/PatientCard'

const RecentPatientsSection = ({ patients, error }) => {
  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h3 className="text-lg font-semibold text-surface-900 mb-2 sm:mb-0">Recent Patients</h3>
        <Button className="text-primary hover:text-primary-dark font-medium" iconName="ArrowRight" iconPosition="right">
          View All Patients
        </Button>
      </div>
      
      {error ? (
        <ErrorDisplay message={`Error loading patients: ${error}`} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {(patients || []).slice(0, 8).map((patient, index) => (
            <PatientCard key={patient?.id || index} patient={patient} index={index} />
          ))}
        </div>
      )}
    </Card>
  )
}

export default RecentPatientsSection
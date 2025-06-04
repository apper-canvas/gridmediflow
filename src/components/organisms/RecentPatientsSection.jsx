import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { patientService } from '../../services'
import PatientList from './PatientList'
import NoDataDisplay from '../molecules/NoDataDisplay'
import ErrorDisplay from '../molecules/ErrorDisplay'
import Card from '../atoms/Card'
import ApperIcon from '../ApperIcon'
import Spinner from '../atoms/Spinner'

const RecentPatientsSection = ({ patients: initialPatients, error: initialError }) => {
  const [patients, setPatients] = useState(initialPatients || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(initialError || null)
  const [showAllPatients, setShowAllPatients] = useState(false)

  useEffect(() => {
    if (!initialPatients || initialPatients.length === 0) {
      loadPatients()
    }
  }, [])

  const loadPatients = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await patientService.getAll()
      setPatients(data || [])
    } catch (err) {
      setError(err.message || 'Failed to load patients')
    } finally {
      setLoading(false)
    }
  }

  const displayPatients = showAllPatients ? patients : patients.slice(0, 4)

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl flex items-center justify-center">
            <ApperIcon name="Users" size={20} className="text-secondary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-surface-900">Recent Patients</h2>
            <p className="text-surface-600 text-sm">Latest patient registrations and visits</p>
          </div>
        </div>
        {patients.length > 4 && (
          <button
            onClick={() => setShowAllPatients(!showAllPatients)}
            className="text-primary hover:text-primary-dark font-medium text-sm transition-colors"
          >
            {showAllPatients ? 'Show Less' : `View All (${patients.length})`}
          </button>
        )}
      </div>

      {loading && <Spinner message="Loading patients..." />}
      
      {!loading && error && <ErrorDisplay message={error} />}
      
      {!loading && !error && patients.length === 0 && (
        <NoDataDisplay 
          icon="Users"
          title="No patients found"
          description="Start by adding your first patient to the system."
        />
      )}
      
      {!loading && !error && patients.length > 0 && <PatientList patients={displayPatients} />}
    </Card>
  )
}

export default RecentPatientsSection
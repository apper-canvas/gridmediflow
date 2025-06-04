import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { patientService, appointmentService, prescriptionService } from '../../services'
import Card from '../atoms/Card'
import TabButton from '../molecules/TabButton'
import SearchBar from '../molecules/SearchBar'
import Select from '../molecules/Select'
import AppointmentList from './AppointmentList'
import PatientList from './PatientList'
import PrescriptionList from './PrescriptionList'
import NoDataDisplay from '../molecules/NoDataDisplay'
import ErrorDisplay from '../molecules/ErrorDisplay'
import Modal from '../molecules/Modal'
import AddAppointmentForm from '../molecules/AddAppointmentForm'
import ApperIcon from '../ApperIcon'
import Button from '../atoms/Button'
import Spinner from '../atoms/Spinner'

const MainFeature = () => {
  const [activeTab, setActiveTab] = useState('appointments')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  
  // Data states
  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load data on component mount and when tab changes
  useEffect(() => {
    loadData()
  }, [activeTab])

  // Load data when filters change
  useEffect(() => {
    loadData()
  }, [searchTerm, statusFilter])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const filters = {
        searchTerm: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined
      }

      switch (activeTab) {
        case 'appointments':
          const appointmentData = await appointmentService.getAll(filters)
          setAppointments(appointmentData || [])
          break
        case 'patients':
          const patientData = await patientService.getAll(filters)
          setPatients(patientData || [])
          break
        case 'prescriptions':
          const prescriptionData = await prescriptionService.getAll(filters)
          setPrescriptions(prescriptionData || [])
          break
      }
    } catch (err) {
      setError(`Failed to load ${activeTab}`)
      console.error(`Error loading ${activeTab}:`, err)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'appointments', label: 'Appointments', icon: 'Calendar', count: appointments.length },
    { id: 'patients', label: 'Patients', icon: 'Users', count: patients.length },
    { id: 'prescriptions', label: 'Prescriptions', icon: 'Pill', count: prescriptions.length }
  ]

  const appointmentTypes = [
    { value: 'Check-up', label: 'Check-up', color: 'primary' },
    { value: 'Consultation', label: 'Consultation', color: 'secondary' },
    { value: 'Follow-up', label: 'Follow-up', color: 'accent' },
    { value: 'Emergency', label: 'Emergency', color: 'error' }
  ]

  const statusOptions = {
    appointments: [
      { value: 'all', label: 'All Status' },
      { value: 'Scheduled', label: 'Scheduled' },
      { value: 'Completed', label: 'Completed' },
      { value: 'Cancelled', label: 'Cancelled' },
      { value: 'Rescheduled', label: 'Rescheduled' }
    ],
    patients: [
      { value: 'all', label: 'All Patients' }
    ],
    prescriptions: [
      { value: 'all', label: 'All Status' },
      { value: 'Active', label: 'Active' },
      { value: 'Inactive', label: 'Inactive' },
      { value: 'Renewed', label: 'Renewed' },
      { value: 'Expired', label: 'Expired' }
    ]
  }

  const updateAppointmentStatus = async (id, newStatus) => {
    try {
      setLoading(true)
      await appointmentService.update(id, { status: newStatus })
      // Reload appointments to get updated data
      const updatedAppointments = await appointmentService.getAll({
        searchTerm: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined
      })
      setAppointments(updatedAppointments || [])
    } catch (err) {
      setError('Failed to update appointment status')
      console.error('Error updating appointment:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAppointment = async (appointmentData) => {
    try {
      setLoading(true)
      await appointmentService.create(appointmentData)
      setIsAddModalOpen(false)
      // Reload appointments
      const updatedAppointments = await appointmentService.getAll({
        searchTerm: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined
      })
      setAppointments(updatedAppointments || [])
    } catch (err) {
      setError('Failed to create appointment')
      console.error('Error creating appointment:', err)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentData = () => {
    switch (activeTab) {
      case 'appointments':
        return appointments
      case 'patients':
        return patients
      case 'prescriptions':
        return prescriptions
      default:
        return []
    }
  }

  const getCurrentPlaceholder = () => {
    switch (activeTab) {
      case 'appointments':
        return 'Search appointments by patient or doctor...'
      case 'patients':
        return 'Search patients by name...'
      case 'prescriptions':
        return 'Search prescriptions by doctor...'
      default:
        return 'Search...'
    }
  }

  const renderContent = () => {
    const currentData = getCurrentData()

    if (loading) {
      return <Spinner message={`Loading ${activeTab}...`} />
    }

    if (error) {
      return <ErrorDisplay message={error} />
    }

    if (currentData.length === 0) {
      return (
        <NoDataDisplay 
          icon={tabs.find(tab => tab.id === activeTab)?.icon || 'FileX'}
          title={`No ${activeTab} found`}
          description={searchTerm || statusFilter !== 'all' 
            ? `No ${activeTab} match your current filters.`
            : `You haven't added any ${activeTab} yet.`
          }
        />
      )
    }

    switch (activeTab) {
      case 'appointments':
        return (
          <AppointmentList 
            appointments={currentData}
            updateAppointmentStatus={updateAppointmentStatus}
            appointmentTypes={appointmentTypes}
          />
        )
      case 'patients':
        return <PatientList patients={currentData} />
      case 'prescriptions':
        return <PrescriptionList prescriptions={currentData} />
      default:
        return null
    }
  }

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
            <ApperIcon name="Activity" size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-surface-900">Medical Records</h2>
            <p className="text-surface-600 text-sm">Manage patients, appointments, and prescriptions</p>
          </div>
        </div>
        
        {activeTab === 'appointments' && (
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary text-white hover:bg-primary-dark"
            disabled={loading}
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Appointment
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-surface-100 p-1 rounded-xl">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            icon={tab.icon}
            label={tab.label}
            count={tab.count}
            disabled={loading}
          />
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchBar
          placeholder={getCurrentPlaceholder()}
          value={searchTerm}
          onChange={setSearchTerm}
          className="flex-1"
          disabled={loading}
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          options={statusOptions[activeTab] || []}
          className="sm:w-48"
          disabled={loading}
        />
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {/* Add Appointment Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule New Appointment"
      >
        <AddAppointmentForm 
          onSubmit={handleAddAppointment}
          onCancel={() => setIsAddModalOpen(false)}
          appointmentTypes={appointmentTypes}
          patients={patients}
          loading={loading}
        />
      </Modal>
    </Card>
  )
}

export default MainFeature
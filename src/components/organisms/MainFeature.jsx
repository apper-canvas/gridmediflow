import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Card from '../atoms/Card'
import Button from '../atoms/Button'
import SearchBar from '../molecules/SearchBar'
import Select from '../molecules/Select'
import TabButton from '../molecules/TabButton'
import AddAppointmentForm from '../molecules/AddAppointmentForm'
import Modal from '../molecules/Modal'
import ErrorDisplay from '../molecules/ErrorDisplay'
import NoDataDisplay from '../molecules/NoDataDisplay'
import Spinner from '../atoms/Spinner'
import AppointmentList from './AppointmentList'
import PatientList from './PatientList'
import PrescriptionList from './PrescriptionList'
import { appointmentService, patientService, prescriptionService } from '../../services'

const MainFeature = () => {
  const [activeTab, setActiveTab] = useState('appointments')
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Form state for new appointment
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    doctorName: 'Dr. Sarah Johnson',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    type: 'consultation',
    notes: ''
  })

  const tabs = [
    { id: 'appointments', label: 'Appointments', icon: 'Calendar' },
    { id: 'patients', label: 'Patient Search', icon: 'Search' },
    { id: 'prescriptions', label: 'Prescriptions', icon: 'Pill' }
  ]

  const appointmentTypes = [
    { value: 'consultation', label: 'Consultation', color: 'primary' },
    { value: 'follow-up', label: 'Follow-up', color: 'secondary' },
    { value: 'emergency', label: 'Emergency', color: 'error' },
    { value: 'routine', label: 'Routine Check', color: 'accent' }
  ]

  useEffect(() => {
    loadTabData()
  }, [activeTab])

  const loadTabData = async () => {
    setLoading(true)
    setError(null)
    try {
      switch (activeTab) {
        case 'appointments':
          const appointmentData = await appointmentService.getAll()
          setAppointments(appointmentData || [])
          break
        case 'patients':
          const patientData = await patientService.getAll()
          setPatients(patientData || [])
          break
        case 'prescriptions':
          const prescriptionData = await prescriptionService.getAll()
          setPrescriptions(prescriptionData || [])
          break
      }
    } catch (err) {
      setError(err.message)
      toast.error(`Failed to load ${activeTab}`)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAppointment = async (formData) => {
    if (!formData.patientName.trim()) {
      toast.error('Patient name is required')
      return
    }

    try {
      const appointmentData = {
        patientName: formData.patientName,
        doctorName: formData.doctorName,
        dateTime: `${formData.date}T${formData.time}`,
        type: formData.type,
        status: 'scheduled',
        notes: formData.notes
      }

      await appointmentService.create(appointmentData)
      setAppointments(prev => [appointmentData, ...prev])
      setShowAddModal(false)
      setNewAppointment({
        patientName: '',
        doctorName: 'Dr. Sarah Johnson',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        type: 'consultation',
        notes: ''
      })
      toast.success('Appointment scheduled successfully')
    } catch (err) {
      toast.error('Failed to schedule appointment')
    }
  }

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      await appointmentService.update(appointmentId, { status: newStatus })
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId ? { ...apt, status: newStatus } : apt
        )
      )
      toast.success(`Appointment ${newStatus}`)
    } catch (err) {
      toast.error('Failed to update appointment')
    }
  }

  const filteredData = () => {
    switch (activeTab) {
      case 'appointments':
        return (appointments || []).filter(apt => {
          const matchesSearch = apt?.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               apt?.doctorName?.toLowerCase().includes(searchTerm.toLowerCase())
          const matchesStatus = filterStatus === 'all' || apt?.status === filterStatus
          const matchesDate = !selectedDate || apt?.dateTime?.startsWith(selectedDate)
          return matchesSearch && matchesStatus && matchesDate
        })
      case 'patients':
        return (patients || []).filter(patient => {
          const fullName = `${patient?.personalInfo?.firstName || ''} ${patient?.personalInfo?.lastName || ''}`.toLowerCase()
          return fullName.includes(searchTerm.toLowerCase()) ||
                 patient?.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 patient?.personalInfo?.phone?.includes(searchTerm)
        })
      case 'prescriptions':
        return (prescriptions || []).filter(prescription => {
          return prescription?.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 prescription?.doctorName?.toLowerCase().includes(searchTerm.toLowerCase())
        })
      default:
        return []
    }
  }

  const renderTabContent = () => {
    const data = filteredData()

    if (loading) {
      return <Spinner message={`Loading ${activeTab}...`} className="h-8 w-8 border-b-2 border-primary" />
    }

    if (error) {
      return <ErrorDisplay message={error} onRetry={loadTabData} />
    }

    if (data.length === 0) {
      return (
        <NoDataDisplay 
          message={`No ${activeTab} found`}
          actionButtonText={activeTab === 'appointments' ? 'Schedule First Appointment' : null}
          onActionButtonClick={activeTab === 'appointments' ? () => setShowAddModal(true) : null}
        />
      )
    }

    switch (activeTab) {
      case 'appointments':
        return (
          <AppointmentList 
            appointments={data} 
            updateAppointmentStatus={updateAppointmentStatus} 
            appointmentTypes={appointmentTypes}
          />
        )
      case 'patients':
        return <PatientList patients={data} />
      case 'prescriptions':
        return <PrescriptionList prescriptions={data} />
      default:
        return null
    }
  }

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <h3 className="text-lg font-semibold text-surface-900 mb-4 lg:mb-0">Medical Management Hub</h3>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {activeTab === 'appointments' && (
            <Button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium"
              iconName="Plus"
              iconSize={16}
            >
              New Appointment
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-surface-200 mb-6">
        {tabs.map((tab) => (
          <TabButton 
            key={tab.id} 
            tab={tab} 
            activeTab={activeTab} 
            onClick={setActiveTab} 
          />
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <SearchBar 
            searchTerm={searchTerm} 
            onSearchChange={(e) => setSearchTerm(e.target.value)} 
            placeholder={`Search ${activeTab}...`} 
          />
</div>
        
        {activeTab === 'appointments' && (
          <>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' }
              ]}
            />
          </>
        )}
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
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>

      {/* Add Appointment Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Schedule New Appointment"
      >
        <AddAppointmentForm 
          onSubmit={handleAddAppointment} 
          onCancel={() => setShowAddModal(false)} 
          initialData={newAppointment}
          appointmentTypes={appointmentTypes}
        />
      </Modal>
    </Card>
  )
}

export default MainFeature
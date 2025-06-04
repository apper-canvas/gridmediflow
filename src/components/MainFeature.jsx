import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import { appointmentService, patientService, prescriptionService } from '../services'

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

  const handleAddAppointment = async (e) => {
    e.preventDefault()
    if (!newAppointment.patientName.trim()) {
      toast.error('Patient name is required')
      return
    }

    try {
      const appointmentData = {
        patientName: newAppointment.patientName,
        doctorName: newAppointment.doctorName,
        dateTime: `${newAppointment.date}T${newAppointment.time}`,
        type: newAppointment.type,
        status: 'scheduled',
        notes: newAppointment.notes
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-primary/10 text-primary'
      case 'in-progress': return 'bg-accent/10 text-accent'
      case 'completed': return 'bg-secondary/10 text-secondary'
      case 'cancelled': return 'bg-error/10 text-error'
      default: return 'bg-surface-200 text-surface-600'
    }
  }

  const getTypeColor = (type) => {
    const typeObj = appointmentTypes.find(t => t.value === type)
    return typeObj ? typeObj.color : 'primary'
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
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-surface-600">Loading {activeTab}...</span>
        </div>
      )
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <ApperIcon name="AlertTriangle" size={24} className="text-error mx-auto mb-2" />
          <p className="text-error">Error: {error}</p>
          <button 
            onClick={loadTabData}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Retry
          </button>
        </div>
      )
    }

    if (data.length === 0) {
      return (
        <div className="text-center py-12">
          <ApperIcon name="Search" size={24} className="text-surface-400 mx-auto mb-2" />
          <p className="text-surface-600">No {activeTab} found</p>
          {activeTab === 'appointments' && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Schedule First Appointment
            </button>
          )}
        </div>
      )
    }

    switch (activeTab) {
      case 'appointments':
        return (
          <div className="space-y-3">
            {data.map((appointment, index) => (
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
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment?.status)}`}>
                        {appointment?.status || 'scheduled'}
                      </span>
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
                      <>
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'in-progress')}
                          className="px-3 py-1.5 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors text-sm"
                        >
                          Start
                        </button>
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                          className="px-3 py-1.5 bg-error/10 text-error rounded-lg hover:bg-error/20 transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {appointment?.status === 'in-progress' && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                        className="px-3 py-1.5 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-colors text-sm"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )

      case 'patients':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data.map((patient, index) => (
              <motion.div
                key={patient?.id || index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="medical-card p-4"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <ApperIcon name="User" size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-surface-900 mb-1">
                      {patient?.personalInfo?.firstName || 'N/A'} {patient?.personalInfo?.lastName || ''}
                    </h4>
                    <div className="text-sm text-surface-600 space-y-1">
                      <p>ID: {patient?.id || 'N/A'}</p>
                      <p>Age: {patient?.personalInfo?.age || 'N/A'} | Blood Type: {patient?.personalInfo?.bloodType || 'N/A'}</p>
                      <p>Phone: {patient?.personalInfo?.phone || 'N/A'}</p>
                      <p>Last Visit: {patient?.personalInfo?.lastVisit || 'Never'}</p>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm">
                        View Details
                      </button>
                      <button className="px-3 py-1.5 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-colors text-sm">
                        Book Appointment
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )

      case 'prescriptions':
        return (
          <div className="space-y-3">
            {data.map((prescription, index) => (
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
                    <button className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm">
                      View
                    </button>
                    <button className="px-3 py-1.5 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-colors text-sm">
                      Refill
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="medical-card p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <h3 className="text-lg font-semibold text-surface-900 mb-4 lg:mb-0">Medical Management Hub</h3>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {activeTab === 'appointments' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium flex items-center justify-center"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              New Appointment
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-surface-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-all duration-200 ${
              activeTab === tab.id
                ? 'border-primary text-primary font-medium'
                : 'border-transparent text-surface-600 hover:text-surface-900 hover:border-surface-300'
            }`}
          >
            <ApperIcon name={tab.icon} size={18} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <ApperIcon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
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
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-surface-900">Schedule New Appointment</h4>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 hover:bg-surface-100 rounded"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              <form onSubmit={handleAddAppointment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Patient Name *</label>
                  <input
                    type="text"
                    required
                    value={newAppointment.patientName}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, patientName: e.target.value }))}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Enter patient name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={newAppointment.date}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Time</label>
                    <input
                      type="time"
                      value={newAppointment.time}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Appointment Type</label>
                  <select
                    value={newAppointment.type}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {appointmentTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Notes (Optional)</label>
                  <textarea
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    rows="3"
                    placeholder="Additional notes..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-surface-300 text-surface-600 rounded-lg hover:bg-surface-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Schedule
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature
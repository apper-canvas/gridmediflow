import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import { patientService } from '../services'

const Home = () => {
  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true)
      try {
        const patientData = await patientService.getAll()
        setPatients(patientData || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadDashboardData()
  }, [])

  const navigation = [
    { name: 'Dashboard', icon: 'Grid3X3', active: true },
    { name: 'Patients', icon: 'Users', active: false },
    { name: 'Appointments', icon: 'Calendar', active: false },
    { name: 'Prescriptions', icon: 'Pill', active: false },
    { name: 'Reports', icon: 'BarChart3', active: false },
    { name: 'Settings', icon: 'Settings', active: false }
  ]

  const quickStats = [
    { 
      title: "Today's Appointments", 
      value: "24", 
      progress: 65, 
      icon: 'Calendar',
      color: 'primary' 
    },
    { 
      title: 'Patients in Waiting', 
      value: '8', 
      progress: 40, 
      icon: 'Clock',
      color: 'accent' 
    },
    { 
      title: 'Pending Lab Results', 
      value: '12', 
      progress: 75, 
      icon: 'FileText',
      color: 'secondary' 
    },
    { 
      title: 'Prescription Renewals', 
      value: '6', 
      progress: 30, 
      icon: 'Pill',
      color: 'error' 
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="medical-card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-surface-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <header className="bg-white border-b border-surface-200 h-16 fixed top-0 left-0 right-0 z-40 medical-gradient">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-surface-100 transition-colors lg:hidden"
            >
              <ApperIcon name="Menu" size={20} />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Heart" size={20} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-surface-900 hidden sm:block">MediFlow</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <ApperIcon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                placeholder="Search patients by ID or name..."
                className="pl-10 pr-4 py-2 bg-surface-100 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64 lg:w-80"
              />
            </div>
            
            <button className="relative p-2 rounded-lg hover:bg-surface-100 transition-colors">
              <ApperIcon name="Bell" size={20} className="text-surface-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full"></span>
            </button>
            
            <div className="flex items-center space-x-2">
              <img
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=32&h=32&fit=crop&crop=face"
                alt="Dr. Sarah Johnson"
                className="w-8 h-8 rounded-full"
              />
              <span className="hidden sm:block text-sm font-medium text-surface-700">Dr. Johnson</span>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed top-16 left-0 bottom-0 bg-white border-r border-surface-200 transition-all duration-300 z-30 ${sidebarCollapsed ? 'w-20' : 'w-64'} hidden lg:block`}>
        <nav className="p-4 space-y-2">
          {navigation.map((item, index) => (
            <motion.button
              key={item.name}
              whileHover={{ x: 4 }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                item.active 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
              }`}
            >
              <ApperIcon name={item.icon} size={20} />
              {!sidebarCollapsed && <span className="font-medium">{item.name}</span>}
            </motion.button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="p-4 lg:p-6 space-y-6">
          {/* Welcome Section */}
          <div className="medical-card p-6 medical-gradient">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-surface-900 mb-2">Good morning, Dr. Johnson</h2>
                <p className="text-surface-600">You have 8 patients waiting and 16 appointments scheduled for today.</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <button className="neu-button px-6 py-3 text-primary font-medium rounded-xl hover:text-primary-dark transition-colors">
                  <ApperIcon name="Plus" size={16} className="inline mr-2" />
                  New Patient
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="medical-card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    stat.color === 'primary' ? 'bg-primary/10 text-primary' :
                    stat.color === 'secondary' ? 'bg-secondary/10 text-secondary' :
                    stat.color === 'accent' ? 'bg-accent/10 text-accent' :
                    'bg-error/10 text-error'
                  }`}>
                    <ApperIcon name={stat.icon} size={20} />
                  </div>
                  <span className="text-2xl font-bold text-surface-900">{stat.value}</span>
                </div>
                <h3 className="text-sm font-medium text-surface-600 mb-3">{stat.title}</h3>
                <div className="w-full bg-surface-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      stat.color === 'primary' ? 'bg-primary' :
                      stat.color === 'secondary' ? 'bg-secondary' :
                      stat.color === 'accent' ? 'bg-accent' :
                      'bg-error'
                    }`}
                    style={{ width: `${stat.progress}%` }}
                  ></div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Feature - Patient Management */}
          <MainFeature />

          {/* Recent Patients Grid */}
          <div className="medical-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h3 className="text-lg font-semibold text-surface-900 mb-2 sm:mb-0">Recent Patients</h3>
              <button className="text-primary hover:text-primary-dark font-medium transition-colors">
                View All Patients
                <ApperIcon name="ArrowRight" size={16} className="inline ml-1" />
              </button>
            </div>
            
            {error ? (
              <div className="text-center py-8">
                <ApperIcon name="AlertTriangle" size={24} className="text-error mx-auto mb-2" />
                <p className="text-error">Error loading patients: {error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {(patients || []).slice(0, 8).map((patient, index) => (
                  <motion.div
                    key={patient?.id || index}
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
                      <button className="flex-1 text-xs bg-primary/10 text-primary py-2 px-3 rounded-lg hover:bg-primary/20 transition-colors">
                        View Record
                      </button>
                      <button className="flex-1 text-xs bg-secondary/10 text-secondary py-2 px-3 rounded-lg hover:bg-secondary/20 transition-colors">
                        Book Appt.
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <div className={`fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className={`fixed top-16 left-0 bottom-0 w-64 bg-white transform transition-transform duration-300 ${sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'}`}>
          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <button
                key={item.name}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                  item.active 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                }`}
              >
                <ApperIcon name={item.icon} size={20} />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Home
import { useState, useEffect } from 'react'
import { patientService } from '../services'
import DashboardTemplate from '../components/templates/DashboardTemplate'
import WelcomeSection from '../components/organisms/WelcomeSection'
import QuickStatsGrid from '../components/organisms/QuickStatsGrid'
import MainFeature from '../components/organisms/MainFeature'
import RecentPatientsSection from '../components/organisms/RecentPatientsSection'
import Spinner from '../components/atoms/Spinner'

const HomePage = () => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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
    return <Spinner message="Loading dashboard..." />
  }

return (
    <DashboardTemplate navigation={navigation}>
      <WelcomeSection 
        title="Good morning, Doctor"
        message="You have 8 patients waiting and 16 appointments scheduled for today."
        buttonText="New Patient"
        onButtonClick={() => console.log('New Patient clicked')} // Placeholder for actual logic
      />
      <QuickStatsGrid stats={quickStats} />
      <MainFeature />
      <RecentPatientsSection patients={patients} error={error} />
    </DashboardTemplate>
  )
}

export default HomePage
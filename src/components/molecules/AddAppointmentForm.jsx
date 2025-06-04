import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { patientService } from '../../services'
import Button from '../atoms/Button'
import Input from '../atoms/Input'
import Select from './Select'
import Spinner from '../atoms/Spinner'

const AddAppointmentForm = ({ onSubmit, onCancel, appointmentTypes, loading }) => {
  const [formData, setFormData] = useState({
    Name: '',
    doctor_name: '',
    date_time: '',
    type: 'Check-up',
    status: 'Scheduled',
    notes: '',
    patient: ''
  })

  const [errors, setErrors] = useState({})
  const [patients, setPatients] = useState([])
  const [loadingPatients, setLoadingPatients] = useState(false)

  useEffect(() => {
    loadPatients()
  }, [])

  const loadPatients = async () => {
    setLoadingPatients(true)
    try {
      const data = await patientService.getAll()
      setPatients(data || [])
    } catch (err) {
      console.error('Error loading patients:', err)
    } finally {
      setLoadingPatients(false)
    }
  }

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.Name.trim()) {
      newErrors.Name = 'Appointment name is required'
    }

    if (!formData.doctor_name.trim()) {
      newErrors.doctor_name = 'Doctor name is required'
    }

    if (!formData.date_time) {
      newErrors.date_time = 'Date and time is required'
    } else {
      const selectedDate = new Date(formData.date_time)
      const now = new Date()
      if (selectedDate <= now) {
        newErrors.date_time = 'Please select a future date and time'
      }
    }

    if (!formData.patient) {
      newErrors.patient = 'Please select a patient'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      // Format the data for the API
      const appointmentData = {
        Name: formData.Name,
        doctor_name: formData.doctor_name,
        date_time: formData.date_time,
        type: formData.type,
        status: formData.status,
        notes: formData.notes,
        patient: formData.patient
      }
      onSubmit(appointmentData)
    }
  }

  const typeOptions = appointmentTypes?.map(type => ({
    value: type.value,
    label: type.label
  })) || []

  const statusOptions = [
    { value: 'Scheduled', label: 'Scheduled' },
    { value: 'Confirmed', label: 'Confirmed' }
  ]

  // Generate patient options from the patients list
  const patientOptions = patients.map(patient => ({
    value: patient.Id?.toString() || '',
    label: patient.Name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || 'Unnamed Patient'
  }))

  if (loadingPatients) {
    return <Spinner message="Loading patients..." />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-1">
          Appointment Title
        </label>
        <Input
          type="text"
          value={formData.Name}
          onChange={(e) => handleChange('Name', e.target.value)}
          placeholder="Enter appointment title"
          error={errors.Name}
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-surface-700 mb-1">
          Patient
        </label>
        <Select
          value={formData.patient}
          onChange={(value) => handleChange('patient', value)}
          options={[
            { value: '', label: 'Select a patient...' },
            ...patientOptions
          ]}
          error={errors.patient}
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-surface-700 mb-1">
          Doctor
        </label>
        <Input
          type="text"
          value={formData.doctor_name}
          onChange={(e) => handleChange('doctor_name', e.target.value)}
          placeholder="Enter doctor name"
          error={errors.doctor_name}
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-surface-700 mb-1">
          Date & Time
        </label>
        <Input
          type="datetime-local"
          value={formData.date_time}
          onChange={(e) => handleChange('date_time', e.target.value)}
          min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
          error={errors.date_time}
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-surface-700 mb-1">
          Appointment Type
        </label>
        <Select
          value={formData.type}
          onChange={(value) => handleChange('type', value)}
          options={typeOptions}
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-surface-700 mb-1">
          Status
        </label>
        <Select
          value={formData.status}
          onChange={(value) => handleChange('status', value)}
          options={statusOptions}
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-surface-700 mb-1">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Additional notes (optional)"
          rows={3}
          disabled={loading}
          className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none disabled:bg-surface-100 disabled:cursor-not-allowed"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="px-4 py-2"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="px-4 py-2 bg-primary text-white hover:bg-primary-dark disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Scheduling...' : 'Schedule Appointment'}
        </Button>
      </div>
    </form>
  )
}

export default AddAppointmentForm
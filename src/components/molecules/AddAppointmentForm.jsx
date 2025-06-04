import { useState } from 'react'
import Input from '../atoms/Input'
import Select from '../atoms/Select'
import Button from '../atoms/Button'
import ApperIcon from '../ApperIcon'

const AddAppointmentForm = ({ 
  onSubmit, 
  onCancel, 
  initialData = {
    patientName: '',
    doctorName: 'Dr. Sarah Johnson',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    type: 'consultation',
    notes: ''
  },
  appointmentTypes = []
}) => {
  const [formData, setFormData] = useState(initialData)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Patient Name"
        name="patientName"
        type="text"
        required
        value={formData.patientName}
        onChange={handleChange}
        placeholder="Enter patient name"
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
        />
        <Input
          label="Time"
          name="time"
          type="time"
          value={formData.time}
          onChange={handleChange}
        />
      </div>

      <Select
        label="Appointment Type"
        name="type"
        value={formData.type}
        onChange={handleChange}
        options={appointmentTypes.map(type => ({ value: type.value, label: type.label }))}
      />

      <Input
        label="Notes (Optional)"
        name="notes"
        type="textarea"
        value={formData.notes}
        onChange={handleChange}
        rows="3"
        placeholder="Additional notes..."
      />

      <div className="flex space-x-3 pt-4">
        <Button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-surface-300 text-surface-600 rounded-lg hover:bg-surface-50"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          Schedule
        </Button>
      </div>
    </form>
  )
}

export default AddAppointmentForm
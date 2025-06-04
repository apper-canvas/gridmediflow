import appointmentData from '../mockData/appointments.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class AppointmentService {
  constructor() {
    this.data = [...appointmentData]
  }

  async getAll() {
    await delay(250)
    return [...this.data]
  }

  async getById(id) {
    await delay(200)
    const appointment = this.data.find(item => item.id === id)
    return appointment ? { ...appointment } : null
  }

  async create(appointmentInfo) {
    await delay(400)
    const newAppointment = {
      id: Date.now().toString(),
      patientName: appointmentInfo.patientName || '',
      doctorName: appointmentInfo.doctorName || '',
      dateTime: appointmentInfo.dateTime || new Date().toISOString(),
      type: appointmentInfo.type || 'consultation',
      status: appointmentInfo.status || 'scheduled',
      notes: appointmentInfo.notes || ''
    }
    this.data.unshift(newAppointment)
    return { ...newAppointment }
  }

  async update(id, updates) {
    await delay(300)
    const index = this.data.findIndex(item => item.id === id)
    if (index === -1) throw new Error('Appointment not found')
    
    this.data[index] = { ...this.data[index], ...updates }
    return { ...this.data[index] }
  }

  async delete(id) {
    await delay(250)
    const index = this.data.findIndex(item => item.id === id)
    if (index === -1) throw new Error('Appointment not found')
    
    const deleted = this.data.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default new AppointmentService()
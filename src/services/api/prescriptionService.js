import prescriptionData from '../mockData/prescriptions.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class PrescriptionService {
  constructor() {
    this.data = [...prescriptionData]
  }

  async getAll() {
    await delay(300)
    return [...this.data]
  }

  async getById(id) {
    await delay(200)
    const prescription = this.data.find(item => item.id === id)
    return prescription ? { ...prescription } : null
  }

  async create(prescriptionInfo) {
    await delay(450)
    const newPrescription = {
      id: Date.now().toString(),
      patientName: prescriptionInfo.patientName || '',
      doctorName: prescriptionInfo.doctorName || '',
      medications: prescriptionInfo.medications || [],
      dosage: prescriptionInfo.dosage || {},
      duration: prescriptionInfo.duration || {},
      dateIssued: new Date().toISOString(),
      status: 'active'
    }
    this.data.unshift(newPrescription)
    return { ...newPrescription }
  }

  async update(id, updates) {
    await delay(350)
    const index = this.data.findIndex(item => item.id === id)
    if (index === -1) throw new Error('Prescription not found')
    
    this.data[index] = { ...this.data[index], ...updates }
    return { ...this.data[index] }
  }

  async delete(id) {
    await delay(250)
    const index = this.data.findIndex(item => item.id === id)
    if (index === -1) throw new Error('Prescription not found')
    
    const deleted = this.data.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default new PrescriptionService()
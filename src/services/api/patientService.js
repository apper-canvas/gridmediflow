import patientData from '../mockData/patients.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class PatientService {
  constructor() {
    this.data = [...patientData]
  }

  async getAll() {
    await delay(300)
    return [...this.data]
  }

  async getById(id) {
    await delay(200)
    const patient = this.data.find(item => item.id === id)
    return patient ? { ...patient } : null
  }

  async create(patientInfo) {
    await delay(400)
    const newPatient = {
      id: Date.now().toString(),
      personalInfo: {
        firstName: patientInfo.firstName || '',
        lastName: patientInfo.lastName || '',
        age: patientInfo.age || 0,
        bloodType: patientInfo.bloodType || '',
        phone: patientInfo.phone || '',
        email: patientInfo.email || '',
        address: patientInfo.address || '',
        lastVisit: new Date().toLocaleDateString()
      },
      medicalHistory: patientInfo.medicalHistory || [],
      appointments: [],
      prescriptions: [],
      insuranceInfo: patientInfo.insuranceInfo || {}
    }
    this.data.unshift(newPatient)
    return { ...newPatient }
  }

  async update(id, updates) {
    await delay(350)
    const index = this.data.findIndex(item => item.id === id)
    if (index === -1) throw new Error('Patient not found')
    
    this.data[index] = { ...this.data[index], ...updates }
    return { ...this.data[index] }
  }

  async delete(id) {
    await delay(250)
    const index = this.data.findIndex(item => item.id === id)
    if (index === -1) throw new Error('Patient not found')
    
    const deleted = this.data.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default new PatientService()
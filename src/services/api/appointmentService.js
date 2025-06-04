import { toast } from 'react-toastify'

class AppointmentService {
  constructor() {
    this.tableName = 'appointment'
    this.updateableFields = [
      'Name', 'Tags', 'doctor_name', 'date_time', 'type', 'status', 'notes', 'patient'
    ]
    this.allFields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'doctor_name', 'date_time', 'type', 'status', 'notes', 'patient'
    ]
  }

  getApperClient() {
    const { ApperClient } = window.ApperSDK
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
  }

  async getAll(filters = {}) {
    try {
      const apperClient = this.getApperClient()
      const params = {
        fields: this.allFields,
        orderBy: [{ fieldName: 'date_time', SortType: 'DESC' }],
        pagingInfo: { limit: 50, offset: 0 }
      }

      // Add filters if provided
      const whereConditions = []
      
      if (filters.searchTerm) {
        whereConditions.push({
          fieldName: 'doctor_name',
          operator: 'Contains',
          values: [filters.searchTerm]
        })
      }

      if (filters.status && filters.status !== 'all') {
        whereConditions.push({
          fieldName: 'status',
          operator: 'ExactMatch',
          values: [filters.status]
        })
      }

      if (filters.date) {
        whereConditions.push({
          fieldName: 'date_time',
          operator: 'RelativeMatch',
          values: [filters.date]
        })
      }

      if (whereConditions.length > 0) {
        params.where = whereConditions
      }

      const response = await apperClient.fetchRecords(this.tableName, params)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching appointments:', error)
      toast.error('Failed to load appointments')
      return []
    }
  }

  async getById(id) {
    try {
      const apperClient = this.getApperClient()
      const params = { fields: this.allFields }
      const response = await apperClient.getRecordById(this.tableName, id, params)
      return response?.data || null
    } catch (error) {
      console.error(`Error fetching appointment ${id}:`, error)
      toast.error('Failed to load appointment details')
      return null
    }
  }

  async create(appointmentData) {
    try {
      const apperClient = this.getApperClient()
      
      // Filter to only include updateable fields
      const filteredData = {}
      this.updateableFields.forEach(field => {
        if (appointmentData.hasOwnProperty(field)) {
          filteredData[field] = appointmentData[field]
        }
      })

      // Map legacy field names
      if (appointmentData.patientName) {
        filteredData.Name = appointmentData.patientName
      }
      if (appointmentData.doctorName) {
        filteredData.doctor_name = appointmentData.doctorName
      }
      if (appointmentData.dateTime) {
        filteredData.date_time = appointmentData.dateTime
      }

      const params = {
        records: [filteredData]
      }

      const response = await apperClient.createRecord(this.tableName, params)
      
      if (response?.success && response?.results?.[0]?.success) {
        toast.success('Appointment scheduled successfully')
        return response.results[0].data
      } else {
        const errorMsg = response?.results?.[0]?.message || 'Failed to schedule appointment'
        toast.error(errorMsg)
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('Error creating appointment:', error)
      toast.error('Failed to schedule appointment')
      throw error
    }
  }

  async update(id, updates) {
    try {
      const apperClient = this.getApperClient()
      
      // Filter to only include updateable fields
      const filteredUpdates = { Id: id }
      this.updateableFields.forEach(field => {
        if (updates.hasOwnProperty(field)) {
          filteredUpdates[field] = updates[field]
        }
      })

      const params = {
        records: [filteredUpdates]
      }

      const response = await apperClient.updateRecord(this.tableName, params)
      
      if (response?.success && response?.results?.[0]?.success) {
        toast.success('Appointment updated successfully')
        return response.results[0].data
      } else {
        const errorMsg = response?.results?.[0]?.message || 'Failed to update appointment'
        toast.error(errorMsg)
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('Error updating appointment:', error)
      toast.error('Failed to update appointment')
      throw error
    }
  }

  async delete(ids) {
    try {
      const apperClient = this.getApperClient()
      const idsArray = Array.isArray(ids) ? ids : [ids]
      
      const params = {
        RecordIds: idsArray
      }

      const response = await apperClient.deleteRecord(this.tableName, params)
      
      if (response?.success) {
        const successCount = response.results?.filter(r => r.success)?.length || 0
        toast.success(`${successCount} appointment(s) deleted successfully`)
        return true
      } else {
        toast.error('Failed to delete appointment(s)')
        return false
      }
    } catch (error) {
      console.error('Error deleting appointments:', error)
      toast.error('Failed to delete appointment(s)')
      throw error
    }
  }
}

export default new AppointmentService()
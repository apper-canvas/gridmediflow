import { toast } from 'react-toastify'

class PrescriptionService {
  constructor() {
    this.tableName = 'prescription'
    this.updateableFields = [
      'Name', 'Tags', 'patient', 'doctor_name', 'medications', 'dosage', 
      'duration', 'date_issued', 'status'
    ]
    this.allFields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'patient', 'doctor_name', 'medications', 'dosage', 'duration', 'date_issued', 'status'
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
        orderBy: [{ fieldName: 'date_issued', SortType: 'DESC' }],
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

      if (whereConditions.length > 0) {
        params.where = whereConditions
      }

      const response = await apperClient.fetchRecords(this.tableName, params)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching prescriptions:', error)
      toast.error('Failed to load prescriptions')
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
      console.error(`Error fetching prescription ${id}:`, error)
      toast.error('Failed to load prescription details')
      return null
    }
  }

  async create(prescriptionData) {
    try {
      const apperClient = this.getApperClient()
      
      // Filter to only include updateable fields
      const filteredData = {}
      this.updateableFields.forEach(field => {
        if (prescriptionData.hasOwnProperty(field)) {
          filteredData[field] = prescriptionData[field]
        }
      })

      // Map legacy field names
      if (prescriptionData.patientName) {
        filteredData.Name = prescriptionData.patientName
      }
      if (prescriptionData.doctorName) {
        filteredData.doctor_name = prescriptionData.doctorName
      }
      if (prescriptionData.dateIssued) {
        filteredData.date_issued = prescriptionData.dateIssued
      }

      const params = {
        records: [filteredData]
      }

      const response = await apperClient.createRecord(this.tableName, params)
      
      if (response?.success && response?.results?.[0]?.success) {
        toast.success('Prescription created successfully')
        return response.results[0].data
      } else {
        const errorMsg = response?.results?.[0]?.message || 'Failed to create prescription'
        toast.error(errorMsg)
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('Error creating prescription:', error)
      toast.error('Failed to create prescription')
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
        toast.success('Prescription updated successfully')
        return response.results[0].data
      } else {
        const errorMsg = response?.results?.[0]?.message || 'Failed to update prescription'
        toast.error(errorMsg)
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('Error updating prescription:', error)
      toast.error('Failed to update prescription')
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
        toast.success(`${successCount} prescription(s) deleted successfully`)
        return true
      } else {
        toast.error('Failed to delete prescription(s)')
        return false
      }
    } catch (error) {
      console.error('Error deleting prescriptions:', error)
      toast.error('Failed to delete prescription(s)')
      throw error
    }
  }
}

export default new PrescriptionService()
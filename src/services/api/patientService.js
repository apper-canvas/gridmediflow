import { toast } from 'react-toastify'

class PatientService {
  constructor() {
    this.tableName = 'patient'
    this.updateableFields = [
      'Name', 'Tags', 'first_name', 'last_name', 'age', 'blood_type', 
      'phone', 'email', 'address', 'last_visit', 'insurance_info', 'medical_history'
    ]
    this.allFields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'first_name', 'last_name', 'age', 'blood_type', 'phone', 'email', 'address', 
      'last_visit', 'insurance_info', 'medical_history'
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
        orderBy: [{ fieldName: 'CreatedOn', SortType: 'DESC' }],
        pagingInfo: { limit: 50, offset: 0 }
      }

      if (filters.searchTerm) {
        params.where = [
          {
            fieldName: 'Name',
            operator: 'Contains',
            values: [filters.searchTerm]
          }
        ]
      }

      const response = await apperClient.fetchRecords(this.tableName, params)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching patients:', error)
      toast.error('Failed to load patients')
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
      console.error(`Error fetching patient ${id}:`, error)
      toast.error('Failed to load patient details')
      return null
    }
  }

  async create(patientData) {
    try {
      const apperClient = this.getApperClient()
      
      // Filter to only include updateable fields
      const filteredData = {}
      this.updateableFields.forEach(field => {
        if (patientData.hasOwnProperty(field)) {
          filteredData[field] = patientData[field]
        }
      })

      const params = {
        records: [filteredData]
      }

      const response = await apperClient.createRecord(this.tableName, params)
      
      if (response?.success && response?.results?.[0]?.success) {
        toast.success('Patient created successfully')
        return response.results[0].data
      } else {
        const errorMsg = response?.results?.[0]?.message || 'Failed to create patient'
        toast.error(errorMsg)
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('Error creating patient:', error)
      toast.error('Failed to create patient')
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
        toast.success('Patient updated successfully')
        return response.results[0].data
      } else {
        const errorMsg = response?.results?.[0]?.message || 'Failed to update patient'
        toast.error(errorMsg)
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('Error updating patient:', error)
      toast.error('Failed to update patient')
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
        toast.success(`${successCount} patient(s) deleted successfully`)
        return true
      } else {
        toast.error('Failed to delete patient(s)')
        return false
      }
    } catch (error) {
      console.error('Error deleting patients:', error)
      toast.error('Failed to delete patient(s)')
      throw error
    }
  }
}

export default new PatientService()
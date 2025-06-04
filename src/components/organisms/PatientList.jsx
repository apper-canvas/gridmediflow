import PatientCard from '../molecules/PatientCard'

const PatientList = ({ patients }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {patients.map((patient, index) => (
        <PatientCard 
          key={patient?.id || index} 
          patient={patient} 
          index={index} 
        />
      ))}
    </div>
  )
}

export default PatientList
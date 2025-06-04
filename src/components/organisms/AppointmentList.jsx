import AppointmentItem from './AppointmentItem'

const AppointmentList = ({ appointments, updateAppointmentStatus, appointmentTypes }) => {
  const getTypeColor = (type) => {
    const typeObj = appointmentTypes.find(t => t.value === type)
    return typeObj ? typeObj.color : 'primary'
  }

  return (
    <div className="space-y-3">
      {appointments.map((appointment, index) => (
        <AppointmentItem 
          key={appointment?.id || index} 
          appointment={appointment} 
          index={index} 
          updateAppointmentStatus={updateAppointmentStatus} 
          getTypeColor={getTypeColor} 
        />
      ))}
    </div>
  )
}

export default AppointmentList
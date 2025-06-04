import PrescriptionItem from './PrescriptionItem'

const PrescriptionList = ({ prescriptions }) => {
  return (
    <div className="space-y-3">
      {prescriptions.map((prescription, index) => (
        <PrescriptionItem 
          key={prescription?.id || index} 
          prescription={prescription} 
          index={index} 
        />
      ))}
    </div>
  )
}

export default PrescriptionList
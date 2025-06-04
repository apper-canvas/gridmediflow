const Card = ({ children, className = '' }) => {
  return (
    <div className={`medical-card p-6 ${className}`}>
      {children}
    </div>
  )
}

export default Card
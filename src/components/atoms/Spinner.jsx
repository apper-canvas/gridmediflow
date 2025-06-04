const Spinner = ({ message = 'Loading...', className = 'h-12 w-12 border-b-2 border-primary' }) => {
  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center">
      <div className="medical-card p-8 text-center">
        <div className={`animate-spin rounded-full ${className} mx-auto mb-4`}></div>
        <p className="text-surface-600">{message}</p>
      </div>
    </div>
  )
}

export default Spinner
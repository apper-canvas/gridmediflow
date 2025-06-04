import ApperIcon from '../ApperIcon'
import Button from '../atoms/Button'

const ErrorDisplay = ({ message, onRetry }) => {
  return (
    <div className="text-center py-12">
      <ApperIcon name="AlertTriangle" size={24} className="text-error mx-auto mb-2" />
      <p className="text-error">Error: {message}</p>
      {onRetry && (
        <Button 
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          Retry
        </Button>
      )}
    </div>
  )
}

export default ErrorDisplay
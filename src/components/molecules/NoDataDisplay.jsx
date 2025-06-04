import ApperIcon from '../ApperIcon'
import Button from '../atoms/Button'

const NoDataDisplay = ({ message, actionButtonText, onActionButtonClick }) => {
  return (
    <div className="text-center py-12">
      <ApperIcon name="Search" size={24} className="text-surface-400 mx-auto mb-2" />
      <p className="text-surface-600">{message}</p>
      {onActionButtonClick && (
        <Button 
          onClick={onActionButtonClick}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          {actionButtonText}
        </Button>
      )}
    </div>
  )
}

export default NoDataDisplay
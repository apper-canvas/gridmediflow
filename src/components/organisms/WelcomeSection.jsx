import ApperIcon from '../ApperIcon'
import Card from '../atoms/Card'
import Button from '../atoms/Button'

const WelcomeSection = ({ title, message, buttonText, onButtonClick, buttonIcon = 'Plus' }) => {
  return (
    <Card className="p-6 medical-gradient">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-surface-900 mb-2">{title}</h2>
          <p className="text-surface-600">{message}</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={onButtonClick} className="neu-button px-6 py-3 text-primary font-medium rounded-xl hover:text-primary-dark" iconName={buttonIcon}>
            {buttonText}
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default WelcomeSection
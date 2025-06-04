import { motion } from 'framer-motion'
import ApperIcon from '../ApperIcon'

const Button = ({ 
  children, 
  onClick, 
  className = '', 
  iconName, 
  iconSize = 16, 
  iconPosition = 'left', 
  type = 'button',
  whileHover,
  ...props
}) => {
  const Icon = iconName ? <ApperIcon name={iconName} size={iconSize} className={children ? (iconPosition === 'left' ? 'mr-2' : 'ml-2') : ''} /> : null;

  const buttonContent = (
    &lt;&gt;
      {iconPosition === 'left' && Icon}
      {children}
      {iconPosition === 'right' && Icon}
    &lt;/&gt;
  )

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`flex items-center justify-center transition-colors duration-200 ${className}`}
      whileHover={whileHover}
      {...props}
    >
      {buttonContent}
    </motion.button>
  )
}

export default Button
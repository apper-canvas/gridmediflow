import ApperIcon from '../ApperIcon'

const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  className = '', 
  iconName, 
  required = false,
  ...props 
}) => {
  const inputClasses = `w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${iconName ? 'pl-10' : ''} ${className}`;

  return (
    <div>
      {label && <label className="block text-sm font-medium text-surface-700 mb-1">{label}{required && ' *'}</label>}
      <div className="relative">
        {iconName && (
          <ApperIcon name={iconName} size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
        )}
        {type === 'textarea' ? (
          <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={inputClasses}
            {...props}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={inputClasses}
            required={required}
            {...props}
          />
        )}
      </div>
    </div>
  )
}

export default Input
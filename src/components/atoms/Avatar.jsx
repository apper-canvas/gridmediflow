const Avatar = ({ src, alt, name, className = 'w-8 h-8 rounded-full' }) => {
  return (
    <div className="flex items-center space-x-2">
      <img
        src={src}
        alt={alt}
        className={className}
      />
      {name && <span className="hidden sm:block text-sm font-medium text-surface-700">{name}</span>}
    </div>
  )
}

export default Avatar
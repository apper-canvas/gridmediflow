import ApperIcon from '../ApperIcon'
import Input from '../atoms/Input'

const SearchBar = ({ searchTerm, onSearchChange, placeholder = 'Search...' }) => {
  return (
    <Input
      type="text"
      placeholder={placeholder}
      value={searchTerm}
      onChange={onSearchChange}
      iconName="Search"
      className="w-full lg:w-80"
    />
  )
}

export default SearchBar
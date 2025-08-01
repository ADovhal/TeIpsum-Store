import React from 'react';
import Select from 'react-select';
import { useTheme } from '../../context/ThemeContext';

/**
 * Custom Select component using react-select with theme support
 */
const CustomSelect = ({ options, value, onChange, placeholder, isDisabled = false, isSearchable = false, ...props }) => {
  const { theme, isDark } = useTheme();

  // Custom styles for react-select to match the application theme
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: isDark ? '#2c3e50' : 'white',
      borderColor: state.isFocused ? '#3498db' : (isDark ? '#34495e' : '#ecf0f1'),
      borderWidth: '2px',
      borderRadius: '8px',
      boxShadow: state.isFocused ? `0 0 0 1px #3498db` : 'none',
      minHeight: '44px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        borderColor: '#3498db',
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '8px 12px',
    }),
    input: (provided) => ({
      ...provided,
      color: isDark ? '#ecf0f1' : '#2c3e50',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: isDark ? '#ecf0f1' : '#2c3e50',
      fontWeight: '500',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: isDark ? '#95a5a6' : '#7f8c8d',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: isDark ? '#2c3e50' : 'white',
      border: `2px solid ${isDark ? '#34495e' : '#ecf0f1'}`,
      borderRadius: '8px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      zIndex: 9999,
    }),
    menuList: (provided) => ({
      ...provided,
      padding: '8px 0',
      maxHeight: '200px',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#3498db'
        : state.isFocused 
          ? (isDark ? '#34495e' : '#f8f9fa')
          : 'transparent',
      color: state.isSelected 
        ? 'white'
        : (isDark ? '#ecf0f1' : '#2c3e50'),
      cursor: 'pointer',
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: state.isSelected ? '600' : '500',
      transition: 'all 0.2s ease',
      '&:active': {
        backgroundColor: '#3498db',
        color: 'white',
      },
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: state.isFocused ? '#3498db' : (isDark ? '#95a5a6' : '#7f8c8d'),
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'all 0.3s ease',
      '&:hover': {
        color: '#3498db',
      },
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: isDark ? '#95a5a6' : '#7f8c8d',
      '&:hover': {
        color: '#e74c3c',
      },
    }),
  };

  // Transform options to react-select format if they're not already
  const formatOptions = (opts) => {
    if (!Array.isArray(opts)) return [];
    
    return opts.map(option => {
      if (typeof option === 'string') {
        return { value: option, label: option };
      }
      if (option && typeof option === 'object' && option.value && option.label) {
        return option;
      }
      return { value: option, label: option };
    });
  };

  // Handle value transformation
  const formatValue = (val) => {
    if (!val) return val;
    
    if (typeof val === 'string') {
      const formattedOptions = formatOptions(options);
      return formattedOptions.find(opt => opt.value === val) || { value: val, label: val };
    }
    
    return val;
  };

  // Handle change event
  const handleChange = (selectedOption) => {
    if (onChange) {
      // Extract the value for compatibility with regular select onChange
      const value = selectedOption ? selectedOption.value : '';
      onChange({ target: { value } });
    }
  };

  const formattedOptions = formatOptions(options);
  const formattedValue = formatValue(value);

  return (
    <Select
      options={formattedOptions}
      value={formattedValue}
      onChange={handleChange}
      placeholder={placeholder}
      isDisabled={isDisabled}
      isSearchable={isSearchable}
      isClearable={false}
      styles={customStyles}
      classNamePrefix="custom-select"
      theme={(selectTheme) => ({
        ...selectTheme,
        colors: {
          ...selectTheme.colors,
          primary: '#3498db',
          primary75: '#5dade2',
          primary50: '#a9cce3',
          primary25: '#d6eaf8',
          neutral0: isDark ? '#2c3e50' : 'white',
          neutral5: isDark ? '#34495e' : '#f8f9fa',
          neutral10: isDark ? '#34495e' : '#ecf0f1',
          neutral20: isDark ? '#34495e' : '#dee2e6',
          neutral30: isDark ? '#5d6d7e' : '#adb5bd',
          neutral40: isDark ? '#85929e' : '#6c757d',
          neutral50: isDark ? '#95a5a6' : '#6c757d',
          neutral60: isDark ? '#b2bec3' : '#495057',
          neutral70: isDark ? '#ddd' : '#343a40',
          neutral80: isDark ? '#ecf0f1' : '#212529',
          neutral90: isDark ? '#ecf0f1' : '#212529',
        },
      })}
      {...props}
    />
  );
};

export default CustomSelect;
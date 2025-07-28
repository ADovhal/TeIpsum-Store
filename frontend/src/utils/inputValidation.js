// Comprehensive input validation and sanitization utilities

/**
 * Sanitize string input to prevent XSS attacks
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent basic HTML injection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers like onclick, onload
    .replace(/expression\s*\(/gi, '') // Remove CSS expression attacks
    .replace(/eval\s*\(/gi, '') // Remove eval functions
    .replace(/script/gi, '') // Remove script tags
    .replace(/vbscript/gi, '') // Remove vbscript
    .replace(/data:text\/html/gi, '') // Remove data URLs with HTML
    .trim();
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {object} - Validation result
 */
export const validateEmail = (email) => {
  const sanitizedEmail = sanitizeInput(email);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!sanitizedEmail) {
    return { isValid: false, message: 'Email is required' };
  }
  
  if (sanitizedEmail.length > 254) {
    return { isValid: false, message: 'Email is too long' };
  }
  
  if (!emailRegex.test(sanitizedEmail)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  
  return { isValid: true, value: sanitizedEmail };
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (password.length > 128) {
    return { isValid: false, message: 'Password is too long (max 128 characters)' };
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
    return { 
      isValid: false, 
      message: 'Password must contain uppercase, lowercase, number, and special character' 
    };
  }
  
  return { isValid: true, value: password };
};

/**
 * Validate name fields (first name, last name)
 * @param {string} name - Name to validate
 * @returns {object} - Validation result
 */
export const validateName = (name) => {
  const sanitizedName = sanitizeInput(name);
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  
  if (!sanitizedName) {
    return { isValid: false, message: 'Name is required' };
  }
  
  if (sanitizedName.length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters long' };
  }
  
  if (sanitizedName.length > 50) {
    return { isValid: false, message: 'Name is too long (max 50 characters)' };
  }
  
  if (!nameRegex.test(sanitizedName)) {
    return { isValid: false, message: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  
  return { isValid: true, value: sanitizedName };
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {object} - Validation result
 */
export const validatePhone = (phone) => {
  const sanitizedPhone = sanitizeInput(phone);
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,20}$/;
  
  if (!sanitizedPhone) {
    return { isValid: false, message: 'Phone number is required' };
  }
  
  // Remove all non-digit characters for length check
  const digitsOnly = sanitizedPhone.replace(/\D/g, '');
  
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return { isValid: false, message: 'Phone number must be between 10-15 digits' };
  }
  
  if (!phoneRegex.test(sanitizedPhone)) {
    return { isValid: false, message: 'Please enter a valid phone number' };
  }
  
  return { isValid: true, value: sanitizedPhone };
};

/**
 * Validate address
 * @param {string} address - Address to validate
 * @returns {object} - Validation result
 */
export const validateAddress = (address) => {
  const sanitizedAddress = sanitizeInput(address);
  
  if (!sanitizedAddress) {
    return { isValid: false, message: 'Address is required' };
  }
  
  if (sanitizedAddress.length < 5) {
    return { isValid: false, message: 'Address must be at least 5 characters long' };
  }
  
  if (sanitizedAddress.length > 200) {
    return { isValid: false, message: 'Address is too long (max 200 characters)' };
  }
  
  return { isValid: true, value: sanitizedAddress };
};

/**
 * Validate city name
 * @param {string} city - City to validate
 * @returns {object} - Validation result
 */
export const validateCity = (city) => {
  const sanitizedCity = sanitizeInput(city);
  const cityRegex = /^[a-zA-Z\s'-]+$/;
  
  if (!sanitizedCity) {
    return { isValid: false, message: 'City is required' };
  }
  
  if (sanitizedCity.length < 2) {
    return { isValid: false, message: 'City name must be at least 2 characters long' };
  }
  
  if (sanitizedCity.length > 50) {
    return { isValid: false, message: 'City name is too long (max 50 characters)' };
  }
  
  if (!cityRegex.test(sanitizedCity)) {
    return { isValid: false, message: 'City name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  
  return { isValid: true, value: sanitizedCity };
};

/**
 * Validate postal code
 * @param {string} postalCode - Postal code to validate
 * @returns {object} - Validation result
 */
export const validatePostalCode = (postalCode) => {
  const sanitizedPostalCode = sanitizeInput(postalCode);
  const postalRegex = /^[a-zA-Z0-9\s-]{3,10}$/;
  
  if (!sanitizedPostalCode) {
    return { isValid: false, message: 'Postal code is required' };
  }
  
  if (!postalRegex.test(sanitizedPostalCode)) {
    return { isValid: false, message: 'Please enter a valid postal code' };
  }
  
  return { isValid: true, value: sanitizedPostalCode };
};

/**
 * Validate country
 * @param {string} country - Country to validate
 * @returns {object} - Validation result
 */
export const validateCountry = (country) => {
  const sanitizedCountry = sanitizeInput(country);
  const countryRegex = /^[a-zA-Z\s'-]+$/;
  
  if (!sanitizedCountry) {
    return { isValid: false, message: 'Country is required' };
  }
  
  if (sanitizedCountry.length < 2) {
    return { isValid: false, message: 'Country name must be at least 2 characters long' };
  }
  
  if (sanitizedCountry.length > 50) {
    return { isValid: false, message: 'Country name is too long (max 50 characters)' };
  }
  
  if (!countryRegex.test(sanitizedCountry)) {
    return { isValid: false, message: 'Country name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  
  return { isValid: true, value: sanitizedCountry };
};

/**
 * Validate search query
 * @param {string} query - Search query to validate
 * @returns {object} - Validation result
 */
export const validateSearchQuery = (query) => {
  const sanitizedQuery = sanitizeInput(query);
  
  if (sanitizedQuery.length > 100) {
    return { isValid: false, message: 'Search query is too long (max 100 characters)' };
  }
  
  // Allow empty search queries
  return { isValid: true, value: sanitizedQuery };
};

/**
 * Validate text area content (messages, notes, etc.)
 * @param {string} text - Text to validate
 * @param {number} maxLength - Maximum allowed length
 * @returns {object} - Validation result
 */
export const validateTextArea = (text, maxLength = 1000) => {
  const sanitizedText = sanitizeInput(text);
  
  if (sanitizedText.length > maxLength) {
    return { isValid: false, message: `Text is too long (max ${maxLength} characters)` };
  }
  
  return { isValid: true, value: sanitizedText };
};

/**
 * Validate numeric input
 * @param {string|number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {object} - Validation result
 */
export const validateNumeric = (value, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  const numValue = parseFloat(value);
  
  if (isNaN(numValue)) {
    return { isValid: false, message: 'Please enter a valid number' };
  }
  
  if (numValue < min) {
    return { isValid: false, message: `Value must be at least ${min}` };
  }
  
  if (numValue > max) {
    return { isValid: false, message: `Value must be no more than ${max}` };
  }
  
  return { isValid: true, value: numValue };
};

/**
 * Comprehensive form validation
 * @param {object} formData - Form data to validate
 * @param {object} validationRules - Validation rules for each field
 * @returns {object} - Validation results
 */
export const validateForm = (formData, validationRules) => {
  const errors = {};
  const sanitizedData = {};
  let isFormValid = true;
  
  Object.keys(validationRules).forEach(field => {
    const value = formData[field];
    const rules = validationRules[field];
    
    let result = { isValid: true, value: value };
    
    // Apply validation rules
    if (rules.required && (!value || value.toString().trim() === '')) {
      result = { isValid: false, message: `${field} is required` };
    } else if (value && rules.validator) {
      result = rules.validator(value);
    }
    
    if (!result.isValid) {
      errors[field] = result.message;
      isFormValid = false;
    } else {
      sanitizedData[field] = result.value;
    }
  });
  
  return {
    isValid: isFormValid,
    errors,
    sanitizedData
  };
};

/**
 * Rate limiting for form submissions
 */
class RateLimiter {
  constructor() {
    this.attempts = new Map();
  }
  
  isAllowed(identifier, maxAttempts = 5, windowMs = 60000) {
    const now = Date.now();
    const key = identifier;
    
    if (!this.attempts.has(key)) {
      this.attempts.set(key, []);
    }
    
    const attempts = this.attempts.get(key);
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(timestamp => now - timestamp < windowMs);
    this.attempts.set(key, validAttempts);
    
    if (validAttempts.length >= maxAttempts) {
      return false;
    }
    
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    return true;
  }
}

export const rateLimiter = new RateLimiter(); 
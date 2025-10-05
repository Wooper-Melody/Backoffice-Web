// Validation utilities for user forms based on API specifications

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

// Email validation (basic email format)
export const validateEmail = (email: string): ValidationError | null => {
  if (!email || email.trim() === "") {
    return { field: "email", message: "Valid email is required" }
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { field: "email", message: "Please enter a valid email" }
  }
  
  return null
}

// Password validation (5-20 characters, required for create)
export const validatePassword = (password: string, isRequired = true): ValidationError | null => {
  if (isRequired && (!password || password.trim() === "")) {
    return { field: "password", message: "Password is required" }
  }
  
  if (password && (password.length < 5 || password.length > 20)) {
    return { field: "password", message: "Password must be between 5 and 20 characters" }
  }
  
  return null
}

// Username validation (3-50 characters, required)
export const validateUsername = (username: string): ValidationError | null => {
  if (!username || username.trim() === "") {
    return { field: "username", message: "Username is required" }
  }
  
  if (username.length < 3 || username.length > 50) {
    return { field: "username", message: "Username must be between 3 and 50 characters" }
  }
  
  return null
}

// Phone validation (optional, pattern: ^$|^\\+?[0-9]{10,15}$)
export const validatePhone = (phone: string): ValidationError | null => {
  if (!phone || phone.trim() === "") {
    return null // Phone is optional
  }
  
  const phoneRegex = /^\+?[0-9]{10,15}$/
  if (!phoneRegex.test(phone)) {
    return { field: "phoneNumber", message: "Phone number must be between 10 and 15 digits, optionally with +" }
  }
  
  return null
}

// String length validation with custom limits
export const validateStringLength = (
  value: string, 
  fieldName: string, 
  displayName: string, 
  minLength: number = 0, 
  maxLength: number
): ValidationError | null => {
  if (!value || value.trim() === "") {
    if (minLength > 0) {
      return { field: fieldName, message: `${displayName} is required` }
    }
    return null // Optional field
  }
  
  if (value.length < minLength) {
    return { field: fieldName, message: `${displayName} must have at least ${minLength} characters` }
  }
  
  if (value.length > maxLength) {
    return { field: fieldName, message: `${displayName} cannot exceed ${maxLength} characters` }
  }
  
  return null
}

// Validate firstName (0-50 characters)
export const validateFirstName = (firstName: string): ValidationError | null => {
  return validateStringLength(firstName, "firstName", "The first name", 0, 50)
}

// Validate lastName (0-50 characters)
export const validateLastName = (lastName: string): ValidationError | null => {
  return validateStringLength(lastName, "lastName", "The last name", 0, 50)
}

// Validate address (0-500 characters)
export const validateAddress = (address: string): ValidationError | null => {
  return validateStringLength(address, "address", "The address", 0, 500)
}

// Validate profilePictureUrl (0-500 characters)
export const validateProfilePictureUrl = (url: string): ValidationError | null => {
  return validateStringLength(url, "profilePictureUrl", "The profile picture URL", 0, 500)
}

// Validate biography (0-1000 characters)
export const validateBiography = (biography: string): ValidationError | null => {
  return validateStringLength(biography, "biography", "The biography", 0, 1000)
}

// Login form validation (simplified - only email format and required fields)
export const validateLoginForm = (formData: {
  email: string
  password: string
}): ValidationResult => {
  const errors: ValidationError[] = []
  
  // Required fields for login
  const emailError = validateEmail(formData.email)
  if (emailError) errors.push(emailError)
  
  // For login, we just check if password is provided (no length requirements)
  if (!formData.password || formData.password.trim() === "") {
    errors.push({ field: "password", message: "Password is required" })
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Comprehensive validation for CreateUserRequest
export const validateCreateUserForm = (formData: {
  email: string
  password: string
  username: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  address?: string
  profilePictureUrl?: string
  biography?: string
}): ValidationResult => {
  const errors: ValidationError[] = []
  
  // Required fields
  const emailError = validateEmail(formData.email)
  if (emailError) errors.push(emailError)
  
  const passwordError = validatePassword(formData.password, true)
  if (passwordError) errors.push(passwordError)
  
  const usernameError = validateUsername(formData.username)
  if (usernameError) errors.push(usernameError)
  
  // Optional fields
  const phoneError = validatePhone(formData.phoneNumber || "")
  if (phoneError) errors.push(phoneError)
  
  const firstNameError = validateFirstName(formData.firstName || "")
  if (firstNameError) errors.push(firstNameError)
  
  const lastNameError = validateLastName(formData.lastName || "")
  if (lastNameError) errors.push(lastNameError)
  
  const addressError = validateAddress(formData.address || "")
  if (addressError) errors.push(addressError)
  
  const profilePictureError = validateProfilePictureUrl(formData.profilePictureUrl || "")
  if (profilePictureError) errors.push(profilePictureError)
  
  const biographyError = validateBiography(formData.biography || "")
  if (biographyError) errors.push(biographyError)
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Comprehensive validation for UpdateUserRequest (no password required)
export const validateUpdateUserForm = (formData: {
  email?: string
  username?: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  address?: string
  profilePictureUrl?: string
  biography?: string
}): ValidationResult => {
  const errors: ValidationError[] = []
  
  // Required fields
  const emailError = validateEmail(formData.email || "")
  if (emailError) errors.push(emailError)
  
  const usernameError = validateUsername(formData.username || "")
  if (usernameError) errors.push(usernameError)
  
  // Optional fields
  const phoneError = validatePhone(formData.phoneNumber || "")
  if (phoneError) errors.push(phoneError)
  
  const firstNameError = validateFirstName(formData.firstName || "")
  if (firstNameError) errors.push(firstNameError)
  
  const lastNameError = validateLastName(formData.lastName || "")
  if (lastNameError) errors.push(lastNameError)
  
  const addressError = validateAddress(formData.address || "")
  if (addressError) errors.push(addressError)
  
  const profilePictureError = validateProfilePictureUrl(formData.profilePictureUrl || "")
  if (profilePictureError) errors.push(profilePictureError)
  
  const biographyError = validateBiography(formData.biography || "")
  if (biographyError) errors.push(biographyError)
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
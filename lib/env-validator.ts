// Utility to validate environment variables
export function validateEnvVars() {
  const requiredVars = ['NEXT_PUBLIC_API_URL'] as const
  const missingVars: string[] = []
  const invalidVars: string[] = []

  for (const varName of requiredVars) {
    const value = process.env[varName]
    
    if (!value) {
      missingVars.push(varName)
      continue
    }

    // Validate URL format for API-related variables
    if (varName.includes('URL') || varName.includes('API')) {
      try {
        new URL(value)
      } catch {
        invalidVars.push(`${varName} (not a valid URL)`)
      }
    }
  }

  if (missingVars.length > 0 || invalidVars.length > 0) {
    console.error('Environment variable configuration error:')
    
    if (missingVars.length > 0) {
      console.error('Missing variables:', missingVars.join(', '))
    }
    
    if (invalidVars.length > 0) {
      console.error('Invalid variables:', invalidVars.join(', '))
    }
    
    console.error('\n How to fix:')
    console.error('1. Copy .env.local')
    console.error('2. Set the required variables')
    console.error('3. Restart the development server')
    
    if (process.env.NODE_ENV === 'development') {
      console.warn('\nContinuing in development mode...')
    }
    
    return false
  }

  console.log('Environment variables are configured correctly')
  return true
}

// Run validation in development
if (process.env.NODE_ENV === 'development') {
  validateEnvVars()
}
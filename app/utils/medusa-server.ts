import Medusa from '@medusajs/medusa-js'
import type { H3Event } from 'h3'

/**
 * Creates a server-side Medusa client instance.
 * To be used in server API endpoints.
 * 
 * @param event - H3Event from Nuxt's handler
 * @returns Configured Medusa client
 */
export const serverMedusaClient = (event: H3Event) => {
  const config = useRuntimeConfig()

  // Create a new Medusa client
  const client = new Medusa({
    baseUrl: config.public.medusa.baseUrl,
    publishableApiKey: config.public.medusa.publishableKey,
    maxRetries: 3,
    debug: process.env.NODE_ENV === "development",
  })
  
  return client
}

/**
 * Handles user authentication by logging in and setting the JWT token as a cookie
 * 
 * @param event - H3Event from Nuxt's handler
 * @param email - User email
 * @param password - User password
 * @returns Authentication result with customer data
 */
export const authenticateUser = async (event: H3Event, email: string, password: string) => {
  const medusa = serverMedusaClient(event)
  
  try {
    // Authenticate user with Medusa
    const { customer, token } = await medusa.auth.authenticate({
      email,
      password
    })
    
    // Set secure cookie with proper options
    setCookie(event, 'medusa_jwt', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax'
    })
    
    return {
      success: true,
      customer
    }
  } catch (error: any) {
    // Handle authentication error
    console.error('Authentication error:', error.message)
    return {
      success: false,
      error: error.message || 'Authentication failed'
    }
  }
}

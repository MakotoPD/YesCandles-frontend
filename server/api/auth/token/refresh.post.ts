import { getCookie, setCookie } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // Get the current JWT token from the cookie
    const token = getCookie(event, 'medusa_jwt')
    
    if (!token) {
      return {
        success: false,
        message: 'No token found',
        statusCode: 401
      }
    }
    
    // Get publishable API key from environment
    const publishableApiKey = process.env.MEDUSA_PUBLISHABLE_KEY
    if (!publishableApiKey) {
      console.error('No publishable API key found in environment')
      return {
        success: false,
        message: 'Server configuration error',
        statusCode: 500
      }
    }
    
    // Set up headers with the current token
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-publishable-api-key': publishableApiKey
    }
    
    // Call the Medusa refresh token endpoint - correct path is /auth/token/refresh
    const response = await $fetch(`${process.env.MEDUSA_BACKEND_URL}/auth/token/refresh`, {
      method: 'POST',
      headers
    })
    
    // If successful, set the new token in the cookie
    if (response.token) {
      setCookie(event, 'medusa_jwt', response.token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax'
      })
      
      return {
        success: true,
        message: 'Token refreshed successfully'
      }
    } else {
      return {
        success: false,
        message: 'Failed to refresh token - no token in response',
        statusCode: 500
      }
    }
  } catch (error: any) {
    console.error('Error refreshing token:', error)
    
    // If the token is invalid, clear it
    if (error.status === 401) {
      setCookie(event, 'medusa_jwt', '', {
        path: '/',
        httpOnly: true,
        maxAge: 0,
        sameSite: 'lax'
      })
    }
    
    return {
      success: false,
      message: error.message || 'Error refreshing token',
      statusCode: error.status || 500
    }
  }
})

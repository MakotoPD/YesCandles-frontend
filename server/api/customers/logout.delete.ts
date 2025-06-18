import { serverMedusaClient } from '~/utils/medusa-server'

export default defineWrappedResponseHandler(async (event) => {
  try {
    // Delete the session cookie with the same parameters as when it was set
    // This ensures complete removal of the cookie
    deleteCookie(event, 'medusa_jwt', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })
    
    // Return success response
    return { success: true }
  } catch (error) {
    console.error('Error during logout:', error)
    return { success: false, error: 'Failed to complete logout' }
  }
})

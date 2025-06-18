import { serverMedusaClient } from '~/utils/medusa-server'

export default defineWrappedResponseHandler(async (event) => {
  const body = await readBody(event)
  const token = getCookie(event, 'medusa_jwt')

  // Validate request body
  if (!body.current_password || !body.new_password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Current password and new password are required'
    })
  }

  // Validate password length
  if (body.new_password.length < 8) {
    throw createError({
      statusCode: 400,
      statusMessage: 'New password must be at least 8 characters long'
    })
  }

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }
  
  try {
    // Get Medusa client instance
    const medusa = serverMedusaClient(event)
    const authHeaders = { Authorization: `Bearer ${token}` }
    
    // First get the customer to get their email
    const { customer } = await medusa.store.customers.retrieve({}, authHeaders)
    
    if (!customer) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Customer not found'
      })
    }
    
    try {
      // Update password using the customer update endpoint
      await medusa.store.customers.update(
        { password: body.new_password },
        authHeaders
      )
      
      return {
        success: true,
        message: 'Password updated successfully'
      }
    } catch (error: any) {
      // Check if the error is related to password validation
      if (error.response?.status === 400 || error.status === 400) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Password update failed. Please ensure your new password meets requirements.'
        })
      }
      throw error
    }
  } catch (error: any) {
    // Handle authentication errors
    if (error.status === 401 || error.response?.status === 401) {
      deleteCookie(event, 'medusa_jwt', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
      
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication failed'
      })
    }
    
    // Handle bad request errors
    if (error.status === 400 || error.response?.status === 400) {
      throw createError({
        statusCode: 400,
        statusMessage: error.message || 'Invalid request'
      })
    }
    
    // For any other error, create a structured error
    throw createError({
      statusCode: error.status || error.response?.status || 500,
      statusMessage: error.message || 'An error occurred while updating password'
    })
  }
})
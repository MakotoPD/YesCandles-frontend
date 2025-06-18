import { serverMedusaClient } from '~/utils/medusa-server'

export default defineWrappedResponseHandler(async (event) => {
  // Get the token from cookie
  const token = getCookie(event, 'medusa_jwt')
  
  // Check if token exists
  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required'
    })
  }

  const body = await readBody(event)
  
  try {
    // Get Medusa client instance
    const medusa = serverMedusaClient(event)
    
    // Create the update payload with metadata structure
    const updatePayload = {
      first_name: body.first_name,
      last_name: body.last_name,
      phone: body.phone
    }
    
    // Add metadata if provided
    if (body.metadata) {
      updatePayload.metadata = body.metadata
    }
    
    // Update customer information using the serverMedusaClient
    const response = await medusa.store.customers.update(updatePayload, {
      Authorization: `Bearer ${token}`
    })
    
    return response
  } catch (error: any) {
    // Handle specific errors
    console.error('Error updating customer:', error)
    
    if (error.status === 401 || error.response?.status === 401) {
      // Token is invalid or expired
      throw createError({
        statusCode: 401,
        message: 'Session expired, please log in again'
      })
    }
    
    // Create a structured error for the client
    throw createError({
      statusCode: error.status || error.response?.status || 500,
      message: error.message || 'An unexpected error occurred updating your profile'
    })
  }
})
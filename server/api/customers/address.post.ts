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
  const { action, addressId, addressData } = body
  
  try {
    // Get Medusa client instance
    const medusa = serverMedusaClient(event)
    const authHeaders = { Authorization: `Bearer ${token}` }
    let response
    
    switch (action) {
      case 'create':
        // Create a new address
        response = await medusa.store.customers.addresses.addAddress({
          address: addressData
        }, authHeaders)
        break
        
      case 'update':
        // Update an existing address
        response = await medusa.store.customers.addresses.updateAddress({
          address_id: addressId,
          ...addressData
        }, authHeaders)
        break
        
      case 'delete':
        // Delete an address
        response = await medusa.store.customers.addresses.deleteAddress({
          address_id: addressId
        }, authHeaders)
        break
        
      case 'list':
        // List all addresses by getting customer data
        response = await medusa.store.customers.retrieve({}, authHeaders)
        break
        
      default:
        throw createError({
          statusCode: 400,
          message: 'Invalid action specified'
        })
    }
    
    return response
  } catch (error: any) {
    console.error('Error with address operation:', error)
    
    if (error.status === 401 || error.response?.status === 401) {
      // Token is invalid or expired, clear it
      deleteCookie(event, 'medusa_jwt', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
      
      throw createError({
        statusCode: 401,
        message: 'Session expired, please log in again'
      })
    }
    
    // Create a structured error for the client
    throw createError({
      statusCode: error.status || error.response?.status || 500,
      message: error.message || 'An unexpected error occurred with address operation'
    })
  }
})

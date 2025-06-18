import { serverMedusaClient } from '~/utils/medusa-server'

export default defineEventHandler(async (event) => {
  try {
    // Get token from cookie
    const token = getCookie(event, 'medusa_jwt')
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required',
      })
    }

    // Get query parameters for pagination
    const query = getQuery(event)
    const limit = Number(query.limit) || 10
    const offset = Number(query.offset) || 0

    // Get Medusa client instance
    const medusa = serverMedusaClient(event)
    
    // Fetch orders from Medusa API with proper authorization
    const response = await medusa.store.orders.list(
      {
        limit,
        offset
      }, 
      {
        Authorization: `Bearer ${token}`
      }
    )

    return response
  } catch (error: any) {
    console.error('Error fetching orders:', error)
    
    // Handle authentication errors
    if (error.status === 401 || error.response?.status === 401) {
      // Delete the invalid token cookie with the same parameters
      deleteCookie(event, 'medusa_jwt', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
      
      throw createError({
        statusCode: 401,
        statusMessage: 'Session expired, please log in again',
      })
    }
    
    // Create a structured error for the client
    throw createError({
      statusCode: error.status || error.response?.status || 500,
      statusMessage: error.message || 'Error fetching orders',
    })
  }
})

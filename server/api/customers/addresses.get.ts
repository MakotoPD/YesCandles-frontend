import { getCookie } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // Get token from cookie
    const token = getCookie(event, 'medusa_jwt')
    if (!token) {
      console.error('No token found in cookies')
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized - No token',
      })
    }

    // Get publishable API key from environment
    const publishableApiKey = process.env.MEDUSA_PUBLISHABLE_KEY
    if (!publishableApiKey) {
      console.error('No publishable API key found in environment')
      throw createError({
        statusCode: 500,
        statusMessage: 'Server configuration error',
      })
    }

    // Fetch customer data including addresses from Medusa API
    const response = await $fetch(`${process.env.MEDUSA_BACKEND_URL}/store/customers/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-publishable-api-key': publishableApiKey
      }
    })

    // Return only the addresses
    return {
      addresses: response.customer?.addresses || [],
      success: true
    }
  } catch (error: any) {
    console.error('Error fetching customer addresses:', error)
    
    // Handle specific error codes
    if (error.statusCode === 401) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized - Invalid token',
      })
    }
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Error fetching customer addresses',
    })
  }
})

import { getCookie } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // Get token from cookie
    const token = getCookie(event, 'medusa_jwt')
    if (!token) {
      console.error('No token found in cookies')
      return {
        success: false,
        error: 'No authentication token found',
        statusCode: 401
      }
    }

    // Get publishable API key from environment
    const publishableApiKey = process.env.MEDUSA_PUBLISHABLE_KEY
    if (!publishableApiKey) {
      console.error('No publishable API key found in environment')
      return {
        success: false,
        error: 'Server configuration error',
        statusCode: 500
      }
    }

    // Get cart ID from request body
    const { cartId } = await readBody(event)
    if (!cartId) {
      return {
        success: false,
        error: 'Cart ID is required',
        statusCode: 400
      }
    }
    
    // First check if the customer exists by retrieving customer data
    try {
      await $fetch(`${process.env.MEDUSA_BACKEND_URL}/store/customers/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-publishable-api-key': publishableApiKey
        }
      })
    } catch (customerError: any) {
      console.warn('Customer not found or invalid token, skipping cart association:', customerError.message)
      return {
        success: false,
        error: 'Customer not found or invalid token',
        statusCode: 401,
        skipAssociation: true
      }
    }

    // If we get here, customer exists, so associate the customer with the cart
    try {
      const response = await $fetch(`${process.env.MEDUSA_BACKEND_URL}/store/carts/${cartId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-publishable-api-key': publishableApiKey
        },
        body: {
          // We don't need to send any data, just the auth token
          // The Medusa API will associate the cart with the customer based on the token
        }
      })

      return {
        success: true,
        cart: response.cart
      }
    } catch (cartError: any) {
      console.error('Error associating customer with cart:', cartError)
      return {
        success: false,
        error: cartError.message || 'Error associating customer with cart',
        statusCode: cartError.statusCode || 500
      }
    }
  } catch (error: any) {
    console.error('Error associating customer with cart:', error)
    
    // Handle specific error codes
    if (error.statusCode === 401) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized - Invalid token',
      })
    }
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Error associating customer with cart',
    })
  }
})

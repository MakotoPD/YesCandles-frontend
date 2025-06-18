import { getCookie } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const publishableApiKey = process.env.MEDUSA_PUBLISHABLE_KEY

    const cartId = event.context.params?.cartId
    if (!cartId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cart ID is required',
      })
    }

    const code = event.context.params?.code
    if (!code) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Promotion code is required',
      })
    }

    // Get token from cookie for authentication (if user is logged in)
    const token = getCookie(event, 'medusa_jwt')
    
    // Get publishable API key from environment
    if (!publishableApiKey) {
      console.error('No publishable API key found in environment')
      throw createError({
        statusCode: 500,
        statusMessage: 'Server configuration error',
      })
    }

    // Set headers for the request
    const headers: Record<string, string> = {
      'x-publishable-api-key': publishableApiKey
    }

    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Remove promotion from the cart
    const response = await $fetch(`${process.env.MEDUSA_BACKEND_URL}/store/carts/${cartId}/promotions`, {
      method: 'DELETE',
      headers,
      credentials: 'include',
      body: {
        promo_codes: [code]
      }
    })

    return {
      success: true,
      cart: response.cart
    }
  } catch (error: any) {
    console.error('Error removing promotion code:', error)
    
    // Handle specific error codes
    if (error.statusCode === 400) {
      throw createError({
        statusCode: 400,
        statusMessage: error.data?.message || 'Invalid promotion code',
      })
    }
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.data?.message || error.message || 'Error removing promotion code',
    })
  }
})

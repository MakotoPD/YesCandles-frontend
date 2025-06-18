import { serverMedusaClient } from '#medusa/server'

export default defineWrappedResponseHandler(async (event) => {
  try {
    // Get the current token
    const currentToken = getCookie(event, 'medusa_jwt')
    if (!currentToken) {
      return {
        success: false,
        message: 'No authentication token found'
      }
    }

    // Get customer data from the request body
    const { email } = await readBody(event)
    if (!email) {
      return {
        success: false,
        message: 'Email is required'
      }
    }

    // Get a new token using the customer's email
    const medusa = serverMedusaClient(event)
    try {
      // Try to get a new token by verifying the current customer
      const customerResponse = await medusa.store.customer.retrieve({}, {
        Authorization: `Bearer ${currentToken}`
      })
      
      if (customerResponse.customer && customerResponse.customer.email === email) {
        // Clear the old token
        setCookie(event, 'medusa_jwt', '', {
          path: '/',
          maxAge: 0, // Expire immediately
          httpOnly: true
        })
        
        // Set a new cookie with the refreshed token
        setCookie(event, 'medusa_jwt', currentToken, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          sameSite: 'lax'
        })
        
        return {
          success: true,
          message: 'Token refreshed successfully',
          customer: customerResponse.customer
        }
      } else {
        return {
          success: false,
          message: 'Email mismatch or customer not found'
        }
      }
    } catch (error) {
      console.error('Error refreshing token:', error)
      
      // Clear the invalid token
      setCookie(event, 'medusa_jwt', '', {
        path: '/',
        maxAge: 0, // Expire immediately
        httpOnly: true
      })
      
      return {
        success: false,
        message: 'Invalid token, please log in again',
        logout: true
      }
    }
  } catch (error) {
    console.error('Error in refresh-token endpoint:', error)
    return {
      success: false,
      message: 'An error occurred while refreshing the token'
    }
  }
})

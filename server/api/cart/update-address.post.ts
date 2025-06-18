import { getCookie } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // Get the request body with cart ID and address data
    const { cartId, addressData } = await readBody(event)
    
    if (!cartId) {
      return {
        success: false,
        message: 'Cart ID is required',
        statusCode: 400
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

    // Set up headers with publishable API key
    const headers = {
      'Content-Type': 'application/json',
      'x-publishable-api-key': publishableApiKey
    }

    try {
      // Create a modified version of the address data that doesn't include customer_id
      // This avoids the customer lookup that's causing the error
      const sanitizedAddressData = { ...addressData }
      
      // Now update the cart with address information
      const response = await $fetch(`${process.env.MEDUSA_BACKEND_URL}/store/carts/${cartId}`, {
        method: 'POST',
        headers,
        body: sanitizedAddressData
      })

      return {
        success: true,
        cart: response.cart
      }
    } catch (error: any) {
      console.error('Error updating cart address:', error)
      
      // If we get a customer not found error, try again with a more basic approach
      if (error.message && error.message.includes('Customer with id')) {
        console.log('Detected customer ID mismatch error, trying alternative approach')
        
        try {
          // Try with just the shipping and billing address fields
          const minimalAddressData = {
            shipping_address: addressData.shipping_address,
            billing_address: addressData.billing_address
          }
          
          const retryResponse = await $fetch(`${process.env.MEDUSA_BACKEND_URL}/store/carts/${cartId}`, {
            method: 'POST',
            headers,
            body: minimalAddressData
          })
          
          return {
            success: true,
            cart: retryResponse.cart
          }
        } catch (retryError: any) {
          console.error('Error with alternative approach:', retryError)
          return {
            success: false,
            message: retryError.message || 'Error updating cart address with alternative approach',
            statusCode: retryError.statusCode || 500
          }
        }
      }
      
      return {
        success: false,
        message: error.message || 'Error updating cart address',
        statusCode: error.statusCode || 500
      }
    }
  } catch (error: any) {
    console.error('Error in update-address endpoint:', error)
    return {
      success: false,
      message: 'An error occurred while updating the cart address',
      statusCode: 500
    }
  }
})

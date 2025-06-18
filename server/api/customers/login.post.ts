import { serverMedusaClient } from '~/utils/medusa-server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  try {
    // Get Medusa client
    const medusa = serverMedusaClient(event)
    
    // Step 1: Authenticate with email/password to get a JWT
    const { token } = await medusa.auth.authenticate({
      email: body.email,
      password: body.password
    })

    if (!token) {
      throw new Error('Authentication failed, could not retrieve JWT.')
    }

    // Step 2: Set the JWT in a secure, http-only cookie using the recommended approach
    setCookie(event, 'medusa_jwt', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    })

    // Step 3: Use the token to fetch the customer details with proper Authorization header
    const { customer } = await medusa.store.customers.retrieve({}, {
      Authorization: `Bearer ${token}`
    })

    if (!customer) {
      throw new Error('Could not retrieve customer details after login.')
    }

    // Return both customer data and token status for the frontend
    return { customer, success: true }

  } catch (e: any) {
    // Log the error and throw a structured error response
    console.error('Login error:', e.data || e.message)
    throw createError({
      statusCode: e.response?.status || 500,
      statusMessage: e.data?.message || 'An unexpected error occurred during login.',
    })
  }
})


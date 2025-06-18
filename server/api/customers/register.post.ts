import { serverMedusaClient } from '~/utils/medusa-server'

export default defineWrappedResponseHandler(async (event) => {
  const medusa = serverMedusaClient(event)
  const body = await readBody(event)

  try {
    // Step 1: Register the customer and get authentication token
    const { token } = await medusa.auth.register({
      email: body.email,
      password: body.password,
      first_name: body.first_name,
      last_name: body.last_name,
      phone: body.phone
    })

    if (!token) {
      throw new Error('Registration failed, could not retrieve JWT.')
    }

    // Step 2: Set the JWT in a secure, http-only cookie with the same consistent options
    setCookie(event, 'medusa_jwt', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    })

    // Step 3: Get customer details using the token
    const { customer } = await medusa.store.customers.retrieve({}, {
      Authorization: `Bearer ${token}`
    })

    // Return success status and customer data
    return { success: true, customer }
  } catch (error: any) {
    console.error('Registration error:', error.message || error)
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.message || 'An unexpected error occurred during registration.',
    })
  }
})

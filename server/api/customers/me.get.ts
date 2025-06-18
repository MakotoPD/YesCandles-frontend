import { serverMedusaClient } from '#medusa/server'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'medusa_jwt')

  if (!token) {
    return { customer: null }
  }

  try {
    // Use serverMedusaClient with the Authorization header approach as outlined in memory
    const medusa = serverMedusaClient(event)
    const { customer } = await medusa.store.customers.retrieve({}, {
      Authorization: `Bearer ${token}`
    })
    
    if (!customer) {
      // If no customer is returned despite a valid request, handle as auth error
      deleteCookie(event, 'medusa_jwt', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
      return { customer: null }
    }
    
    return { customer }
  } catch (error: any) {
    // Handle authentication errors
    if (error.response?.status === 401 || error.status === 401) {
      deleteCookie(event, 'medusa_jwt', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
    }
    
    // Always return a consistent response structure to prevent frontend errors
    return { customer: null }
  }
})


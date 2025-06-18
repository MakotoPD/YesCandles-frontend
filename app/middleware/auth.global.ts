

export default defineNuxtRouteMiddleware(async () => {
  if (process.server) {
    return
  }

  const authStore = useAuthStore()

  // If a token exists, always try to fetch the customer data
  // This ensures the session is always refreshed on page reload
  if (useCookie('medusa_jwt').value) {
    console.log('[Auth Middleware] JWT token found, fetching customer data')
    await authStore.fetchCustomer()
  }
})


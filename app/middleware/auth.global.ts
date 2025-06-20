export default defineNuxtRouteMiddleware(async () => {
  if (process.server) {
    return
  }

  const authStore = useAuthStore()
  const cartStore = useCartStore()
  
  // Resetuj komunikaty o błędach przy każdej zmianie strony/nawigacji
  authStore.clearError()
  
  // Sprawdź czy istnieje token przez API endpoint (httpOnly cookie)
  try {
    const tokenData = await $fetch('/api/auth/get-token')
    
    if (tokenData.token && !authStore.isLoggedIn) {
      console.log('[Auth Middleware] JWT token found, initializing auth')
      await authStore.initializeAuth(tokenData.token)
    }
  } catch (error) {
    console.log('[Auth Middleware] No token found or error checking token')
  }

  cartStore.initializeCart()
})

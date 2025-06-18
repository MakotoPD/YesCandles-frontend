export default defineNuxtRouteMiddleware(async (to) => {
  // Since we've hardcoded the site to Polish locale only, this middleware no longer needs to handle country routing
  // The useCountry composable now always returns the Polish country data
  
  // No redirects or country selection needed
  return
})

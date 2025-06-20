export default defineEventHandler(async (event) => {
  // Usuń cookie z tokenem JWT
  deleteCookie(event, 'medusa_jwt', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })

  return { success: true }
})

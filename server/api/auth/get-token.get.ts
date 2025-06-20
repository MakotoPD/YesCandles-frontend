export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'medusa_jwt')
  
  return { 
    token: token || null 
  }
})

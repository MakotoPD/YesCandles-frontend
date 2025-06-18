import Medusa from '@medusajs/medusa-js'

/**
 * Creates a client-side Medusa client instance.
 * To be used in the browser/frontend components.
 * 
 * @returns Configured Medusa client
 */
export const createMedusaClient = () => {
  const config = useRuntimeConfig()
  
  // Create a new Medusa client with the proper configuration
  const client = new Medusa({
    baseUrl: config.public.medusaBackendUrl,
    publishableApiKey: config.public.medusaPublishableKey,
    maxRetries: 3
  })
  
  return client
}

/**
 * A composable to access the Medusa client in components
 * Ensures credentials are included to send cookies with requests
 * 
 * @returns Medusa client instance
 */
export const useMedusaClient = () => {
  // Create or return singleton client instance
  const client = useState('medusa-client', () => createMedusaClient())
  
  return client.value
}

/**
 * Makes a fetch request to the Medusa API with proper credentials
 * This is useful for endpoints not covered by the Medusa JS Client
 * 
 * @param endpoint - API endpoint path (without the base URL)
 * @param options - Fetch options
 * @returns Response data
 */
export const medusaFetch = async (endpoint: string, options: any = {}) => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.medusaBackendUrl
  
  // Ensure credentials are included to send cookies
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': config.public.medusaPublishableKey
    }
  }
  
  // Merge default options with provided options
  const fetchOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  }
  
  try {
    const response = await fetch(`${baseUrl}${endpoint}`, fetchOptions)
    
    // Handle HTTP errors
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw { status: response.status, data: error }
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching from Medusa API:', error)
    throw error
  }
}

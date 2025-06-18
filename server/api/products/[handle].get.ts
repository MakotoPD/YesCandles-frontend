import { serverMedusaClient } from '#medusa/server'

export default defineEventHandler(async (event) => {
  try {
    const handle = getRouterParam(event, 'handle')

    if (!handle) {
      throw createError({
        statusCode: 400,
        message: 'Product handle is required'
      })
    }
   
    // Inicjalizacja klienta Medusa JS SDK
    const medusa = serverMedusaClient(event)
    
    try {
      // Lista produktów z filtrowaniem po handle
      console.log(`[API] Using Medusa JS SDK to fetch products with handle: ${handle}`)
      
      // Używamy metody list z SDK, aby pobrać wszystkie produkty
      // Dodajemy opcję expand, aby pobrać warianty, ceny i inne powiązane dane
      const products = await medusa.store.product.list({
        region_id: process.env.MEDUSA_REGION,
        handle: handle,
        fields: '*variants.calculated_price'
      })

      console.log(products)

      const product = products.products.find(p => p.handle == handle)
      
      console.log(product)

      if (!product) {
        console.log(`[API] Product with handle '${handle}' not found in product list`)
        throw createError({ 
          statusCode: 404, 
          message: 'Product not found' 
        })
      }
      
      console.log('[API] Product found via SDK:', product.title)
      console.log('[API] Variants count:', product.variants?.length || 0)
      
      // Debug pierwszego wariantu i jego ceny
      if (product.variants && product.variants.length > 0) {
        console.log('[API] First variant structure:', JSON.stringify(product.variants[0], null, 2))
        console.log('[API] Variant prices:', JSON.stringify(product.variants[0].prices, null, 2))
      }
      
      return { data: product }
    } catch (sdkError) {
      console.error(`[API] Error using Medusa JS SDK:`, sdkError)
      
      throw createError({
        statusCode: 500,
        message: sdkError.message || 'Error fetching product data'
      })
    }
  } catch (error: any) {
    console.error(`Error fetching product:`, error)
    
    // Handle specific error types
    if (error.statusCode) {
      throw error // Re-throw Nuxt errors
    }
    
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.message || 'Error fetching product data'
    })
  }
})

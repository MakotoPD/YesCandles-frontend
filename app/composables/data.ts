import type { StoreAddCartLineItem, StoreCartResponse, StoreCartShippingMethod, StoreOrder, StoreProductListParams, StoreUpdateCart, StoreUpdateCartLineItem } from '@medusajs/types'

export const useFetchCategories = () => {
  const medusa = useMedusaClient()
  return useLazyAsyncData(
    `categories`,
    async () => {
      return await medusa.store.category.list({
        fields: 'handle,name,*parent_category,*category_children',
      })
    })
}

export const useFetchCollections = () => {
  const medusa = useMedusaClient()
  return useLazyAsyncData(
    `collections`,
    async () => {
      return await medusa.store.collection.list({
        fields: 'handle,title',
      })
    })
}

export const useFetchCollectionByHandle = (handle: string) => useLazyAsyncData(`collection:${handle}`, () => {
  if (handle && typeof handle === 'string') {
    return $fetch(`/api/collections/${handle}`)
  }
  return Promise.resolve(null)
})

export const useFetchCategoryByHandle = (handle: string) => useLazyAsyncData(`category:${handle}`, () => {
  if (handle && typeof handle === 'string') {
    return $fetch(`/api/categories/${handle}`)
  }
  return Promise.resolve(null)
})

// Since the site is only in Polish with PLN currency, we'll use a function to get the Polish region ID
const getPolishRegionId = () => {
  // Default region ID to use if we can't determine the Polish one
  // This will be replaced with the actual region ID once we fetch it
  return 'reg_01JXW78760SH74JF8QWACENE54' // This is a fallback value
}

// Use this for all region_id references
const POLISH_REGION_ID = getPolishRegionId()

export const useFetchProducts = (query: MaybeRef<StoreProductListParams>, prefetch?: boolean) => {
  const queryRef = toRef(query)

  const queryParams = computed(() => ({
    region_id: POLISH_REGION_ID,
    ...queryRef.value,
  }))

  const key = computed(() => `products:${queryParams.value?.collection_id}:${queryParams.value?.category_id}:${queryParams.value?.limit}:${queryParams.value?.offset}:${POLISH_REGION_ID}`)

  return useLazyFetch('/api/products', {
    key: key.value,
    params: queryParams,
    watch: prefetch ? false : [queryParams],
    immediate: !prefetch,
  })
}

export const useFetchProductByHandle = (handle: string) => {
  const NuxtApp = useNuxtApp()

  return useLazyFetch(
    `/api/products/${handle}`,
    {
      key: `product:${handle}:region:${POLISH_REGION_ID}`,
      params: {
        region_id: POLISH_REGION_ID,
      },
      default: () => {
        // Only try to access payload data if it exists
        if (NuxtApp.payload?.data) {
          try {
            // Safely iterate through keys
            for (const key of Object.keys(NuxtApp.payload.data || {})) {
              if (key.startsWith('products')) {
                // Safe access with optional chaining
                const productData = NuxtApp.payload.data[key]
                const productsList = productData?.products
                
                if (Array.isArray(productsList)) {
                  for (const product of productsList) {
                    if (product?.handle === handle) {
                      return { data: product }
                    }
                  }
                }
              }
            }
          } catch (error) {
            console.error('Error in product default function:', error)
          }
        }
        
        // Return null if no product is found to prevent undefined errors
        return { data: null }
      },
      // Add proper error handling
      onResponseError(error) {
        console.error(`Error fetching product ${handle}:`, error)
      },
      server: false // Prevent hydration mismatches
    })
}

export const useFetchCountries = () => {
  return useLazyFetch('/api/regions', {
    key: 'countries',
    transform: data => getCountriesFromRegions(data?.regions),
  })
}

export const useCart = () => {
  const medusa = useMedusaClient()
  const { cartId, setCartId } = useUserCart()

  const retrieveCart = async () => {
    if (!cartId.value)
      return { cart: null }

    const cartResponse = await medusa.store.cart.retrieve(cartId.value, {
      fields: '*items,*region,*items.product,*items.variant,*items.thumbnail,*items.metadata,+items.total,*promotions,+shipping_methods.name',
    })

    if (cartResponse.cart && cartResponse.cart?.region_id !== POLISH_REGION_ID) {
      updateCart({ region_id: POLISH_REGION_ID })
    }

    return cartResponse
  }

  const createCart = async () => {
    const cartResponse = await medusa.store.cart.create({
      region_id: POLISH_REGION_ID,
    })
    setCartId(cartResponse.cart.id)
    return cartResponse
  }

  const retrieveOrCreateCart = async () => {
    const cartResponse = await retrieveCart()
    if (!cartResponse.cart)
      return await createCart()
    return cartResponse
  }

  const updateCart = async (data: StoreUpdateCart) => {
    if (!cartId.value)
      throw new Error('No existing cart found, please create one before updating')

    const cartResponse = await medusa.store.cart.update(cartId.value, data)
    refreshNuxtData(`cart`)
    return cartResponse.cart
  }

  const createLineItem = async (item: StoreAddCartLineItem) => {
    if (!cartId.value)
      throw new Error('No existing cart found, please create one before updating')

    const cartResponse = await medusa.store.cart.createLineItem(cartId.value, item)
    refreshNuxtData(`cart`)
    return cartResponse.cart
  }

  const updateLineItem = async (lineItemId: string, data: StoreUpdateCartLineItem) => {
    if (!cartId.value)
      throw new Error('No existing cart found, please create one before updating')

    const cartResponse = await medusa.store.cart.updateLineItem(cartId.value, lineItemId, data)
    refreshNuxtData(`cart`)
    return cartResponse.cart
  }

  const updateOrCreateLineItem = async (item: StoreAddCartLineItem) => {
    const cartResponse = await retrieveOrCreateCart()
    if (!cartResponse.cart)
      throw new Error('No existing cart found, please create one before adding items')

    const existingItem = cartResponse.cart.items?.find(
      lineItem => lineItem.variant_id === item.variant_id,
    )

    if (existingItem) {
      const updatedQuantity = existingItem.quantity + (item.quantity || 1)
      return await updateLineItem(existingItem.id, { quantity: updatedQuantity })
    }
    else {
      return await createLineItem(item)
    }
  }

  const deleteLineItem = async (lineItemId: string) => {
    if (!cartId.value)
      throw new Error('No existing cart found, please create one before updating')

    const cartResponse = await medusa.store.cart.deleteLineItem(cartId.value, lineItemId)
    refreshNuxtData(`cart`)
    return cartResponse.deleted
  }

  const addShippingMethod = async (shippingMethodId: StoreCartShippingMethod['id']) => {
    if (!cartId.value)
      throw new Error('No existing cart found, please create one before updating')

    const cartResponse = await medusa.store.cart.addShippingMethod(cartId.value, { option_id: shippingMethodId })
    refreshNuxtData(`cart`)
    return cartResponse.cart
  }

  const completeOrder = async () => {
    if (!cartId.value)
      throw new Error('No existing cart found')

    return await medusa.store.cart.complete(cartId.value)
  }

  return {
    retrieveCart,
    createCart,
    retrieveOrCreateCart,
    updateCart,
    createLineItem,
    updateLineItem,
    updateOrCreateLineItem,
    deleteLineItem,
    addShippingMethod,
    completeOrder,
  }
}

export const useFetchOrder = (orderId: StoreOrder['id']) => {
  const medusa = useMedusaClient()

  return useLazyAsyncData(
    `order:${orderId}`,
    async () => await medusa.store.order.retrieve(orderId, {
      fields: '*payment_collections.payments,*items,*items.metadata,*items.variant,*items.product',
    }),
    {
      transform: data => data.order,
    },
  )
}

export const useFetchShippingOptions = () => {
  const medusa = useMedusaClient()
  const { cartId } = useUserCart()

  return useLazyAsyncData(
    `shipping-options`,
    async () => {
      if (!cartId.value) {
        return null
      }
      return await medusa.store.fulfillment.listCartOptions({
        cart_id: cartId.value,
      })
    },
    {},
  )
}

export const useFetchPaymentProviders = () => {
  const medusa = useMedusaClient()

  return useLazyAsyncData(
    `payment-providers`,
    async () => {
      return await medusa.store.payment.listPaymentProviders({
        region_id: POLISH_REGION_ID,
      })
    },
    {},
  )
}

export const usePaymentSession = () => {
  const medusa = useMedusaClient()

  const initiatePaymentSession = async (provider_id: string) => {
    const { data: cartResponse } = useNuxtData<StoreCartResponse>('cart')
    if (!cartResponse.value?.cart)
      throw new Error('No existing cart found, please create one before updating')

    const paymentResponse = await medusa.store.payment.initiatePaymentSession(cartResponse.value?.cart, {
      provider_id,
    })
    await refreshNuxtData(`cart`)
    return paymentResponse.payment_collection
  }

  return {
    initiatePaymentSession,
  }
}

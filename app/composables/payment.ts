import type { StorePaymentCollection } from '@medusajs/types'
import { useCartStore } from '~/stores/cart'

export const useInitiatePaymentSession = () => {
  const cartStore = useCartStore()

  const loading = ref(false)
  const data = ref<StorePaymentCollection>()

  const mutate = async (provider_id: string) => {
    loading.value = true

    try {
      // Używamy Pinia store zamiast composables/data.ts
      data.value = await cartStore.initiatePaymentSession(provider_id)
    }
    catch (error) {
      console.error('Error initiating payment session:', error)
      throw error
    }
    finally {
      loading.value = false
    }
  }

  return {
    data,
    loading,
    mutate,
  }
}

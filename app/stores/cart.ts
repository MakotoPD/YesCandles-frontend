import { defineStore } from 'pinia'
import type { StoreCart, StoreAddCartLineItem, StoreUpdateCartLineItem, StoreCartShippingMethod } from '@medusajs/types'

export const useCartStore = defineStore('cart', {
  state: (): {
    cart: StoreCart | null
    isLoading: boolean
    error: string | null
    shippingOptions: any[]
  } => ({
    cart: null,
    isLoading: false,
    error: null,
    shippingOptions: []
  }),
  
  getters: {
    cartId: (state) => state.cart?.id,
    items: (state) => state.cart?.items || [],
    itemsCount: (state) => state.cart?.items?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0,
    totals: (state) => ({
      subtotal: state.cart?.subtotal || 0,
      tax: state.cart?.tax_total || 0,
      discount: state.cart?.discount_total || 0,
      shipping: state.cart?.shipping_total || 0,
      total: state.cart?.total || 0
    }),
    requiresShipping: (state) => state.cart?.shipping_methods?.length === 0
  },
  
  actions: {
    setCart(cart: StoreCart | null) {
      this.cart = cart
      
      // Zapisz ID koszyka w cookie dla zachowania między sesjami
      const cartIdCookie = useCookie('cart_id', {
        maxAge: 60 * 60 * 24 * 90, // 90 dni
      })
      
      if (cart?.id) {
        cartIdCookie.value = cart.id
      }
    },
    
    setLoading(loading: boolean) {
      this.isLoading = loading
    },
    
    async fetchCart() {
      const { retrieveCart } = useCart()
      const cartIdCookie = useCookie('cart_id')
      
      if (!cartIdCookie.value) {
        this.setCart(null)
        return null
      }
      
      try {
        this.setLoading(true)
        const response = await retrieveCart()
        this.setCart(response.cart)
        return response.cart
      } catch (error) {
        console.error('Błąd podczas pobierania koszyka:', error)
        this.setCart(null)
        return null
      } finally {
        this.setLoading(false)
      }
    },
    
    async addItem(item: StoreAddCartLineItem) {
      const { updateOrCreateLineItem } = useCart()
      
      try {
        this.setLoading(true)
        const cart = await updateOrCreateLineItem(item)
        this.setCart(cart)
        return cart
      } catch (error) {
        console.error('Błąd podczas dodawania przedmiotu do koszyka:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },
    
    async updateItem(itemId: string, data: StoreUpdateCartLineItem) {
      const { updateLineItem } = useCart()
      
      try {
        this.setLoading(true)
        const cart = await updateLineItem(itemId, data)
        this.setCart(cart)
        
        // Dodatkowe pełne odświeżenie koszyka po zakończonej operacji
        // aby mieć pewność, że wszystkie części UI mają aktualne dane
        await this.fetchCart()
        return cart
      } catch (error) {
        console.error('Błąd podczas aktualizacji przedmiotu w koszyku:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },
    
    async removeItem(itemId: string) {
      const { deleteLineItem } = useCart()
      
      try {
        this.setLoading(true)
        await deleteLineItem(itemId)
        // Po usunięciu przedmiotu, pobierz aktualny stan koszyka
        await this.fetchCart()
        return true
      } catch (error) {
        console.error('Błąd podczas usuwania przedmiotu z koszyka:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },
    
    async setShippingMethod(shippingMethodId: StoreCartShippingMethod['id']) {
      const { addShippingMethod } = useCart()
      
      try {
        this.setLoading(true)
        const cart = await addShippingMethod(shippingMethodId)
        this.setCart(cart)
        return cart
      } catch (error) {
        console.error('Błąd podczas ustawiania metody wysyłki:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },
    
    async updateCartData(data: any) {
      const { updateCart } = useCart()
      
      try {
        this.setLoading(true)
        const cart = await updateCart(data)
        this.setCart(cart)
        return cart
      } catch (error) {
        console.error('Błąd podczas aktualizacji koszyka:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },
    
    async updateCartAddress(addressData: any) {
      // Wykorzystaj nowy endpoint API do aktualizacji adresu
      try {
        this.setLoading(true)
        
        if (!this.cart?.id) {
          throw new Error('Brak ID koszyka')
        }
        
        const response = await $fetch('/api/cart/update-address', {
          method: 'POST',
          body: {
            cartId: this.cart.id,
            addressData: addressData
          },
          credentials: 'include'
        })
        
        if (response.success) {
          await this.fetchCart() // Odśwież koszyk, aby mieć najnowsze dane
          return true
        } else {
          throw new Error('Błąd podczas aktualizacji adresu')
        }
      } catch (error) {
        console.error('Błąd podczas aktualizacji adresu koszyka:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },
    
    async placeOrder() {
      const { completeOrder } = useCart()
      
      try {
        this.setLoading(true)
        const orderResponse = await completeOrder()
        
        if (orderResponse.type === 'order') {
          // Wyczyść koszyk, gdy zamówienie zostało złożone
          const cartIdCookie = useCookie('cart_id')
          cartIdCookie.value = null
          this.setCart(null)
          
          return {
            success: true,
            order: orderResponse.order
          }
        } else {
          this.setCart(orderResponse.cart)
          return {
            success: false,
            cart: orderResponse.cart
          }
        }
      } catch (error) {
        console.error('Błąd podczas składania zamówienia:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },
    
    async clearCart() {
      this.cart = null
      const cartIdCookie = useCookie('cart_id')
      cartIdCookie.value = null
    },
    
    async fetchShippingOptions() {
      try {
        this.setLoading(true)
        
        // Używamy bezpośrednio klienta Medusa
        const medusa = useMedusaClient()
        
        // Używamy stałego region_id dla Polski (wykrytego w diagnostyce)
        const regionId = "reg_01JXW78760SH74JF8QWACENE54"
        
        console.log('Używam konkretnego region ID:', regionId)
        
        console.log('Pobieranie opcji wysyłki dla regionu ID:', regionId)
        
        // Pobieramy klucz API z konfiguracji
        const config = useRuntimeConfig()
        const publishableApiKey = config.public.medusa?.publishableKey || 'pk_01HGMJ9M2Z1X4Y5Z6A7B8C9D00'
        
        // Przygotowujemy nagłówki zgodnie z dokumentacją Medusa
        const headers: Record<string, string> = {
          'x-publishable-api-key': publishableApiKey
        }
        
        console.log('Używany publishable API key:', publishableApiKey)
        
        // Pobieramy opcje wysyłki bezpośrednio za pomocą fetch, ponieważ SDK może nie mieć tej metody
        const baseUrl = config.public.medusa?.baseUrl || 'http://localhost:9000'
        const url = `${baseUrl}/store/shipping-options?region_id=${regionId}`
        
        console.log('Wywołuję URL:', url)
        
        // Wykonujemy bezpośrednio zapytanie fetch
        const fetchResponse = await fetch(url, {
          method: 'GET',
          headers,
          credentials: 'include'
        })
        
        if (!fetchResponse.ok) {
          throw new Error(`Błąd HTTP: ${fetchResponse.status}`)
        }
        
        // Parsujemy odpowiedź
        const response = await fetchResponse.json()
        
        console.log('Otrzymane opcje wysyłki:', response)
        
        if (response.shipping_options) {
          this.shippingOptions = response.shipping_options
          console.log('Zapisane opcje wysyłki:', this.shippingOptions)
        } else {
          console.error('Brak opcji wysyłki w odpowiedzi')
          this.shippingOptions = []
        }
        
        return this.shippingOptions
      } catch (error) {
        console.error('Błąd podczas pobierania opcji wysyłki:', error)
        return []
      } finally {
        this.setLoading(false)
      }
    }
  }
})

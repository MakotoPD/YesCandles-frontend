import { useCartStore } from '~/stores/cart'

export default defineNuxtPlugin({
  name: 'cart-store-initializer',
  async setup() {
    // Użyj sklepu koszyka
    const cartStore = useCartStore()
    
    // Na kliencie (przeglądarce) automatycznie pobierz koszyk przy starcie
    if (process.client) {
      // Użyj nextTick aby inicjalizacja odbyła się po pełnym załadowaniu Vue
      await nextTick();
      
      try {
        // Sprawdź czy istnieje cookie z ID koszyka
        const cartIdCookie = useCookie('cart_id');
        if (cartIdCookie.value) {
          await cartStore.fetchCart()
          console.log('[Cart Store] Koszyk załadowany pomyślnie:', {
            id: cartStore.cartId,
            items: cartStore.items.length,
            total: cartStore.totals.total
          })
        } else {
          console.log('[Cart Store] Brak zapisanego koszyka')
        }
      } catch (error) {
        console.error('[Cart Store] Błąd podczas inicjalizacji koszyka:', error)
      }
    }
    
    // Dodaj komposable dla łatwego dostępu do sklepu koszyka
    return {
      provide: {
        cartStore
      }
    }
  }
})

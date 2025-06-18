import { defineNuxtPlugin } from '#app'

/**
 * Plugin do trwałego przechowywania stanu Pinii między odświeżeniami strony
 */
export default defineNuxtPlugin(({ $pinia }) => {
  // Funkcja do zapisywania i przywracania stanu
  function piniaStatePersistence({ store }) {
    // Nie zapisujemy stanu na serwerze
    if (process.server) return

    // Unikalny klucz dla każdego store'a w localStorage
    const storageKey = `pinia-${store.$id}`

    // Próba przywrócenia stanu ze storage przy inicjalizacji
    const fromStorage = localStorage.getItem(storageKey)
    if (fromStorage) {
      try {
        // Przywracamy stan ze storage
        store.$patch(JSON.parse(fromStorage))
        console.log(`[Pinia] Restored state for ${store.$id}`)
      } catch (error) {
        console.error(`[Pinia] Failed to restore state for ${store.$id}:`, error)
        localStorage.removeItem(storageKey)
      }
    }

    // Zapisujemy zmiany stanu do storage
    store.$subscribe((mutation, state) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state))
      } catch (error) {
        console.error(`[Pinia] Failed to save state for ${store.$id}:`, error)
      }
    })
  }

  // Dodajemy plugin do Pinii
  $pinia.use(piniaStatePersistence)
})

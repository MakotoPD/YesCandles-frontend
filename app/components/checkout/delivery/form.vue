<script lang="ts" setup>
import { useCartStore } from '~/stores/cart'
import { storeToRefs } from 'pinia'
import { useMedusaClient } from '~/utils/medusa-client'

const emit = defineEmits<{
  validate: [boolean]
}>()

// Używamy Pinia store zamiast composables
const cartStore = useCartStore()
const { cart, isLoading } = storeToRefs(cartStore)

// Pobieramy opcje wysyłki używając metody z cartStore
const { shippingOptions } = storeToRefs(cartStore)


// Zmienna określająca czy mamy włączony tryb debugowania
const isDev = true

// Refs dla debugowania
const debugInfo = ref({
  hasCartId: false,
  hasShippingAddress: false,
  addressComplete: false,
  shippingOptionsCount: 0,
  cartId: ''
})

// Funkcja sprawdzająca, czy adres dostawy jest kompletny
function isAddressComplete(address) {
  if (!address) return false
  
  // Wymagane pola adresu
  const requiredFields = ['first_name', 'last_name', 'address_1', 'city', 'country_code', 'postal_code', 'phone']
  return requiredFields.every(field => !!address[field])
}

// Aktualizacja informacji debugowania
function updateDebugInfo() {
  if (cart.value) {
    debugInfo.value = {
      hasCartId: !!cart.value.id,
      hasShippingAddress: !!cart.value.shipping_address,
      addressComplete: isAddressComplete(cart.value.shipping_address),
      shippingOptionsCount: shippingOptions.value?.length || 0,
      cartId: cart.value.id || '',
      regionId: cart.value.region_id || cart.value?.region?.id || 'brak',
      publishableKey: useRuntimeConfig().public.medusa?.publishableKey ? 'ustawiony' : 'brak'
    }
  }
}

// Funkcja ładująca opcje wysyłki
async function loadShippingOptions() {
  console.log('Ładowanie opcji wysyłki...')
  updateDebugInfo()
  
  // Sprawdź czy adres dostawy jest ustawiony
  if (!debugInfo.value.hasShippingAddress || !debugInfo.value.addressComplete) {
    console.warn('Adres dostawy nie jest kompletny. Może to uniemożliwiać pobranie opcji wysyłki.')
  }
  
  try {
    const options = await cartStore.fetchShippingOptions()
    console.log('Załadowane opcje wysyłki:', options)
    updateDebugInfo()
  } catch (error) {
    console.error('Błąd podczas ładowania opcji wysyłki:', error)
  }
}

// Ładujemy opcje wysyłki przy montowaniu komponentu
onMounted(() => {
  // Najpierw aktualizujemy informacje debugowania
  updateDebugInfo()
  // Następnie ładujemy opcje wysyłki
  loadShippingOptions()
})

// Wybrana opcja wysyłki - inicjalizacja z istniejącej w koszyku
const value = ref(cart.value?.shipping_methods?.at(-1)?.shipping_option_id)

// Funkcja walidacji użwająca metody z cartStore
const validateDelivery = async () => {
  if (value.value) {
    // Używamy metody z cartStore zamiast bezpośredniego composable
    await cartStore.setShippingMethod(value.value)
    // Po ustawieniu metody wysyłki odświeżamy koszyk
    await cartStore.retrieveCart()
  }
  emit('validate', true)
}
</script>

<template>
  <div>
    <!-- Debugowanie danych -->
    <div class="mb-4 text-xs text-gray-500" v-if="isDev">
      <div class="mb-2 font-bold text-sm">Informacje diagnostyczne:</div>
      <div class="mb-1">Cart ID: {{ debugInfo.cartId || 'brak' }}</div>
      <div class="mb-1">Region ID: {{ debugInfo.regionId }}</div>
      <div class="mb-1">Publishable API Key: {{ debugInfo.publishableKey }}</div>
      <div class="mb-1">Czy jest ID koszyka: {{ debugInfo.hasCartId ? 'Tak' : 'Nie' }}</div>
      <div class="mb-1">Czy jest adres wysyłki: {{ debugInfo.hasShippingAddress ? 'Tak' : 'Nie' }}</div>
      <div class="mb-1">Czy adres jest kompletny: {{ debugInfo.addressComplete ? 'Tak' : 'Nie' }}</div>
      <div class="mb-1">Liczba metod wysyłki: {{ debugInfo.shippingOptionsCount }}</div>
      <div class="mb-1">Stan ładowania: {{ isLoading ? 'Trwa ładowanie' : 'Zakończono' }}</div>
      <div class="mb-1">Wybrana opcja: {{ value || 'brak' }}</div>
    </div>
    
    <!-- Komunikat o braku opcji wysyłki -->
    <div v-if="shippingOptions?.length === 0 && !isLoading" class="w-full mb-6 p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-alert-triangle" class="text-yellow-500" />
        <span>Brak dostępnych opcji wysyłki.</span>
      </div>
      <div class="mt-2 text-sm" v-if="!debugInfo.hasShippingAddress || !debugInfo.addressComplete">
        <strong>Prawdopodobna przyczyna:</strong> Adres dostawy nie jest kompletny. Wróć do poprzedniego kroku i sprawdź czy wszystkie wymagane pola adresu zostały wypełnione.
      </div>
      <UButton class="mt-4 cursor-pointer" size="sm" @click="loadShippingOptions">Odśwież opcje wysyłki</UButton>
    </div>

    <!-- Lista opcji wysyłki -->
    <div
      v-if="shippingOptions && shippingOptions.length > 0"
      class="w-full mb-6"
    >
      <URadioGroup
        v-model="value"
        :items="shippingOptions"
        color="neutral"
        value-key="id"
        label-key="name"
        description-key="amount"
        :ui="{
          root: 'cursor-pointer',
          fieldset: 'w-full gap-y-2',
          item: 'w-full items-center rounded-lg border border-neutral-200',
          container: 'ml-4',
          wrapper: 'w-full',
          label: 'w-full p-4 cursor-pointer',
          description: 'hidden',
        }"
      >
        <template #label="{ item }">
          <div class="flex items-center justify-between gap-x-2 w-full ">
            <div>{{ item.name }}</div>
            <div class="text-neutral-500">
              <StoreLocalizedPrice
                :amount="item.amount"
                :currency-code="cart?.currency_code"
              />
            </div>
          </div>
        </template>
      </URadioGroup>
    </div>

    <!-- Loading spinner -->
    <div
      v-if="isLoading"
      class="mb-6 flex justify-center"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="size-6 animate-spin"
      />
    </div>
    <UButton
      class="cursor-pointer"
      color="neutral"
      size="xl"
      :loading="isLoading"
      :disabled="!value"
      @click="validateDelivery"
    >
      Kontynuuj do płatności
    </UButton>
  </div>
</template>

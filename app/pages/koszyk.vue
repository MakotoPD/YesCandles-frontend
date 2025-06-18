<script lang="ts" setup>
import { useCartStore } from '~/stores/cart'
import { storeToRefs } from 'pinia'

const cartStore = useCartStore()

// Ważne: używamy storeToRefs aby dane z Pinia były reaktywne!
const { cart, items, isLoading } = storeToRefs(cartStore)

// Sprawdzanie czy koszyk jest pusty
const isCartEmpty = computed(() => {
  return !items.value || items.value.length === 0
})

// Logowanie dla debugowania
console.log('Current cart state:', {
  cart: cart.value,
  items: items.value,
  isEmpty: isCartEmpty.value,
  isLoading: isLoading.value
})

// Odśwież koszyk na początku oraz przy każdej zmianie routy
onMounted(async () => {
  await cartStore.fetchCart()
  console.log('Cart after fetch:', {
    cart: cart.value,
    items: items.value,
    isEmpty: isCartEmpty.value
  })
})

useHead({
  title: 'Koszyk',
})
</script>

<template>
  <UContainer class="py-12">
    <div>
      <div
        class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-x-20 xl:gap-x-40"
      >
        <div class="flex flex-col bg-white py-6 px-6 gap-y-6 shadow-sm border border-pink-100 rounded-lg">
          <div class="flex flex-col gap-y-3">
            <div class="bg-gradient-to-r from-pink-100 to-pink-200 -mx-6 px-6 py-4 mb-2">
              <AppHeading
                as="h1"
                class="text-pink-800"
              >
                Koszyk
              </AppHeading>
            </div>


            <ClientOnly>
              <template v-if="isLoading">
                <CartTableSkeleton />
              </template>
              <template v-else-if="!isCartEmpty">
                <CartTable
                  :cart="cart"
                />
              </template>
              <template v-else>
                <CartEmpty />
              </template>
              <template #fallback>
                <CartTableSkeleton />
              </template>
            </ClientOnly>
          </div>
        </div>
        <div class="relative">
          <div class="flex flex-col gap-y-8 sticky top-12">
            <div class="bg-white py-6 px-6 shadow-sm border border-pink-100 rounded-lg">
              <div class="bg-gradient-to-r from-pink-100 to-pink-200 -mx-6 px-6 py-4 mb-4">
                <h2 class="font-semibold text-xl text-pink-800">Podsumowanie</h2>
              </div>
              <ClientOnly>
                <CartSummary
                  v-if="!isCartEmpty"
                  title=""
                  :cart="cart"
                />
                <template #fallback>
                  <CartSummary
                    title=""
                    :cart="undefined"
                  />
                </template>
              </ClientOnly>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UContainer>
</template>

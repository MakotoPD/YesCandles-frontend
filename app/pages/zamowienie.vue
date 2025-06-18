<script lang="ts" setup>
import { useCartStore } from '~/stores/cart'
import { storeToRefs } from 'pinia'

definePageMeta({
  layout: 'checkout',
})

// Używamy sklepu Pinia z reaktywnym dostępem
const cartStore = useCartStore()
const { cart } = storeToRefs(cartStore)

// Logowanie dla debugowania
console.log('Checkout page - current cart:', cart.value)

// Odśwież koszyk przy każdym wejściu na stronę zamówienia
onMounted(async () => {
  await cartStore.fetchCart()
  console.log('Checkout page - cart after fetch:', cart.value)
})
</script>

<template>
  <UContainer class="py-12">
    <div
      class="grid grid-cols-1 sm:grid-cols-[1fr_416px] gap-x-40"
    >
      <CheckoutForm />
      <CartSummary
        title="Podsumowanie"
        :cart="cart"
        is-checkout
      />
    </div>
  </UContainer>
</template>

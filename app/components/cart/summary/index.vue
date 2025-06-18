<script lang="ts" setup>
import type { StoreCart } from '@medusajs/types'
import { useCartStore } from '~/stores/cart'
import { storeToRefs } from 'pinia'

// No need for country code since the site is only in Polish

const {
  cart: propCart,
  title,
  isCheckout,
} = defineProps<{
  title: string
  cart?: StoreCart
  isCheckout?: boolean
}>()

// Użyj przekazanego koszyka lub pobierz ze store'a z reaktywnym dostępem
const cartStore = useCartStore()
const storeCartData = storeToRefs(cartStore).cart

// Jeśli przekazano kart jako prop, użyj go, w przeciwnym wypadku użyj koszyka ze store
const cart = computed(() => propCart || storeCartData.value)
const isCartEmpty = computed(() => !cart.value?.items?.length)
const isCartUndefined = computed(() => cart.value === null || cart.value === undefined)
</script>

<template>
  <div
    v-if="isCartUndefined || !isCartEmpty"
    :cart="cart && cart.items && cart.items.length > 0 ? cart : undefined"
    class="flex flex-col gap-y-4"
  >
    <AppHeading as="h2">
      {{ title }}
    </AppHeading>
    <USeparator />
    <CartTotals
      :cart="cart"
    />
    <CartTable
      v-if="isCheckout"
      :cart="cart"
      is-preview
    />
    <UButton
      v-if="!isCheckout"
      to="/zamowienie"
      :block="true"
      class="bg-gradient-to-r from-pink-400 to-pink-600 hover:opacity-90"
      :disabled="isCartUndefined"
      size="lg"
    >
      Do kasy
    </UButton>
  </div>
</template>

<script lang="ts" setup>
import type { StoreCartLineItem, StoreOrderLineItem } from '@medusajs/types'
import { useCartStore } from '~/stores/cart'
import { storeToRefs } from 'pinia'

const {
  item,
} = defineProps<{
  item: StoreCartLineItem | StoreOrderLineItem
}>()

// Użyjemy Pinia store zamiast composable
const cartStore = useCartStore()
const { isLoading } = storeToRefs(cartStore)

// Zmodyfikowana funkcja aktualizacji ilości, która odświeża koszyk
const updateQuantity = async (quantity: number) => {
  if (quantity !== item.quantity) {
    try {
      // Aktualizuj przedmiot w koszyku
      await cartStore.updateItem(item.id, { quantity })
      // fetchCart jest już wywoływane w updateItem, więc nie musimy tego robić ponownie
    } catch (error) {
      console.error('Błąd podczas aktualizacji ilości:', error)
    }
  }
}
</script>

<template>
  <div class="flex items-center gap-x-3">
    <UInputNumber
      :model-value="item?.quantity"
      color="neutral"
      class="w-20"
      size="sm"
      :max="10"
      :min="1"
      @update:model-value="updateQuantity"
    />
    <UIcon
      v-if="isLoading"
      name="i-lucide-refresh-cw"
      class="size-4 animate-spin"
    />
    <CartItemDeleteButton
      v-else
      :item="item"
    />
  </div>
</template>

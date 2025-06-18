<script lang="ts" setup>
import type { StoreCartLineItem, StoreOrderLineItem } from '@medusajs/types'
import { useCartStore } from '~/stores/cart'
import { storeToRefs } from 'pinia'

const {
  item,
} = defineProps<{
  item?: StoreCartLineItem | StoreOrderLineItem
}>()

// Używamy Pinia store zamiast composable z reaktywnym dostępem
const cartStore = useCartStore()
const loading = ref(false)

const removeItem = async () => {
  if (!item) return
  loading.value = true
  try {
    await cartStore.removeItem(item.id)
    // Zauważ że cartStore.removeItem zawiera już fetchCart aby odświeżyć koszyk po usunięciu
    loading.value = false
  } catch (error) {
    console.error('Błąd podczas usuwania przedmiotu:', error)
    loading.value = false
  }
}
</script>

<template>
  <button
    class="cursor-pointer flex items-center gap-x-1"
    @click="removeItem()"
  >
    <UIcon
      v-if="loading"
      name="i-lucide-refresh-cw"
      class="size-4 animate-spin"
    />
    <UIcon
      v-else
      name="i-lucide-trash-2"
      class="size-4"
    />
    <slot />
  </button>
</template>

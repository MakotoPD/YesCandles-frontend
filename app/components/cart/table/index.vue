<script lang="ts" setup>
import type { StoreCart, StoreOrder } from '@medusajs/types'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { useCartStore } from '~/stores/cart'
import { storeToRefs } from 'pinia'

const {
  cart: propCart,
  isPreview,
  isDropDown,
} = defineProps<{
  cart?: StoreCart | StoreOrder
  isPreview?: boolean
  isDropDown?: boolean
}>()

// Używamy przekazanego koszyka lub pobieramy z Pinia z reaktywnym dostępem
const cartStore = useCartStore()
const { cart: storeCart } = storeToRefs(cartStore)

const cart = computed(() => {
  // Użyj koszyka przekazanego jako prop (jeśli istnieje) lub pobierz z Pinia
  return propCart || storeCart.value
})



const columns = [
  {
    accessorKey: 'item',
    header: 'Produkt',
  },
  {
    accessorKey: 'quantity',
    header: 'Ilość',
  },
  {
    accessorKey: 'price',
    header: 'Cena',
  },
  {
    accessorKey: 'total',
    header: () => h('div', { class: 'text-right' }, 'Suma'),
  },
]

const data = computed(() => {
  // Pobierz elementy koszyka z props lub ze store
  const storeItems = storeCart.value?.items || []
  const propItems = propCart?.items || []
  
  // Źródło danych - preferujemy propItems, ale jeśli puste, użyj storeItems
  const sourceItems = propItems.length > 0 ? propItems : storeItems
  
  // Sortujemy elementy wg daty utworzenia
  return [...sourceItems].sort((a, b) => {
    if (!a.created_at || !b.created_at || a.created_at === b.created_at) return 0
    const dateA = a.created_at.toString()
    const dateB = b.created_at.toString()
    return dateA.localeCompare(dateB)
  })
})

const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 768 })
const activeBreakpoint = breakpoints.active()

const isMobile = computed(() => activeBreakpoint.value === 'sm' || !activeBreakpoint.value)

const isSmall = computed(() => isPreview || isDropDown)

const columnVisibility = computed(() => {
  return {
    price: !isMobile.value && !isSmall.value,
    quantity: !isSmall.value,
  }
})
// Zamiast sprawdzać czy cart jest undefined, sprawdźmy czy ma przedmioty
const isCartUndefined = computed(() => {
  // Logowanie wartości dla debugowania
  console.log('isCartUndefined check:', {
    cart: cart.value,
    items: cart.value?.items,
    itemsLength: cart.value?.items?.length || 0
  })
  // Sprawdzenie czy koszyk istnieje i czy ma przedmioty
  return !cart.value || !cart.value.items || cart.value.items.length === 0
})
</script>

<template>
  <div class="flex flex-col gap-y-3">
    <UTable
      v-if="data.length > 0"
      v-model:column-visibility="columnVisibility"
      :data="data"
      :loading="false"
      :columns="columns"
      class="flex-1"
      :ui="{
        thead: isSmall ? 'hidden' : 'default',
      }"
    >
      <template #item-cell="{ row }">
        <div
          class="flex items-center gap-x-4"
          :class="{
            '-ml-4': isSmall,
          }"
        >
          <div :class="isPreview ? 'w-16' : 'w-24'">
            <CartItemThumbnail
              :src="row.original.thumbnail || undefined"
              :alt="row.original.title"
              :link="`/produkty/${row.original.product_handle}`"
            />
          </div>
          <div :class="isDropDown ? 'w-40' : 'w-auto'">
            <div class="text-black mb-1 truncate">
              {{ row.original.product_title }}
            </div>
            <div>Wariant: {{ row.original.variant_title }}</div>
            <CartItemDeleteButton
              v-if="isDropDown"
              class="text-sm text-neutral-700 hover:text-neutral-900 mt-2"
              :item="row.original"
            >
              Usuń
            </CartItemDeleteButton>
          </div>
        </div>
      </template>
      <template #quantity-cell="{ row }">
        <CartItemSelectQuantity :item="row.original" />
      </template>
      <template #price-cell="{ row }">
        <StoreLocalizedPrice
          :amount="row.original.unit_price"
          :currency-code="cart?.currency_code"
        />
      </template>
      <template #total-cell="{ row }">
        <div
          :class="{
            '-mr-4': isSmall,
          }"
        >
          <div
            v-if="isSmall && row.original.quantity > 1"
            class="text-neutral-500 text-right mb-1"
          >
            <span>{{ row.original.quantity }}</span>
            <span>x</span>
            <span>
              <StoreLocalizedPrice
                :amount="row.original.unit_price"
                :currency-code="cart?.currency_code"
              />
            </span>
          </div>
          <CartItemPrice
            :item="row.original"
            :currency-code="cart?.currency_code"
          />
        </div>
      </template>
    </UTable>
    <CartTableSkeleton v-if="isCartUndefined" />
    <USeparator />
  </div>
</template>

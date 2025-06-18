<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { storeToRefs } from 'pinia'

const { isCartDropdownOpen } = useCartDropdown()
// Używamy sklepu Pinia z reaktywnym dostępem
const cartStore = useCartStore()
const { cart, isLoading, itemsCount } = storeToRefs(cartStore)

// Reaktywne dane
const loading = isLoading
const cartItemsCount = itemsCount

// Calculate subtotal with null checks
const subtotal = computed(() => {
  if (!cart.value) return ''
  return convertToLocale({
    amount: cart.value.subtotal || 0,
    currency_code: cart.value.currency_code,
    country: 'PL', // Hardcoded to Polish
  })
})

// Odśwież koszyk gdy komponent jest montowany
onMounted(async () => {
  await cartStore.fetchCart()
})
</script>

<template>
  <UPopover
    v-model:open="isCartDropdownOpen"
    mode="hover"
    :content="{
      align: 'end',
      side: 'bottom',
      sideOffset: 24,
    }"
    :ui="{ content: 'w-[420px] rounded-none' }"
  >
    <AppLink
      to="/koszyk"
      class="relative"
    >
        <Icon name="i-lucide-shopping-cart" size="18" class="text-pink-700" />
        <span v-if="cartItemsCount" class="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center bg-pink-500 border border-pink-600 text-white rounded-full text-xs font-bold">{{ cartItemsCount }}</span>
    </AppLink>
    <template #content>
      <div class="p-4 flex items-center justify-center bg-gradient-to-r from-pink-100 to-pink-200">
        <h3 class="font-bold text-lg text-pink-800">
          Koszyk
        </h3>
      </div>
      <div
        v-if="cart === null || cart?.items?.length === 0"
        class="p-4 flex flex-col gap-y-4 text-xs"
      >
        <div class="flex items-center justify-center">
          <div>Koszyk jest pusty</div>
        </div>
        <div class="flex items-center justify-center pb-8">
          <UButton
            to="/sklep"
            color="pink"
            variant="soft"
            class="bg-gradient-to-r from-pink-400 to-pink-600 text-white hover:opacity-90"
          >
            Przejdź do sklepu
          </UButton>
        </div>
      </div>
      <div v-else>
        <div class="overflow-y-scroll max-h-[402px] px-4 grid grid-cols-1 gap-y-8 no-scrollbar p-px">
          <CartTable
            is-drop-down
            :cart="loading ? undefined : cart"
          />
        </div>
        <div
          v-if="cartItemsCount && cartItemsCount > 0"
          class="px-4 pb-4 flex flex-col gap-y-4 text-xs"
        >
          <div class="flex items-end justify-between">
            <span class="font-bold flex items-center gap-x-1">
              Suma
              <span class="font-normal">(netto)</span>
            </span>
            <span class="font-bold text-lg">{{ subtotal }}</span>
          </div>
          <UButton
            to="/koszyk"
            color="pink"
            size="lg"
            :block="true"
            class="w-full bg-gradient-to-r from-pink-400 to-pink-600 text-white hover:opacity-90"
          >
            Do koszyka
          </UButton>
        </div>
      </div>
    </template>
  </UPopover>
</template>

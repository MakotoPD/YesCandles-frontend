<script lang="ts" setup>
import type { StoreCart, StoreOrder } from '@medusajs/types'
import { useCartStore } from '~/stores/cart'

const { cart } = defineProps<{
  cart?: StoreCart | StoreOrder
}>()

const hasCartItems = computed(() => cart?.items && cart.items.length > 0)

// Check if cart has any applied promotions
const hasPromotions = computed(() => {
  if (!cart) return false
  return cart.promotions && cart.promotions.length > 0
})

// Get applied promotion codes from cart
const appliedPromoCodes = computed(() => {
  if (!cart?.promotions) return []
  return cart.promotions.map(promotion => ({
    id: promotion.id,
    code: promotion.code,
    rule: 'Kod promocyjny',
    amount: 0,
    type: ''
  }))
})

// Function to remove a promotion code
async function removePromotionCode(code: string) {
  if (!cartId.value) return
  
  try {
    await $fetch(`/api/cart/${cartId.value}/promotions/${code}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    
    // Używamy Pinia store zamiast refreshNuxtData i useCart
    const cartStore = useCartStore()
    await cartStore.retrieveCart()
  } catch (error) {
    console.error('Error removing promotion code:', error)
  }
}

// Promotion code functionality
const promotionCode = ref('')
const isApplyingPromotion = ref(false)
const promotionError = ref('')
const promotionSuccess = ref(false)

// Get cart ID from the cart object
const cartId = computed(() => {
  if (!cart) return null
  return 'id' in cart ? cart.id : null
})

// Apply promotion code to cart
async function applyPromotionCode() {
  if (!promotionCode.value || !cartId.value) return
  
  try {
    promotionError.value = ''
    isApplyingPromotion.value = true
    promotionSuccess.value = false
    
    const response = await $fetch(`/api/cart/${cartId.value}/promotions`, {
      method: 'POST',
      body: { promo_codes: [promotionCode.value] },
      credentials: 'include'
    })
    
    if (response.success) {
      promotionSuccess.value = true
      promotionCode.value = '' // Clear the input after successful application
      
      // Używamy Pinia store zamiast refreshNuxtData i useCart
      const cartStore = useCartStore()
      await cartStore.retrieveCart()
    }
  } catch (error: any) {
    console.error('Error applying promotion code:', error)
    promotionError.value = error.statusMessage || 'Nie udało się zastosować kodu promocyjnego'
  } finally {
    isApplyingPromotion.value = false
  }
}
</script>

<template>
  <div>
    <div class="flex flex-col gap-y-2 font-medium">
      <div class="flex items-center justify-between text-sm">
        <span class="flex gap-x-1 items-center">
          Suma
        </span>
        <StoreLocalizedPrice
          v-if="hasCartItems"
          :amount="cart?.subtotal"
          :currency-code="cart?.currency_code"
        />
        <USkeleton
          v-else
          class="h-4 w-[60px]"
        />
      </div>
      <div
        v-if="cart?.discount_total"
        class="flex items-center justify-between text-sm"
      >
        <span class="flex gap-x-1 items-center">
          Rabat
        </span>
        <StoreLocalizedPrice
          :amount="cart.discount_total"
          :currency-code="cart.currency_code"
        />
      </div>
      <div class="flex items-center justify-between text-sm">
        <span class="flex gap-x-1 items-center">
          Dostawa
        </span>
        <StoreLocalizedPrice
          v-if="hasCartItems"
          :amount="cart?.shipping_subtotal"
          :currency-code="cart?.currency_code"
        />
        <USkeleton
          v-else
          class="h-4 w-[60px]"
        />
      </div>
      <div
        v-if="cart?.gift_card_total"
        class="flex items-center justify-between text-sm"
      >
        <span class="flex gap-x-1 items-center">
          Karta prezentowa
        </span>
        <StoreLocalizedPrice
          :amount="cart.gift_card_total"
          :currency-code="cart.currency_code"
        />
      </div>
    </div>
    <USeparator class="my-4" />
    
    <!-- Promotion Code Input -->
    <div class="mb-4">
      <div class="flex flex-col gap-2">
        <label for="promotion-code" class="text-sm font-medium">Kod promocyjny</label>
        <div class="flex gap-2">
          <UInput
            id="promotion-code"
            v-model="promotionCode"
            placeholder="Wpisz kod promocyjny"
            size="md"
            class="flex-grow"
            :disabled="isApplyingPromotion"
            @keyup.enter="applyPromotionCode"
          />
          <UButton
            color="neutral"
            size="md"
            :loading="isApplyingPromotion"
            :disabled="!promotionCode || isApplyingPromotion"
            @click="applyPromotionCode"
          >
            Zastosuj
          </UButton>
        </div>
        <p v-if="promotionError" class="text-red-500 text-xs mt-1">{{ promotionError }}</p>
        <p v-if="promotionSuccess" class="text-green-500 text-xs mt-1">Kod promocyjny zastosowany pomyślnie!</p>
      </div>
    </div>
    
    <div class="flex items-center justify-between text-ui-fg-base mb-2 txt-medium ">
      <span class="text-sm text-black">Suma</span>
      <StoreLocalizedPrice
        v-if="hasCartItems"
        class="text-lg font-semibold"
        :amount="cart?.total"
        :currency-code="cart?.currency_code"
      />
      <USkeleton
        v-else
        class="h-7 w-[80px]"
      />
    </div>
    
    <!-- Display Applied Promotion Codes before total -->
    <div v-if="appliedPromoCodes.length > 0" class="mt-4 mb-4">
      <div class="text-sm font-medium mb-2">Zastosowane kody promocyjne:</div>
      <div v-for="code in appliedPromoCodes" :key="code.code" class="flex items-center justify-between mb-2 text-sm bg-gray-50 p-2 rounded-md">
        <div class="flex items-center gap-1">
          <UIcon name="i-heroicons-ticket" class="w-4 h-4 text-green-600" />
          <span class="font-medium">{{ code.code }}</span>
        </div>
        <div class="flex items-center gap-2">
          <UButton
            color="gray"
            variant="ghost"
            size="xs"
            icon="i-heroicons-x-mark"
            :loading="isApplyingPromotion"
            @click="removePromotionCode(code.code)"
            class="p-1 cursor-pointer"
            title="Usuń kod promocyjny"
          />
        </div>
      </div>
    </div>
    
    <USeparator class="mt-4" />
  </div>
</template>

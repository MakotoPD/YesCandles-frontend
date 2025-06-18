<script lang="ts" setup>
import { useCartStore } from '~/stores/cart'
import { storeToRefs } from 'pinia'

const { currentStep, goToStep } = useCheckoutStep()
const cartStore = useCartStore()
const { cart, loading } = storeToRefs(cartStore)

// Sprawdzamy, czy mamy dane adresu dostawy, adresu rozliczeniowego i email
const isAddressValid = computed(() => {
  return !!cart.value?.shipping_address && !!cart.value?.billing_address && !!cart.value?.email
})

// Sprawdzamy, czy wybrano metodę wysyłki
const isDeliveryValid = computed(() => {
  return !!cart.value?.shipping_methods?.at(-1)?.shipping_option_id
})

// Sprawdzamy, czy wybrano metodę płatności
const isPaymentValid = computed(() => {
  return !!cart.value?.payment_collection?.payment_sessions?.find(
    paymentSession => paymentSession.status === 'pending',
  )
})
</script>

<template>
  <div
    class="w-full grid grid-cols-1 gap-y-8"
  >
    <!-- Address Step -->
    <div>
      <div class="flex flex-row items-center justify-between mb-6">
        <AppHeading
          as="h2"
          :class="[isAddressValid || currentStep === 'address' ? 'text-black' : 'text-neutral-500']"
        >
          Adres wysyłki
          <UIcon
            v-if="isAddressValid"
            name="i-lucide-circle-check-big"
            class="size-5"
          />
        </AppHeading>
        <UButton
          v-if="isAddressValid && currentStep !== 'address'"
          class="cursor-pointer"
          variant="link"
          color="primary"
          @click="goToStep('address')"
        >
          Edytuj
        </UButton>
      </div>
      <CheckoutAddressForm
        v-if="currentStep === 'address'"
        @validate="goToStep('delivery')"
      />
      <CheckoutAddress
        v-else
      />
      <USeparator class="mt-8" />
    </div>

    <!-- Delivery Step -->
    <div>
      <div class="flex flex-row items-center justify-between mb-6">
        <AppHeading
          as="h2"
          :class="[isDeliveryValid || currentStep === 'delivery' ? 'text-black' : 'text-neutral-500']"
        >
          Metoda wysyłki
          <UIcon
            v-if="isDeliveryValid"
            name="i-lucide-circle-check-big"
            class="size-5"
          />
        </AppHeading>
        <UButton
          v-if="isDeliveryValid && currentStep !== 'delivery'"
          class="cursor-pointer"
          variant="link"
          color="primary"
          @click="goToStep('delivery')"
        >
          Edytuj
        </UButton>
      </div>
      <CheckoutDeliveryForm
        v-if="currentStep === 'delivery'"
        @validate="goToStep('payment')"
      />
      <CheckoutDelivery v-else />
      <USeparator class="mt-8" />
    </div>

    <!-- Payment Step -->
    <div>
      <div class="flex flex-row items-center justify-between mb-6">
        <AppHeading
          as="h2"
          :class="[isPaymentValid || currentStep === 'payment' ? 'text-black' : 'text-neutral-500']"
        >
          Metoda płatności
          <UIcon
            v-if="isPaymentValid"
            name="i-lucide-circle-check-big"
            class="size-5"
          />
        </AppHeading>
        <UButton
          v-if="isPaymentValid && currentStep !== 'payment'"
          class="cursor-pointer"
          variant="link"
          color="primary"
          @click="goToStep('payment')"
        >
          Edytuj
        </UButton>
      </div>
      <CheckoutPaymentForm
        v-if="currentStep === 'payment'"
        @validate="goToStep('review')"
      />
      <CheckoutPayment v-else />
      <USeparator class="mt-8" />
    </div>

    <!-- Review Step -->
    <div>
      <div class="flex flex-row items-center justify-between mb-6">
        <AppHeading
          as="h2"
          :class="[currentStep === 'review' ? 'text-black' : 'text-neutral-500']"
        >
          Podgląd zamówienia
        </AppHeading>
      </div>
      <div v-if="currentStep === 'review'">
        <CheckoutReview />
      </div>
    </div>
  </div>
</template>

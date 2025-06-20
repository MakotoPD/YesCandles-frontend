<script lang="ts" setup>
import { useCartStore } from '~/stores/cart'
import { storeToRefs } from 'pinia'
import { loadStripe } from '@stripe/stripe-js'
import type { Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js'
import { providers } from '~/utils/payment'

const cartStore = useCartStore()
const { cart, loading: cartLoading } = storeToRefs(cartStore)
const config = useRuntimeConfig()
// Since the site is only in Polish language, we hardcode Polish country code
const POLISH_COUNTRY_CODE = 'PL'

const notReady = computed(() => {
  return !cart.value
    || !cart.value.shipping_address
    || !cart.value.billing_address
    || !cart.value.email
    || (cart.value.shipping_methods?.length ?? 0) < 1
    || !cart.value.payment_collection?.payment_sessions?.find(
      session => session.status === 'pending',
    )
})

const processingState = ref<'idle' | 'processing' | 'success' | 'error'>('idle')
const errorMessage = ref<string | undefined>(undefined)

const { mutate: placeOrder, loading } = usePlaceOrder()

// Éléments Stripe
const stripe = ref<Stripe | null>(null)
const elements = ref<StripeElements | null>(null)
const cardElement = ref<StripeCardElement | null>(null)
const cardComplete = ref(false)
const cardError = ref<string | undefined>(undefined)

const stripeSession = computed(() => {
  return cart.value?.payment_collection?.payment_sessions?.find(
    session => session.status === 'pending' && session.provider_id.includes('stripe'),
  )
})

const clientSecret = computed(() => {
  return stripeSession.value?.data?.client_secret as string | undefined
})

const isStripePayment = computed(() => {
  return !!stripeSession.value && !!clientSecret.value
})

onMounted(async () => {
  if (!isStripePayment.value) return

  if (!config.public.stripeKey) {
    throw new Error('Stripe key is not set')
  }

  try {
    const stripeInstance = await loadStripe(config.public.stripeKey)
    if (!stripeInstance) {
      throw new Error('Failed to initialize Stripe')
    }
    stripe.value = stripeInstance

    if (clientSecret.value) {
      const elementsInstance = stripeInstance.elements({
        clientSecret: clientSecret.value,
      })
      elements.value = elementsInstance

      const card = elementsInstance.create('card', {
        style: {
          base: {
            'fontSize': '16px',
            'color': '#424770',
            '::placeholder': {
              color: '#aab7c4',
            },
          },
          invalid: {
            color: '#c23d4b',
          },
        },
      })

      cardElement.value = card

      nextTick(() => {
        card.mount('#stripe-card-element')

        card.on('change', (event) => {
          cardComplete.value = event.complete
          cardError.value = event.error?.message
        })
      })
    }
  }
  catch (error) {
    console.error('Stripe initialization error:', error)
    errorMessage.value = error instanceof Error
      ? error.message
      : 'Failed to initialize payment form'
  }
})

onUnmounted(() => {
  if (cardElement.value) {
    cardElement.value.destroy()
  }
})

const handlePlaceOrder = async () => {
  if (!cart.value) {
    return
  }

  try {
    processingState.value = 'processing'
    errorMessage.value = undefined

    if (isStripePayment.value) {
      if (!stripe.value || !elements.value || !cardElement.value || !clientSecret.value) {
        throw new Error('Stripe payment elements are not fully initialized')
      }

      const billingDetails = {
        name: cart.value.billing_address?.first_name || '',
        email: cart.value.email || '',
        phone: cart.value.billing_address?.phone || '',
        address: {
          city: cart.value.billing_address?.city || '',
          country: cart.value.billing_address?.country_code || '',
          line1: cart.value.billing_address?.address_1 || '',
          line2: cart.value.billing_address?.address_2 || '',
          postal_code: cart.value.billing_address?.postal_code || '',
        },
      }

      const { error: paymentError } = await stripe.value.confirmCardPayment(clientSecret.value, {
        payment_method: {
          card: cardElement.value,
          billing_details: billingDetails,
        },
      })

      if (paymentError) {
        throw new Error(paymentError.message)
      }
    }

    await placeOrder()
  }
  catch (error) {
    processingState.value = 'error'
    errorMessage.value = error instanceof Error
      ? error.message
      : 'An error occurred during payment processing. Please try again.'
    console.error('Payment error:', error)
  }
}

const isButtonDisabled = computed(() => {
  return (
    loading.value
    || processingState.value === 'processing'
    || notReady.value
    || (isStripePayment.value && (!cardComplete.value || !!cardError.value))
  )
})

const activePaymentProvider = computed(() => {
  const session = cart.value?.payment_collection?.payment_sessions?.find(
    session => session.status === 'pending',
  )

  if (!session) return { name: 'Nieznany', id: '' }

  // Uncomment this when providers are imported
  // const providerConfig = providers.find(p => p.id === session.provider_id)
  return {
    id: session.provider_id,
    name: session.provider_id, // Use provider_id directly until providers are imported
  }
})

const cartTotal = computed(() => convertToLocale({
  amount: cart.value?.total,
  currency_code: cart.value?.currency_code,
  country: POLISH_COUNTRY_CODE,
}))
</script>

<template>
  <div>
    <div class="mb-6 text-sm">
      Klikając przycisk "Złóż zamówienie", potwierdzasz, że przeczytałeś, zrozumiałeś i zaakceptowałeś nasze <strong>Regulamin</strong>, <strong>Regulamin sprzedaży</strong> i <strong>Regulamin zwrotów</strong> oraz potwierdzasz, że przeczytałeś <strong>Regulamin Medusa Store</strong>.
    </div>

    <div class="mb-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
      <h3 class="text-sm font-medium mb-2">
        Informacje o płatności
      </h3>
      <div
        v-if="cart?.payment_collection?.payment_sessions?.length"
        class="text-sm"
      >
        <div class="flex justify-between">
          <span>Metoda płatności:</span>
          <span class="font-medium">{{ activePaymentProvider.name }}</span>
        </div>
        <div class="flex justify-between mt-1">
          <span>Suma:</span>
          <span class="font-medium">{{ cartTotal }}</span>
        </div>
      </div>
    </div>

    <div
      v-if="isStripePayment"
      class="mb-6"
    >
      <h3 class="text-sm font-medium mb-2">
        Informacje o karcie
      </h3>
      <div
        id="stripe-card-element"
        class="p-4 border rounded-lg border-neutral-200 bg-white"
      />
      <p
        v-if="cardError"
        class="mt-2 text-sm text-red-600"
      >
        {{ cardError }}
      </p>
      <p
        v-else-if="cardComplete"
        class="mt-2 text-sm text-green-600"
      >
        Informacje o karcie zostały wprowadzone
      </p>
    </div>

    <UAlert
      v-if="processingState === 'error'"
      title="Payment Error"
      :description="errorMessage"
      color="error"
      variant="soft"
      icon="i-lucide-alert-circle"
      class="mb-6"
    />

    <UButton
      class="cursor-pointer"
      color="neutral"
      size="xl"
      :disabled="isButtonDisabled"
      :loading="loading || processingState === 'processing'"
      @click="handlePlaceOrder"
    >
      Złóż zamówienie
    </UButton>
  </div>
</template>

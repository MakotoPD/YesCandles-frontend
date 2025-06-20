<script lang="ts" setup>
import * as z from 'zod'
import type { StoreCartResponse } from '@medusajs/types'
import type { FormSubmitEvent } from '#ui/types'

const emit = defineEmits<{
  validate: [boolean]
}>()

// Since the site is only in Polish language, we hardcode Polish country code
const POLISH_COUNTRY_CODE = 'PL'

const { data: cartResponse } = useNuxtData<StoreCartResponse>('cart')
const cart = computed(() => cartResponse.value?.cart)
const { mutate: updateCart, loading: updateLoading } = useUpdateCart()

// Fetch saved addresses

const { data: addressesResponse, pending: loadingAddresses, error: addressesError } = useFetch('/api/customers/addresses', {
  credentials: 'include' // Ensure cookies are sent with the request
})

const savedAddresses = computed(() => addressesResponse.value?.addresses || [])
const hasAddresses = computed(() => savedAddresses.value.length > 0)

// Find default shipping and billing addresses
const defaultShippingAddress = computed(() => savedAddresses.value.find(addr => addr.is_default_shipping))
const defaultBillingAddress = computed(() => savedAddresses.value.find(addr => addr.is_default_billing))

// Selected address ID
const selectedAddressId = ref<string | null>(null)

// Loading state
const loading = computed(() => updateLoading.value || loadingAddresses.value)

const schema = z.object({
  shipping_address: z.object({
    first_name: z.string({ required_error: 'Imię jest wymagane' }).min(1, 'Imię jest wymagane'),
    last_name: z.string({ required_error: 'Nazwisko jest wymagane' }).min(1, 'Nazwisko jest wymagane'),
    address_1: z.string({ required_error: 'Adres jest wymagany' }).min(1, 'Adres jest wymagany'),
    address_2: z.string().optional(),
    company: z.string().optional(),
    postal_code: z.string({ required_error: 'Kod pocztowy jest wymagany' }).min(1, 'Kod pocztowy jest wymagany'),
    city: z.string({ required_error: 'Miasto jest wymagane' }).min(1, 'Miasto jest wymagane'),
    phone: z.string().optional(),
  }),
  email: z.string({ required_error: 'Email jest wymagany' }).email('Wprowadź poprawny adres email'),
  billing_address: z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    address_1: z.string().optional(),
    address_2: z.string().optional(),
    company: z.string().optional(),
    postal_code: z.string().optional(),
    city: z.string().optional(),
    phone: z.string().optional(),
  }),
})

type Schema = z.output<typeof schema>

interface PartialSchema {
  shipping_address: Partial<Schema['shipping_address']>
  email?: Schema['email']
  billing_address: Partial<Schema['billing_address']>
}

const state = reactive<PartialSchema>({
  shipping_address: {
    first_name: cart.value?.shipping_address?.first_name || undefined,
    last_name: cart.value?.shipping_address?.last_name || undefined,
    address_1: cart.value?.shipping_address?.address_1 || undefined,
    address_2: cart.value?.shipping_address?.address_2 || undefined,
    company: cart.value?.shipping_address?.company || undefined,
    postal_code: cart.value?.shipping_address?.postal_code || undefined,
    city: cart.value?.shipping_address?.city || undefined,
    phone: cart.value?.shipping_address?.phone || undefined,
  },
  email: cart.value?.email || undefined,
  billing_address: {
    first_name: cart.value?.billing_address?.first_name || undefined,
    last_name: cart.value?.billing_address?.last_name || undefined,
    address_1: cart.value?.billing_address?.address_1 || undefined,
    address_2: cart.value?.billing_address?.address_2 || undefined,
    company: cart.value?.billing_address?.company || undefined,
    postal_code: cart.value?.billing_address?.postal_code || undefined,
    city: cart.value?.billing_address?.city || undefined,
    phone: cart.value?.billing_address?.phone || undefined,
  },
})

const sameAsBilling = ref(compareAddresses(cart.value?.shipping_address, cart.value?.billing_address))

// Set selected address ID to default shipping address when available
watch(defaultShippingAddress, (address) => {
  if (address && !selectedAddressId.value) {
    selectedAddressId.value = address.id
    selectAddress(address)
  }
}, { immediate: true })

// Function to select an address from saved addresses
function selectAddress(address) {
  if (!address) return
  
  console.log('Wybrany adres:', address)
  
  // Update shipping address form fields - dodajemy country_code
  state.shipping_address = {
    first_name: address.first_name || '',
    last_name: address.last_name || '',
    address_1: address.address_1 || '',
    address_2: address.address_2 || '',
    company: address.company || '',
    postal_code: address.postal_code || '',
    city: address.city || '',
    phone: address.phone || '',
    province: address.province || '',
    metadata: address.metadata || {}
  }
  
  // Sprawdzamy, czy adres został poprawnie przypisany
  console.log('Po przypisaniu - shipping_address:', state.shipping_address)
  
  // If this address is also default billing, use it for billing too
  if (address.is_default_billing) {
    sameAsBilling.value = true
    
    // Jeśli używamy tego samego adresu do rozliczeń, przypisujemy go też do billing_address
    if (sameAsBilling.value) {
      state.billing_address = {...state.shipping_address}
    }
  }
}

async function onSubmit(event: FormSubmitEvent<PartialSchema> | { data: PartialSchema }) {
  try {
    const formData = event.data
    let addressData = formData
    
    // Skip validation for customer when not logged in
    // But still validate the address itself

    if (!state.shipping_address?.first_name || 
        !state.shipping_address?.last_name || 
        !state.shipping_address?.address_1 || 
        !state.shipping_address?.city) {
      console.error('Missing required shipping address fields')
      return
    }

    
    if (sameAsBilling.value) {
      addressData.billing_address = { ...addressData.shipping_address }
    }
    
    // Get the cart store instance
    const cartStore = useCartStore()
    
    // Use the store method to update address
    await cartStore.updateCartAddress(addressData)
    
    // Signal that validation was successful
    emit('validate', true)
  } catch (error) {
    console.error('Error updating cart address:', error)
    toast.error('Wystąpił błąd podczas zapisywania adresu')
    emit('validate', false)
  }
}

// Set Polish country code as default for shipping and billing addresses
</script>

<template>
  <div class="pb-8">
    <!-- Saved Addresses Section -->
    <div v-if="hasAddresses" class="mb-8">
      <h3 class="text-lg font-medium mb-4">Wybierz adres dostawy</h3>
      
      <ClientOnly>
        <div v-if="loadingAddresses" class="flex justify-center py-4">
          <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-pink-500" />
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UCard 
            v-for="address in savedAddresses" 
            :key="address.id"
            class="border hover:border-pink-200 transition-all cursor-pointer"
            :class="{'border-pink-500 ring-1 ring-pink-500': selectedAddressId === address.id, 'border-gray-200': selectedAddressId !== address.id}"
            @click="selectedAddressId = address.id; selectAddress(address)"
          >
            <div class="flex justify-between">
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <p class="font-medium text-pink-600">{{ address.address_name || 'Adres' }}</p>
                </div>
                <p class="text-gray-800">{{ address.first_name }} {{ address.last_name }}</p>
                <p class="text-gray-600">{{ address.address_1 }}</p>
                <p v-if="address.address_2" class="text-gray-600">{{ address.address_2 }}</p>
                <p class="text-gray-600">{{ address.postal_code }} {{ address.city }}</p>
                <p v-if="address.phone" class="text-gray-600">{{ address.phone }}</p>
              </div>
              <div class="flex items-center">
                <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center" 
                  :class="{'border-pink-500 bg-pink-100': selectedAddressId === address.id, 'border-gray-300': selectedAddressId !== address.id}">
                  <div v-if="selectedAddressId === address.id" class="w-3 h-3 rounded-full bg-pink-500"></div>
                </div>
              </div>
            </div>
          </UCard>
          
          <!-- New Address Card -->
          <UCard 
            class="border border-dashed border-gray-300 hover:border-pink-200 transition-all cursor-pointer flex items-center justify-center p-6"
            @click="selectedAddressId = null"
          >
            <div class="text-center">
              <UIcon name="i-heroicons-plus" class="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p class="font-medium text-gray-600">Użyj nowego adresu</p>
            </div>
          </UCard>
        </div>
      </ClientOnly>
      
      <USeparator class="my-8" />
      
      <!-- Continue button when address is selected -->
      <UButton
        v-if="selectedAddressId !== null"
        class="cursor-pointer"
        color="neutral"
        size="xl"
        type="button"
        :loading="loading"
        @click="onSubmit({data: state})"
      >
        Kontynuuj do wysyłki
      </UButton>
    </div>
    <!-- Manual Address Form -->
    <div v-if="!hasAddresses || selectedAddressId === null">
      <h3 v-if="hasAddresses" class="text-lg font-medium mb-4">Wprowadź nowy adres</h3>
      
      <UForm
        :schema="schema"
        :state="state"
        @submit="onSubmit"
      >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
        <UFormField
          required
          size="xl"
          class="w-full"
          name="shipping_address.first_name"
          :ui="{ error: 'text-xs' }"
        >
          <AppInput
            v-model="state.shipping_address.first_name"
            name="shipping_address.first_name"
            label="Imię"
            required
            size="xl"
          />
        </UFormField>
        <UFormField
          required
          size="xl"
          class="w-full"
          name="shipping_address.last_name"
          :ui="{ error: 'text-xs' }"
        >
          <AppInput
            v-model="state.shipping_address.last_name"
            name="shipping_address.last_name"
            label="Nazwisko"
            required
            size="xl"
          />
        </UFormField>
        <UFormField
          required
          size="xl"
          class="w-full"
          name="shipping_address.address_1"
          :ui="{ error: 'text-xs' }"
        >
          <AppInput
            v-model="state.shipping_address.address_1"
            name="shipping_address.address_1"
            label="Adres"
            required
            size="xl"
          />
        </UFormField>
        <UFormField
          size="xl"
          class="w-full"
          name="shipping_address.company"
          :ui="{ error: 'text-xs' }"
        >
          <AppInput
            v-model="state.shipping_address.company"
            name="shipping_address.company"
            label="Firma"
            size="xl"
          />
        </UFormField>
        <UFormField
          required
          size="xl"
          class="w-full"
          name="shipping_address.postal_code"
          :ui="{ error: 'text-xs' }"
        >
          <AppInput
            v-model="state.shipping_address.postal_code"
            name="shipping_address.postal_code"
            label="Kod pocztowy"
            required
            size="xl"
          />
        </UFormField>
        <UFormField
          required
          size="xl"
          class="w-full"
          name="shipping_address.city"
          :ui="{ error: 'text-xs' }"
        >
          <AppInput
            v-model="state.shipping_address.city"
            name="shipping_address.city"
            label="Miasto"
            required
            size="xl"
          />
        </UFormField>
        <UFormField
          size="xl"
          class="w-full"
          name="shipping_address.phone"
          :ui="{ error: 'text-xs' }"
        >
          <AppInput
            v-model="state.shipping_address.phone"
            name="shipping_address.phone"
            type="tel"
            label="Telefon"
            size="xl"
          />
        </UFormField>
      </div>
      <div
        class="py-4"
      >
        <UCheckbox
          v-model="sameAsBilling"
          color="neutral"
          label="Billing address same as shipping address"
        />
      </div>
      <div class="grid grid-cols-2 gap-4 pb-8">
        <UFormField
          required
          size="xl"
          class="w-full"
          name="email"
          :ui="{ error: 'text-xs' }"
        >
          <AppInput
            v-model="state.email"
            name="email"
            type="email"
            label="Email"
            required
            size="xl"
          />
        </UFormField>
        <UFormField
          required
          size="xl"
          class="w-full"
          name="shipping_address.phone"
          :ui="{ error: 'text-xs' }"
        >
          <AppInput
            v-model="state.shipping_address.phone"
            name="shipping_address.phone"
            type="tel"
            label="Telefon"
            size="xl"
          />
        </UFormField>
      </div>
      <div
        v-if="!sameAsBilling"
      >
        <AppHeading
          as="h2"
          class="mb-6"
        >
          Billing Address
        </AppHeading>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
          <UFormField
            required
            size="xl"
            class="w-full"
            name="billing_address.first_name"
            :ui="{ error: 'text-xs' }"
          >
            <AppInput
              v-model="state.billing_address.first_name"
              name="billing_address.first_name"
              label="Imię"
              required
              size="xl"
            />
          </UFormField>
          <UFormField
            required
            size="xl"
            class="w-full"
            name="billing_address.last_name"
            :ui="{ error: 'text-xs' }"
          >
            <AppInput
              v-model="state.billing_address.last_name"
              name="billing_address.last_name"
              label="Nazwisko"
              required
              size="xl"
            />
          </UFormField>
          <UFormField
            required
            size="xl"
            class="w-full"
            name="billing_address.address_1"
            :ui="{ error: 'text-xs' }"
          >
            <AppInput
              v-model="state.billing_address.address_1"
              name="billing_address.address_1"
              label="Adres"
              required
              size="xl"
            />
          </UFormField>
          <UFormField
            required
            size="xl"
            class="w-full"
            name="billing_address.company"
            :ui="{ error: 'text-xs' }"
          >
            <AppInput
              v-model="state.billing_address.company"
              name="billing_address.company"
              label="Firma"
              size="xl"
            />
          </UFormField>
          <UFormField
            required
            size="xl"
            class="w-full"
            name="billing_address.postal_code"
            :ui="{ error: 'text-xs' }"
          >
            <AppInput
              v-model="state.billing_address.postal_code"
              name="billing_address.postal_code"
              label="Kod pocztowy"
              required
              size="xl"
            />
          </UFormField>
          <UFormField
            required
            size="xl"
            class="w-full"
            name="billing_address.city"
            :ui="{ error: 'text-xs' }"
          >
            <AppInput
              v-model="state.billing_address.city"
              name="billing_address.city"
              label="Miasto"
              required
              size="xl"
            />
          </UFormField>
          <UFormField
            required
            size="xl"
            class="w-full"
            name="billing_address.phone"
            :ui="{ error: 'text-xs' }"
          >
            <AppInput
              v-model="state.billing_address.phone"
              name="billing_address.phone"
              type="tel"
              label="Telefon"
              size="xl"
            />
          </UFormField>
        </div>
      </div>
      <UButton
        class="cursor-pointer"
        color="neutral"
        size="xl"
        type="submit"
        :loading="loading"
      >
        Kontynuuj do wysyłki
      </UButton>
    </UForm>
    </div>
  </div>
</template>

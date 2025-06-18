<script lang="ts" setup>
import { useCartStore } from '~/stores/cart'
import { storeToRefs } from 'pinia'

const cartStore = useCartStore()
const { cart, loading } = storeToRefs(cartStore)

// Since the site is only in Polish language, we hardcode Polish country name
function getCountryName(countryCode?: string) {
  // Always return Poland regardless of the country code since we're hardcoding to Polish locale
  return 'Polska'
}

const sameAsBilling = computed(() => {
  return compareAddresses(cart.value?.shipping_address, cart.value?.billing_address)
})
</script>

<template>
  <div
    v-if="cart"
    class="flex items-start gap-x-8 text-sm"
  >
    <div class="flex items-start gap-x-1 w-full">
      <div
        class="flex flex-col w-1/3"
      >
        <div class="font-semibold text-black mb-1">
          Adres wysyłki
        </div>
        <div>
          {{ cart.shipping_address?.first_name }}
          {{ cart.shipping_address?.last_name }}
        </div>
        <div>
          {{ cart.shipping_address?.address_1 }}
          {{ cart.shipping_address?.address_2 }}
        </div>
        <div>
          {{ cart.shipping_address?.postal_code }},
          {{ cart.shipping_address?.city }}
        </div>
        <div>
          {{ getCountryName(cart.shipping_address?.country_code) }}
        </div>
      </div>

      <div
        class="flex flex-col w-1/3 "
      >
        <div class="font-semibold text-black mb-1">
          Kontakt
        </div>
        <div>
          {{ cart.shipping_address?.phone }}
        </div>
        <div>
          {{ cart.email }}
        </div>
      </div>

      <div
        class="flex flex-col w-1/3"
      >
        <div class="font-semibold text-black mb-1">
          Adres rozliczeniowy
        </div>

        <div
          v-if="sameAsBilling"
        >
          Adres rozliczeniowy jest taki sam jak adres wysyłki.
        </div>
        <div
          v-else
        >
          <div>
            {{ cart.billing_address?.first_name }}
            {{ cart.billing_address?.last_name }}
          </div>
          <div>
            {{ cart.billing_address?.address_1 }}
            {{ cart.billing_address?.address_2 }}
          </div>
          <div>
            {{ cart.billing_address?.postal_code }}
            {{ cart.billing_address?.city }}
          </div>
          <div>
            {{ getCountryName(cart.billing_address?.country_code) }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    ...ładowanie
  </div>
</template>

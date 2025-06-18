<script lang="ts" setup>
const route = useRoute()

const orderId = computed(() => route.params.orderId as string)

const { data: order } = useFetchOrder(orderId.value)

// Hardcoded to Polish locale - no need to fetch countries dynamically
function getCountryName(countryCode?: string) {
  // Always return "Polska" since we're hardcoding to Polish locale
  return "Polska"
}

const paymentMethod = computed(() => order.value?.payment_collections?.[0]?.payments?.[0])
const paymentProvider = computed(() => providers.find(({ id }) => id === paymentMethod.value?.provider_id))
const paymentDate = computed(() => {
  if (!paymentMethod.value?.created_at) return
  return new Date(paymentMethod.value?.created_at).toDateString()
})
</script>

<template>
  <UContainer class="flex flex-col justify-center items-center gap-y-10 max-w-4xl h-full w-full py-6">
    <div
      v-if="order"
      class="flex flex-col gap-4 max-w-4xl h-full bg-white w-full py-10"
    >
      <AppHeading
        as="h1"
        class="flex flex-col gap-y-3"
      >
        <div>Dankon!</div>
        <div>Twoje zamówienie zostało złożone pomyślnie.</div>
      </AppHeading>
      <div class="text-sm text-black flex flex-col gap-y-2">
        <p>Wyśleliśmy szczegóły zamówienia do <span class="font-semibold">{{ order?.email }}</span></p>
        <p>Order date: {{ new Date(order.created_at).toDateString() }}</p>
        <p class="text-blue-500">
          Nummer zamówienia: {{ order.id }}
        </p>
      </div>
      <AppHeading
        as="h2"
      >
        Podsumowanie
      </AppHeading>
      <USeparator />
      <OrderTableWrapper
        :order="order"
        is-preview
      />
      <CartTotals :cart="order" />
      <AppHeading
        as="h2"
      >
        Dostawa
      </AppHeading>
      <div class="flex items-start gap-x-1 w-full text-sm">
        <div
          class="flex flex-col w-1/3"
        >
          <div class="font-semibold text-black mb-1">
            Adres dostawy
          </div>
          <div>
            {{ order.shipping_address?.first_name }}
            {{ order.shipping_address?.last_name }}
          </div>
          <div>
            {{ order.shipping_address?.address_1 }}
            {{ order.shipping_address?.address_2 }}
          </div>
          <div>
            {{ order.shipping_address?.postal_code }},
            {{ order.shipping_address?.city }}
          </div>
          <div>
            {{ getCountryName(order.shipping_address?.country_code) }}
          </div>
        </div>

        <div
          class="flex flex-col w-1/3 "
        >
          <div class="font-semibold text-black mb-1">
            Kontakt
          </div>
          <div>
            {{ order.shipping_address?.phone }}
          </div>
          <div>
            {{ order.email }}
          </div>
        </div>

        <div
          class="flex flex-col w-1/3"
        >
          <div class="font-semibold text-black mb-1">
            Metoda dostawy
          </div>
          <div>
            {{ order.shipping_methods?.at(-1)?.name }}
            (<StoreLocalizedPrice
              :amount="order.shipping_methods?.at(-1)?.amount"
              :currency-code="order?.currency_code"
            />)
          </div>
        </div>
      </div>
      <USeparator />
      <AppHeading
        as="h2"
      >
        Płatność
      </AppHeading>
      <div class="flex items-start gap-x-1 w-full text-sm">
        <div
          class="flex flex-col w-1/3"
        >
          <div class="font-semibold text-black mb-1">
            Metoda płatności
          </div>
          <div>
            {{ paymentProvider?.label }}
          </div>
        </div>
        <div
          class="flex flex-col w-2/3"
        >
          <div class="font-semibold text-black mb-1">
            Szczegóły płatności
          </div>
          <div class="flex gap-2 items-center">
            <div class="flex items-center h-7 w-fit p-2 bg-neutral-50 rounded-lg border border-neutral-200">
              <UIcon
                :name="paymentProvider?.icon || 'i-lucide-credit-card'"
                class="size-5"
              />
            </div>
            <div class="flex gap-1">
              <StoreLocalizedPrice
                :amount="paymentMethod?.amount"
                :currency-code="order?.currency_code"
              />
              <span>Opłacone</span>
              <span>{{ paymentDate }}</span>
            </div>
          </div>
        </div>
      </div>
      <USeparator />
      <div class="mt-6">
        <div class="font-semibold text-sm text-black">
          Potrzebujesz pomocy?
        </div>
        <ul class="my-2 gap-y-2 flex flex-col">
          <li>
            <AppLink
              to="/contact"
              class="text-sm text-black"
            >
              Kontakt
            </AppLink>
          </li>
          <li>
            <AppLink
              to="/contact"
              class="text-sm text-black"
            >
              Zwracanie & Zamienianie
            </AppLink>
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      ...Ładowanie
    </div>
  </UContainer>
</template>

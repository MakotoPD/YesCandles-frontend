<script lang="ts" setup>
// Since the site is only in Polish language, we hardcode Polish country code
const POLISH_COUNTRY_CODE = 'PL'

const {
  amount,
  currencyCode,
} = defineProps<{
  amount?: number
  currencyCode?: string
}>()

const localizedPrice = computed(() => convertToLocale({
  amount: amount,
  currency_code: currencyCode,
  country: POLISH_COUNTRY_CODE,
}))
</script>

<template>
  <span>
    {{ localizedPrice }}
  </span>
</template>

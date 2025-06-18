<script setup lang="ts">
import type { StoreProduct } from '@medusajs/types'

const {
  product,
} = defineProps<{
  product?: StoreProduct
}>()

const cheapestVariant = computed(() => getCheapestVariant(product))

const currentPrice = computed(() => cheapestVariant.value?.calculated_price?.calculated_amount || undefined)
const originalPrice = computed(() => cheapestVariant.value?.calculated_price?.original_amount || undefined)
const currencyCode = computed(() => cheapestVariant.value?.calculated_price?.currency_code || undefined)
</script>

<template>
  <AppLink
    :to="product?.handle ? `/produkty/${product?.handle}` : undefined"
    class="group product-card"
  >
    <div
      v-if="product"
      class="rounded-lg bg-white relative overflow-hidden border border-color-muted group-hover:border-pink-200 transition-all ease-in-out duration-300 aspect-[11/14] w-full"
    >
      <div class="absolute top-2 right-2 z-10">
        <span v-if="originalPrice && originalPrice > currentPrice" class="pink-badge text-xs px-2 py-0.5">Promocja</span>
      </div>
      <NuxtImg
        v-if="product?.thumbnail"
        :src="product.thumbnail || undefined"
        class="object-cover object-center w-full h-full transition-transform duration-300"
      />
    </div>
    <USkeleton
      v-else
      class="rounded-lg relative overflow-hidden aspect-[11/14] w-full"
    />
    <div class="mt-4 text-sm">
      <h3 v-if="product" class="font-medium text-gray-800 mb-1 group-hover:text-pink-600 transition-colors">
        {{ product?.title }}
      </h3>
      <USkeleton
        v-else
        class="h-4 w-[160px]"
      />
      <div class="flex justify-between items-center">
        <div class="text-color-dimmed">
          <ProductPrice
            v-if="product"
            :original-price="originalPrice"
            :current-price="currentPrice"
            :currency-code="currencyCode"
            display-inline
          />
          <USkeleton
            v-else
            class="h-4 w-[60px]"
          />
        </div>
        <UButton v-if="product" size="xs" class="btn-yescandles opacity-0 group-hover:opacity-100 transition-opacity">
          Dodaj
        </UButton>
      </div>
    </div>
  </AppLink>
</template>

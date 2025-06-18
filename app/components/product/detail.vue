<script lang="ts" setup>
import type { StoreProduct } from '@medusajs/types'

const props = defineProps<{
  product?: StoreProduct
}>()

// Ensure product exists before rendering
const hasProduct = computed(() => {
  return !!props.product && !!props.product.id
})
</script>

<template>
  <div v-if="hasProduct">
    <UContainer class="flex flex-col sm:flex-row sm:items-start py-6 relative">
      <div class="flex flex-col sm:sticky sm:top-48 sm:py-0 sm:max-w-[300px] w-full py-8 gap-y-6">
        <ProductInfo
          :product="product"
        />
      </div>
      <div class="block w-full relative">
        <ProductGallery
          :product="product"
        />
      </div>
      <div class="flex flex-col sm:sticky sm:top-48 sm:py-0 sm:max-w-[300px] w-full py-8 gap-y-12">
        <ProductVariantSelector
          v-if="product"
          :product="product"
        />
      </div>
    </UContainer>
  </div>
  <div v-else>
    <UContainer class="py-12 text-center">
      <USkeleton class="h-96 w-full" />
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import type { StoreProduct } from '@medusajs/types'

const props = defineProps<{
  product?: StoreProduct
}>()

// Track the currently selected image index
const currentImageIndex = ref(0)

// Get all product images
const productImages = computed(() => {
  return props.product?.images || []
})

console.log('Product images:', productImages.value)

// Function to navigate to a specific image
function selectImage(index: number) {
  currentImageIndex.value = index
}

// Get current image URL
const currentImageUrl = computed(() => {
  if (productImages.value && productImages.value.length > 0 && productImages.value[currentImageIndex.value]) {
    return productImages.value[currentImageIndex.value].url || ''
  }
  return ''
})

// Check if we have valid images
const hasValidImages = computed(() => {
  return !!props.product && 
         !!props.product.images && 
         props.product.images.length > 0 && 
         !!props.product.images[0].url
})
</script>

<template>
  <div class="flex items-start relative">
    <div class="flex flex-col flex-1 sm:mx-16 gap-y-4">
      <!-- Main image display -->
      <div
        v-if="hasValidImages"
        class="rounded-lg bg-gray-100 relative w-full overflow-hidden border border-gray-200 flex items-center justify-center"
        style="height: 500px;"
      >
        <!-- Simple image display -->
        <img 
          :src="currentImageUrl" 
          :alt="product.title" 
          class="max-h-full max-w-full object-contain p-4" 
          loading="eager"
        />
        
        <!-- Navigation arrows -->
        <button
          v-if="productImages.length > 1"
          class="absolute left-2 z-10 flex items-center justify-center rounded-full bg-white/80 p-2 text-gray-800 shadow-md transition-all hover:bg-white"
          @click="currentImageIndex = (currentImageIndex - 1 + productImages.length) % productImages.length"
        >
          <UIcon name="i-heroicons-chevron-left" class="text-xl" />
        </button>
        
        <button
          v-if="productImages.length > 1"
          class="absolute right-2 z-10 flex items-center justify-center rounded-full bg-white/80 p-2 text-gray-800 shadow-md transition-all hover:bg-white"
          @click="currentImageIndex = (currentImageIndex + 1) % productImages.length"
        >
          <UIcon name="i-heroicons-chevron-right" class="text-xl" />
        </button>
      </div>
      <USkeleton
        v-else
        class="rounded-lg relative overflow-hidden w-full"
        style="height: 500px;"
      />
      
      <!-- Thumbnail navigation -->
      <div v-if="hasValidImages && productImages.length > 1" class="flex flex-wrap gap-2 mt-4 justify-center">
        <button
          v-for="(image, index) in productImages"
          :key="index"
          class="w-16 h-16 rounded-md overflow-hidden border transition-all"
          :class="currentImageIndex === index ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200 hover:border-gray-300'"
          @click="selectImage(index)"
        >
          <img
            :src="image.url"
            class="h-full w-full object-contain"
            :alt="`${product.title} thumbnail ${index + 1}`"
            loading="eager"
          />
        </button>
      </div>
    </div>
  </div>
</template>

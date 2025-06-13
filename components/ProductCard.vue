<template>
  <div class="group relative card">
    <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-primary-100 xl:aspect-h-8 xl:aspect-w-7">
      <img 
        v-if="product.images && product.images.length > 0" 
        :src="product.images[0]?.src" 
        :alt="product.images[0]?.alt || product.name" 
        class="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity duration-300"
        @error="handleImageError"
      >
      <div v-else class="h-full w-full flex items-center justify-center bg-primary-50">
        <span class="text-secondary-400 text-sm">Brak zdjęcia</span>
      </div>
      <div v-if="product.sale_price" class="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
        Promocja
      </div>
    </div>
    <div class="mt-4 flex justify-between">
      <div>
        <h3 class="text-sm text-secondary-700">
          <NuxtLink :to="`/produkt/${product.slug}`">
            <span aria-hidden="true" class="absolute inset-0"></span>
            {{ product.name }}
          </NuxtLink>
        </h3>
        <p class="mt-1 text-sm text-secondary-500" v-html="shortDescription"></p>
      </div>
      <div class="text-right">
        <p v-if="product.sale_price" class="text-sm font-medium text-secondary-900">{{ formatPrice(product.sale_price) }}</p>
        <p v-if="product.sale_price" class="text-sm text-secondary-500 line-through">{{ formatPrice(product.regular_price) }}</p>
        <p v-else class="text-sm font-medium text-secondary-900">{{ formatPrice(product.price || product.regular_price) }}</p>
      </div>
    </div>
    <div class="mt-3">
      <button 
        @click.prevent="addToCart" 
        class="btn-primary w-full"
        :disabled="product.stock_status !== 'instock'"
      >
        {{ product.stock_status === 'instock' ? 'Dodaj do koszyka' : 'Brak w magazynie' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const cartStore = useCartStore();

const shortDescription = computed(() => {
  const desc = props.product.short_description || '';
  // Remove HTML tags and limit to 50 characters
  return desc.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 50) + (desc.length > 50 ? '...' : '');
});

const formatPrice = (price) => {
  return parseFloat(price).toFixed(2) + ' zł';
};

const addToCart = () => {
  cartStore.addToCart(props.product, 1);
};

// Handle image loading errors
const handleImageError = (event) => {
  // Replace with a placeholder image
  event.target.src = '/images/placeholder.webp';
  event.target.alt = 'Placeholder image';
};
</script>

<template>
  <div>
    <!-- Backdrop -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-black/30 backdrop-blur z-40 transition-opacity"
      @click="closeCart"
    ></div>
    
    <!-- Cart Drawer -->
    <div 
      class="fixed top-0 right-0 w-full md:w-96 h-full bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out"
      :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="flex flex-col h-full">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b">
          <h2 class="text-lg font-medium">Twój koszyk ({{ totalItems }})</h2>
          <button @click="closeCart" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Cart Items -->
        <div class="flex-grow overflow-y-auto p-4">
          <div v-if="items.length === 0" class="flex flex-col items-center justify-center h-full text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p class="text-gray-500 mb-4">Twój koszyk jest pusty</p>
            <button @click="closeCart" class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
              Kontynuuj zakupy
            </button>
          </div>
          
          <div v-else class="space-y-4">
            <div v-for="item in items" :key="item.product.id" class="flex items-center border-b border-gray-200 pb-4">
              <div class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img 
                  :src="item.product.images[0]?.src" 
                  :alt="item.product.images[0]?.alt" 
                  class="h-full w-full object-cover object-center"
                >
              </div>
              
              <div class="ml-4 flex flex-1 flex-col">
                <div>
                  <div class="flex justify-between text-base font-medium text-gray-900">
                    <h3>{{ item.product.name }}</h3>
                    <p class="ml-4">{{ formatPrice(item.product.price) }}</p>
                  </div>
                </div>

                <div v-if="item.variants && Object.keys(item.variants).length > 0" class="mt-2">
                  <div v-for="(value, name) in item.variants" :key="name" class="mb-1">
                    <span class="text-xs font-medium text-gray-700">{{ name }}:</span>
                    <span 
                      class="ml-1 px-2 py-0.5 text-xs border rounded-md border-primary-600 bg-primary-50 text-primary-700"
                    >
                      {{ value }}
                    </span>
                  </div>
                </div>

                <div class="flex flex-1 items-end justify-between text-sm">
                  <div class="flex items-center border rounded">
                    <button 
                      @click="decrementQuantity(item.product.id)" 
                      class="px-2 py-1 text-gray-600 hover:text-primary-600"
                      :disabled="item.quantity <= 1"
                    >
                      -
                    </button>
                    <span class="px-2 py-1">{{ item.quantity }}</span>
                    <button 
                      @click="incrementQuantity(item.product.id)" 
                      class="px-2 py-1 text-gray-600 hover:text-primary-600"
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    @click="removeItem(item.product.id)" 
                    class="font-medium text-primary-600 hover:text-primary-800"
                  >
                    Usuń
                  </button>
                </div>
                <!-- Display selected variants if any -->
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div v-if="items.length > 0" class="border-t border-gray-200 p-4">
          <div class="flex justify-between text-base font-medium text-gray-900 mb-4">
            <p>Razem</p>
            <p>{{ formattedTotalPrice }}</p>
          </div>
          <NuxtLink 
            to="/checkout" 
            class="w-full flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700"
            @click="closeCart"
          >
            Przejdź do kasy
          </NuxtLink>
          <div class="mt-2">
            <button 
              @click="closeCart" 
              class="w-full text-center text-sm text-primary-600 hover:text-primary-800"
            >
              Kontynuuj zakupy
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore();

// Reactive properties from store
const isOpen = computed(() => cartStore.isOpen);
const items = computed(() => cartStore.items);
const totalItems = computed(() => cartStore.totalItems);
const formattedTotalPrice = computed(() => cartStore.formattedTotalPrice);

// Methods
const closeCart = () => {
  cartStore.isOpen = false;
};

const removeItem = (productId) => {
  cartStore.removeFromCart(productId);
};

const incrementQuantity = (productId) => {
  const item = cartStore.items.find(item => item.product.id === productId);
  if (item) {
    cartStore.updateQuantity(productId, item.quantity + 1);
  }
};

const decrementQuantity = (productId) => {
  const item = cartStore.items.find(item => item.product.id === productId);
  if (item && item.quantity > 1) {
    cartStore.updateQuantity(productId, item.quantity - 1);
  }
};

const formatPrice = (price) => {
  return parseFloat(price).toFixed(2) + ' zł';
};
</script>

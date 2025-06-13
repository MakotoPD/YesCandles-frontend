<template>
  <header class="bg-primary-50 shadow-md border-b border-primary-200">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center">
          <span class="text-2xl font-bold text-primary-700">YesCandles</span>
        </NuxtLink>
        
        <!-- Navigation -->
        <nav class="hidden md:flex space-x-6">
          <NuxtLink to="/" class="text-secondary-700 hover:text-primary-600 transition-colors">Strona główna</NuxtLink>
          
          <!-- Categories Dropdown -->
          <div class="relative group">
            <button class="flex items-center text-secondary-700 hover:text-primary-600 transition-colors">
              Kategorie
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <!-- Using a better dropdown structure with proper nesting -->
            <div class="absolute left-0 top-full w-48 pt-2 z-50 hidden group-hover:block">
              <div class="bg-white rounded-md shadow-lg py-1 border border-primary-100">
                <div v-if="categoriesLoading" class="px-4 py-2 text-sm text-gray-500">Ładowanie...</div>
                <div v-else-if="categoriesError" class="px-4 py-2 text-sm text-red-500">Błąd ładowania kategorii</div>
                <template v-else>
                  <NuxtLink 
                    v-for="category in categories" 
                    :key="category.id" 
                    :to="`/sklep/kategoria/${category.slug}`" 
                    class="block px-4 py-2 text-sm text-secondary-700 hover:bg-primary-50 hover:text-primary-600"
                  >
                    {{ category.name }} ({{ category.count }})
                  </NuxtLink>
                  <NuxtLink 
                    to="/sklep" 
                    class="block px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 border-t border-primary-100"
                  >
                    Wszystkie produkty
                  </NuxtLink>
                </template>
              </div>
            </div>
          </div>
          
          <NuxtLink to="/sklep" class="text-secondary-700 hover:text-primary-600 transition-colors">Sklep</NuxtLink>
          <NuxtLink to="/kontakt" class="text-secondary-700 hover:text-primary-600 transition-colors">Kontakt</NuxtLink>
        </nav>
        
        <!-- Cart and Mobile Menu -->
        <div class="flex items-center space-x-4">
          <!-- Cart Icon -->
          <button @click="toggleCart" class="relative p-2 text-secondary-700 hover:text-primary-600">
            <span class="sr-only">Koszyk</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span v-if="totalItems > 0" class="absolute top-0 right-0 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {{ totalItems }}
            </span>
          </button>
          
          <!-- Mobile Menu Button -->
          <button @click="toggleMobileMenu" class="md:hidden p-2 text-secondary-700 hover:text-primary-600">
            <span class="sr-only">Menu</span>
            <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Mobile Menu -->
      <div v-if="isMobileMenuOpen" class="md:hidden mt-4 pb-4">
        <div class="flex flex-col space-y-3">
          <NuxtLink to="/" class="text-gray-700 hover:text-primary-600 font-medium">Strona główna</NuxtLink>
          
          <!-- Mobile Categories Menu -->
          <div class="relative">
            <button 
              @click="toggleMobileCategories" 
              class="flex items-center justify-between w-full text-gray-700 hover:text-primary-600 font-medium"
            >
              <span>Kategorie</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-4 w-4 transition-transform" 
                :class="isMobileCategoriesOpen ? 'rotate-180' : ''" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-if="isMobileCategoriesOpen" class="mt-2 ml-4 space-y-2">
              <div v-if="categoriesLoading" class="text-sm text-gray-500">Ładowanie...</div>
              <div v-else-if="categoriesError" class="text-sm text-red-500">Błąd ładowania kategorii</div>
              <template v-else>
                <NuxtLink 
                  v-for="category in categories" 
                  :key="category.id" 
                  :to="`/sklep/kategoria/${category.slug}`" 
                  class="block text-gray-600 hover:text-primary-600 py-1"
                  @click="isMobileMenuOpen = false"
                >
                  {{ category.name }} ({{ category.count }})
                </NuxtLink>
                <NuxtLink 
                  to="/sklep" 
                  class="block text-primary-600 hover:text-primary-800 py-1 font-medium"
                  @click="isMobileMenuOpen = false"
                >
                  Wszystkie produkty
                </NuxtLink>
              </template>
            </div>
          </div>
          
          <NuxtLink to="/sklep" class="text-gray-700 hover:text-primary-600 font-medium">Sklep</NuxtLink>
          <NuxtLink to="/kontakt" class="text-gray-700 hover:text-primary-600 font-medium">Kontakt</NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCartStore } from '~/stores/cart';
import { useCategoriesStore } from '~/stores/categories';

const cartStore = useCartStore();
const categoriesStore = useCategoriesStore();
const isMobileMenuOpen = ref(false);
const isMobileCategoriesOpen = ref(false);

// Get categories from store
const categories = computed(() => categoriesStore.getMainCategories);
const categoriesLoading = computed(() => categoriesStore.isLoading);
const categoriesError = computed(() => categoriesStore.error);

// Fetch categories on component mount
onMounted(async () => {
  if (categories.value.length === 0) {
    await categoriesStore.fetchCategories();
  }
});

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  // Close categories submenu when closing mobile menu
  if (!isMobileMenuOpen.value) {
    isMobileCategoriesOpen.value = false;
  }
};

const toggleMobileCategories = () => {
  isMobileCategoriesOpen.value = !isMobileCategoriesOpen.value;
};

const toggleCart = () => {
  cartStore.toggleCart();
};

const totalItems = computed(() => cartStore.totalItems);
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Sklep ze świeczkami</h1>
    
    <!-- Filters and Sort -->
    <div class="flex flex-col md:flex-row justify-between mb-6">
      <div class="mb-4 md:mb-0">
        <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Kategoria</label>
        <select 
          id="category" 
          v-model="selectedCategory"
          class="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Wszystkie kategorie</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
      
      <div>
        <label for="sort" class="block text-sm font-medium text-gray-700 mb-1">Sortuj według</label>
        <select 
          id="sort" 
          v-model="sortBy"
          class="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="popularity">Popularność</option>
          <option value="price-low">Cena: od najniższej</option>
          <option value="price-high">Cena: od najwyższej</option>
          <option value="newest">Najnowsze</option>
        </select>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12 text-red-600">
      {{ error }}
      <button @click="fetchProducts" class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
        Spróbuj ponownie
      </button>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="filteredProducts.length === 0" class="text-center py-12">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-1">Nie znaleziono produktów</h3>
      <p class="text-gray-500">Spróbuj zmienić filtry lub wróć później.</p>
    </div>
    
    <!-- Products Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <ProductCard 
        v-for="product in filteredProducts" 
        :key="product.id" 
        :product="product" 
      />
    </div>
    
    <!-- Pagination -->
    <div v-if="filteredProducts.length > 0" class="mt-12 flex justify-center">
      <nav class="flex items-center">
        <button 
          @click="page > 1 && (page--)"
          :disabled="page === 1"
          class="px-3 py-1 rounded-md mr-2"
          :class="page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-primary-600 hover:bg-primary-50'"
        >
          &laquo; Poprzednia
        </button>
        
        <div class="flex space-x-1">
          <button 
            v-for="pageNum in totalPages" 
            :key="pageNum"
            @click="page = pageNum"
            class="px-3 py-1 rounded-md"
            :class="page === pageNum ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-primary-50'"
          >
            {{ pageNum }}
          </button>
        </div>
        
        <button 
          @click="page < totalPages && (page++)"
          :disabled="page === totalPages"
          class="px-3 py-1 rounded-md ml-2"
          :class="page === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-primary-600 hover:bg-primary-50'"
        >
          Następna &raquo;
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useProductsStore } from '~/stores/products';

const productsStore = useProductsStore();
const isLoading = computed(() => productsStore.isLoading);
const error = computed(() => productsStore.error);

// Pagination
const page = ref(1);
const perPage = 12;

// Filters
const selectedCategory = ref('');
const sortBy = ref('popularity');

// Fetch products on mount
onMounted(async () => {
  await fetchProducts();
});

// Fetch products
async function fetchProducts() {
  await productsStore.fetchProducts();
}

// Reset page when filters change
watch([selectedCategory, sortBy], () => {
  page.value = 1;
});

// Get all products
const allProducts = computed(() => productsStore.products);

// Get all categories from products
const categories = computed(() => {
  const categoriesMap = new Map();
  
  allProducts.value.forEach(product => {
    product.categories.forEach(category => {
      categoriesMap.set(category.id, category);
    });
  });
  
  return Array.from(categoriesMap.values());
});

// Filter products by category
const filteredByCategory = computed(() => {
  if (!selectedCategory.value) {
    return allProducts.value;
  }
  
  return allProducts.value.filter(product => 
    product.categories.some(category => category.id === parseInt(selectedCategory.value))
  );
});

// Sort products
const sortedProducts = computed(() => {
  const products = [...filteredByCategory.value];
  
  switch (sortBy.value) {
    case 'price-low':
      return products.sort((a, b) => parseFloat(a.price || a.regular_price) - parseFloat(b.price || b.regular_price));
    case 'price-high':
      return products.sort((a, b) => parseFloat(b.price || b.regular_price) - parseFloat(a.price || a.regular_price));
    case 'newest':
      return products.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
    case 'popularity':
    default:
      // Assuming products are already sorted by popularity from the API
      return products;
  }
});

// Paginate products
const paginatedProducts = computed(() => {
  const start = (page.value - 1) * perPage;
  const end = start + perPage;
  return sortedProducts.value.slice(start, end);
});

// Compute total pages
const totalPages = computed(() => {
  return Math.ceil(sortedProducts.value.length / perPage);
});

// Final filtered products
const filteredProducts = computed(() => {
  return paginatedProducts.value;
});
</script>

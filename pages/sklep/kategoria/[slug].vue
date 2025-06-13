<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Breadcrumbs -->
    <div class="text-sm mb-6">
      <NuxtLink to="/" class="text-gray-600 hover:text-primary-600">Strona główna</NuxtLink>
      <span class="mx-2 text-gray-400">/</span>
      <NuxtLink to="/sklep" class="text-gray-600 hover:text-primary-600">Sklep</NuxtLink>
      <span class="mx-2 text-gray-400">/</span>
      <span class="text-primary-600">{{ categoryName }}</span>
    </div>

    <!-- Category Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">{{ categoryName }}</h1>
      <p class="text-gray-600">Znaleziono {{ products.length }} produktów</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
      <p>{{ error }}</p>
      <button @click="fetchCategoryProducts" class="mt-2 text-primary-600 hover:text-primary-800 font-medium">
        Spróbuj ponownie
      </button>
    </div>

    <!-- No Products Found -->
    <div v-else-if="products.length === 0" class="text-center py-12">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 class="text-xl font-medium text-gray-700 mb-2">Brak produktów</h2>
      <p class="text-gray-500 mb-6">Nie znaleziono produktów w tej kategorii.</p>
      <NuxtLink to="/sklep" class="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-md">
        Wróć do sklepu
      </NuxtLink>
    </div>

    <!-- Products Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <ProductCard 
        v-for="product in products" 
        :key="product.id" 
        :product="product" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useProductsStore } from '~/stores/products';
import { useCategoriesStore } from '~/stores/categories';

const route = useRoute();
const productsStore = useProductsStore();
const categoriesStore = useCategoriesStore();

const slug = computed(() => route.params.slug);
const isLoading = ref(false);
const error = ref(null);
const products = ref([]);
const categoryName = ref('');

// Fetch category products
const fetchCategoryProducts = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    // Get category info
    if (categoriesStore.categories.length === 0) {
      await categoriesStore.fetchCategories();
    }
    
    const category = categoriesStore.getCategoryBySlug(slug.value);
    if (category) {
      categoryName.value = category.name;
      
      // Fetch products for this category
      const config = useRuntimeConfig();
      const response = await $fetch(`${config.public.wooApiUrl}/products`, {
        params: {
          consumer_key: config.public.wooConsumerKey,
          consumer_secret: config.public.wooConsumerSecret,
          category: category.id,
          per_page: 100
        }
      });
      
      products.value = response;
    } else {
      error.value = 'Nie znaleziono kategorii';
    }
  } catch (err) {
    console.error('Error fetching category products:', err);
    error.value = 'Wystąpił błąd podczas ładowania produktów. Spróbuj ponownie później.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchCategoryProducts();
});
</script>

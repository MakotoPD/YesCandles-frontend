<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Breadcrumbs -->
    <nav class="flex mb-8 text-sm">
      <NuxtLink to="/" class="text-gray-500 hover:text-primary-600">Strona główna</NuxtLink>
      <span class="mx-2 text-gray-500">/</span>
      <NuxtLink to="/sklep" class="text-gray-500 hover:text-primary-600">Sklep</NuxtLink>
      <span class="mx-2 text-gray-500">/</span>
      <span class="text-gray-900">{{ product?.name || 'Produkt' }}</span>
    </nav>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12 text-red-600">
      {{ error }}
      <NuxtLink to="/sklep" class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 inline-block">
        Wróć do sklepu
      </NuxtLink>
    </div>
    
    <!-- Product Not Found -->
    <div v-else-if="!product" class="text-center py-12">
      <h2 class="text-2xl font-bold mb-4">Produkt nie został znaleziony</h2>
      <p class="mb-6 text-gray-600">Przepraszamy, ale szukany produkt nie istnieje lub został usunięty.</p>
      <NuxtLink to="/sklep" class="px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition duration-150 ease-in-out">
        Wróć do sklepu
      </NuxtLink>
    </div>
    
    <!-- Product Details -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Product Images -->
      <div>
        <div class="mb-4 aspect-square overflow-hidden rounded-lg relative bg-gray-100">
          <div v-if="product.tags.length > 0" class="absolute left-2 top-2 flex flex-wrap gap-2">
            <div v-for="tag in product.tags" :key="tag.id" 
              class="px-2 py-1 text-white rounded-md text-sm font-medium"
              :class="tag.name == 'NOWOŚĆ' ? 'bg-green-600' : tag.name == 'Polecane' ? 'bg-primary-600' : 'bg-red-600'"
              >
              {{ tag.name }}
            </div>
          </div>
          <img 
            :src="currentImage" 
            :alt="product.name" 
            class="h-full w-full object-cover object-center"
          >
        </div>
        
        <!-- Thumbnail Gallery -->
        <div v-if="product.images.length > 1" class="grid grid-cols-5 gap-2">
          <button 
            v-for="(image, index) in product.images" 
            :key="image.id"
            @click="currentImageIndex = index"
            class="aspect-square overflow-hidden rounded-md border-2"
            :class="currentImageIndex === index ? 'border-primary-600' : 'border-transparent'"
          >
            <img 
              :src="image.src" 
              :alt="`${product.name} - zdjęcie ${index + 1}`" 
              class="h-full w-full object-cover object-center"
            >
          </button>
        </div>
      </div>
      
      <!-- Product Info -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ product.name }}</h1>
        
        <!-- Price -->
        <div class="mb-4">
          <span v-if="currentVariantPrice.sale" class="text-2xl font-bold text-primary-600 mr-2">
            {{ formatPrice(currentVariantPrice.sale) }}
          </span>
          <span v-if="currentVariantPrice.sale" class="text-lg text-gray-500 line-through">
            {{ formatPrice(currentVariantPrice.regular) }}
          </span>
          <span v-else class="text-2xl font-bold text-primary-600">
            {{ formatPrice(currentVariantPrice.regular) }}
          </span>
          
          <!-- Omnibus Directive Information -->
          <div v-if="hasOmnibusData" class="mt-2 text-xs text-gray-500">
            <p>Najniższa cena z 30 dni przed obniżką: {{ formatPrice(lowestPrice) }}</p>
          </div>
        </div>
        
        <!-- Stock Status -->
        <div class="mb-6">
          <span 
            :class="product.stock_status === 'instock' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
            class="px-2 py-1 rounded-md text-sm font-medium"
          >
            {{ product.stock_status === 'instock' ? 'Dostępny' : 'Niedostępny' }}
          </span>
        </div>
        
        <!-- Short Description -->
        <div class="mb-6 prose" v-html="product.short_description"></div>
        
        <!-- Product Variants -->
        <div v-if="product.attributes && product.attributes.length > 0" class="mb-6">
          <div v-for="attribute in product.attributes" :key="attribute.id" class="mb-4">
            <h3 class="text-sm font-medium text-gray-700 mb-2">{{ attribute.name }}:</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="option in attribute.options" 
                :key="option"
                @click="selectVariant(attribute.name, option)"
                class="px-3 py-1 border rounded-md text-sm"
                :class="isVariantSelected(attribute.name, option) ? 
                  'border-primary-600 bg-primary-50 text-primary-700' : 
                  'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'"
              >
                {{ option }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- Add to Cart -->
        <div class="mb-8">
          <div class="flex items-center mb-4">
            <label for="quantity" class="mr-4 text-gray-700">Ilość:</label>
            <div class="flex items-center border rounded">
              <button 
                @click="quantity > 1 && quantity--" 
                class="px-3 py-1 text-gray-600 hover:text-primary-600"
                :disabled="quantity <= 1"
              >
                -
              </button>
              <input 
                type="number" 
                id="quantity" 
                v-model="quantity" 
                min="1" 
                :max="product.stock_quantity || 99"
                class="w-12 text-center border-none focus:outline-none focus:ring-0"
              >
              <button 
                @click="quantity++" 
                class="px-3 py-1 text-gray-600 hover:text-primary-600"
                :disabled="product.stock_quantity && quantity >= product.stock_quantity"
              >
                +
              </button>
            </div>
          </div>
          
          <button 
            @click="addToCart" 
            class="w-full md:w-auto px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition duration-150 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
            :disabled="product.stock_status !== 'instock'"
          >
            {{ product.stock_status === 'instock' ? 'Dodaj do koszyka' : 'Produkt niedostępny' }}
          </button>
        </div>
        
        <!-- Categories -->
        <div class="mb-4">
          <h3 class="text-sm text-gray-500 mb-1">Kategorie:</h3>
          <div class="flex flex-wrap gap-2">
            <NuxtLink 
              v-for="category in product.categories" 
              :key="category.id"
              :to="`/sklep?category=${category.id}`"
              class="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
            >
              {{ category.name }}
            </NuxtLink>
          </div>
        </div>


      </div>
    </div>
    
    <!-- Product Description -->
    <div v-if="product" class="mt-12">
      <h2 class="text-2xl font-bold mb-6">Opis produktu</h2>
      <div class="prose max-w-none" v-html="product.description"></div>
    </div>
    
    <!-- Related Products -->
    <div v-if="relatedProducts.length > 0" class="mt-16">
      <h2 class="text-2xl font-bold mb-6">Podobne produkty</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ProductCard 
          v-for="relatedProduct in relatedProducts" 
          :key="relatedProduct.id" 
          :product="relatedProduct" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProductsStore } from '~/stores/products';
import { useCartStore } from '~/stores/cart';

const route = useRoute();
const productsStore = useProductsStore();
const cartStore = useCartStore();

const slug = computed(() => route.params.slug);
const product = ref(null);
const isLoading = ref(true);
const error = ref(null);
const quantity = ref(1);
const currentImageIndex = ref(0);
const selectedVariants = ref({});
const lowestPrice = ref(0);
const hasOmnibusData = ref(false);
const variations = ref([]);
const currentVariantPrice = ref({
  regular: 0,
  sale: null
});
const currentVariantId = ref(0);
const isLoadingVariations = ref(false);

// Get current image
const currentImage = computed(() => {
  if (!product.value || !product.value.images || product.value.images.length === 0) {
    return '';
  }
  return product.value.images[currentImageIndex.value]?.src || product.value.images[0]?.src;
});

// Process Omnibus data
const processOmnibusData = () => {
  if (!product.value || !product.value.meta_data) return;
  
  const omnibusData = product.value.meta_data.find(meta => meta.key === '_iwo_price_last_change');
  
  if (omnibusData && omnibusData.value) {
    const priceData = omnibusData.value;
    
    // Check if we have valid price data
    if (priceData.price && parseFloat(priceData.price) > 0) {
      lowestPrice.value = parseFloat(priceData.price);
      hasOmnibusData.value = true;
    } else if (product.value.regular_price) {
      // Fallback to regular price if no historical data
      lowestPrice.value = parseFloat(product.value.regular_price);
      hasOmnibusData.value = product.value.sale_price ? true : false;
    }
  }
};

// Fetch product variations
const fetchVariations = async () => {
  if (!product.value || !product.value.id || !product.value.type || product.value.type !== 'variable') return;
  
  isLoadingVariations.value = true;
  try {
    const productStore = useProductsStore();
    const productVariations = await productStore.getProductVariations(product.value.id);
    variations.value = productVariations;
    
    // Set default prices and image
    if (variations.value.length > 0) {
      updateCurrentPrice();
    } else {
      // No variants, use product price
      currentVariantPrice.value = {
        regular: parseFloat(product.value.price || product.value.regular_price),
        sale: product.value.sale_price ? parseFloat(product.value.sale_price) : null
      };
    }
  } catch (error) {
    console.error('Error fetching variations:', error);
  } finally {
    isLoadingVariations.value = false;
  }
};

// Update price and image based on selected variants
const updateCurrentPrice = () => {
  if (variations.value.length === 0) return;
  
  // Find matching variant based on selected attributes
  const selectedVariantKeys = Object.keys(selectedVariants.value);
  
  if (selectedVariantKeys.length === 0) {
    // No variant selected, use first variant price
    const firstVariant = variations.value[0];
    currentVariantPrice.value = {
      regular: parseFloat(firstVariant.regular_price),
      sale: firstVariant.sale_price ? parseFloat(firstVariant.sale_price) : null
    };
    currentVariantId.value = firstVariant.id;
    return;
  }
  
  // Find matching variant
  const matchingVariant = variations.value.find(variant => {
    if (!variant.attributes) return false;
    
    // Check if all selected attributes match this variant
    return selectedVariantKeys.every(key => {
      const variantAttribute = variant.attributes.find(attr => 
        attr.name === key && attr.option === selectedVariants.value[key]
      );
      return !!variantAttribute;
    });
  });
  
  if (matchingVariant) {
    currentVariantPrice.value = {
      regular: parseFloat(matchingVariant.regular_price),
      sale: matchingVariant.sale_price ? parseFloat(matchingVariant.sale_price) : null
    };
    currentVariantId.value = matchingVariant.id;
    
    // Update image if variant has an image
    if (matchingVariant.image && product.value && product.value.images) {
      // Find the index of the matching image in the product images array
      const imageIndex = product.value.images.findIndex(img => img.id === matchingVariant.image.id);
      if (imageIndex !== -1) {
        currentImageIndex.value = imageIndex;
      }
    }
  } else {
    // No matching variant, use product price
    currentVariantPrice.value = {
      regular: parseFloat(product.value.price || product.value.regular_price),
      sale: product.value.sale_price ? parseFloat(product.value.sale_price) : null
    };
    currentVariantId.value = 0;
  }
};

// Format price
const formatPrice = (price) => {
  return parseFloat(price).toFixed(2) + ' zł';
};

// Variant selection functions
const selectVariant = (attributeName, option) => {
  selectedVariants.value = {
    ...selectedVariants.value,
    [attributeName]: option
  };
  
  // Update price and image based on selected variant
  updateCurrentPrice();
};

// Auto-select first variant option for each attribute
const selectFirstVariants = () => {
  if (!product.value || !product.value.attributes) return;
  
  product.value.attributes.forEach(attribute => {
    if (attribute.options && attribute.options.length > 0) {
      selectVariant(attribute.name, attribute.options[0]);
    }
  });
};

const isVariantSelected = (attributeName, option) => {
  return selectedVariants.value[attributeName] === option;
};

// Add to cart
const addToCart = () => {
  if (!product.value) return;
  
  const cartStore = useCartStore();
  cartStore.addToCart({
    ...product.value,
    quantity: quantity.value,
    variants: selectedVariants.value,
    variant_id: currentVariantId.value,
    price: currentVariantPrice.value.sale || currentVariantPrice.value.regular
  });
  
  // Show notification
  toast.success('Produkt dodany do koszyka');
};

// Get related products (products in the same category)
const relatedProducts = computed(() => {
  if (!product.value) return [];
  
  const categoryIds = product.value.categories.map(cat => cat.id);
  
  return productsStore.products
    .filter(p => 
      p.id !== product.value.id && 
      p.categories.some(cat => categoryIds.includes(cat.id))
    )
    .slice(0, 4);
});

// Fetch product data
onMounted(async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    // First try to get the product from the store if it exists
    const productFromStore = productsStore.products.find(p => p.slug === slug.value);
    
    if (productFromStore) {
      product.value = productFromStore;
    } else {
      // If not in store, fetch from API
      product.value = await productsStore.getProductBySlug(slug.value);
      
      // If product not found and we don't have products in store yet, fetch all products
      if (!product.value && productsStore.products.length === 0) {
        await productsStore.fetchProducts();
        product.value = productsStore.products.find(p => p.slug === slug.value);
      }
    }
    
    if (!product.value) {
      error.value = 'Produkt nie został znaleziony';
    } else {
      // Process Omnibus data for price history
      processOmnibusData();
      // Fetch product variations if it's a variable product
      await fetchVariations();
      // Auto-select first variant options
      selectFirstVariants();
    }
  } catch (err) {
    console.error('Error fetching product:', err);
    error.value = 'Wystąpił błąd podczas ładowania produktu';
  } finally {
    isLoading.value = false;
  }
});
</script>

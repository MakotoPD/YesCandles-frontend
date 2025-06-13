<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-primary-100">
      <div class="container mx-auto px-4 py-16 md:py-24">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Ręcznie robione świeczki woskowe
            </h1>
            <p class="text-lg text-gray-700 mb-8">
              Odkryj naszą kolekcję ręcznie robionych świeczek woskowych, 
              które wypełnią Twój dom ciepłem i niepowtarzalnym aromatem.
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <NuxtLink 
                to="/sklep" 
                class="px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition duration-150 ease-in-out text-center"
              >
                Zobacz produkty
              </NuxtLink>
              <NuxtLink 
                to="/o-nas" 
                class="px-6 py-3 bg-white text-primary-600 font-medium rounded-md border border-primary-600 hover:bg-primary-50 transition duration-150 ease-in-out text-center"
              >
                Poznaj naszą historię
              </NuxtLink>
            </div>
          </div>
          <div class="relative h-64 md:h-auto">
            <img 
              src="/images/hero-candle.jpg" 
              alt="Ręcznie robiona świeczka woskowa" 
              class="rounded-lg shadow-lg w-full h-full object-cover"
            >
          </div>
        </div>
      </div>
    </section>
    
    <!-- Featured Products -->
    <section class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-8">Polecane produkty</h2>
        
        <div v-if="productsStore.isLoading" class="flex justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
        
        <div v-else-if="productsStore.error" class="text-center text-red-600">
          {{ productsStore.error }}
        </div>
        
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProductCard 
            v-for="product in featuredProducts" 
            :key="product.id" 
            :product="product" 
          />
        </div>
        
        <div class="mt-10 text-center">
          <NuxtLink 
            to="/sklep" 
            class="px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition duration-150 ease-in-out inline-block"
          >
            Zobacz wszystkie produkty
          </NuxtLink>
        </div>
      </div>
    </section>
    
    <!-- Features -->
    <section class="py-12 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Dlaczego nasze świeczki?</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center p-6">
            <div class="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Ręcznie robione</h3>
            <p class="text-gray-600">
              Każda świeczka jest wykonana ręcznie z dbałością o najdrobniejsze detale.
            </p>
          </div>
          
          <div class="text-center p-6">
            <div class="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Naturalne składniki</h3>
            <p class="text-gray-600">
              Używamy tylko naturalnego wosku i olejków eterycznych najwyższej jakości.
            </p>
          </div>
          
          <div class="text-center p-6">
            <div class="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Unikalne wzory</h3>
            <p class="text-gray-600">
              Każdy produkt jest wyjątkowy i niepowtarzalny, stworzony z pasją.
            </p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Testimonials -->
    <section class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Co mówią nasi klienci</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-gray-50 p-6 rounded-lg">
            <div class="flex items-center mb-4">
              <div class="text-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </div>
            </div>
            <p class="text-gray-600 mb-4">
              "Świeczki są przepiękne i pachną obłędnie! Zamówiłam już trzeci raz i za każdym razem jestem zachwycona jakością."
            </p>
            <p class="font-medium">Anna K.</p>
          </div>
          
          <div class="bg-gray-50 p-6 rounded-lg">
            <div class="flex items-center mb-4">
              <div class="text-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </div>
            </div>
            <p class="text-gray-600 mb-4">
              "Idealne na prezent! Kupiłem świeczkę dla mamy na urodziny i była zachwycona. Piękne opakowanie i wspaniały zapach."
            </p>
            <p class="font-medium">Marek W.</p>
          </div>
          
          <div class="bg-gray-50 p-6 rounded-lg">
            <div class="flex items-center mb-4">
              <div class="text-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </div>
            </div>
            <p class="text-gray-600 mb-4">
              "Uwielbiam te świeczki! Naturalne składniki to duży plus, a zapach utrzymuje się bardzo długo. Polecam!"
            </p>
            <p class="font-medium">Karolina B.</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Newsletter -->
    <section class="py-12 bg-primary-50">
      <div class="container mx-auto px-4">
        <div class="max-w-2xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-4">Zapisz się do newslettera</h2>
          <p class="text-gray-600 mb-6">
            Bądź na bieżąco z nowościami i promocjami. Zapisz się do naszego newslettera.
          </p>
          <form class="flex flex-col sm:flex-row gap-2">
            <input 
              type="email" 
              placeholder="Twój adres email" 
              class="flex-grow px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
            <button 
              type="submit" 
              class="px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition duration-150 ease-in-out"
            >
              Zapisz się
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useProductsStore } from '~/stores/products';

const productsStore = useProductsStore();

// Fetch featured products on page load
onMounted(async () => {
  await productsStore.fetchFeaturedProducts();
});

// Computed property to get featured products
const featuredProducts = computed(() => productsStore.featuredProducts);
</script>

<script setup lang="ts">
const { title } = useAppConfig()

const isSideMenuOpen = ref(false)
const isCategoriesOpen = ref(false)

// Fetch categories from API
const { data: categoriesData, pending } = useFetch('/api/categories')

// Get customer data from Pinia store
import { storeToRefs } from 'pinia';

const authStore = useAuthStore()
const { isLoggedIn , customer } = storeToRefs(authStore)

// Transform categories for display
const categories = computed(() => {
  if (!categoriesData.value?.product_categories) return []
  
  return categoriesData.value.product_categories.map(category => ({
    id: category.id,
    name: category.name,
    slug: category.handle
  }))
})
</script>

<template>
  <div class="sticky top-0 inset-x-0 z-50">
    <header class="h-16 mx-auto duration-200 bg-pink-50/80 backdrop-blur-sm border-b border-pink-100">
      <UContainer class="flex items-center justify-between w-full h-full text-sm">
        <div
          class="cursor-pointer h-full flex items-center flex-1 basis-0 sm:hidden"
          @click="isSideMenuOpen = !isSideMenuOpen"
        >
          <UIcon name="i-lucide-menu" class="size-5" />
        </div>
        <div class="hidden sm:flex items-center flex-1 basis-0 space-x-6">
          <AppLink to="/sklep" class="header-link font-medium">Sklep</AppLink>
          
          <!-- Categories dropdown -->
          <div 
            class="relative" 
            @mouseleave="isCategoriesOpen = false"
          >
            <button 
              class="header-link font-medium flex items-center gap-1"
              @click="isCategoriesOpen = !isCategoriesOpen"
              @mouseenter="isCategoriesOpen = true"
            >
              Kategorie
              <UIcon 
                :name="isCategoriesOpen ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" 
                class="w-4 h-4 transition-transform"
              />
            </button>
            
            <!-- Dropdown menu -->
            <div 
              class="absolute top-full left-0 mt-0 w-56 bg-white shadow-lg rounded-md overflow-hidden z-50 transform transition-all duration-200 origin-top-left"
              :class="isCategoriesOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'"
            >
              <div class="py-1">
                <!-- Loading state -->
                <div v-if="pending" class="px-4 py-3 text-center">
                  <UIcon name="i-lucide-loader-2" class="animate-spin h-4 w-4 mx-auto mb-1" />
                  <span class="text-xs text-gray-500">Ładowanie...</span>
                </div>
                
                <!-- No categories -->
                <div v-else-if="categories.length === 0" class="px-4 py-3 text-center">
                  <span class="text-sm text-gray-500">Brak kategorii</span>
                </div>
                
                <!-- Categories list -->
                <AppLink 
                  v-else
                  v-for="category in categories" 
                  :key="category.id"
                  :to="`/kategorie/${category.slug}`"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                >
                  {{ category.name }}
                </AppLink>
              </div>
            </div>
          </div>
          
          <AppLink to="/kontakt" class="header-link font-medium">Kontakt</AppLink>
        </div>
        <AppLink
          to="/"
          class="uppercase text-lg font-medium h-full flex items-center"
        >
          <NuxtImg
            src="/logo_makeitcozy.png"
            alt="Logo Make It Cozy"
            class="w-24 h-12"
            loading="lazy"
          />
        </AppLink>
        <nav class="flex items-center space-x-6 flex-1 basis-0 justify-end">
          <AppLink
            to="/konto"
            class="header-link relative"
          >
            <ClientOnly>
              <div v-if="isLoggedIn && customer" class="flex items-center gap-2">
                <span class="hidden lg:inline">{{ customer.first_name }} {{ customer.last_name[0] }}.</span>
                <Icon name="i-lucide-user" size="18" />
              </div>
              <Icon v-else name="i-lucide-user" size="18" />
              <template #fallback>
                <div class="flex items-center justify-center">
                  <Icon name="i-lucide-user" size="18" />
                </div>
              </template>
            </ClientOnly>
          </AppLink>
          <ClientOnly>
            <LazyCartDropdown />
            <template #fallback>
              <AppLink
                to="/koszyk"
              >
                <Icon name="i-lucide-shopping-cart" size="18" style="color: black" />
              </AppLink>
            </template>
          </ClientOnly>
        </nav>
      </UContainer>
      <AppHeaderSideMenu
        v-model="isSideMenuOpen"
      />
    </header>
  </div>
</template>

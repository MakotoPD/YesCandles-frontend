<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const handle = computed(() => route.params.handle as string)

// Define reactive state to store the product
const product = ref(null)
const pending = ref(true)
const error = ref(null)
const notFound = ref(false)

// Use a function to fetch the product data
const fetchProduct = async () => {
  if (!handle.value) return
  
  pending.value = true
  error.value = null
  notFound.value = false
  
  try {
    // Use $fetch directly with credentials included to ensure cookies are sent
    const response = await $fetch(`/api/products/${handle.value}`, {
      credentials: 'include', // Include cookies for authentication
    })
    
    if (response && response.data) {
      product.value = response.data
    } else {
      notFound.value = true
    }
  } catch (err) {
    console.error('Error fetching product:', err)
    error.value = err
    
    // Set not found for 404 errors
    if (err.response?.status === 404) {
      notFound.value = true
    }
  } finally {
    pending.value = false
  }
}

// Watch for handle changes to refetch the product
watch(() => handle.value, (newHandle) => {
  if (newHandle) {
    fetchProduct()
  }
}, { immediate: true })
</script>

<template>
  <div>
    <UContainer v-if="pending" class="py-12">
      <USkeleton class="h-96 w-full" />
    </UContainer>
    
    <ProductDetail
      v-else-if="product && !notFound"
      :product="product"
    />
    
    <UContainer v-else-if="notFound" class="py-12 text-center">
      <AppHeading tag="h1" class="text-3xl font-bold mb-4">
        Produkt nie został znaleziony
      </AppHeading>
      <p class="mt-4 mb-8">Produkt, którego szukasz nie istnieje lub został usunięty.</p>
      <UButton to="/" color="primary">
        Powrót do strony głównej
      </UButton>
    </UContainer>
    
    <UContainer v-else class="py-12 text-center">
      <AppHeading tag="h1" class="text-3xl font-bold mb-4">
        Błąd podczas ładowania produktu
      </AppHeading>
      <p class="mt-4 mb-8">Wystąpił błąd podczas ładowania produktu. Spróbuj ponownie później.</p>
      <UButton to="/" color="primary">
        Powrót do strony głównej
      </UButton>
    </UContainer>
    
    <!-- TODO: Implement ProductRelated component -->
    <!-- <LazyProductRelated v-if="product" :product="product" /> -->
  </div>
</template>

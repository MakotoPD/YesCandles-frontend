<template>
  <div class="container mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-8">Kasa</h1>
    
    <div v-if="cartItems.length === 0" class="text-center py-12">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      <h2 class="text-2xl font-medium text-gray-900 mb-2">Twój koszyk jest pusty</h2>
      <p class="text-gray-500 mb-6">Wygląda na to, że nie dodałeś jeszcze żadnych produktów do koszyka.</p>
      <NuxtLink 
        to="/sklep" 
        class="px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition duration-150 ease-in-out inline-block"
      >
        Przejdź do sklepu
      </NuxtLink>
    </div>
    
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Order Summary -->
      <div class="lg:col-span-2">
        <div class="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 class="text-xl font-bold mb-6">Podsumowanie zamówienia</h2>
          
          <div class="border-b border-gray-200 pb-4 mb-4">
            <div class="flex justify-between text-sm text-gray-500 mb-2">
              <span>Produkt</span>
              <span>Razem</span>
            </div>
          </div>
          
          <div v-for="item in cartItems" :key="item.product.id" class="flex items-center py-4 border-b border-gray-200">
            <div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mr-4">
              <img 
                :src="item.product.images[0]?.src" 
                :alt="item.product.images[0]?.alt" 
                class="h-full w-full object-cover object-center"
              >
            </div>
            
            <div class="flex-grow">
              <h3 class="text-base font-medium text-gray-900">{{ item.product.name }}</h3>
              <!-- Display selected variants if any -->
              <div v-if="item.product.variants && Object.keys(item.product.variants).length > 0" class="mt-2">
                <div v-for="(value, name) in item.product.variants" :key="name" class="mb-1">
                  <span class="text-xs font-medium text-gray-700">{{ name }}:</span>
                  <span 
                    class="ml-1 px-2 py-0.5 text-xs border rounded-md border-primary-600 bg-primary-50 text-primary-700"
                  >
                    {{ value }}
                  </span>
                </div>
              </div>
              
              <p class="text-sm text-gray-500 mt-1">Ilość: {{ item.quantity }}</p>
            </div>
            
            <div class="text-right">
              <p class="text-base font-medium text-gray-900">
                {{ formatPrice(item.product.price * item.quantity) }}
              </p>
            </div>
          </div>
          
          <div class="mt-6 space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Suma częściowa</span>
              <span class="font-medium">{{ formattedTotalPrice }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Wysyłka</span>
              <span v-if="cartStore.totalPrice >= 150" class="font-medium text-green-600">Darmowa dostawa</span>
              <span v-else class="font-medium">{{ formatPrice(shippingCost) }}</span>
            </div>
            <div class="flex justify-between border-t border-gray-200 pt-2 mt-2">
              <span class="text-lg font-bold">Razem</span>
              <span class="text-lg font-bold text-primary-600">{{ formatPrice(totalWithShipping) }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md mb-4">
          <h2 class="text-xl font-bold mb-6">Dane do zamówienia</h2>
          
          <form @submit.prevent="placeOrder">
            <div class="flex gap-4 w-full">
              <div class="mb-4 w-full">
                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">Imię</label>
                <input 
                  type="text" 
                  id="firstName" 
                  v-model="form.firstName" 
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
              </div>
              
              <div class="mb-4 w-full">
                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Nazwisko</label>
                <input 
                  type="text" 
                  id="lastName" 
                  v-model="form.lastName" 
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
              </div>
            </div>
            
            <div class="flex gap-4 w-full">
              <div class="mb-4 w-full">
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="form.email" 
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
              </div>
              
              <div class="mb-4 w-full">
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input 
                  type="tel" 
                  id="phone" 
                  v-model="form.phone" 
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
              </div>
            </div>
            
            
            <div class="mb-4">
              <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Adres</label>
              <input 
                type="text" 
                id="address" 
                v-model="form.address" 
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
            </div>
            
            <div class="flex gap-4">
              <div class="mb-4 w-full">
                <label for="city" class="block text-sm font-medium text-gray-700 mb-1">Miasto</label>
                <input 
                  type="text" 
                  id="city" 
                  v-model="form.city" 
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
              </div>
              
              <div class="mb-4 w-full">
                <label for="postcode" class="block text-sm font-medium text-gray-700 mb-1">Kod pocztowy</label>
                <input 
                  type="text" 
                  id="postcode" 
                  v-model="form.postcode" 
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
              </div>
            </div>
            
            
            <div class="mb-6">
              <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">Uwagi do zamówienia (opcjonalnie)</label>
              <textarea 
                id="notes" 
                v-model="form.notes" 
                rows="3" 
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              ></textarea>
            </div>

            
          </form>
        </div>
      </div>

      
      
      
      <!-- Checkout Form -->
      <div class="lg:col-span-1">
        
        <!-- Shipping Methods Section -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 class="text-xl font-bold mb-4">Sposób dostawy</h2>
          
          <div v-if="isLoadingShipping" class="py-4 text-center">
            <p>Ładowanie metod dostawy...</p>
          </div>
          
          <div v-else-if="shippingMethods.length === 0" class="py-4 text-center">
            <p>Brak dostępnych metod dostawy</p>
          </div>
          
          <div v-else class="space-y-3">
            <div 
              v-for="method in shippingMethods.filter(m => m.method_id !== 'free_shipping' || cartStore.totalPrice >= 150)" 
              :key="method.id"
              @click="selectShippingMethod(method)"
              class="p-3 border rounded-md cursor-pointer transition-all"
              :class="selectedShippingMethod && selectedShippingMethod.id === method.id ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-300'"
            >
              <div class="flex items-center justify-between cursor-pointer">
                <div class="flex items-center">
                  <input type="radio" :checked="selectedShippingMethod?.id === method.id" class="h-4 w-4 text-primary-600">
                  <span class="ml-2 font-medium">{{ method.title }}</span>
                </div>
                <span class="font-medium">{{ formatPrice(method.settings?.cost?.value || 0) }}</span>
              </div>
              
              <!-- Show InPost widget only for InPost shipping method -->
              <div v-if="(method.method_id === 'inpost' || method.method_id === 'inpost_paczkomaty') && selectedShippingMethod?.id === method.id" class="mt-4">
                <p class="mb-2 text-sm">Wybierz paczkomat:</p>
                <GeoWidget @select="handleLockerSelect" />
                <div v-if="selectedLocker" class="mt-2 p-2 bg-gray-50 rounded">
                  <h3 class="text-sm font-medium">Wybrany paczkomat:</h3>
                  <p class="text-sm"><strong>{{ selectedLocker.name }}</strong> – {{ selectedLocker.address.line1 }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>


        <!-- Payment Component - only shown after shipping method is selected -->
        <div v-if="selectedShippingMethod" class="mt-6">
          <h2 class="text-xl font-bold mb-4">Płatność</h2>
          <PaymentComponent 
            :order-id="123"
            :order-summary="{
              subtotal: (cartStore.totalPrice * 100),
              shipping: (shippingCost * 100),
              total: (totalWithShipping * 100)
            }"
            @payment-success="handlePaymentSuccess"
            @payment-error="handlePaymentError"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '~/stores/cart';

const router = useRouter();
const cartStore = useCartStore();
const config = useRuntimeConfig();

const isSubmitting = ref(false);

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postcode: '',
  notes: '',
  paymentMethod: 'blik'
});


// Shipping methods state
const isLoadingShipping = ref(true)
const shippingMethods = ref([])
const selectedShippingMethod = ref(null)
const shippingZones = ref([])
const shippingCost = ref(20)

// Selected locker for InPost
const selectedLocker = ref(null)

function handleLockerSelect(locker) {
  selectedLocker.value = locker
  console.log('Wybrany punkt:', locker)
}

function selectShippingMethod(method) {
  selectedShippingMethod.value = method
  // Update shipping cost (0 if cart total is over 150 zł)
  if (cartStore.totalPrice >= 150) {
    shippingCost.value = 0
  } else {
    shippingCost.value = parseFloat(method.settings?.cost?.value || 0)
  }
  console.log('Selected shipping method:', method, 'Cost:', shippingCost.value)
}

// Fetch shipping zones and methods
async function fetchShippingMethods() {
  isLoadingShipping.value = true
  
  try {
    // Fetch shipping zones
    const zones = await $fetch(`${config.public.wooApiUrl}/shipping/zones`, {
      headers: {
        'Authorization': `Basic ${btoa(`${config.public.wooConsumerKey}:${config.public.wooConsumerSecret}`)}`
      }
    })
    
    shippingZones.value = zones
    console.log('Shipping zones:', shippingZones.value)
    
    // Fetch methods for each zone
    const methods = []
    
    for (const zone of zones) {
      const zoneMethods = await $fetch(`${config.public.wooApiUrl}/shipping/zones/${zone.id}/methods`, {
        headers: {
          'Authorization': `Basic ${btoa(`${config.public.wooConsumerKey}:${config.public.wooConsumerSecret}`)}`
        }
      })
      
      // Only add enabled methods
      methods.push(...zoneMethods.filter(method => method.enabled))
    }
    
    shippingMethods.value = methods
    console.log('Shipping methods:', shippingMethods.value)
    
    // Auto-select first available shipping method
    if (shippingMethods.value.length > 0) {
      // Filter methods based on cart total for free shipping
      const availableMethods = shippingMethods.value.filter(
        m => m.method_id !== 'free_shipping' || cartStore.totalPrice >= 150
      )
      
      if (availableMethods.length > 0) {
        selectShippingMethod(availableMethods[0])
      }
    }
  } catch (error) {
    console.error('Error fetching shipping methods:', error)
  } finally {
    isLoadingShipping.value = false
  }
}

// Get cart items from store
const cartItems = computed(() => cartStore.items);
const formattedTotalPrice = computed(() => cartStore.formattedTotalPrice);
const totalWithShipping = computed(() => {
  // Free shipping for orders over 150 zł
  if (cartStore.totalPrice >= 150) {
    return cartStore.totalPrice;
  }
  return cartStore.totalPrice + shippingCost.value;
});

// Format price with currency
const formatPrice = (price) => {
  return parseFloat(price).toFixed(2) + ' zł';
};

// Payment handlers
function handlePaymentSuccess(response) {
  console.log('Payment successful:', response);
  // Process successful payment
  // This could trigger the order completion
  placeOrder();
}

function handlePaymentError(error) {
  console.error('Payment error:', error);
  alert('Wystąpił błąd podczas płatności. Spróbuj ponownie.');
}

// Fetch payment gateways
const paymentGateways = ref([]);

onMounted(async () => {
  try {
    // Fetch shipping methods
    await fetchShippingMethods();
    
    // Fetch payment gateways
    const response = await $fetch(`${config.public.wordpressUrl}/mkt/v1/payment-gateways`);
    paymentGateways.value = response || [];
    console.log('Payment gateways:', paymentGateways.value);
    
    // Set default payment method if available
    if (paymentGateways.value.length > 0) {
      form.paymentMethod = paymentGateways.value[0].id;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
})

// Place order
const placeOrder = async () => {
  isSubmitting.value = true;
  
  // Validate if shipping method is selected
  if (!selectedShippingMethod.value) {
    alert('Proszę wybrać metodę dostawy');
    isSubmitting.value = false;
    return;
  }
  
  // Validate if InPost locker is selected when needed
  if ((selectedShippingMethod.value.method_id === 'inpost' || selectedShippingMethod.value.method_id === 'inpost_paczkomaty') && !selectedLocker.value) {
    alert('Proszę wybrać paczkomat');
    isSubmitting.value = false;
    return;
  }
  
  try {
    // Prepare order data
    const orderData = {
      customer: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone
      },
      shipping: {
        address: form.address,
        city: form.city,
        postcode: form.postcode,
        method: {
          id: selectedShippingMethod.value.id,
          title: selectedShippingMethod.value.title,
          cost: shippingCost.value
        }
      },
      payment: {
        method: form.paymentMethod
      },
      items: cartStore.items.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        variants: item.variants
      })),
      notes: form.notes,
      total: totalWithShipping.value
    };
    
    // Add InPost locker data if applicable
    if ((selectedShippingMethod.value.method_id === 'inpost' || selectedShippingMethod.value.method_id === 'inpost_paczkomaty') && selectedLocker.value) {
      orderData.shipping.inpost = {
        locker: selectedLocker.value.name,
        address: selectedLocker.value.address.line1,
        locationDescription: selectedLocker.value.location_description
      };
    }
    
    // Send order to API
    const response = await $fetch(`${config.public.wordpressUrl}/mkt/v1/orders`, {
      method: 'POST',
      body: orderData
    });
    
    console.log('Order placed successfully:', response);
    
    // Clear cart and redirect to success page
    cartStore.clearCart();
    navigateTo('/zamowienie-zlozone');
  } catch (error) {
    console.error('Error placing order:', error);
    alert('Wystąpił błąd podczas składania zamówienia. Spróbuj ponownie.');
  } finally {
    isSubmitting.value = false;
  }
};

// Check if cart is empty on page load
onMounted(() => {
  if (process.client && cartItems.value.length === 0) {
    router.push('/sklep');
  }
});
</script>

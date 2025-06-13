<template>
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
        Wybierz metodę płatności
      </h2>
      
      <!-- Podsumowanie zamówienia -->
      <div class="bg-gray-50 rounded-lg p-4 mb-6">
        <div class="flex justify-between items-center mb-2">
          <span class="text-gray-600">Produkty:</span>
          <span class="font-semibold">{{ formatPrice(orderSummary.subtotal) }}</span>
        </div>
        <div class="flex justify-between items-center mb-2">
          <span class="text-gray-600">Dostawa:</span>
          <span class="font-semibold">{{ formatPrice(orderSummary.shipping) }}</span>
        </div>
        <div class="border-t pt-2 flex justify-between items-center">
          <span class="text-lg font-bold">Łącznie:</span>
          <span class="text-lg font-bold text-blue-600">{{ formatPrice(orderSummary.total) }}</span>
        </div>
      </div>
  
      <!-- Metody płatności -->
      <div class="space-y-3 mb-6">
        <div 
          v-for="method in paymentMethods" 
          :key="method.id"
          class="relative"
        >
          <input 
            :id="method.id"
            v-model="selectedPayment"
            :value="method.id"
            type="radio"
            name="payment-method"
            class="sr-only peer"
          />
          <label 
            :for="method.id"
            class="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer transition-all duration-200 hover:border-blue-300 peer-checked:border-blue-500 peer-checked:bg-blue-50"
          >
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center space-x-3">
                <!-- Render SVG icons directly instead of using component -->
                <div v-if="method.icon === 'CreditCard'" class="w-6 h-6 text-gray-600">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                </div>
                <div v-else-if="method.icon === 'Smartphone'" class="w-6 h-6 text-gray-600">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                </div>
                <div v-else-if="method.icon === 'Building'" class="w-6 h-8 flex items-center">
                  <svg version="1.1" id="Warstwa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 1920 672" enable-background="new 0 0 1920 672" xml:space="preserve"><g><polygon fill-rule="evenodd" clip-rule="evenodd" fill="#D13239" points="409.6,384.9 566,384.7 560.3,420.3 429.5,545.2 539.3,545 532.9,583.4 371.2,583.5 378,543.8 503.4,423.7 403.3,423.7 409.6,384.9 	"/><path fill-rule="evenodd" clip-rule="evenodd" fill="#D13239" d="M238.5,324c-3.4-3.6-8.3-6.4-13.7-8.6c-5.7-2.2-12-3.8-18.2-4.9
		c-7.8-1.4-15.4-2-20.8-2.2c-5-0.2-8.2-0.2-8.2-0.2l-68.4,0l-50.9,0L12.7,583.5l42.6,0l16.8-102l82.6,0.4c0,0,32.2,1.3,55-10.8
		c22.8-12.1,28.9-39.6,28.9-39.6s2.5-10.2,4.6-22.6c2.3-13.7,4.6-30.1,5.8-38.8c0.5-3.8,0.8-6.2,0.8-6.2s0.6-2.8,0.6-7.2
		c0.1-6.1-0.8-15.3-5.6-24.1C243.1,329.5,241.1,326.7,238.5,324z M205.7,372.6c0,0.5-3.8,22.6-8.8,48.8c-1.9,10-9.6,15.4-18.4,17.3
		c-14.6,3.1-30.3,2.5-30.3,2.5l-69-0.2l15.2-91.5l62.5,0.2c0,0,4.2-0.1,10.1,0c6.7,0.1,15.6,0.4,22.9,1.4c6.3,0.8,11.3,2.1,12.9,4.1
		c2.1,2.6,2.9,6,3.2,9C206.4,368.6,205.7,372.3,205.7,372.6z"/>
	<polygon fill-rule="evenodd" clip-rule="evenodd" fill="#D13239" points="778.1,308.1 819.1,308.1 773.2,583.5 732.1,583.4 
		778.1,308.1 	"/>
	<polygon fill-rule="evenodd" clip-rule="evenodd" fill="#D13239" points="996.9,384.9 1036.2,384.8 1050.1,524.6 1110.6,384.6 
		1159.1,384.7 1173.4,525.1 1233.8,384.8 1274.6,384.8 1188,583.3 1139.6,583.3 1125.6,444.3 1064.5,583.3 1016.9,583.5 
		996.9,384.9 	"/>
	<g>
		<path fill="#D13239" d="M702.4,386.5c-11.5-3.7-31.4-4.5-48.3-4.3c-16.3,0.2-23.8,1-29.9,2.3c0,0-29,4.2-45.5,24.6
			c-16.5,20.4-21.4,65-21.4,65s-9.8,49.3-6.9,65.8c2.9,16.4,8,31.7,26.6,38.8c18.6,7.2,34.4,6.8,34.4,6.8s33.2,2.6,58.2-3.3
			c25-5.9,38.2-23.5,38.2-23.5s5.9-7.6,10.1-16.6c4.2-9,5.5-15.3,5.7-16.1l2.6-10.7l-42.5,0.1c0,0-2.3,28.1-25.3,30.7
			c-22.9,2.6-35.2,1.6-39.7,1.4c-4.4-0.2-29,0.9-27-19.7c0-0.3,0-0.7,0.1-1.3c1.1-23.4,3.7-29.5,3.7-29.5l133.5-0.4l5.7-33
			C741.3,426.2,736.6,397.7,702.4,386.5z M693.5,458.9l-91.5-0.1l3.6-14.5c0,0,3.2-11.4,9.5-16.2c6.4-4.8,14.5-5.7,22.1-6.4
			c7.6-0.7,27.9-2.2,44.4,1.2c5.5,1.1,10.7,4.2,12.1,8.8C696.9,442.5,693.5,458.9,693.5,458.9z"/>
		<path fill="#D13239" d="M592,526.9c0,0.3-0.1,0.6-0.1,0.9C591.8,529.4,592,526.8,592,526.9z"/>
	</g>
	<g><path fill="#D13239" d="M843.8,527c0,0.3-0.1,0.6-0.1,0.9C843.7,529.5,843.8,526.9,843.8,527z"/><path fill="#D13239" d="M954.3,386.6c-11.5-3.7-31.4-4.5-48.3-4.3c-16.3,0.2-23.8,1-29.9,2.3c0,0-29,4.2-45.5,24.6
			c-16.5,20.4-21.4,65-21.4,65s-9.8,49.3-6.9,65.8c2.9,16.4,8,31.7,26.6,38.8c18.6,7.2,34.4,6.8,34.4,6.8s33.2,2.6,58.2-3.3
			c25-5.9,38.2-23.5,38.2-23.5s5.9-7.6,10.1-16.6c4.2-9,5.5-15.3,5.7-16.1l2.6-10.7l-42.5,0.1c0,0-2.3,28.1-25.3,30.7
			c-22.9,2.6-35.2,1.6-39.7,1.5c-4.4-0.2-29,0.8-27-19.7c0-0.3,0-0.7,0.1-1.3c1.1-23.4,3.7-29.5,3.7-29.5l133.5-0.4l5.7-33
			C993.2,426.3,988.5,397.7,954.3,386.6z M945,458.9l-91.5-0.1l3.6-14.5c0,0,3.2-11.4,9.5-16.2c6.3-4.8,14.5-5.7,22.1-6.4
			c7.6-0.7,27.9-2.2,44.4,1.2c5.5,1.1,10.7,4.2,12.1,8.8C948.4,442.4,945,458.9,945,458.9z"/></g><path fill-rule="evenodd" clip-rule="evenodd" fill="#D13239" d="M1321.8,384.9l26.3,145.2l74.3-145.3l41.8,0.4l-107.1,207.5
		c0,0-19.4,37.6-31.4,47.1c-12,9.5-19.4,13.8-29.2,14.8c-9.8,1-13.8,1.7-23.2,0l-10-1.8l6.2-37.1c0,0,16.6,3.1,26.4-0.8
		c9.9-3.9,17.8-20.7,17.8-20.7l5-8.4l-38.7-201L1321.8,384.9L1321.8,384.9z"/><path fill-rule="evenodd" clip-rule="evenodd" fill="#B3B2B1" d="M1479.4,404.6l43.1,0.1l2.6-16.7c0,0,4.6-30.2,14.9-36
		c3.3-1.9,8.6-3.6,14.7-4.7c11.3-2,25.6-2.2,37.3-1.8c17.9,0.6,24.7,0.8,42.9,2.9c18.2,2.1,13.6,19.7,13.6,19.7l-3.6,26.3
		c0,0-1.6,11.8-5.8,19.1c-3.7,6.5-13.9,10.9-19.8,12.8c-14.2,4.6-62.8,17-62.8,17l-38.2,11c0,0-23.5,6.8-36.6,21.3
		c-13.2,14.6-18.4,31.1-20.2,39.7c-1.8,8.6-11.9,68.1-11.9,68.1l206.2,0.1l6.9-41.2l-163.1,0.2l2.9-16.8c0,0,1.9-17.3,8.9-23
		c2.2-1.8,3.3-4.2,16.3-8.8c7.8-2.8,34.4-9.9,34.4-9.9l61.5-16.8c0,0,33.6-8.6,46.8-27c13.2-18.3,18.3-53.4,18.3-53.4
		s3.6-34.1,0.8-44.8c-2.7-10.7-12.8-23.5-25.1-29c-12.3-5.5-25.1-8.7-62.2-8.2c-37.1,0.5-55.5,2.2-74.3,9.2
		c-18.8,6.9-29.7,19.5-36.6,37.3C1483.8,368.2,1479.4,404.6,1479.4,404.6L1479.4,404.6z"/><path fill-rule="evenodd" clip-rule="evenodd" fill="#B3B2B1" d="M1867.6,481.2l28.9-173.2l-51.2,0l-159.4,171.2l-7.2,43.4l139.4,0
		l-10.2,60.8l42.8,0.1l10.1-60.9l39.5,0.1l7.1-41.5L1867.6,481.2z M1825,481.3l-90.1-0.1l109.7-116.9L1825,481.3z"/><path fill-rule="evenodd" clip-rule="evenodd" fill="#B3B2B1" d="M328.9,330.8h131.3c0,0,29.4-23.8,50.3-39.1
		c20.9-15.3,58.9-39.4,58.9-39.4l-74.2-34.7c0,0-62.7,38.8-89.3,57.1C380.1,291.6,328.9,330.8,328.9,330.8L328.9,330.8z"/><path fill-rule="evenodd" clip-rule="evenodd" fill="#B3B2B1" d="M611.1,227.8l-60.9-41c0,0,55.1-31.3,128.4-60.5
		c73.2-29.2,112.3-41.4,112.3-41.4l12.4,58.1c0,0-70.5,23.6-110.9,42.7C650.6,203.5,611.1,227.8,611.1,227.8L611.1,227.8z"/><path fill-rule="evenodd" clip-rule="evenodd" fill="#B3B2B1" d="M848.3,130.3l-10.6-59.5c0,0,75.2-20,144-32.8
		c68.9-12.8,160.2-18.9,160.2-18.9l-30.2,91.9c0,0-80.3-11-155.7-0.7C897.3,117.3,848.3,130.3,848.3,130.3L848.3,130.3z"/><path fill-rule="evenodd" clip-rule="evenodd" fill="#B3B2B1" d="M1159.5,118.8l50.8-102.1c0,0,111.3-2.2,207.3,12.7
		c96,14.8,183.8,37.6,181.9,38.6l-243.4,127.3c0,0-56.9-36-127.5-58.1C1188.6,125.4,1159.5,118.8,1159.5,118.8L1159.5,118.8z"/><path fill-rule="evenodd" clip-rule="evenodd" fill="#B3B2B1" d="M1399.7,223l53.5,40.6h439.7c0,0-0.9-14.2-12.6-34.4
		c-7.3-12.6-20.6-26-34.5-39.9c-5.1-5-25.3-20.8-40.5-30.7c-38.8-25.2-60.5-34.9-100.8-53.2L1399.7,223L1399.7,223z"/><path fill="#D13239" d="M357.4,384.7c-16.5,0-32.1,6.5-45.4,13.8l2.3-13.8h-43.7l-35,197.7h43.8l19.4-109.5
		c4-22.2,20.6-49.7,53-49.7l22.6-0.1l6.8-38.4H357.4z"/></g></svg>

                </div>
                <div v-else-if="method.icon === 'Apple'" class="w-6 h-6 text-gray-600">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                </div>
                <div v-else-if="method.icon === 'Chrome'" class="w-6 h-6 text-gray-600">
                  <svg class="fill-gray-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path></svg>
                </div>
                <div>
                  <div class="font-medium text-gray-900">{{ method.name }}</div>
                  <div class="text-sm text-gray-500">{{ method.description }}</div>
                </div>
              </div>
              <div class="w-4 h-4 border-2 border-gray-300 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-500 relative">
                <div class="absolute inset-0.5 bg-white rounded-full peer-checked:bg-blue-500"></div>
              </div>
            </div>
          </label>
        </div>
      </div>
  
      <!-- Szczegóły karty (gdy wybrana karta) -->
      <div v-if="selectedPayment === 'card'" class="mb-6 p-4 border border-gray-200 rounded-lg">
        <div id="card-element" class="p-3 border border-gray-300 rounded-lg bg-white">
          <!-- Stripe Card Element będzie tutaj -->
        </div>
        <div v-if="cardError" class="text-red-600 text-sm mt-2">{{ cardError }}</div>
      </div>
  
      <!-- Przycisk płatności -->
      <button
        @click="processPayment"
        :disabled="!selectedPayment || isProcessing"
        class="w-full bg-primary-600 hover:bg-primary-700 ease-in-out disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        <svg v-if="isProcessing" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span v-if="isProcessing">Przetwarzanie...</span>
        <span v-else>Zapłać {{ formatPrice(orderSummary.total) }}</span>
      </button>
  
      <!-- Bezpieczeństwo -->
      <div class="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
        </svg>
        <span>Płatność zabezpieczona przez Stripe</span>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, nextTick, defineComponent } from 'vue'
  
  // Props
  const props = defineProps({
    orderId: {
      type: [String, Number],
      required: true
    },
    orderSummary: {
      type: Object,
      default: () => ({
        subtotal: 0,
        shipping: 0,
        total: 0
      })
    }
  })
  
  // Emits
  const emit = defineEmits(['payment-success', 'payment-error'])
  
  // Reactive data
  const selectedPayment = ref('')
  const isProcessing = ref(false)
  const cardError = ref('')
  const stripe = ref(null)
  const cardElement = ref(null)
  
  // Metody płatności
  const paymentMethods = ref([
    {
      id: 'card',
      name: 'Karta płatnicza',
      description: 'Visa, Mastercard, Maestro',
      icon: 'CreditCard'
    },
    {
      id: 'blik',
      name: 'BLIK',
      description: 'Szybka płatność mobilna',
      icon: 'Smartphone'
    },
    {
      id: 'p24',
      name: 'Przelewy24',
      description: 'Przelewy bankowe online',
      icon: 'Building'
    },
    {
      id: 'apple_pay',
      name: 'Apple Pay',
      description: 'Płać za pomocą Touch ID lub Face ID',
      icon: 'Apple'
    },
    {
      id: 'google_pay',
      name: 'Google Pay',
      description: 'Szybka płatność Google',
      icon: 'Chrome'
    }
  ])
  
  // Stripe configuration
  const stripePublicKey = useRuntimeConfig().public.stripePublicKey || 'pk_test_...'
  
  // Inicjalizacja Stripe
  onMounted(async () => {
    await loadStripe()
  })
  
  const loadStripe = async () => {
    try {
      if (!process.client) return
      
      // Ładowanie Stripe.js
      if (!window.Stripe) {
        const script = document.createElement('script')
        script.src = 'https://js.stripe.com/v3/'
        script.async = true
        document.head.appendChild(script)
        
        await new Promise((resolve) => {
          script.onload = resolve
        })
      }
      
      stripe.value = window.Stripe(stripePublicKey)
      
      // Inicjalizacja elementu karty po wybraniu płatności kartą
      watch(selectedPayment, async (newValue) => {
        if (newValue === 'card') {
          await nextTick()
          setupCardElement()
        }
      })
      
    } catch (error) {
      console.error('Błąd ładowania Stripe:', error)
    }
  }
  
  const setupCardElement = () => {
    if (!stripe.value) return
    
    const elements = stripe.value.elements()
    cardElement.value = elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
      },
    })
    
    cardElement.value.mount('#card-element')
    
    cardElement.value.on('change', (event) => {
      cardError.value = event.error ? event.error.message : ''
    })
  }
  
  // Formatowanie ceny
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN'
    }).format(price / 100) // Zakładamy że cena jest w groszach
  }
  
  // Przetwarzanie płatności
  const processPayment = async () => {
    if (!selectedPayment.value || isProcessing.value) return
    
    isProcessing.value = true
    cardError.value = ''
    
    try {
      switch (selectedPayment.value) {
        case 'card':
          await processCardPayment()
          break
        case 'blik':
          await processBlikPayment()
          break
        case 'p24':
          await processP24Payment()
          break
        case 'apple_pay':
          await processApplePayPayment()
          break
        case 'google_pay':
          await processGooglePayPayment()
          break
        default:
          throw new Error('Nieznana metoda płatności')
      }
    } catch (error) {
      console.error('Błąd płatności:', error)
      emit('payment-error', error.message)
    } finally {
      isProcessing.value = false
    }
  }
  
  // Płatność kartą
  const processCardPayment = async () => {
    if (!stripe.value || !cardElement.value) {
      throw new Error('Stripe nie został zainicjalizowany')
    }
    
    // Tworzenie PaymentIntent na backendzie
    const { data: paymentIntent } = await $fetch('/api/payments/create-intent', {
      method: 'POST',
      body: {
        orderId: props.orderId,
        amount: props.orderSummary.total,
        paymentMethod: 'card'
      }
    })
    
    // Potwierdzenie płatności
    const { error, paymentIntent: confirmedPayment } = await stripe.value.confirmCardPayment(
      paymentIntent.client_secret,
      {
        payment_method: {
          card: cardElement.value,
          billing_details: {
            name: 'Klient', // Można dodać dane z formularza
          },
        }
      }
    )
    
    if (error) {
      throw new Error(error.message)
    }
    
    if (confirmedPayment.status === 'succeeded') {
      emit('payment-success', confirmedPayment)
    }
  }
  
  // Płatność BLIK
  const processBlikPayment = async () => {
    // Tworzenie PaymentIntent dla BLIK
    const { data: paymentIntent } = await $fetch('/api/payments/create-intent', {
      method: 'POST',
      body: {
        orderId: props.orderId,
        amount: props.orderSummary.total,
        paymentMethod: 'blik'
      }
    })
    
    // Przekierowanie do Stripe Checkout dla BLIK
    const { error } = await stripe.value.redirectToCheckout({
      sessionId: paymentIntent.session_id
    })
    
    if (error) {
      throw new Error(error.message)
    }
  }
  
  // Płatność Przelewy24
  const processP24Payment = async () => {
    const { data: paymentIntent } = await $fetch('/api/payments/create-intent', {
      method: 'POST',
      body: {
        orderId: props.orderId,
        amount: props.orderSummary.total,
        paymentMethod: 'p24'
      }
    })
    
    const { error } = await stripe.value.confirmP24Payment(
      paymentIntent.client_secret,
      {
        payment_method: {
          p24: {
            bank: 'alior_bank', // Można pozwolić użytkownikowi wybrać bank
          },
          billing_details: {
            email: 'customer@example.com', // Email klienta
          },
        },
        return_url: `${window.location.origin}/payment/success`,
      }
    )
    
    if (error) {
      throw new Error(error.message)
    }
  }
  
  // Apple Pay
  const processApplePayPayment = async () => {
    if (!stripe.value.paymentRequest) {
      throw new Error('Apple Pay nie jest dostępne')
    }
    
    const paymentRequest = stripe.value.paymentRequest({
      country: 'PL',
      currency: 'pln',
      total: {
        label: 'Suma zamówienia',
        amount: props.orderSummary.total,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    })
    
    const elements = stripe.value.elements()
    const prButton = elements.create('paymentRequestButton', {
      paymentRequest,
    })
    
    // Sprawdzenie dostępności
    const result = await paymentRequest.canMakePayment()
    if (!result) {
      throw new Error('Apple Pay nie jest dostępne na tym urządzeniu')
    }
    
    paymentRequest.on('paymentmethod', async (ev) => {
      // Tutaj można dodać logikę przetwarzania Apple Pay
      ev.complete('success')
      emit('payment-success', ev.paymentMethod)
    })
  }
  
  // Google Pay
  const processGooglePayPayment = async () => {
    // Podobna implementacja jak Apple Pay
    throw new Error('Google Pay - implementacja w toku')
  }
  
  // We don't need to define icon components anymore as we're using inline SVGs
  </script>
<template>
  <div class="container mx-auto px-4 py-16 text-center">
    <div class="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <div class="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h1 class="text-3xl font-bold mb-4">Dziękujemy za złożenie zamówienia!</h1>
      
      <p class="text-gray-600 mb-6">
        Twoje zamówienie zostało przyjęte do realizacji. Na podany adres email wysłaliśmy potwierdzenie z szczegółami zamówienia.
      </p>
      
      <div class="bg-gray-50 p-4 rounded-md mb-6">
        <h2 class="font-medium text-gray-900 mb-2">Numer zamówienia: #{{ orderNumber }}</h2>
        <p class="text-gray-600">
          Prosimy o zapisanie tego numeru. Będzie potrzebny w przypadku kontaktu z obsługą klienta.
        </p>
      </div>
      
      <p class="text-gray-600 mb-8">
        Jeśli masz jakiekolwiek pytania dotyczące zamówienia, skontaktuj się z nami pod adresem 
        <a href="mailto:kontakt@yescandles.pl" class="text-primary-600 hover:underline">kontakt@yescandles.pl</a> 
        lub telefonicznie pod numerem <span class="font-medium">+48 123 456 789</span>.
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink 
          to="/" 
          class="px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition duration-150 ease-in-out"
        >
          Wróć do strony głównej
        </NuxtLink>
        
        <NuxtLink 
          to="/sklep" 
          class="px-6 py-3 bg-white text-primary-600 font-medium rounded-md border border-primary-600 hover:bg-primary-50 transition duration-150 ease-in-out"
        >
          Kontynuuj zakupy
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const orderNumber = ref('');

// Generate a random order number
const generateOrderNumber = () => {
  const timestamp = new Date().getTime().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `YC${timestamp}${random}`;
};

onMounted(() => {
  // Generate order number
  orderNumber.value = generateOrderNumber();
  
  // If user refreshes this page, redirect to home after 5 seconds
  if (process.client) {
    const handleBeforeUnload = () => {
      sessionStorage.setItem('orderCompleted', 'true');
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Check if user is coming directly to this page (e.g., by refreshing)
    const orderCompleted = sessionStorage.getItem('orderCompleted');
    if (orderCompleted) {
      setTimeout(() => {
        router.push('/');
      }, 5000);
    }
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }
});
</script>

<template>
  <div class="container mx-auto px-4 py-12 bg-primary-50">
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden border border-primary-100">
      <div class="px-6 py-8">
        <h1 class="text-2xl font-bold text-center mb-8 text-primary-700">Rejestracja</h1>
        
        <!-- Error Alert -->
        <div v-if="userStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {{ userStore.error }}
        </div>
        
        <!-- Registration Form -->
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-secondary-700 mb-1">Imię</label>
              <input 
                id="firstName" 
                v-model="firstName" 
                type="text" 
                class="w-full px-4 py-2 border border-primary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Jan"
              >
            </div>
            
            <div>
              <label for="lastName" class="block text-sm font-medium text-secondary-700 mb-1">Nazwisko</label>
              <input 
                id="lastName" 
                v-model="lastName" 
                type="text" 
                class="w-full px-4 py-2 border border-primary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Kowalski"
              >
            </div>
          </div>
          
          <div>
            <label for="username" class="block text-sm font-medium text-secondary-700 mb-1">Nazwa użytkownika</label>
            <input 
              id="username" 
              v-model="username" 
              type="text" 
              required 
              class="w-full px-4 py-2 border border-primary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="jankowalski"
            >
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-secondary-700 mb-1">Email</label>
            <input 
              id="email" 
              v-model="email" 
              type="email" 
              required 
              class="w-full px-4 py-2 border border-primary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="jan.kowalski@example.com"
            >
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-secondary-700 mb-1">Hasło</label>
            <input 
              id="password" 
              v-model="password" 
              type="password" 
              required 
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="••••••••"
            >
            <p class="mt-1 text-xs text-secondary-500">Hasło musi zawierać minimum 8 znaków, w tym dużą literę, cyfrę i znak specjalny.</p>
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-secondary-700 mb-1">Potwierdź hasło</label>
            <input 
              id="confirmPassword" 
              v-model="confirmPassword" 
              type="password" 
              required 
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="••••••••"
            >
          </div>
          
          <div class="flex items-center">
            <input id="terms" type="checkbox" v-model="acceptTerms" required class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-primary-300 rounded">
            <label for="terms" class="ml-2 block text-sm text-secondary-700">
              Akceptuję <NuxtLink to="/regulamin" class="text-primary-600 hover:text-primary-500">regulamin</NuxtLink> i <NuxtLink to="/polityka-prywatnosci" class="text-primary-600 hover:text-primary-500">politykę prywatności</NuxtLink>
            </label>
          </div>
          
          <button 
            type="submit" 
            class="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md transition duration-150 ease-in-out shadow-sm"
            :disabled="userStore.isLoading || !isFormValid"
          >
            <span v-if="userStore.isLoading">Rejestracja...</span>
            <span v-else>Zarejestruj się</span>
          </button>
        </form>
        
        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-primary-200"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-secondary-500">Lub</span>
          </div>
        </div>
        
        <!-- Google Login Button -->
        <div id="googleLoginButton" class="flex justify-center">
          <!-- Google Sign-In button will be rendered here -->
        </div>
        
        <!-- Login Link -->
        <div class="text-center mt-6">
          <p class="text-sm text-secondary-600">
            Masz już konto? 
            <NuxtLink to="/konto/logowanie" class="text-primary-600 hover:text-primary-500">
              Zaloguj się
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '~/stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
const config = useRuntimeConfig();

// Form data
const firstName = ref('');
const lastName = ref('');
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const acceptTerms = ref(false);

// Form validation
const isFormValid = computed(() => {
  return (
    username.value.length > 0 &&
    email.value.length > 0 &&
    password.value.length >= 8 &&
    password.value === confirmPassword.value &&
    acceptTerms.value
  );
});

// Handle form submission
const handleRegister = async () => {
  if (!isFormValid.value) {
    return;
  }
  
  const success = await userStore.register({
    username: username.value,
    email: email.value,
    password: password.value,
    firstName: firstName.value,
    lastName: lastName.value
  });
  
  if (success) {
    // Redirect to account page after successful registration
    router.push('/konto');
  }
};

// Initialize Google Sign-In
onMounted(() => {
  if (process.client && window.google && config.googleClientId) {
    window.google.accounts.id.initialize({
      client_id: config.googleClientId,
      callback: handleGoogleLogin
    });
    
    window.google.accounts.id.renderButton(
      document.getElementById('googleLoginButton'),
      { 
        theme: 'outline', 
        size: 'large',
        text: 'signup_with',
        width: 280
      }
    );
  }
  
  // Check if user is already logged in
  userStore.checkAuth();
  
  // If already logged in, redirect to account page
  if (userStore.loggedIn) {
    router.push('/konto');
  }
});

// Handle Google Sign-In response
const handleGoogleLogin = async (response) => {
  if (response.credential) {
    const success = await userStore.loginWithGoogle(response.credential);
    
    if (success) {
      // Redirect to account page after successful login
      router.push('/konto');
    }
  }
};
</script>

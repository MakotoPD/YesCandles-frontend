<template>
  <div class="container mx-auto px-4 py-12 bg-primary-50">
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden border border-primary-100">
      <div class="px-6 py-8">
        <h1 class="text-2xl font-bold text-center mb-8 text-primary-700">Logowanie</h1>
        
        <!-- Error Alert -->
        <div v-if="userStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {{ userStore.error }}
        </div>
        
        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-secondary-700 mb-1">Nazwa użytkownika / E-mail</label>
            <input 
              id="username" 
              v-model="username" 
              type="text" 
              required 
              class="w-full px-4 py-2 border border-primary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Yescandle"
            >
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Hasło</label>
            <input 
              id="password" 
              v-model="password" 
              type="password" 
              required 
              class="w-full px-4 py-2 border border-primary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="••••••••"
            >
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember" type="checkbox" v-model="rememberMe" class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded">
              <label for="remember" class="ml-2 block text-sm text-secondary-700">Zapamiętaj mnie</label>
            </div>
            <div>
              <NuxtLink to="/konto/reset-hasla" class="text-sm text-primary-600 hover:text-primary-500">
                Zapomniałeś hasła?
              </NuxtLink>
            </div>
          </div>
          
          <button 
            type="submit" 
            class="w-full cursor-pointer bg-primary-600 hover:bg-primary-700 text-black py-2 px-4 rounded-md transition duration-150 ease-in-out shadow-sm"
            :disabled="userStore.isLoading"
          >
            <span v-if="userStore.isLoading">Logowanie...</span>
            <span v-else>Zaloguj się</span>
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
        
        <!-- Register Link -->
        <div class="text-center mt-6">
          <p class="text-sm text-secondary-600">
            Nie masz jeszcze konta? 
            <NuxtLink to="/konto/rejestracja" class="text-primary-600 hover:text-primary-500">
              Zarejestruj się
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '~/stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
const config = useRuntimeConfig();

// Form data
const username = ref('');
const password = ref('');
const rememberMe = ref(false);

// Handle form submission
const handleLogin = async () => {
  const success = await userStore.login({
    username: username.value,
    password: password.value
  });
  
  if (success) {
    // Redirect to account page after successful login
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
        text: 'continue_with',
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

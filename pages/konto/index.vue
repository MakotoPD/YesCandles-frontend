<template>
  <div class="container mx-auto px-4 py-12 bg-primary-50">
    <!-- Loading state -->
    <div v-if="userStore.isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
    
    <!-- Not logged in state -->
    <div v-else-if="!userStore.loggedIn" class="max-w-md mx-auto text-center">
      <h1 class="text-2xl font-bold mb-4">Dostęp zabroniony</h1>
      <p class="mb-6">Musisz się zalogować, aby zobaczyć tę stronę.</p>
      <NuxtLink 
        to="/konto/logowanie" 
        class="inline-block bg-primary-600 hover:bg-primary-700 text-white py-2 px-6 rounded-md transition duration-150 ease-in-out"
      >
        Zaloguj się
      </NuxtLink>
    </div>
    
    <!-- Logged in state -->
    <div v-else>
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-2xl font-bold">Moje konto</h1>
          <button 
            @click="userStore.logout()" 
            class="bg-secondary-200 hover:bg-secondary-300 text-secondary-800 py-2 px-4 rounded-md transition duration-150 ease-in-out"
          >
            Wyloguj się
          </button>
        </div>
        
        <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8 border border-primary-100">
          <div class="p-6">
            <div class="flex items-center space-x-4">
              <div class="h-16 w-16 rounded-full bg-primary-100 overflow-hidden">
                <img 
                  v-if="userStore.user?.avatar" 
                  :src="userStore.user.avatar" 
                  :alt="userStore.user?.displayName"
                  class="h-full w-full object-cover"
                >
                <div v-else class="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600 text-xl font-bold">
                  {{ userInitials }}
                </div>
              </div>
              
              <div>
                <h2 class="text-xl font-semibold">{{ userStore.user?.displayName }}</h2>
                <p class="text-secondary-600">{{ userStore.user?.email }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Account Navigation -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <!-- Sidebar Navigation -->
          <div class="md:col-span-1">
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              <nav class="flex flex-col">
                <button 
                  v-for="(tab, index) in tabs" 
                  :key="index"
                  @click="activeTab = tab.id"
                  :class="[
                    'px-4 py-3 text-left transition-colors duration-150 ease-in-out',
                    activeTab === tab.id 
                      ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500' 
                      : 'hover:bg-primary-50'
                  ]"
                >
                  {{ tab.name }}
                </button>
              </nav>
            </div>
          </div>
          
          <!-- Content Area -->
          <div class="md:col-span-3">
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              <!-- Personal Information -->
              <div v-if="activeTab === 'profile'" class="p-6">
                <h3 class="text-lg font-semibold mb-4">Dane osobowe</h3>
                
                <form @submit.prevent="updateProfile" class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label for="firstName" class="block text-sm font-medium text-secondary-700 mb-1">Imię</label>
                      <input 
                        id="firstName" 
                        v-model="profileForm.firstName" 
                        type="text" 
                        class="w-full px-4 py-2 border border-primary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                    </div>
                    
                    <div>
                      <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Nazwisko</label>
                      <input 
                        id="lastName" 
                        v-model="profileForm.lastName" 
                        type="text" 
                        class="w-full px-4 py-2 border border-primary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                    </div>
                  </div>
                  
                  <div>
                    <label for="email" class="block text-sm font-medium text-secondary-700 mb-1">Email</label>
                    <input 
                      id="email" 
                      v-model="profileForm.email" 
                      type="email" 
                      disabled
                      class="w-full px-4 py-2 border border-secondary-200 bg-secondary-50 rounded-md"
                    >
                    <p class="mt-1 text-xs text-secondary-500">Adres email nie może być zmieniony.</p>
                  </div>
                  
                  <div class="pt-4">
                    <button 
                      type="submit" 
                      class="bg-primary-600 hover:bg-primary-700 text-white py-2 px-6 rounded-md transition duration-150 ease-in-out"
                      :disabled="isUpdating"
                    >
                      <span v-if="isUpdating">Aktualizowanie...</span>
                      <span v-else>Zapisz zmiany</span>
                    </button>
                  </div>
                </form>
              </div>
              
              <!-- Orders -->
              <div v-else-if="activeTab === 'orders'" class="p-6">
                <h3 class="text-lg font-semibold mb-4">Moje zamówienia</h3>
                
                <div v-if="orders.length === 0" class="text-center py-8">
                  <p class="text-secondary-500">Nie masz jeszcze żadnych zamówień.</p>
                  <NuxtLink 
                    to="/sklep" 
                    class="inline-block mt-4 text-primary-600 hover:text-primary-700"
                  >
                    Przejdź do sklepu
                  </NuxtLink>
                </div>
                
                <div v-else class="space-y-4">
                  <!-- Orders list would go here -->
                  <p class="text-secondary-600">Lista zamówień zostanie zaimplementowana w przyszłości.</p>
                </div>
              </div>
              
              <!-- Addresses -->
              <div v-else-if="activeTab === 'addresses'" class="p-6">
                <h3 class="text-lg font-semibold mb-4">Moje adresy</h3>
                
                <!-- Addresses would go here -->
                <p class="text-secondary-600">Zarządzanie adresami zostanie zaimplementowane w przyszłości.</p>
              </div>
              
              <!-- Account Security -->
              <div v-else-if="activeTab === 'security'" class="p-6">
                <h3 class="text-lg font-semibold mb-4">Bezpieczeństwo konta</h3>
                
                <form @submit.prevent="changePassword" class="space-y-4">
                  <div>
                    <label for="currentPassword" class="block text-sm font-medium text-secondary-700 mb-1">Obecne hasło</label>
                    <input 
                      id="currentPassword" 
                      v-model="passwordForm.currentPassword" 
                      type="password" 
                      required
                      class="w-full px-4 py-2 border border-primary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                  </div>
                  
                  <div>
                    <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">Nowe hasło</label>
                    <input 
                      id="newPassword" 
                      v-model="passwordForm.newPassword" 
                      type="password" 
                      required
                      class="w-full px-4 py-2 border border-primary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                  </div>
                  
                  <div>
                    <label for="confirmNewPassword" class="block text-sm font-medium text-gray-700 mb-1">Potwierdź nowe hasło</label>
                    <input 
                      id="confirmNewPassword" 
                      v-model="passwordForm.confirmNewPassword" 
                      type="password" 
                      required
                      class="w-full px-4 py-2 border border-primary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                  </div>
                  
                  <div class="pt-4">
                    <button 
                      type="submit" 
                      class="bg-primary-600 hover:bg-primary-700 text-white py-2 px-6 rounded-md transition duration-150 ease-in-out"
                      :disabled="isChangingPassword || !isPasswordFormValid"
                    >
                      <span v-if="isChangingPassword">Aktualizowanie...</span>
                      <span v-else>Zmień hasło</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
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

// Check authentication
onMounted(() => {
  userStore.checkAuth();
});

// Tabs
const tabs = [
  { id: 'profile', name: 'Dane osobowe' },
  { id: 'orders', name: 'Zamówienia' },
  { id: 'addresses', name: 'Adresy' },
  { id: 'security', name: 'Bezpieczeństwo' }
];
const activeTab = ref('profile');

// User initials for avatar placeholder
const userInitials = computed(() => {
  if (!userStore.user) return '';
  
  const firstName = userStore.user.firstName || '';
  const lastName = userStore.user.lastName || '';
  
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
});

// Profile form
const profileForm = ref({
  firstName: '',
  lastName: '',
  email: ''
});

// Initialize profile form with user data
onMounted(() => {
  if (userStore.user) {
    profileForm.value = {
      firstName: userStore.user.firstName || '',
      lastName: userStore.user.lastName || '',
      email: userStore.user.email || ''
    };
  }
});

// Update profile
const isUpdating = ref(false);
const updateProfile = async () => {
  isUpdating.value = true;
  
  // This would call an API to update the user profile
  // For now, we'll just simulate a successful update
  setTimeout(() => {
    // Update local user data
    if (userStore.user) {
      userStore.user.firstName = profileForm.value.firstName;
      userStore.user.lastName = profileForm.value.lastName;
    }
    
    isUpdating.value = false;
  }, 1000);
};

// Password form
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
});

// Password form validation
const isPasswordFormValid = computed(() => {
  return (
    passwordForm.value.currentPassword.length > 0 &&
    passwordForm.value.newPassword.length >= 8 &&
    passwordForm.value.newPassword === passwordForm.value.confirmNewPassword
  );
});

// Change password
const isChangingPassword = ref(false);
const changePassword = async () => {
  if (!isPasswordFormValid.value) return;
  
  isChangingPassword.value = true;
  
  // This would call an API to change the password
  // For now, we'll just simulate a successful update
  setTimeout(() => {
    // Reset form
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    };
    
    isChangingPassword.value = false;
  }, 1000);
};

// Orders (placeholder)
const orders = ref([]);
</script>

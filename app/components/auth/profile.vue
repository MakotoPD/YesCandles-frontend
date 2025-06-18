<template>
    <div class="max-w-6xl mx-auto p-6 min-h-screen">
      <!-- Header -->
      <div class="mb-8 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full mb-4">
          <UIcon name="i-heroicons-user-circle" class="w-36 h-36 text-white" size="36"/>
        </div>
        <h1 class="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
          Mój Profil
        </h1>
        <p class="text-gray-600 text-lg">Zarządzaj swoimi danymi osobowymi i preferencjami</p>
      </div>
  
      <!-- Loading State -->
      <div v-if="pending" class="flex flex-col items-center justify-center py-20">
        <div class="relative">
          <div class="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
          <div class="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-rose-400 rounded-full animate-spin animate-reverse"></div>
        </div>
        <p class="mt-4 text-gray-600">Ładowanie danych...</p>
      </div>
  
      <!-- Error State -->
      <UAlert
        v-else-if="error"
        icon="i-heroicons-exclamation-triangle"
        color="red"
        variant="soft"
        :title="'Błąd ładowania danych'"
        :description="error.toString()"
        class="mb-6"
      />
  
      <!-- Not logged in -->
      <div v-else-if="!customer" class="text-center py-20">
        <div class="mx-auto w-24 h-24 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mb-6">
          <UIcon name="i-heroicons-user-circle" class="w-12 h-12 text-pink-400" />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Nie jesteś zalogowany</h3>
        <p class="text-gray-600 mb-8">Zaloguj się, aby zarządzać swoim profilem</p>
        <UButton
          to="/login"
          color="pink"
          size="lg"
          icon="i-heroicons-arrow-right-on-rectangle"
          class="shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Zaloguj się
        </UButton>
      </div>
  
      <!-- Customer Profile -->
      <div v-else class="space-y-6">
        <!-- Success Message -->
        <UAlert
          v-if="showSuccessMessage"
          icon="i-heroicons-check-circle"
          color="green"
          variant="soft"
          title="Sukces!"
          description="Dane zostały pomyślnie zaktualizowane!"
          class="animate-fade-in"
        />
        <!-- Profile Card -->
        <UCard class="overflow-hidden bg-white/80 backdrop-blur-sm shadow-xl border-0 ring-1 ring-pink-100">
          <template #header>
            <div class="flex items-center justify-between p-2">
              <div class="flex items-center space-x-4">
                <div class="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center">
                  <span class="text-white text-xl font-bold">
                    {{ customer.first_name?.[0] }}{{ customer.last_name?.[0] }}
                  </span>
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-900">
                    {{ customer.first_name }} {{ customer.last_name }}
                  </h2>
                  <p class="text-gray-600">{{ customer.email }}</p>
                </div>
              </div>
              <UButton
                color="red"
                variant="soft"
                icon="i-heroicons-arrow-right-on-rectangle"
                @click="handleLogout"
              >
                Wyloguj się
              </UButton>
            </div>
          </template>
  
          <!-- Tabs -->
          <UTabs :items="tabs" class="w-full" v-model="selectedTab">
            <!-- Personal Info Tab -->
            <template #personal-info="{ item }">
              <div class="space-y-6 p-6">
                <div class="flex items-center space-x-3 mb-6">
                  <UIcon name="i-heroicons-user" class="w-6 h-6 text-pink-600" />
                  <h3 class="text-xl font-semibold text-gray-900">Dane osobowe</h3>
                </div>
  
                <UForm :state="profileForm" @submit="handleUpdateProfile" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <UFormField label="Imię" :error="profileErrors.first_name">
                                <UInput
                                    v-model="profileForm.first_name"
                                    icon="i-heroicons-user"
                                    placeholder="Wprowadź imię"
                                    color="pink"
                                    class="w-full"
                                    :error="!!profileErrors.first_name"
                                />
                            </UFormField>
    
                            <UFormField label="Nazwisko" :error="profileErrors.last_name">
                                <UInput
                                    v-model="profileForm.last_name"
                                    icon="i-heroicons-user"
                                    placeholder="Wprowadź nazwisko"
                                    color="pink"
                                    class="w-full"
                                    :error="!!profileErrors.last_name"
                                />
                            </UFormField>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <UFormField label="Email" :error="profileErrors.email">
                                <UInput
                                v-model="profileForm.email"
                                type="email"
                                disabled
                                icon="i-heroicons-envelope"
                                placeholder="Wprowadź email"
                                color="pink"
                                class="w-full"
                                :error="!!profileErrors.email"
                                />
                            </UFormField>
                            <UFormField label="Telefon" :error="profileErrors.phone">
                                <UInput
                                v-model="profileForm.phone"
                                type="tel"
                                icon="i-heroicons-phone"
                                placeholder="Wprowadź numer telefonu"
                                color="pink"
                                class="w-full"
                                :error="!!profileErrors.phone"
                                />
                            </UFormField>
                    </div>
                        <UFormField label="Data urodzenia" :error="profileErrors.metadata.date_of_birth">
                            <UInput
                            v-model="profileForm.metadata.date_of_birth"
                            type="date"
                            icon="i-heroicons-calendar-days"
                            color="pink"
                            class="w-full"
                            :error="!!profileErrors.metadata.date_of_birth"
                            />
                        </UFormField>
                    <div class="flex justify-end mt-4">
                        <UButton
                            type="submit"
                            color="pink"
                            size="lg"
                            :loading="isUpdating"
                            :disabled="isUpdating"
                            icon="i-heroicons-check"
                            class="shadow-lg bg-pink-200 hover:bg-pink-400 transition-all duration-300"
                            >
                            {{ isUpdating ? 'Zapisywanie...' : 'Zapisz zmiany' }}
                        </UButton>
                    </div>
                </UForm>
              </div>
            </template>
  
            <!-- Delivery Address Tab -->
            <template #delivery-address="{ item }">
              <div class="space-y-6 p-6">
                <div class="flex items-center justify-between mb-6">
                  <div class="flex items-center space-x-3">
                    <UIcon name="i-heroicons-map-pin" class="w-6 h-6 text-pink-600" />
                    <h3 class="text-xl font-semibold text-gray-900">Adresy</h3>
                  </div>
                  <UButton
                    v-if="!isAddingNewAddress && !isEditingAddress"
                    color="pink"
                    variant="soft"
                    icon="i-heroicons-plus"
                    @click="startAddingNewAddress"
                  >
                    Dodaj nowy adres
                  </UButton>
                </div>

                <!-- Address List -->
                <div v-if="!isAddingNewAddress && !isEditingAddress && customer && customer.addresses && customer.addresses.length > 0" class="space-y-4">
                  <UCard v-for="address in customer.addresses" :key="address.id" class="border border-gray-200 hover:border-pink-200 transition-all">
                    <div class="flex justify-between">
                      <div>
                        <div class="flex items-center gap-2">
                          <p class="font-medium text-pink-600">{{ address.address_name || 'Adres' }}</p>
                          <div class="flex gap-1">
                            <UBadge v-if="address.is_default_shipping" color="green" size="sm" variant="subtle">
                              <template #leading>
                                <UIcon name="i-heroicons-truck" class="w-3 h-3" />
                              </template>
                              Domyślna dostawa
                            </UBadge>
                            <UBadge v-if="address.is_default_billing" color="blue" size="sm" variant="subtle">
                              <template #leading>
                                <UIcon name="i-heroicons-receipt-percent" class="w-3 h-3" />
                              </template>
                              Domyślny adres rozliczeniowy
                            </UBadge>
                          </div>
                        </div>
                        <p class="font-medium">{{ address.first_name }} {{ address.last_name }}</p>
                        <p class="text-gray-600">{{ address.address_1 }} {{ address.address_2 }}</p>
                        <p class="text-gray-600">{{ address.postal_code }} {{ address.city }}</p>
                        <p class="text-gray-600">{{ address.country_code }}</p>
                        <p v-if="address.phone" class="text-gray-600">Tel: {{ address.phone }}</p>
                      </div>
                      <div class="flex flex-col space-y-2">
                        <UButton
                          color="gray"
                          variant="ghost"
                          icon="i-heroicons-pencil"
                          size="sm"
                          @click="editAddress(address)"
                        >
                          Edytuj
                        </UButton>
                        <UButton
                          color="red"
                          variant="ghost"
                          icon="i-heroicons-trash"
                          size="sm"
                          @click="deleteAddress(address.id)"
                        >
                          Usuń
                        </UButton>
                      </div>
                    </div>
                  </UCard>
                </div>
                
                <div v-else-if="!isAddingNewAddress && !isEditingAddress" class="text-center py-8 bg-gray-50 rounded-lg">
                  <UIcon name="i-heroicons-map" class="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p class="text-gray-600 mb-4">Nie masz jeszcze zapisanych adresów</p>
                  <UButton
                    color="pink"
                    @click="startAddingNewAddress"
                    icon="i-heroicons-plus"
                  >
                    Dodaj adres
                  </UButton>
                </div>

                <UForm v-if="isAddingNewAddress || isEditingAddress" :state="addressForm" @submit="handleSaveAddress" class="space-y-6">
                  <div class="flex items-center justify-between mb-4">
                    <h4 class="text-lg font-medium text-gray-900">
                      {{ isEditingAddress ? 'Edytuj adres' : 'Dodaj nowy adres' }}
                    </h4>
                    <UButton
                      color="gray"
                      variant="ghost"
                      icon="i-heroicons-x-mark"
                      @click="cancelAddressForm"
                    >
                      Anuluj
                    </UButton>
                  </div>
                  
                  <div class="grid grid-cols-1 gap-6">
                        <UFormField label="Nazwa adresu" :error="addressErrors.address_name">
                            <UInput
                                v-model="addressForm.address_name"
                                icon="i-heroicons-tag"
                                placeholder="Np. Dom, Praca, Rodzice"
                                color="pink"
                                :error="!!addressErrors.address_name"
                            />
                        </UFormField>
                  </div>
  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <UFormField label="Imię" :error="addressErrors.first_name">
                            <UInput
                                v-model="addressForm.first_name"
                                icon="i-heroicons-user"
                                placeholder="Imię"
                                color="pink"
                                :error="!!addressErrors.first_name"
                            />
                        </UFormField>
                        
                        <UFormField label="Nazwisko" :error="addressErrors.last_name">
                            <UInput
                                v-model="addressForm.last_name"
                                icon="i-heroicons-user"
                                placeholder="Nazwisko"
                                color="pink"
                                :error="!!addressErrors.last_name"
                            />
                        </UFormField>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <UFormField label="Ulica" :error="addressErrors.address_1">
                            <UInput
                                v-model="addressForm.address_1"
                                icon="i-heroicons-map"
                                placeholder="Nazwa ulicy"
                                color="pink"
                                :error="!!addressErrors.address_1"
                            />
                        </UFormField>
  
                        <UFormField label="Numer domu/mieszkania" :error="addressErrors.address_2">
                            <UInput
                                v-model="addressForm.address_2"
                                icon="i-heroicons-home"
                                placeholder="Numer domu/mieszkania"
                                color="pink"
                                :error="!!addressErrors.address_2"
                            />
                        </UFormField>
                  </div>
  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <UFormField label="Kod pocztowy" :error="addressErrors.postal_code">
                            <UInput
                                v-model="addressForm.postal_code"
                                icon="i-heroicons-hashtag"
                                placeholder="Kod pocztowy"
                                color="pink"
                                :error="!!addressErrors.postal_code"
                            />
                        </UFormField>
  
                        <UFormField label="Miasto" :error="addressErrors.city">
                            <UInput
                                v-model="addressForm.city"
                                icon="i-heroicons-building-office-2"
                                placeholder="Miasto"
                                color="pink"
                                :error="!!addressErrors.city"
                            />
                        </UFormField>
                  </div>
                    
                    <UFormField label="Telefon" :error="addressErrors.phone">
                        <UInput
                            v-model="addressForm.phone"
                            icon="i-heroicons-phone"
                            placeholder="Telefon kontaktowy"
                            color="pink"
                            :error="!!addressErrors.phone"
                        />
                    </UFormField>
  
                    <div class="grid grid-cols-1 gap-4 mt-6 col-span-full">
                        <div class="flex flex-col gap-2">
                            <div class="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    id="default_shipping" 
                                    v-model="addressForm.is_default_shipping"
                                    class="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500"
                                />
                                <label for="default_shipping" class="text-sm font-medium text-gray-700 cursor-pointer">
                                    Ustaw jako domyślny adres dostawy
                                </label>
                            </div>
                            <div class="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    id="default_billing" 
                                    v-model="addressForm.is_default_billing"
                                    class="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500"
                                />
                                <label for="default_billing" class="text-sm font-medium text-gray-700 cursor-pointer">
                                    Ustaw jako domyślny adres rozliczeniowy
                                </label>
                            </div>
                        </div>
                        
                        <div class="flex justify-end">
                            <UButton
                                type="submit"
                                color="pink"
                                :loading="isUpdatingAddress"
                                :disabled="isUpdatingAddress"
                                class="shadow-lg bg-pink-200 hover:bg-pink-400 transition-all duration-300"
                            >
                                {{ isUpdatingAddress ? 'Zapisywanie...' : (isEditingAddress ? 'Aktualizuj adres' : 'Dodaj adres') }}
                            </UButton>
                        </div>
                    </div>
                </UForm>
              </div>
            </template>
            
            <!-- Orders Tab -->
            <template #orders="{ item }">
              <div class="space-y-6 p-6">
                <div class="flex items-center space-x-3 mb-6">
                  <UIcon name="i-heroicons-shopping-bag" class="w-6 h-6 text-pink-600" />
                  <h3 class="text-xl font-semibold text-gray-900">Twoje zamówienia</h3>
                </div>
                
                <div v-if="isLoadingOrders" class="flex justify-center py-8">
                  <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-pink-500" />
                </div>
                
                <div v-else-if="orders.length === 0" class="bg-gray-50 rounded-lg p-8 text-center">
                  <UIcon name="i-heroicons-shopping-bag" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h4 class="text-lg font-medium text-gray-900">Brak zamówień</h4>
                  <p class="text-gray-500 mt-2">Nie masz jeszcze żadnych zamówień.</p>
                  <UButton to="/sklep" color="pink" class="mt-4 bg-pink-200 hover:bg-pink-400 transition-all duration-300">
                    Przejdź do sklepu
                  </UButton>
                </div>
                
                <div v-else class="space-y-4">
                  <UCard v-for="order in orders" :key="order.id" class="border border-gray-200 hover:border-pink-200 transition-all">
                    <div class="flex justify-between items-start">
                      <div>
                        <div class="flex items-center gap-2 mb-2">
                          <p class="font-medium text-pink-600">Zamówienie #{{ order.display_id }}</p>
                          <UBadge :color="getOrderStatusColor(order.status)" size="sm" variant="subtle">
                            {{ translateOrderStatus(order.status) }}
                          </UBadge>
                        </div>
                        <p class="text-gray-600">Data: {{ formatDate(order.created_at) }}</p>
                        <p class="text-gray-600">Produkty: {{ order.items.length }}</p>
                        <p class="font-medium mt-1">Suma: {{ formatPrice(order.total) }}</p>
                      </div>
                      <UButton 
                        size="sm" 
                        color="gray" 
                        variant="ghost" 
                        icon="i-heroicons-eye"
                        :to="`/zamowienia/${order.id}`"
                      >
                        Szczegóły
                      </UButton>
                    </div>
                  </UCard>
                  
                  <!-- Pagination -->
                  <div class="flex justify-between items-center pt-4">
                    <p class="text-sm text-gray-600">
                      Wyświetlanie {{ Math.min(orders.length, ordersPagination.limit) }} z {{ ordersCount }} zamówień
                    </p>
                    <div class="flex gap-2">
                      <UButton 
                        size="sm" 
                        color="gray" 
                        variant="ghost" 
                        icon="i-heroicons-arrow-left" 
                        :disabled="ordersPagination.offset === 0"
                        @click="prevOrdersPage"
                      >
                        Poprzednia
                      </UButton>
                      <UButton 
                        size="sm" 
                        color="gray" 
                        variant="ghost" 
                        icon="i-heroicons-arrow-right" 
                        icon-right
                        :disabled="ordersPagination.offset + ordersPagination.limit >= ordersCount"
                        @click="nextOrdersPage"
                      >
                        Następna
                      </UButton>
                    </div>
                  </div>
                </div>
              </div>
            </template>
  
            <!-- Password Tab -->
            <template #password="{ item }">
              <div class="space-y-6 p-6">
                <div class="flex items-center space-x-3 mb-6">
                  <UIcon name="i-heroicons-lock-closed" class="w-6 h-6 text-pink-600" />
                  <h3 class="text-xl font-semibold text-gray-900">Zmiana hasła</h3>
                </div>
  
                <UAlert
                  icon="i-heroicons-information-circle"
                  color="pink"
                  variant="soft"
                  title="Bezpieczeństwo"
                  description="Hasło musi mieć co najmniej 8 znaków i zawierać litery oraz cyfry"
                  class="mb-6"
                />
  
                <UForm :state="passwordForm" @submit="handleChangePassword" class="space-y-6">
                    <UFormField label="Aktualne hasło" :error="passwordErrors.current_password">
                        <UInput
                          v-model="passwordForm.current_password"
                          type="password"
                          icon="i-heroicons-key"
                          placeholder="Wprowadź aktualne hasło"
                          color="pink"
                          :error="!!passwordErrors.current_password"
                        />
                    </UFormField>
  
                    <UFormField label="Nowe hasło" :error="passwordErrors.new_password">
                        <UInput
                          v-model="passwordForm.new_password"
                          type="password"
                          icon="i-heroicons-lock-closed"
                          placeholder="Wprowadź nowe hasło"
                          color="pink"
                          :error="!!passwordErrors.new_password"
                        />
                    </UFormField>
  
                    <UFormField label="Potwierdź nowe hasło" :error="passwordErrors.confirm_password">
                        <UInput
                            v-model="passwordForm.confirm_password"
                            type="password"
                            icon="i-heroicons-lock-closed"
                            placeholder="Potwierdź nowe hasło"
                            color="pink"
                            :error="!!passwordErrors.confirm_password"
                        />
                    </UFormField>
  
                  <div class="flex justify-end">
                    <UButton
                      type="submit"
                      color="red"
                      size="lg"
                      :loading="isChangingPassword"
                      :disabled="isChangingPassword"
                      icon="i-heroicons-shield-check"
                      class="shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {{ isChangingPassword ? 'Zmienianie...' : 'Zmień hasło' }}
                    </UButton>
                  </div>
                </UForm>
              </div>
            </template>
  
            <!-- Account Info Tab -->
            <template #account-info="{ item }">
              <div class="space-y-6 p-6">
                <div class="flex items-center space-x-3 mb-6">
                  <UIcon name="i-heroicons-information-circle" class="w-6 h-6 text-pink-600" />
                  <h3 class="text-xl font-semibold text-gray-900">Informacje o koncie</h3>
                </div>
  
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <UCard class="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                        <UIcon name="i-heroicons-identification" class="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p class="text-sm text-gray-600">ID konta</p>
                        <p class="font-mono text-sm font-medium">{{ customer.id }}</p>
                      </div>
                    </div>
                  </UCard>

                  <UCard class="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center">
                        <UIcon name="i-heroicons-calendar" class="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p class="text-sm text-gray-600">Data rejestracji</p>
                        <p class="text-sm font-medium">{{ formatDate(customer.created_at) }}</p>
                      </div>
                    </div>
                  </UCard>
  
                  <UCard class="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <UIcon name="i-heroicons-clock" class="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p class="text-sm text-gray-600">Ostatnia aktualizacja</p>
                        <p class="text-sm font-medium">{{ formatDate(customer.updated_at) }}</p>
                      </div>
                    </div>
                  </UCard>

                </div>
              </div>
            </template>
          </UTabs>
        </UCard>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { storeToRefs } from 'pinia'
  

  // Define interfaces
  interface Customer {
    id: string
    first_name: string
    last_name: string
    email: string
    phone: string | null
    metadata: { [key: string]: any }
    addresses: any[]
  }

  interface ProfileForm {
    first_name: string
    last_name: string
    email: string
    phone?: string
    metadata: {
      date_of_birth?: string
    }
  }

  interface AddressForm {
    address_name: string
    first_name: string
    last_name: string
    address_1: string
    address_2?: string
    postal_code: string
    city: string
    country_code: string
    phone?: string
    is_default_shipping: boolean
    is_default_billing: boolean
  }

  interface PasswordForm {
    current_password: string
    new_password: string
    confirm_password: string
  }

  // Tabs configuration
  const tabs = [
    {
      slot: 'personal-info' as const,
      key: 'personal-info',
      label: 'Dane osobowe',
      icon: 'i-heroicons-user'
    },
    {
      slot: 'delivery-address' as const,
      key: 'delivery-address',
      label: 'Adres dostawy',
      icon: 'i-heroicons-map-pin'
    },
    {
      slot: 'orders' as const,
      key: 'orders',
      label: 'Zamówienia',
      icon: 'i-heroicons-shopping-bag'
    },
    {
      slot: 'password' as const,
      key: 'password',
      label: 'Hasło',
      icon: 'i-heroicons-lock-closed'
    },
    {
      slot: 'account-info' as const,
      key: 'account-info',
      label: 'Informacje o koncie',
      icon: 'i-heroicons-information-circle'
    }
  ]

  const authStore = useAuthStore()
  const { customer, pending, error } = storeToRefs(authStore)

  // Reactive data
  const selectedTab = ref(0)
  const profileForm = ref<ProfileForm>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    metadata: {
      date_of_birth: ''
    }
  })

  const addressForm = ref<AddressForm>({
    address_name: '',
    first_name: '',
    last_name: '',
    address_1: '',
    address_2: '',
    postal_code: '',
    city: '',
    country_code: 'PL',
    phone: '',
    is_default_shipping: false,
    is_default_billing: false
  })

  const passwordForm = ref<PasswordForm>({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })

  // Address management state
  const isAddingNewAddress = ref(false)
  const isEditingAddress = ref(false)
  const currentEditingAddressId = ref<string | null>(null)

  // Orders management state
  const orders = ref<any[]>([])
  const isLoadingOrders = ref(false)
  const ordersCount = ref(0)
  const ordersPagination = ref({
    limit: 10,
    offset: 0
  })

  const profileErrors = ref<Record<string, any>>({
    metadata: {},
    general: ''
  })
  const addressErrors = ref<Record<string, string>>({})
  const passwordErrors = ref<Record<string, string>>({})
  const isUpdating = ref(false)
  const isUpdatingAddress = ref(false)
  const isChangingPassword = ref(false)
  const showSuccessMessage = ref(false)

  // Watch for customer data changes from the store and update the form
  watch(customer, (newData) => {
    if (newData) {
      profileForm.value = {
        first_name: newData.first_name || '',
        last_name: newData.last_name || '',
        email: newData.email || '',
        phone: newData.phone || '',
        metadata: {
          date_of_birth: newData.metadata?.date_of_birth ? new Date(newData.metadata.date_of_birth).toISOString().split('T')[0] : ''
        }
      };
    }
  }, { immediate: true, deep: true })

  // Fetch orders when the 'orders' tab is activated
  watch(selectedTab, (newTab) => {
    if (newTab === 'orders' && orders.value.length === 0 && hasMoreOrders.value) {
      loadMoreOrders()
    }
  })

  // --- FORM VALIDATION ---
  const validateProfileForm = () => {
    profileErrors.value = { first_name: '', last_name: '', email: '', general: '' }
    let isValid = true
    if (!profileForm.value.first_name) { profileErrors.value.first_name = 'Imię jest wymagane'; isValid = false }
    if (!profileForm.value.last_name) { profileErrors.value.last_name = 'Nazwisko jest wymagane'; isValid = false }
    if (!profileForm.value.email) { profileErrors.value.email = 'Email jest wymagany'; isValid = false }
    return isValid
  }

  const validateAddressForm = () => {
    addressErrors.value = { first_name: '', last_name: '', address_1: '', postal_code: '', city: '', general: '' }
    let isValid = true
    if (!addressForm.value.first_name) { addressErrors.value.first_name = 'Imię jest wymagane'; isValid = false }
    if (!addressForm.value.last_name) { addressErrors.value.last_name = 'Nazwisko jest wymagane'; isValid = false }
    if (!addressForm.value.address_1) { addressErrors.value.address_1 = 'Adres jest wymagany'; isValid = false }
    if (!addressForm.value.postal_code) { addressErrors.value.postal_code = 'Kod pocztowy jest wymagany'; isValid = false }
    if (!addressForm.value.city) { addressErrors.value.city = 'Miasto jest wymagane'; isValid = false }
    return isValid
  }

  const validatePasswordForm = () => {
    passwordErrors.value = { current_password: '', new_password: '', confirm_password: '', general: '' }
    let isValid = true
    if (!passwordForm.value.current_password) { passwordErrors.value.current_password = 'Aktualne hasło jest wymagane'; isValid = false }
    if (passwordForm.value.new_password.length < 8) { passwordErrors.value.new_password = 'Hasło musi mieć co najmniej 8 znaków'; isValid = false }
    if (passwordForm.value.new_password !== passwordForm.value.confirm_password) { passwordErrors.value.confirm_password = 'Hasła nie są zgodne'; isValid = false }
    return isValid
  }

  // --- ACTIONS (delegating to Pinia store) ---
  const handleLogout = async () => {
    await authStore.logout()
    router.push('/')
  }

  const handleUpdateProfile = async () => {
    if (!validateProfileForm()) return
    profileErrors.value.general = ''
    try {
      await authStore.updateProfile(profileForm.value)
    } catch (err: any) {
      profileErrors.value.general = err.data?.message || 'Wystąpił błąd podczas aktualizacji profilu'
    }
  }

  const handleSaveAddress = async () => {
    if (!validateAddressForm()) return
    addressErrors.value.general = ''
    try {
      const payload: AddressPayload = { ...addressForm.value }
      if (isEditingAddress.value && currentEditingAddressId.value) {
        await authStore.updateAddress(currentEditingAddressId.value, payload)
      } else {
        await authStore.addAddress(payload)
      }
      cancelAddressForm()
    } catch (err: any) {
      addressErrors.value.general = err.data?.message || 'Wystąpił błąd podczas zapisywania adresu'
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (confirm('Czy na pewno chcesz usunąć ten adres?')) {
      try {
        await authStore.deleteAddress(addressId)
      } catch (err) {
        // Error is already handled in the store, but you could add specific UI feedback here if needed
        console.error('Failed to delete address from component.')
      }
    }
  }

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return
    passwordErrors.value.general = ''
    try {
      await authStore.changePassword({
        current_password: passwordForm.value.current_password,
        new_password: passwordForm.value.new_password,
      })
      // Clear form on success
      passwordForm.value = { current_password: '', new_password: '', confirm_password: '' }
    } catch (err: any) {
      passwordErrors.value.general = err.data?.message || 'Wystąpił błąd podczas zmiany hasła'
    }
  }

  const loadMoreOrders = () => {
    const limit = 5
    const offset = orders.value.length
    authStore.fetchOrders(limit, offset)
  }

  // --- ADDRESS FORM UI LOGIC ---
  const openAddAddressForm = () => {
    isAddingNewAddress.value = true
    isEditingAddress.value = false
    currentEditingAddressId.value = null
    addressForm.value = {
      address_name: '',
      first_name: customer.value?.first_name || '',
      last_name: customer.value?.last_name || '',
      address_1: '', address_2: '', postal_code: '', city: '',
      country_code: 'PL', phone: customer.value?.phone || '',
    }
  }

  const openEditAddressForm = (address: Address) => {
    isEditingAddress.value = true
    isAddingNewAddress.value = false
    currentEditingAddressId.value = address.id
    // Create a plain object for the form to avoid reactivity issues with store objects
    addressForm.value = JSON.parse(JSON.stringify(address))
  }

  const cancelAddressForm = () => {
    isAddingNewAddress.value = false
    isEditingAddress.value = false
    currentEditingAddressId.value = null
  }

  // --- HELPER FUNCTIONS FOR DISPLAY ---
  const formatPrice = (amount: number, currencyCode: string) => {
    return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: currencyCode }).format(amount / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL')
  }

  const translateStatus = (status: string) => {
    const statuses: { [key: string]: string } = {
      pending: 'Oczekujące', completed: 'Zakończone', archived: 'Zarchiwizowane', canceled: 'Anulowane',
      requires_action: 'Wymaga akcji', not_fulfilled: 'Niespakowane', fulfilled: 'Spakowane',
      partially_fulfilled: 'Częściowo spakowane', shipped: 'Wysłane', partially_shipped: 'Częściowo wysłane',
      returned: 'Zwrócone', partially_returned: 'Częściowo zwrócone', not_paid: 'Nieopłacone',
      captured: 'Opłacone', partially_refunded: 'Częściowo zwrócone', refunded: 'Zwrócone'
    }
    return statuses[status] || status
  }
</script>

<style scoped>
  .animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-reverse {
    animation-direction: reverse;
  }
</style>
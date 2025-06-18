import { defineStore } from 'pinia'
import type { Customer, Order, Address } from '@medusajs/medusa'
import { useMedusaClient, medusaFetch } from '~/utils/medusa-client'

// Define types for our forms and payloads
interface PasswordForm {
  current_password: string
  new_password: string
}

interface AddressPayload {
  first_name: string
  last_name: string
  address_1: string
  address_2?: string
  city: string
  postal_code: string
  country_code: string
  phone?: string
  address_name?: string
  is_default_shipping?: boolean
  is_default_billing?: boolean
  metadata?: Record<string, any>
}

interface RegisterPayload {
  first_name: string
  last_name: string
  email: string
  password: string
  phone?: string
}

interface PasswordPayload {
  current_password: string
  new_password: string
}

interface ProfileUpdatePayload {
  first_name?: string
  last_name?: string
  phone?: string
  metadata?: Record<string, any>
}

export const useAuthStore = defineStore('auth', () => {
  // Core auth state
  const customer = ref<Customer | null>(null)
  const isAuthenticated = computed(() => !!customer.value)
  const pending = ref(false) // For initial customer fetch
  const error = ref<any | null>(null)

  // State for other actions (profile update, address, password)
  const actionPending = ref(false)
  const actionError = ref<any | null>(null)
  const successMessage = ref<string | null>(null)

  // State for orders
  const orders = ref<Order[]>([])
  const ordersPending = ref(false)
  const hasMoreOrders = ref(true)

  // --- HELPER FUNCTIONS ---
  function showSuccess(message: string) {
    successMessage.value = message
    setTimeout(() => {
      successMessage.value = null
    }, 3000)
  }

  // --- CORE ACTIONS ---
  async function fetchCustomer() {
    pending.value = true
    error.value = null
    try {
      // Use our server endpoint which handles token extraction and authentication
      const response = await $fetch<{ customer: Customer }>('/api/customers/me', {
        method: 'GET',
        credentials: 'include', // Important to include credentials to send cookies
      })
      customer.value = response.customer
    } catch (e) {
      customer.value = null
      // Don't set a global error for a 401, as it's expected when not logged in
      if ((e as any).statusCode !== 401) {
        error.value = e
      }
    } finally {
      pending.value = false
    }
  }

  async function login(email: string, password: string) {
    actionPending.value = true
    actionError.value = null
    try {
      // Use our server login endpoint which will set the JWT cookie
      const response = await $fetch<{ customer: Customer }>('/api/customers/login', {
        method: 'POST',
        body: { email, password },
        credentials: 'include', // Important to include credentials to receive cookies
      })
      
      customer.value = response.customer
      return customer.value
    } catch (e: any) {
      actionError.value = e.data?.message || 'Login failed. Please check your credentials.'
      throw e // Re-throw to be caught in the component
    } finally {
      actionPending.value = false
    }
  }

  async function logout() {
    try {
      await $fetch('/api/customers/logout', {
        method: 'DELETE',
        credentials: 'include',
      })
    } catch (e) {
      console.error('Error during logout:', e)
    } finally {
      // Clear local state regardless of API call success
      customer.value = null
      orders.value = []
      hasMoreOrders.value = true
    }
  }

  // --- PROFILE ACTIONS ---
  async function updateProfile(profileData: ProfileUpdatePayload) {
    actionPending.value = true
    actionError.value = null
    try {
      // Remove email from payload as it can't be updated directly
      const { email, ...updatePayload } = profileData as any
      
      await $fetch('/api/customers/me', {
        method: 'POST',
        body: updatePayload,
        credentials: 'include',
      })
      
      await fetchCustomer() // Refresh customer data
      showSuccess('Profil został zaktualizowany.')
    } catch (e: any) {
      actionError.value = e.data?.message || 'Wystąpił błąd podczas aktualizacji profilu.'
      throw e
    } finally {
      actionPending.value = false
    }
  }

  // --- ADDRESS ACTIONS ---
  async function addAddress(address: AddressPayload) {
    actionPending.value = true
    actionError.value = null
    try {
      await $fetch('/api/customers/address', {
        method: 'POST',
        body: address,
        credentials: 'include',
      })
      await fetchCustomer()
      showSuccess('Adres został dodany.')
    } catch (e) {
      actionError.value = e
      throw e
    } finally {
      actionPending.value = false
    }
  }

  async function updateAddress(addressId: string, address: AddressPayload) {
    actionPending.value = true
    actionError.value = null
    try {
      await $fetch(`/api/customers/address/${addressId}`, {
        method: 'POST',
        body: address,
        credentials: 'include',
      })
      await fetchCustomer()
      showSuccess('Adres został zaktualizowany.')
    } catch (e) {
      actionError.value = e
      throw e
    } finally {
      actionPending.value = false
    }
  }

  async function deleteAddress(addressId: string) {
    actionPending.value = true
    actionError.value = null
    try {
      await $fetch(`/api/customers/address/${addressId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      await fetchCustomer()
      showSuccess('Adres został usunięty.')
    } catch (e) {
      actionError.value = e
      throw e
    } finally {
      actionPending.value = false
    }
  }

  // --- PASSWORD ACTION ---
  async function register(payload: RegisterPayload) {
    actionPending.value = true
    actionError.value = null
    clearSuccessMessage()

    try {
      // Medusa API creates the customer but doesn't log them in.
      await $fetch('/api/customers', {
        method: 'POST',
        body: payload,
      })

      setSuccessMessage('Rejestracja powiodła się! Możesz się teraz zalogować.')
      return true // Indicate success
    } catch (e: any) {
      actionError.value = e.data?.message || 'Wystąpił błąd podczas rejestracji.'
      return false // Indicate failure
    } finally {
      actionPending.value = false
    }
  }

  async function changePassword(payload: PasswordPayload) {
    actionPending.value = true
    actionError.value = null
    try {
      await $fetch('/api/customers/password', {
        method: 'POST',
        body: payload,
        credentials: 'include',
      })
      showSuccess('Hasło zostało zmienione.')
    } catch (e) {
      actionError.value = e
      throw e
    } finally {
      actionPending.value = false
    }
  }

  // --- ORDER ACTION ---
  async function fetchOrders(limit: number = 10, offset: number = 0) {
    if (ordersPending.value || !hasMoreOrders.value) return
    ordersPending.value = true
    try {
      // Use medusaFetch utility to ensure proper credentials and headers
      const response = await $fetch<{ orders: Order[] }>(`/api/customers/orders?limit=${limit}&offset=${offset}`, {
        method: 'GET',
        credentials: 'include',
      })

      if (response.orders.length > 0) {
        orders.value.push(...response.orders)
      } else {
        hasMoreOrders.value = false
      }
    } catch (e) {
      console.error('Failed to fetch orders:', e)
    } finally {
      ordersPending.value = false
    }
  }
  
  // Clear success message
  function clearSuccessMessage() {
    successMessage.value = null
  }
  
  // Set success message
  function setSuccessMessage(message: string) {
    successMessage.value = message
    setTimeout(() => {
      successMessage.value = null
    }, 3000)
  }

  return {
    // State
    customer,
    isAuthenticated,
    pending,
    error,
    actionPending,
    actionError,
    successMessage,
    orders,
    ordersPending,
    hasMoreOrders,
    // Actions
    fetchCustomer,
    login,
    logout,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    register,
    changePassword,
    fetchOrders,
  }
})

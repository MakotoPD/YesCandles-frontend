// stores/customer.ts
import { defineStore } from 'pinia'

interface Customer {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  billing_address_id?: string
  metadata: MetaData[]
  shipping_addresses: ShippingAddress[]
  created_at: string
  updated_at: string
}

interface MetaData {
  date_of_birth: string
}

interface ShippingAddress {
  id: string
  first_name: string
  last_name: string
  address_1: string
  address_2?: string
  city: string
  country_code: string
  province?: string
  postal_code: string
  phone?: string
  company?: string
  customer_id: string
}

interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
  phone?: string
}

interface LoginData {
  email: string
  password: string
}

interface UpdateProfileData {
  first_name?: string
  last_name?: string
  phone?: string
}

interface AddressData {
  first_name: string
  last_name: string
  address_1: string
  address_2?: string
  city: string
  country_code: string
  province?: string
  postal_code: string
  phone?: string
  company?: string
}

interface ChangePasswordData {
  old_password: string
  new_password: string
}

export const useAuthStore = defineStore('auth', () => {
  const client = useMedusaClient()
  
  // Stan
  const customer = ref<Customer | null>(null)
  const isLoggedIn = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Gettery
  const fullName = computed(() => {
    if (!customer.value) return ''
    return `${customer.value.first_name} ${customer.value.last_name}`
  })

  const primaryAddress = computed(() => {
    if (!customer.value?.shipping_addresses?.length) return null
    return customer.value.shipping_addresses[0]
  })

  // Akcje
  const clearError = () => {
    error.value = null
  }

  const setLoading = (state: boolean) => {
    loading.value = state
  }

  const setError = (message: string) => {
    error.value = message
  }

  // Rejestracja klienta - poprawiona wersja
  const register = async (data: RegisterData) => {
    try {
      setLoading(true)
      clearError()

      console.log('Próba rejestracji z danymi:', { 
        email: data.email, 
        first_name: data.first_name, 
        last_name: data.last_name 
      })

      // Debug: sprawdź konfigurację
      const config = useRuntimeConfig()
      console.log('Konfiguracja Medusa:', {
        baseUrl: config.public.medusa.baseUrl,
        publishableKey: config.public.medusa.publishableKey ? 'SET' : 'NOT SET',
        publishableKeyPrefix: config.public.medusa.publishableKey?.substring(0, 10) + '...'
      })

      const token = await client.auth.register("customer", "emailpass", {
        "email": data.email,
        "password": data.password,
      })

      // Aktualizacja wywołania API dla nowego @medusajs/js-sdk
      await client.store.customer.create({
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone || undefined
      },
      {},
      {
        Authorization: `Bearer ${token}`
      }).then(({ customer: customerData }) => {

        // Zapisz token jako cookie przez server API
        $fetch('/api/auth/set-token', {
          method: 'POST',
          body: { token }
        })

        console.log('Odpowiedź rejestracji:', customerData)

        if (customerData) {
          customer.value = customerData
          isLoggedIn.value = true
          console.log('Rejestracja udana')
        }
      })
    
      return customer.value

    } catch (err: any) {
      console.error('Błąd rejestracji:', err)
      console.error('Szczegóły błędu:', {
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        data: err?.response?.data,
        message: err?.message
      })
      
      let message = 'Błąd podczas rejestracji'
      
      if (err?.response?.status === 401) {
        message = 'Błąd autoryzacji - sprawdź konfigurację publishable key'
      } else if (err?.response?.status === 422) {
        message = 'Nieprawidłowe dane - użytkownik może już istnieć'
      } else if (err?.response?.data?.message) {
        message = err.response.data.message
      }
      
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Logowanie - poprawiona wersja
  const login = async (data: LoginData) => {
    try {
      setLoading(true)
      clearError()

      console.log('Próba logowania dla:', data.email)

      // W Medusa v2 może być inna struktura
      const token = await client.auth.login(
        "customer",
        "emailpass",
        {
          email: data.email,
          password: data.password
        }
      )
      
      if (typeof token !== "string") {
        alert("Authentication requires additional steps")
        // replace with the redirect logic of your application
        window.location.href = token.location
        return
      }

      const { customer: customerData } = await client.store.customer.retrieve()

      if (customerData) {
        // Zapisz token jako cookie przez server API
        await $fetch('/api/auth/set-token', {
          method: 'POST',
          body: { token }
        })

        customer.value = customerData
        isLoggedIn.value = true
      }

      return customer.value
    } catch (err: any) {
      console.error('Błąd logowania:', err)
      
      let message = 'Błąd podczas logowania'
      
      if (err?.response?.status === 401) {
        message = 'Nieprawidłowy email lub hasło'
      } else if (err?.response?.data?.message) {
        message = err.response.data.message
      }
      
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Wylogowanie
  const logout = async () => {
    try {
      setLoading(true)
      clearError()

      // Usuń cookie z tokenem
      await $fetch('/api/auth/clear-token', {
        method: 'POST'
      })

      // Wyczyść stan
      customer.value = null
      isLoggedIn.value = false
      
      console.log('Wylogowano pomyślnie')
    } catch (err: any) {
      console.error('Błąd wylogowania:', err)
      setError('Błąd podczas wylogowania')
    } finally {
      setLoading(false)
    }
  }

  // Pobieranie aktualnych danych klienta
  const fetchCustomer = async () => {
    try {
      setLoading(true)
      clearError()

      const response = await client.store.customer.retrieve()
      
      if (response.customer) {
        customer.value = response.customer
        isLoggedIn.value = true
      }

      return response
    } catch (err: any) {
      console.log('Nie można pobrać danych klienta (prawdopodobnie nie zalogowany)')
      customer.value = null
      isLoggedIn.value = false
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Aktualizacja profilu klienta
  const updateProfile = async (data: UpdateProfileData) => {
    const tokenData = await $fetch('/api/auth/get-token', {
      method: 'GET',
    })
    const token = tokenData.token
    if (!process.client) {
      // Jeśli nie jesteśmy w przeglądarce, nic nie rób
      console.warn('Próbowano wywołać updateProfile po stronie serwera. Pomijam.')
      return
    }
    try {
      setLoading(true)
      clearError()

      if (!customer.value) {
        throw new Error('Klient nie jest zalogowany')
      }
      console.log(data)
      const response = await client.store.customer.update({
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        metadata: {
          date_of_birth: data.metadata?.date_of_birth
        }
      },
      {},
      {
        Authorization: `Bearer ${token}`
      })

      if (response.customer) {
        customer.value = response.customer
      }

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas aktualizacji profilu'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Dodanie adresu wysyłki
  const addShippingAddress = async (data: AddressData) => {

    const tokenData = await $fetch('/api/auth/get-token', {
      method: 'GET',
    })
    const token = tokenData.token
    try {
      setLoading(true)
      clearError()

      if (!customer.value) {
        throw new Error('Klient nie jest zalogowany')
      }

      const response = await client.store.customer.createAddress({
        address_name: data.address_name,
        first_name: data.first_name,
        last_name: data.last_name,
        address_1: data.address_1,
        address_2: data.address_2,
        postal_code: data.postal_code,
        city: data.city,
        country_code: 'PL',
        phone: data.phone,
        is_default_shipping: data.is_default_shipping,
        is_default_billing: data.is_default_billing,
        company: data.company,
        province: data.province,
        province_code: data.province_code,
        metadata: data.metadata
      },
      {},
      {
        Authorization: `Bearer ${token}`
      })

      if (response.address) {
        await fetchCustomer()
      }

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas dodawania adresu'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Aktualizacja adresu wysyłki
  const updateShippingAddress = async (addressId: string, data: AddressData) => {
    const tokenData = await $fetch('/api/auth/get-token', {
      method: 'GET',
    })
    const token = tokenData.token
    try {
      setLoading(true)
      clearError()

      if (!customer.value) {
        throw new Error('Klient nie jest zalogowany')
      }

      const response = await client.store.customer.updateAddress(addressId, {
        address_name: data.address_name,
        first_name: data.first_name,
        last_name: data.last_name,
        address_1: data.address_1,
        address_2: data.address_2,
        postal_code: data.postal_code,
        city: data.city,
        country_code: 'PL',
        phone: data.phone,
        is_default_shipping: data.is_default_shipping,
        is_default_billing: data.is_default_billing,
        company: data.company,
        province: data.province,
        province_code: data.province_code,
        metadata: data.metadata
      },
      {},
      {
        Authorization: `Bearer ${token}`
      })

      if (response.address) {
        await fetchCustomer()
      }

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas aktualizacji adresu'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Usunięcie adresu wysyłki
  const deleteShippingAddress = async (addressId: string) => {
    const tokenData = await $fetch('/api/auth/get-token', {
      method: 'GET',
    })
    const token = tokenData.token

    try {
      setLoading(true)
      clearError()

      if (!customer.value) {
        throw new Error('Klient nie jest zalogowany')
      }

      const response = await client.store.customer.deleteAddress(addressId, {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
      })

      if (customer.value && customer.value.shipping_addresses) {
        customer.value.shipping_addresses = 
          customer.value.shipping_addresses.filter(addr => addr.id !== addressId)
      }

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas usuwania adresu'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Zmiana hasła
  const changePassword = async (data: ChangePasswordData) => {
    try {
      setLoading(true)
      clearError()

      if (!customer.value) {
        throw new Error('Klient nie jest zalogowany')
      }

      const response = await client.store.customer.update({
        password: data.new_password,
        old_password: data.old_password
      })

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas zmiany hasła'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Reset hasła
  const requestPasswordReset = async (email: string) => {
    try {
      setLoading(true)
      clearError()

      const response = await client.auth.resetPassword({
        email: email
      })

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas wysyłania linku resetującego hasło'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Inicjalizacja stanu z cookie
  const initializeAuth = async (token?: string) => {
    try {
      let authToken = token
      
      // Jeśli token nie został przekazany, pobierz go z cookie
      if (!authToken) {
        const tokenData = await $fetch('/api/auth/get-token')
        authToken = tokenData.token
      }
      
      if (authToken) {
        // Pobierz dane klienta używając tokena
        const client = useMedusaClient()
        const { customer: customerData } = await client.store.customer.retrieve({}, {
          Authorization: `Bearer ${authToken}`
        })
        
        if (customerData) {
          customer.value = customerData
          isLoggedIn.value = true
          console.log('[Auth Store] User authenticated from token')
        }
      }
    } catch (err) {
      console.log('[Auth Store] No valid token or auth initialization error')
      // Nie logujemy błędu jako error, bo to normalne gdy użytkownik nie jest zalogowany
    }
  }

  // Inicjalizacja store
  const initialize = async () => {
    try {
      // fetchCustomer jest już wywoływane przez middleware poprzez initializeAuth
      // await fetchCustomer()
    } catch (err) {
      // Użytkownik nie jest zalogowany - to normalne
    }
  }

  return {
    // Stan
    customer,
    isLoggedIn,
    loading,
    error,
    
    // Gettery
    fullName,
    primaryAddress,
    
    // Akcje
    clearError,
    register,
    login,
    logout,
    fetchCustomer,
    updateProfile,
    addShippingAddress,
    updateShippingAddress,
    deleteShippingAddress,
    changePassword,
    requestPasswordReset,
    initialize,
    initializeAuth
  }
})
// stores/orders.ts
import { defineStore } from 'pinia'

interface Order {
  id: string
  status: string
  fulfillment_status: string
  payment_status: string
  display_id: number
  cart_id: string
  customer_id: string
  email: string
  billing_address: Address
  shipping_address: Address
  region: Region
  currency_code: string
  tax_rate: number
  items: LineItem[]
  shipping_methods: ShippingMethod[]
  payments: Payment[]
  fulfillments: Fulfillment[]
  returns: Return[]
  exchanges: Exchange[]
  total: number
  subtotal: number
  tax_total: number
  shipping_total: number
  discount_total: number
  gift_card_total: number
  refunded_total: number
  canceled_at?: string
  created_at: string
  updated_at: string
}

interface Address {
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
}

interface Region {
  id: string
  name: string
  currency_code: string
  tax_rate: number
}

interface LineItem {
  id: string
  cart_id: string
  order_id: string
  title: string
  description: string
  thumbnail?: string
  is_return: boolean
  is_giftcard: boolean
  should_merge: boolean
  allow_discounts: boolean
  has_shipping: boolean
  unit_price: number
  variant_id: string
  variant: ProductVariant
  quantity: number
  fulfilled_quantity: number
  returned_quantity: number
  shipped_quantity: number
  refundable_amount: number
  subtotal: number
  tax_total: number
  total: number
  original_total: number
  original_tax_total: number
  discount_total: number
  gift_card_total: number
}

interface ProductVariant {
  id: string
  title: string
  product_id: string
  sku?: string
  barcode?: string
  ean?: string
  upc?: string
  inventory_quantity: number
  allow_backorder: boolean
  manage_inventory: boolean
  weight?: number
  length?: number
  height?: number
  width?: number
  origin_country?: string
  mid_code?: string
  material?: string
  product: Product
  prices: Price[]
  options: ProductOptionValue[]
}

interface Product {
  id: string
  title: string
  subtitle?: string
  description?: string
  handle: string
  is_giftcard: boolean
  status: string
  thumbnail?: string
  weight?: number
  length?: number
  height?: number
  width?: number
  origin_country?: string
  mid_code?: string
  material?: string
}

interface Price {
  id: string
  currency_code: string
  amount: number
  min_quantity?: number
  max_quantity?: number
}

interface ProductOptionValue {
  id: string
  value: string
  option_id: string
  variant_id: string
}

interface ShippingMethod {
  id: string
  shipping_option_id: string
  order_id: string
  name: string
  description?: string
  amount: number
  is_return: boolean
  data: Record<string, any>
  price: number
}

interface Payment {
  id: string
  swap_id?: string
  cart_id?: string
  order_id?: string
  amount: number
  currency_code: string
  amount_refunded: number
  provider_id: string
  data: Record<string, any>
  captured_at?: string
  canceled_at?: string
  created_at: string
  updated_at: string
}

interface Fulfillment {
  id: string
  claim_order_id?: string
  swap_id?: string
  order_id: string
  provider_id: string
  location_id?: string
  shipped_at?: string
  canceled_at?: string
  data: Record<string, any>
  items: FulfillmentItem[]
  tracking_links: TrackingLink[]
}

interface FulfillmentItem {
  fulfillment_id: string
  item_id: string
  quantity: number
}

interface TrackingLink {
  id: string
  url: string
  tracking_number: string
  fulfillment_id: string
}

interface Return {
  id: string
  status: string
  order_id: string
  swap_id?: string
  claim_order_id?: string
  location_id?: string
  shipping_method?: ShippingMethod
  shipping_data?: Record<string, any>
  refund_amount: number
  received_at?: string
  created_at: string
  updated_at: string
  items: ReturnItem[]
}

interface ReturnItem {
  return_id: string
  item_id: string
  quantity: number
  is_requested: boolean
  requested_quantity: number
  received_quantity: number
  reason_id?: string
  note?: string
}

interface Exchange {
  id: string
  order_id: string
  cart_id: string
  difference_due: number
  shipped_at?: string
  canceled_at?: string
  confirmed_at?: string
  created_at: string
  updated_at: string
  additional_items: LineItem[]
  return_items: ReturnItem[]
}

interface CreateOrderData {
  cart_id: string
  customer_id?: string
  email?: string
  billing_address?: Partial<Address>
  shipping_address?: Partial<Address>
  discounts?: string[]
  customer_id?: string
}

interface OrderFilters {
  limit?: number
  offset?: number
  status?: string[]
  fulfillment_status?: string[]
  payment_status?: string[]
  display_id?: string
  cart_id?: string
  customer_id?: string
  email?: string
  region_id?: string
  currency_code?: string
  tax_rate?: number
  created_at?: {
    lt?: string
    gt?: string
    lte?: string
    gte?: string
  }
  updated_at?: {
    lt?: string
    gt?: string
    lte?: string
    gte?: string
  }
}

interface ReturnOrderData {
  items: {
    item_id: string
    quantity: number
    reason_id?: string
    note?: string
  }[]
  return_shipping?: {
    option_id: string
    price?: number
  }
  note?: string
  receive_now?: boolean
  refund?: number
  location_id?: string
}

interface CancelOrderData {
  reason?: string
}

export const useOrdersStore = defineStore('orders', () => {
  const client = useMedusaClient()
  
  // Stan
  const orders = ref<Order[]>([])
  const currentOrder = ref<Order | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    total: 0,
    count: 0,
    offset: 0,
    limit: 20
  })

  // Gettery
  const ordersByStatus = computed(() => {
    return (status: string) => orders.value.filter(order => order.status === status)
  })

  const pendingOrders = computed(() => orders.value.filter(order => 
    order.status === 'pending' || order.fulfillment_status === 'not_fulfilled'
  ))

  const completedOrders = computed(() => orders.value.filter(order => 
    order.status === 'completed' && order.fulfillment_status === 'fulfilled'
  ))

  const totalOrderValue = computed(() => {
    return orders.value.reduce((total, order) => total + order.total, 0)
  })

  // Akcje pomocnicze
  const clearError = () => {
    error.value = null
  }

  const setLoading = (state: boolean) => {
    loading.value = state
  }

  const setError = (message: string) => {
    error.value = message
  }

  // Pobranie wszystkich zamówień (z filtrowaniem)
  const fetchOrders = async (filters: OrderFilters = {}) => {
    try {
      setLoading(true)
      clearError()

      const response = await client.store.order.list({
        limit: filters.limit || 20,
        offset: filters.offset || 0,
        ...filters
      })

      if (response.orders) {
        orders.value = response.orders
        pagination.value = {
          total: response.count || 0,
          count: response.orders.length,
          offset: filters.offset || 0,
          limit: filters.limit || 20
        }
      }

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas pobierania zamówień'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Pobranie zamówień klienta
  const fetchCustomerOrders = async (customerId?: string, filters: OrderFilters = {}) => {
    try {
      setLoading(true)
      clearError()

      const orderFilters = customerId 
        ? { ...filters, customer_id: customerId }
        : filters

      const response = await client.store.order.list(orderFilters)

      if (response.orders) {
        orders.value = response.orders
        pagination.value = {
          total: response.count || 0,
          count: response.orders.length,
          offset: filters.offset || 0,
          limit: filters.limit || 20
        }
      }

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas pobierania zamówień klienta'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Pobranie szczegółów zamówienia
  const fetchOrder = async (orderId: string) => {
    try {
      setLoading(true)
      clearError()

      const response = await client.store.order.retrieve(orderId)

      if (response.order) {
        currentOrder.value = response.order
        
        // Aktualizuj też w liście zamówień jeśli istnieje
        const index = orders.value.findIndex(order => order.id === orderId)
        if (index !== -1) {
          orders.value[index] = response.order
        }
      }

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas pobierania zamówienia'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Pobranie zamówienia po display_id
  const fetchOrderByDisplayId = async (displayId: string) => {
    try {
      setLoading(true)
      clearError()

      const response = await client.store.order.lookupOrder({
        display_id: displayId
      })

      if (response.order) {
        currentOrder.value = response.order
      }

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas pobierania zamówienia'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Stworzenie zamówienia (z koszyka)
  const createOrder = async (data: CreateOrderData) => {
    try {
      setLoading(true)
      clearError()

      const response = await client.store.order.create({
        cart_id: data.cart_id,
        customer_id: data.customer_id,
        email: data.email,
        billing_address: data.billing_address,
        shipping_address: data.shipping_address,
        discounts: data.discounts
      })

      if (response.order) {
        currentOrder.value = response.order
        // Dodaj do początku listy zamówień
        orders.value.unshift(response.order)
      }

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas tworzenia zamówienia'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Anulowanie zamówienia
  const cancelOrder = async (orderId: string, data?: CancelOrderData) => {
    try {
      setLoading(true)
      clearError()

      const response = await client.store.order.cancel(orderId, {
        reason: data?.reason
      })

      if (response.order) {
        currentOrder.value = response.order
        
        // Aktualizuj w liście zamówień
        const index = orders.value.findIndex(order => order.id === orderId)
        if (index !== -1) {
          orders.value[index] = response.order
        }
      }

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas anulowania zamówienia'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Zwrot zamówienia
  const createReturn = async (orderId: string, data: ReturnOrderData) => {
    try {
      setLoading(true)
      clearError()

      const response = await client.returns.create({
        order_id: orderId,
        items: data.items,
        return_shipping: data.return_shipping,
        note: data.note,
        receive_now: data.receive_now,
        refund: data.refund,
        location_id: data.location_id
      })

      // Odświeżenie zamówienia po stworzeniu zwrotu
      if (response.return) {
        await fetchOrder(orderId)
      }

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas tworzenia zwrotu'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Pobranie zwrotów dla zamówienia
  const fetchOrderReturns = async (orderId: string) => {
    try {
      setLoading(true)
      clearError()

      const response = await client.returns.list({
        order_id: orderId
      })

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas pobierania zwrotów'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Pobranie statusu wysyłki
  const fetchOrderFulfillments = async (orderId: string) => {
    try {
      setLoading(true)
      clearError()

      // Pobranie zamówienia z fulfillments
      const response = await client.store.order.retrieve(orderId, {
        expand: 'fulfillments,fulfillments.tracking_links'
      })

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas pobierania statusu wysyłki'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Pobranie płatności dla zamówienia
  const fetchOrderPayments = async (orderId: string) => {
    try {
      setLoading(true)
      clearError()

      const response = await client.store.order.retrieve(orderId, {
        expand: 'payments'
      })

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas pobierania płatności'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Wyszukiwanie zamówień
  const searchOrders = async (query: string, filters: OrderFilters = {}) => {
    try {
      setLoading(true)
      clearError()

      // Sprawdź czy query to display_id (liczba)
      if (/^\d+$/.test(query)) {
        const response = await fetchOrderByDisplayId(query)
        if (response.order) {
          orders.value = [response.order]
        }
        return response
      }

      // Wyszukaj po email
      const response = await client.store.order.list({
        ...filters,
        email: query
      })

      if (response.orders) {
        orders.value = response.orders
        pagination.value = {
          total: response.count || 0,
          count: response.orders.length,
          offset: filters.offset || 0,
          limit: filters.limit || 20
        }
      }

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas wyszukiwania zamówień'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Pobranie następnej strony zamówień
  const loadMoreOrders = async (filters: OrderFilters = {}) => {
    try {
      const nextOffset = pagination.value.offset + pagination.value.limit
      
      const response = await client.store.order.list({
        ...filters,
        offset: nextOffset,
        limit: pagination.value.limit
      })

      if (response.orders) {
        orders.value.push(...response.orders)
        pagination.value.offset = nextOffset
        pagination.value.count = orders.value.length
      }

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas ładowania kolejnych zamówień'
      setError(message)
      throw err
    }
  }

  // Resetowanie stanu
  const resetState = () => {
    orders.value = []
    currentOrder.value = null
    error.value = null
    pagination.value = {
      total: 0,
      count: 0,
      offset: 0,
      limit: 20
    }
  }

  return {
    // Stan
    orders,
    currentOrder,
    loading,
    error,
    pagination,
    
    // Gettery
    ordersByStatus,
    pendingOrders,
    completedOrders,
    totalOrderValue,
    
    // Akcje
    clearError,
    fetchOrders,
    fetchCustomerOrders,
    fetchOrder,
    fetchOrderByDisplayId,
    createOrder,
    cancelOrder,
    createReturn,
    fetchOrderReturns,
    fetchOrderFulfillments,
    fetchOrderPayments,
    searchOrders,
    loadMoreOrders,
    resetState
  }
})
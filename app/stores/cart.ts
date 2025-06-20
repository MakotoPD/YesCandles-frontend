// stores/cart.ts
import { defineStore } from 'pinia'

interface Cart {
  id: string
  customer_id?: string
  email?: string
  billing_address_id?: string
  billing_address?: Address
  shipping_address_id?: string
  shipping_address?: Address
  items: LineItem[]
  region_id: string
  region: Region
  discounts: Discount[]
  gift_cards: GiftCard[]
  customer: Customer
  payment_session?: PaymentSession
  payment_sessions: PaymentSession[]
  payment_id?: string
  payment: Payment
  shipping_methods: ShippingMethod[]
  type: 'default' | 'swap' | 'draft_order' | 'payment_link' | 'claim'
  completed_at?: string
  payment_authorized_at?: string
  idempotency_key?: string
  context: Record<string, any>
  sales_channel_id?: string
  sales_channel: SalesChannel
  shipping_total: number
  discount_total: number
  tax_total: number
  refunded_total: number
  total: number
  subtotal: number
  refundable_amount: number
  gift_card_total: number
  gift_card_tax_total: number
  created_at: string
  updated_at: string
}

interface LineItem {
  id: string
  cart_id: string
  order_id?: string
  swap_id?: string
  claim_order_id?: string
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
  fulfilled_quantity?: number
  returned_quantity?: number
  shipped_quantity?: number
  refundable_amount?: number
  subtotal?: number
  tax_total?: number
  total?: number
  original_total?: number
  original_tax_total?: number
  discount_total?: number
  gift_card_total?: number
  adjustments: LineItemAdjustment[]
  tax_lines: LineItemTaxLine[]
  created_at: string
  updated_at: string
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
  created_at: string
  updated_at: string
}

interface Product {
  id: string
  title: string
  subtitle?: string
  description?: string
  handle: string
  is_giftcard: boolean
  status: 'draft' | 'proposed' | 'published' | 'rejected'
  images: Image[]
  thumbnail?: string
  options: ProductOption[]
  variants: ProductVariant[]
  categories: ProductCategory[]
  profile_id: string
  profile: ShippingProfile
  weight?: number
  length?: number
  height?: number
  width?: number
  hs_code?: string
  origin_country?: string
  mid_code?: string
  material?: string
  collection_id?: string
  collection: ProductCollection
  type_id?: string
  type: ProductType
  tags: ProductTag[]
  discountable: boolean
  external_id?: string
  created_at: string
  updated_at: string
}

interface Address {
  id: string
  customer_id?: string
  company?: string
  first_name?: string
  last_name?: string
  address_1?: string
  address_2?: string
  city?: string
  country_code?: string
  country: Country
  province?: string
  postal_code?: string
  phone?: string
  created_at?: string
  updated_at?: string
}

interface Region {
  id: string
  name: string
  currency_code: string
  currency: Currency
  tax_rate: number
  tax_rates: TaxRate[]
  tax_code?: string
  gift_cards_taxable: boolean
  automatic_taxes: boolean
  countries: Country[]
  tax_provider_id?: string
  payment_providers: PaymentProvider[]
  fulfillment_providers: FulfillmentProvider[]
  includes_tax: boolean
  created_at: string
  updated_at: string
}

interface Discount {
  id: string
  code: string
  is_dynamic: boolean
  rule_id: string
  rule: DiscountRule
  is_disabled: boolean
  parent_discount_id?: string
  parent_discount?: Discount
  starts_at: string
  ends_at?: string
  valid_duration?: string
  regions: Region[]
  usage_limit?: number
  usage_count: number
  created_at: string
  updated_at: string
}

interface DiscountRule {
  id: string
  type: 'fixed' | 'percentage' | 'free_shipping'
  description?: string
  value: number
  allocation?: 'total' | 'item'
  conditions: DiscountCondition[]
  created_at: string
  updated_at: string
}

interface DiscountCondition {
  id: string
  type: 'products' | 'product_types' | 'product_collections' | 'product_tags' | 'customer_groups'
  operator: 'in' | 'not_in'
  discount_rule_id: string
  products: Product[]
  product_types: ProductType[]
  product_collections: ProductCollection[]
  product_tags: ProductTag[]
  customer_groups: CustomerGroup[]
  created_at: string
  updated_at: string
}

interface GiftCard {
  id: string
  code: string
  value: number
  balance: number
  region_id: string
  region: Region
  order_id?: string
  order: Order
  is_disabled: boolean
  ends_at?: string
  tax_rate?: number
  created_at: string
  updated_at: string
}

interface PaymentSession {
  id: string
  cart_id: string
  provider_id: string
  is_selected: boolean
  is_initiated: boolean
  status: 'authorized' | 'pending' | 'requires_more' | 'error' | 'canceled'
  data: Record<string, any>
  amount: number
  payment_authorized_at?: string
  idempotency_key?: string
  created_at: string
  updated_at: string
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
  idempotency_key?: string
  created_at: string
  updated_at: string
}

interface ShippingMethod {
  id: string
  shipping_option_id: string
  order_id?: string
  cart_id?: string
  swap_id?: string
  return_id?: string
  claim_order_id?: string
  name: string
  description?: string
  amount: number
  is_return: boolean
  data: Record<string, any>
  price: number
  shipping_option: ShippingOption
  tax_lines: ShippingMethodTaxLine[]
  adjustments: ShippingMethodAdjustment[]
}

interface ShippingOption {
  id: string
  name: string
  region_id: string
  profile_id: string
  provider_id: string
  price_type: 'flat_rate' | 'calculated'
  amount?: number
  is_return: boolean
  admin_only: boolean
  requirements: ShippingOptionRequirement[]
  data: Record<string, any>
  includes_tax: boolean
  created_at: string
  updated_at: string
}

interface Customer {
  id: string
  email: string
  first_name?: string
  last_name?: string
  billing_address_id?: string
  billing_address?: Address
  shipping_addresses: Address[]
  password_hash?: string
  phone?: string
  has_account: boolean
  orders: Order[]
  groups: CustomerGroup[]
  created_at: string
  updated_at: string
}

interface SalesChannel {
  id: string
  name: string
  description?: string
  is_disabled: boolean
  locations: SalesChannelLocation[]
  created_at: string
  updated_at: string
}

// Pomocnicze interfejsy
interface Price {
  id: string
  currency_code: string
  amount: number
  min_quantity?: number
  max_quantity?: number
  price_list_id?: string
  variant_id: string
  region_id?: string
  created_at: string
  updated_at: string
}

interface Image {
  id: string
  url: string
  created_at: string
  updated_at: string
}

interface ProductOption {
  id: string
  title: string
  values: ProductOptionValue[]
  product_id: string
  created_at: string
  updated_at: string
}

interface ProductOptionValue {
  id: string
  value: string
  option_id: string
  variant_id: string
  created_at: string
  updated_at: string
}

interface ProductCategory {
  id: string
  name: string
  handle: string
  is_active: boolean
  is_internal: boolean
  parent_category_id?: string
  parent_category?: ProductCategory
  category_children: ProductCategory[]
  products: Product[]
  created_at: string
  updated_at: string
}

interface ProductCollection {
  id: string
  title: string
  handle: string
  products: Product[]
  created_at: string
  updated_at: string
}

interface ProductType {
  id: string
  value: string
  created_at: string
  updated_at: string
}

interface ProductTag {
  id: string
  value: string
  created_at: string
  updated_at: string
}

interface ShippingProfile {
  id: string
  name: string
  type: 'default' | 'gift_card' | 'custom'
  products: Product[]
  shipping_options: ShippingOption[]
  created_at: string
  updated_at: string
}

interface Country {
  id: number
  iso_2: string
  iso_3: string
  num_code: number
  name: string
  display_name: string
  region_id?: string
  region?: Region
}

interface Currency {
  code: string
  symbol: string
  symbol_native: string
  name: string
  includes_tax?: boolean
}

interface TaxRate {
  id: string
  rate?: number
  code?: string
  name: string
  region_id: string
  region?: Region
  products: Product[]
  product_types: ProductType[]
  shipping_options: ShippingOption[]
  product_count?: number
  product_type_count?: number
  shipping_option_count?: number
  created_at: string
  updated_at: string
}

interface PaymentProvider {
  id: string
  is_installed: boolean
}

interface FulfillmentProvider {
  id: string
  is_installed: boolean
}

interface CustomerGroup {
  id: string
  name: string
  customers: Customer[]
  price_lists: PriceList[]
  created_at: string
  updated_at: string
}

interface Order {
  id: string
  status: string
  fulfillment_status: string
  payment_status: string
  display_id: number
  cart_id: string
  customer_id: string
  email: string
  created_at: string
  updated_at: string
}

interface PriceList {
  id: string
  name: string
  description: string
  type: 'sale' | 'override'
  status: 'active' | 'draft'
  starts_at?: string
  ends_at?: string
  customer_groups: CustomerGroup[]
  prices: Price[]
  includes_tax: boolean
  created_at: string
  updated_at: string
}

interface LineItemAdjustment {
  id: string
  item_id: string
  description: string
  discount_id?: string
  amount: number
  metadata?: Record<string, any>
}

interface LineItemTaxLine {
  id: string
  rate: number
  name: string
  code?: string
  item_id: string
  metadata?: Record<string, any>
}

interface ShippingMethodTaxLine {
  id: string
  rate: number
  name: string
  code?: string
  shipping_method_id: string
  metadata?: Record<string, any>
}

interface ShippingMethodAdjustment {
  id: string
  shipping_method_id: string
  description: string
  discount_id?: string
  amount: number
  metadata?: Record<string, any>
}

interface ShippingOptionRequirement {
  id: string
  shipping_option_id: string
  type: 'min_subtotal' | 'max_subtotal'
  amount: number
}

interface SalesChannelLocation {
  id: string
  sales_channel_id: string
  location_id: string
}

// Typy dla akcji
interface CreateCartData {
  region_id?: string
  sales_channel_id?: string
  country_code?: string
  items?: AddLineItemData[]
  customer_id?: string
  email?: string
  billing_address?: Partial<Address>
  shipping_address?: Partial<Address>
  discounts?: { code: string }[]
  gift_cards?: { code: string }[]
  context?: Record<string, any>
}

interface AddLineItemData {
  variant_id: string
  quantity: number
  metadata?: Record<string, any>
  unit_price?: number
}

interface UpdateLineItemData {
  quantity: number
  metadata?: Record<string, any>
}

interface AddDiscountData {
  code: string
}

interface AddGiftCardData {
  code: string
}

interface UpdateCartData {
  customer_id?: string
  email?: string
  billing_address?: Partial<Address>
  shipping_address?: Partial<Address>
  discounts?: { code: string }[]
  gift_cards?: { code: string }[]
  context?: Record<string, any>
  sales_channel_id?: string
}

interface AddShippingMethodData {
  option_id: string
  data?: Record<string, any>
}

interface CreatePaymentSessionsData {
  provider_id?: string
}

interface UpdatePaymentSessionData {
  data: Record<string, any>
}

interface SetPaymentSessionData {
  provider_id: string
}

interface CompleteCartData {
  context?: Record<string, any>
}


export const useCartStore = defineStore('cart', () => {
  const client = useMedusaClient()
  
  // Stan
  const cart = ref<Cart | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const shippingOptions = ref<ShippingOption[]>([])

  // Gettery
  const cartId = computed(() => cart.value?.id || null)
  
  const items = computed(() => cart.value?.items || [])
  
  const itemsCount = computed(() => {
    if (!cart.value?.items) return 0
    return cart.value.items.reduce((total, item) => total + item.quantity, 0)
  })

  const isEmpty = computed(() => itemsCount.value === 0)

  const subtotal = computed(() => cart.value?.subtotal || 0)
  const total = computed(() => cart.value?.total || 0)
  const shippingTotal = computed(() => cart.value?.shipping_total || 0)
  const taxTotal = computed(() => cart.value?.tax_total || 0)
  const discountTotal = computed(() => cart.value?.discount_total || 0)
  const giftCardTotal = computed(() => cart.value?.gift_card_total || 0)

  const hasShippingMethod = computed(() => 
    cart.value?.shipping_methods && cart.value.shipping_methods.length > 0
  )

  const hasPaymentSession = computed(() => 
    cart.value?.payment_sessions && cart.value.payment_sessions.length > 0
  )

  const selectedPaymentSession = computed(() => 
    cart.value?.payment_sessions?.find(session => session.is_selected) || null
  )

  const canComplete = computed(() => {
    return cart.value && 
           cart.value.items.length > 0 && 
           cart.value.billing_address &&
           cart.value.shipping_address &&
           hasShippingMethod.value &&
           selectedPaymentSession.value
  })

  // Helper to get line item by variant ID
  const getLineItemByVariant = computed(() => {
    return (variantId: string) => {
      return cart.value?.items.find(item => item.variant_id === variantId)
    }
  })

  // Helper to format price
  const formatPrice = (amount: number, currencyCode?: string) => {
    const currency = currencyCode || cart.value?.region?.currency_code || 'USD'
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: currency
    }).format(amount / 100)
  }

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

  // Inicjalizacja koszyka przy starcie aplikacji
  const initializeCart = async () => {
    try {
      const cartIdCookie = useCookie('cart_id', {
        default: () => null,
        maxAge: 60 * 60 * 24 * 30, // 30 dni
        secure: true,
        sameSite: 'strict'
      })
      
      if (cartIdCookie.value) {
        await retrieveCart(cartIdCookie.value)
        console.log('[✔] Koszyk: udało się zainicjować koszyk')
      }
    } catch (err) {
      // Jeśli nie można pobrać zapisanego koszyka, po prostu ignorujemy błąd
      console.warn('Nie można pobrać zapisanego koszyka:', err)
    }
  }

  // Tworzenie koszyka
  const createCart = async (data: CreateCartData = {}) => {
    try {
      setLoading(true)
      clearError()

      const response = await client.store.cart.create({
        region_id: data.region_id,
        sales_channel_id: data.sales_channel_id,
        country_code: data.country_code,
        items: data.items,
        customer_id: data.customer_id,
        email: data.email,
        billing_address: data.billing_address,
        shipping_address: data.shipping_address,
        discounts: data.discounts,
        gift_cards: data.gift_cards,
        context: data.context
      })

      if (response.cart) {
        cart.value = response.cart
        // Zapisz ID koszyka w cookies dla trwałości
        const cartIdCookie = useCookie('cart_id', {
          default: () => null,
          maxAge: 60 * 60 * 24 * 30, // 30 dni
          secure: true,
          sameSite: 'strict'
        })
        cartIdCookie.value = response.cart.id
      }

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas tworzenia koszyka'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Pobranie koszyka
  const retrieveCart = async (cartId?: string) => {
    try {
      setLoading(true)
      clearError()

      const id = cartId || (useCookie('cart_id', {
        default: () => null,
        maxAge: 60 * 60 * 24 * 30, // 30 dni
        secure: true,
        sameSite: 'strict'
      }).value)
      
      if (!id) {
        initializeCart()
      }

      const response = await client.store.cart.retrieve(id)

      if (response.cart) {
        cart.value = response.cart
      }

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas pobierania koszyka'
      setError(message)
      // Jeśli koszyk nie istnieje, usuń z cookies
      if (useCookie('cart_id', {
        default: () => null,
        maxAge: 60 * 60 * 24 * 30, // 30 dni
        secure: true,
        sameSite: 'strict'
      }).value && err?.response?.status === 404) {
        useCookie('cart_id', {
          default: () => null,
          maxAge: 60 * 60 * 24 * 30, // 30 dni
          secure: true,
          sameSite: 'strict'
        }).value = null
        cart.value = null
      }
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Aktualizacja koszyka
  const updateCart = async (data: UpdateCartData) => {
    try {
      setLoading(true)
      clearError()

      if (!cart.value) {
        throw new Error('Brak aktywnego koszyka')
      }

      const response = await client.store.cart.update(cart.value.id, {
        customer_id: data.customer_id,
        email: data.email,
        billing_address: data.billing_address,
        shipping_address: data.shipping_address,
        discounts: data.discounts,
        gift_cards: data.gift_cards,
        context: data.context,
        sales_channel_id: data.sales_channel_id
      })

      if (response.cart) {
        cart.value = response.cart
      }

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas aktualizacji koszyka'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Usunięcie koszyka i wyczyszczenie stanu
  const clearCart = async () => {
    try {
      setLoading(true)
      clearError()

      if (cart.value) {
        // Możesz dodać wywołanie API do usunięcia koszyka jeśli jest dostępne
        // await client.store.cart.delete(cart.value.id)
      }

      cart.value = null
      
      useCookie('cart_id', {
        default: () => null,
        maxAge: 60 * 60 * 24 * 30, // 30 dni
        secure: true,
        sameSite: 'strict'
      }).value = null
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas czyszczenia koszyka'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Zapewnienie istnienia koszyka
  const ensureCart = async () => {
    if (!cart.value) {
      await createCart()
    }
    return cart.value
  }

  // Dodanie produktu do koszyka
  const addLineItem = async (data: AddLineItemData) => {
    try {
      setLoading(true)
      clearError()

      await ensureCart()

      if (!cart.value) {
        throw new Error('Nie można utworzyć koszyka')
      }

      const response = await client.store.cart.lineItems.create(cart.value.id, {
        variant_id: data.variant_id,
        quantity: data.quantity,
        metadata: data.metadata,
        unit_price: data.unit_price
      })

      if (response.cart) {
        cart.value = response.cart
      }

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas dodawania produktu do koszyka'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Aktualizacja produktu w koszyku
  const updateLineItem = async (lineItemId: string, data: UpdateLineItemData) => {
    try {
      setLoading(true)
      clearError()

      if (!cart.value) {
        throw new Error('Brak aktywnego koszyka')
      }

      const response = await client.store.cart.lineItems.update(cart.value.id, lineItemId, {
        quantity: data.quantity,
        metadata: data.metadata
      })

      if (response.cart) {
        cart.value = response.cart
      }

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas aktualizacji produktu w koszyku'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Usunięcie produktu z koszyka
  const removeLineItem = async (lineItemId: string) => {
    try {
      setLoading(true)
      clearError()

      if (!cart.value) {
        throw new Error('Brak aktywnego koszyka')
      }

      const response = await client.store.cart.lineItems.delete(cart.value.id, lineItemId)

      if (response.cart) {
        cart.value = response.cart
      }

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas usuwania produktu z koszyka'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Wygodna funkcja do dodania lub aktualizacji ilości produktu
  const addOrUpdateItem = async (variantId: string, quantity: number = 1) => {
    const existingItem = getLineItemByVariant.value(variantId)
    
    if (existingItem) {
      return await updateLineItem(existingItem.id, {
        quantity: existingItem.quantity + quantity
      })
    } else {
      return await addLineItem({ variant_id: variantId, quantity })
    }
  }

  // Ustawienie konkretnej ilości produktu
  const setItemQuantity = async (variantId: string, quantity: number) => {
    const existingItem = getLineItemByVariant.value(variantId)
    
    if (existingItem) {
      if (quantity === 0) {
        return await removeLineItem(existingItem.id)
      } else {
        return await updateLineItem(existingItem.id, { quantity })
      }
    } else if (quantity > 0) {
      return await addLineItem({ variant_id: variantId, quantity })
    }
  }

  // Zwiększenie ilości produktu o 1
  const incrementItem = async (variantId: string) => {
    return await addOrUpdateItem(variantId, 1)
  }

  // Zmniejszenie ilości produktu o 1
  const decrementItem = async (variantId: string) => {
    const existingItem = getLineItemByVariant.value(variantId)
    
    if (existingItem) {
      const newQuantity = existingItem.quantity - 1
      if (newQuantity <= 0) {
        return await removeLineItem(existingItem.id)
      } else {
        return await updateLineItem(existingItem.id, { quantity: newQuantity })
      }
    }
  }

  // Dodanie kodu rabatowego
  const addDiscount = async (data: AddDiscountData) => {
    try {
      setLoading(true)
      clearError()

      if (!cart.value) {
        throw new Error('Brak aktywnego koszyka')
      }

      const response = await client.store.cart.discounts.add(cart.value.id, {
        code: data.code
      })

      if (response.cart) {
        cart.value = response.cart
      }

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas dodawania kodu rabatowego'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Usunięcie kodu rabatowego
  const removeDiscount = async (discountCode: string) => {
    try {
      setLoading(true)
      clearError()

      if (!cart.value) {
        throw new Error('Brak aktywnego koszyka')
      }

      const response = await client.store.cart.discounts.delete(cart.value.id, discountCode)

      if (response.cart) {
        cart.value = response.cart
      }

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas usuwania kodu rabatowego'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Dodanie karty podarunkowej
  const addGiftCard = async (data: AddGiftCardData) => {
    try {
      setLoading(true)
      clearError()

      if (!cart.value) {
        throw new Error('Brak aktywnego koszyka')
      }

      const response = await client.store.cart.giftCards.add(cart.value.id, {
        code: data.code
      })

      if (response.cart) {
        cart.value = response.cart
      }

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas dodawania karty podarunkowej'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Usunięcie karty podarunkowej
  const removeGiftCard = async (giftCardCode: string) => {
    try {
      setLoading(true)
      clearError()

      if (!cart.value) {
        throw new Error('Brak aktywnego koszyka')
      }

      const response = await client.store.cart.giftCards.delete(cart.value.id, giftCardCode)

      if (response.cart) {
        cart.value = response.cart
      }

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas usuwania karty podarunkowej'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Pobranie opcji wysyłki
  const listShippingOptions = async () => {
    try {
      setLoading(true)
      clearError()

      if (!cart.value) {
        throw new Error('Brak aktywnego koszyka')
      }

      const response = await client.shippingOptions.listCartOptions(cart.value.id)
      
      if (response.shipping_options) {
        shippingOptions.value = response.shipping_options
      }

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas pobierania opcji wysyłki'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Dodanie metody wysyłki
  const addShippingMethod = async (data: AddShippingMethodData) => {
    try {
      setLoading(true)
      clearError()

      if (!cart.value) {
        throw new Error('Brak aktywnego koszyka')
      }

      const response = await client.store.cart.shippingMethods.add(cart.value.id, {
        option_id: data.option_id,
        data: data.data
      })

      if (response.cart) {
        cart.value = response.cart
      }

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas dodawania metody wysyłki'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Stworzenie sesji płatności
  const createPaymentSessions = async (data?: CreatePaymentSessionsData) => {
    try {
      setLoading(true)
      clearError()

      if (!cart.value) {
        throw new Error('Brak aktywnego koszyka')
      }

      const response = await client.store.cart.paymentSessions.create(cart.value.id, data?.provider_id ? {
        provider_id: data.provider_id
      } : {})

      if (response.cart) {
        cart.value = response.cart
      }

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas tworzenia sesji płatności'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Inicjowanie sesji płatności (dla payment collection)
  const initiatePaymentSession = async (provider_id: string) => {
    try {
      setLoading(true)
      clearError()

      if (!cart.value) {
        throw new Error('Brak aktywnego koszyka')
      }

      const paymentResponse = await client.store.payment.initiatePaymentSession(cart.value, {
        provider_id,
      })

      return paymentResponse.payment_collection
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas inicjowania sesji płatności'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Aktualizacja sesji płatności
  const updatePaymentSession = async (providerId: string, data: UpdatePaymentSessionData) => {
    try {
      setLoading(true)
      clearError()

      if (!cart.value) {
        throw new Error('Brak aktywnego koszyka')
      }

      const response = await client.store.cart.paymentSessions.update(cart.value.id, providerId, {
        data: data.data
      })

      if (response.cart) {
        cart.value = response.cart
      }

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas aktualizacji sesji płatności'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Wybór sesji płatności
  const setPaymentSession = async (data: SetPaymentSessionData) => {
    try {
      setLoading(true)
      clearError()

      if (!cart.value) {
        throw new Error('Brak aktywnego koszyka')
      }

      const response = await client.store.cart.paymentSessions.select(cart.value.id, data.provider_id)

      if (response.cart) {
        cart.value = response.cart
      }

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas wyboru sesji płatności'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Odświeżenie sesji płatności
  const refreshPaymentSession = async (providerId: string) => {
    try {
      setLoading(true)
      clearError()

      if (!cart.value) {
        throw new Error('Brak aktywnego koszyka')
      }

      const response = await client.store.cart.paymentSessions.refresh(cart.value.id, providerId)

      if (response.cart) {
        cart.value = response.cart
      }

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas odświeżania sesji płatności'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Finalizacja koszyka i utworzenie zamówienia
  const completeCart = async (data?: CompleteCartData) => {
    try {
      setLoading(true)
      clearError()

      if (!cart.value) {
        throw new Error('Brak aktywnego koszyka')
      }

      if (!canComplete.value) {
        throw new Error('Koszyk nie jest gotowy do finalizacji')
      }

      const response = await client.store.cart.complete(cart.value.id, {
        context: data?.context
      })

      // Po udanej finalizacji, wyczyść koszyk
      if (response.type === 'order') {
        cart.value = null
        useCookie('cart_id', {
          default: () => null,
          maxAge: 60 * 60 * 24 * 30, // 30 dni
          secure: true,
          sameSite: 'strict'
        }).value = null
      }

      return response
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd podczas finalizacji koszyka'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Aktualizacja adresu rozliczeniowego
  const updateBillingAddress = async (address: Partial<Address>) => {
    return await updateCart({ billing_address: address })
  }

  // Aktualizacja adresu wysyłki
  const updateShippingAddress = async (address: Partial<Address>) => {
    return await updateCart({ shipping_address: address })
  }

  // Ustawienie emaila klienta
  const setCustomerEmail = async (email: string) => {
    return await updateCart({ email })
  }

  // Przypisanie klienta do koszyka
  const assignCustomer = async (customerId: string) => {
    return await updateCart({ customer_id: customerId })
  }

  // Pobranie podsumowania koszyka (przydatne do widoku checkout)
  const getCartSummary = computed(() => {
    if (!cart.value) return null

    return {
      id: cart.value.id,
      itemsCount: itemsCount.value,
      subtotal: formatPrice(subtotal.value),
      shippingTotal: formatPrice(shippingTotal.value),
      taxTotal: formatPrice(taxTotal.value),
      discountTotal: formatPrice(discountTotal.value),
      giftCardTotal: formatPrice(giftCardTotal.value),
      total: formatPrice(total.value),
      currency: cart.value.region.currency_code,
      hasShipping: hasShippingMethod.value,
      hasPayment: hasPaymentSession.value,
      canComplete: canComplete.value
    }
  })

  return {
    // Stan
    cart,
    loading,
    error,
    shippingOptions,

    // Gettery
    cartId,
    items,
    itemsCount,
    isEmpty,
    subtotal,
    total,
    shippingTotal,
    taxTotal,
    discountTotal,
    giftCardTotal,
    hasShippingMethod,
    hasPaymentSession,
    selectedPaymentSession,
    canComplete,
    getLineItemByVariant,
    getCartSummary,

    // Akcje podstawowe
    initializeCart,
    createCart,
    retrieveCart,
    updateCart,
    clearCart,
    ensureCart,

    // Zarządzanie produktami
    addLineItem,
    updateLineItem,
    removeLineItem,
    addOrUpdateItem,
    setItemQuantity,
    incrementItem,
    decrementItem,

    // Promocje
    addDiscount,
    removeDiscount,
    addGiftCard,
    removeGiftCard,

    // Wysyłka
    listShippingOptions,
    addShippingMethod,

    // Płatności
    createPaymentSessions,
    initiatePaymentSession,
    updatePaymentSession,
    setPaymentSession,
    refreshPaymentSession,

    // Finalizacja
    completeCart,

    // Adresy i klient
    updateBillingAddress,
    updateShippingAddress,
    setCustomerEmail,
    assignCustomer,

    // Pomocnicze
    formatPrice,
    clearError,
    setLoading,
    setError
  }
})
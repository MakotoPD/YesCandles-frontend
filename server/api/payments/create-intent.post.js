// /server/api/payments/create-intent.post.js

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { orderId, amount, paymentMethod } = body

    // Walidacja danych
    if (!orderId || !amount || !paymentMethod) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Brakuje wymaganych danych'
      })
    }

    // Pobieranie szczegółów zamówienia z WordPress/WooCommerce
    const order = await fetchOrderFromWooCommerce(orderId)
    
    if (!order) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Zamówienie nie zostało znalezione'
      })
    }

    let paymentIntent

    switch (paymentMethod) {
      case 'card':
        paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: 'pln',
          payment_method_types: ['card'],
          metadata: {
            order_id: orderId.toString(),
            source: 'woocommerce'
          }
        })
        break

      case 'blik':
        // Dla BLIK używamy Stripe Checkout
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['blik'],
          line_items: [
            {
              price_data: {
                currency: 'pln',
                product_data: {
                  name: `Zamówienie #${orderId}`,
                },
                unit_amount: amount,
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${process.env.FRONTEND_URL}/zamowienie-zlozone?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.FRONTEND_URL}/zamowienie-anulowane`,
          metadata: {
            order_id: orderId.toString(),
            source: 'woocommerce'
          }
        })
        
        return {
          session_id: session.id,
          url: session.url
        }

      case 'p24':
        paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: 'pln',
          payment_method_types: ['p24'],
          metadata: {
            order_id: orderId.toString(),
            source: 'woocommerce'
          }
        })
        break

      default:
        throw createError({
          statusCode: 400,
          statusMessage: 'Nieobsługiwana metoda płatności'
        })
    }

    return {
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id
    }

  } catch (error) {
    console.error('Błąd tworzenia PaymentIntent:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Błąd serwera'
    })
  }
})

// Funkcja pomocnicza do pobierania zamówienia z WooCommerce
async function fetchOrderFromWooCommerce(orderId) {
  try {
    const response = await fetch(`${process.env.WORDPRESS_URL}/wp-json/wc/v3/orders/${orderId}`, {
      params: {
        consumer_key: process.env.WOO_CONSUMER_KEY,
        consumer_secret: process.env.WOO_CONSUMER_SECRET,
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Błąd pobierania zamówienia:', error)
    return null
  }
}
// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'


export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/image',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@pinia/nuxt',
  ],
  
  // Image module configuration
  image: {
    domains: ['yescandles.pl'],
    format: ['webp', 'jpg', 'jpeg', 'png'],
    provider: 'ipx',
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    }
  },
  
  // App configuration
  app: {
    head: {
      title: 'YesCandles - Ręcznie robione świeczki woskowe',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Sklep z ręcznie robionymi świeczkami woskowymi' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
      script: [
        // Google Sign-In API
        { src: 'https://accounts.google.com/gsi/client', async: true, defer: true }
      ]
    }
  },
  
  // Runtime config for WordPress API
  runtimeConfig: {
    // Prywatne (tylko serwer)
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    // Publiczne (klient + serwer)
    public: {
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
      wordpressUrl: process.env.WORDPRESS_URL,
      frontendUrl: process.env.FRONTEND_URL,
      wooApiUrl: process.env.WOO_API_URL,
      wooConsumerKey: process.env.WOO_CONSUMER_KEY,
      wooConsumerSecret: process.env.WOO_CONSUMER_SECRET,
    }
  },
  
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  nitro: {
    experimental: {
      wasm: true
    }
  }

})
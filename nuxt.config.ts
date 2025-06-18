import type { StoreRegion } from '@medusajs/types'


export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxtjs/google-fonts',
    '@nuxt/icon',
    '@nuxt/ui',
    '@nuxtjs/medusa',
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
    '@nuxthub/core',
    '@pinia/nuxt',
  ],

  pinia: {
    storesDirs: ['./app/stores/**'],
  },

  googleFonts: {
    families: {
      Poppins: {
        wght: [200, 300, 400, 500, 600, 700, 800, 900],
      } 
    }
  },

  css: [
    '~/assets/css/main.css',
  ],

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    lang: 'pl',
    head: {
      title: 'YesCandles - Ręcznie robione świeczki woskowe',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Sklep z ręcznie robionymi świeczkami woskowymi' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon/fav-32x32.ico' }
      ],
    }
  },

  ui: {
    colorMode: false,
    global: true,
    icons: ['heroicons'],
    safelistColors: ['pink', 'rose', 'red', 'green', 'yellow', 'purple'],
  },

  routeRules: {
    '/': { prerender: true },
    '/produkty/**': { ssr: true },
    '/kolekcje/**': { ssr: true },
    '/kategorie/**': { ssr: true },
    '/konto': { ssr: true },
    '/sklep': { ssr: true },
    '/koszyk': { ssr: true },
    '/zamowienie': { ssr: true },
    '/zamowienie/**': { ssr: true },
  },

  future: {
    compatibilityVersion: 4,
  },

  medusa: {
    baseUrl: process.env.MEDUSA_URL || 'http://localhost:9000',
    global: true,
    server: true,
    debug: false,
    publishableKey: process.env.MEDUSA_PUBLISHABLE_KEY,

  },

  // No country-specific routes since the site is only in Polish
  hooks: {},

  eslint: {
    config: {
      stylistic: true,
    },
  },



  runtimeConfig: {
    public: {
      stripeKey: process.env.NUXT_PUBLIC_STRIPE_KEY || '',
      medusa: {
        baseUrl: process.env.MEDUSA_URL || 'http://localhost:9000',
        publishableKey: process.env.MEDUSA_PUBLISHABLE_KEY || '',
      },
    },
  },
})
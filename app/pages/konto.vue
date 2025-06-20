<script setup lang="ts">
import { storeToRefs } from 'pinia'

// Metadata
definePageMeta({
  layout: 'default',
})

useHead({
  title: 'Konto - YesCandles',
  meta: [
    { name: 'description', content: 'Zarządzaj swoim kontem YesCandles' },
  ],
})

// Use Pinia store for auth state
const authStore = useAuthStore()
const { customer, isLoggedIn, pending } = storeToRefs(authStore)

// Form management for signin/register
const mode = ref<'signin' | 'register'>('signin')

// The global middleware `auth.global.ts` handles fetching the customer on load,
// so we don't need to do it here.
</script>

<template>
  <div class="min-h-full">
    <ClientOnly>
      <div class="min-h-[40vh] flex items-center justify-center">
        <!-- Loading state from Pinia store -->
        <div
          v-if="pending"
          class="text-center"
        >
          <UIcon
            name="i-heroicons-arrow-path"
            class="animate-spin h-8 w-8 mx-auto mb-4"
          />
          <p>Ładowanie Twojego konta...</p>
        </div>

        <!-- Connected user profile -->
        <div v-else-if="isLoggedIn && customer" class="py-24 w-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
          <AuthProfile />
        </div>

        <!-- Authentication forms -->
        <Transition
          v-else
          name="fade"
          mode="out-in"
        >
          <!-- Sign in form -->
          <AuthSigninForm
            v-if="mode === 'signin'"
            :key="'signin'"
            @switch-to-register="mode = 'register'"
          />

          <!-- Registration form -->
          <AuthRegisterForm
            v-else
            :key="'register'"
            @switch-to-signin="mode = 'signin'"
          />
        </Transition>
      </div>
    </ClientOnly>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<script setup lang="ts">
import type { NuxtError } from '#app'

// TODO: Customize error page
const {
  error,
} = defineProps<{
  error: NuxtError
}>()
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <AppHeader />
    <NuxtLoadingIndicator />
    <main class="relative">
      Błąd
      {{ error.message }}
    </main>
    <AppFooter />
  </UApp>
</template>

<script setup lang="ts">
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <AppHeader />
    <NuxtLoadingIndicator color="pink" />
    <main class="relative">
      <slot />
    </main>
    <AppFooter />
  </UApp>
</template>

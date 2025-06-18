<script setup lang="ts">
// Since the site is only in Polish language with PLN currency,
// we don't need country selection functionality
</script>

<template>
  <!-- Simple Polish flag display instead of country selector -->
  <div class="flex items-center space-x-2">
    <UIcon name="i-flag-PL-4x3" />
    <span class="uppercase text-sm">Polska</span>
  </div>
</template>

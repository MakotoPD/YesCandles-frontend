<script setup lang="ts">
// Since the site is only in Polish language, we hardcode Polish country code
const value = defineModel<string>()

// Set the value to PL (Poland) on component mount
onMounted(() => {
  value.value = 'PL'
})
</script>

<template>
  <!-- Display Polish flag and country name instead of a dropdown -->
  <div class="flex items-center space-x-2 py-2 w-full">
    <UIcon name="i-flag-PL-4x3" />
    <span>Polska</span>
    <input type="hidden" :value="value" />
  </div>
</template>

<script setup lang="ts">
// Since the site is only in Polish language, we don't need country code in URLs
const {
  to,
} = defineProps<{
  to?: string
}>()

const link = computed(() => {
  if (!to) return undefined
  // Remove country code from URLs
  return to
})
</script>

<template>
  <span>
    <NuxtLink
      v-if="link"
      prefetch
      :to="link"
    >
      <slot />
    </NuxtLink>
    <slot v-else />
  </span>
</template>

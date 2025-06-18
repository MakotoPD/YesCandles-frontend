<script setup lang="ts">
// Since the site is only in Polish language, we don't need country code in URLs
const {
  to,
} = defineProps<{
  to: string
}>()

const link = computed(() => {
  // Remove country code from URLs
  return to
})
</script>

<template>
  <UButton
    :to="link"
    prefetch
    color="primary"
    variant="link"
    :trailing="true"
    class="group"
  >
    <slot />
    <template #trailing>
      <UIcon
        name="i-lucide-arrow-up-right"
        class="group-hover:rotate-45 ease-in-out duration-150 size-5"
      />
    </template>
  </UButton>
</template>

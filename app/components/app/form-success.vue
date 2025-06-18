<script lang="ts" setup>
defineProps<{
  message?: string
  show?: boolean
}>()
</script>

<template>
  <UAlert
    v-if="show && message"
    color="success"
    variant="soft"
    size="xs"
    :ui="{
      wrapper: 'bg-green-50 px-3 py-2',
      description: 'text-xs text-green-500',
      icon: 'text-green-500',
    }"
    icon="i-heroicons-exclamation-circle"
    :title="message"
  />
</template>

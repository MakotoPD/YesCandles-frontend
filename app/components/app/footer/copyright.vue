<script lang="ts" setup>
const { title } = useAppConfig()

const {
  minimal,
} = defineProps<{
  minimal?: boolean
}>()
</script>

<template>
  <div
    class="flex w-full text-color-dimmed text-xs"
    :class="[minimal ? 'py-4 justify-center' : 'mb-16 justify-between']"
  >
    <div
      v-if="!minimal"
      class=""
    >
      © 2025 {{ title }}. Wszelkie prawa zastrzeżone.
    </div>
    <div class="flex gap-x-2 items-center">
      {{ title }}
    </div>
  </div>
</template>

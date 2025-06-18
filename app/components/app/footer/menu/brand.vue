<script lang="ts" setup>
const items = ref([
  {
    title: 'O nas',
    link: '/o-nas',
  },
  {
    title: 'Regulamin',
    link: '/regulamin',
  },
  {
    title: 'Polityka prywatności',
    link: '/polityka-prywatnosci',
  },
  {
    title: 'Zwroty',
    link: '/zwroty',
  },
  {
    title: 'Kontakt',
    link: '/kontakt',
  },
  {
    title: 'FAQ',
    link: '/faq',
  },
])
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <div class="font-medium text-color-highlighted">
      YesCandles
    </div>
    <ul class="grid grid-cols-1 gap-y-2">
      <li
        v-for="item in items"
        :key="item.title"
      >
        <NuxtLink
          :to="item.link"
          class="hover:text-color-highlighted"
        >
          {{ item.title }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

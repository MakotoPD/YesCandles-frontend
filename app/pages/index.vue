<script setup lang="ts">

useHead({
  title: 'YesCandles',
  meta: [
    { name: 'description', content: 'Strona główna YesCandles' },
  ],
})
</script>

<template>
  <div>
    <StoreHero />
    <LazyCollectionList />
    <LazyStoreWhyYescandles />
    <LazyStoreSmallfaq />
  </div>
</template>

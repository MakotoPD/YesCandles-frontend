<template>
  <div class="min-h-screen flex flex-col">
    <TheHeader />
    <main class="flex-grow">
      <slot />
    </main>
    <TheFooter />
    <CartDrawer />
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart';

// Initialize cart from localStorage on client-side
onMounted(() => {
  const cartStore = useCartStore();
  cartStore.loadCart();
});
</script>

<script setup lang="ts">
const isOpen = defineModel<boolean>()
const { title } = useAppConfig()

// Since the site is only in Polish language, we don't need country selection
</script>

<template>
  <USlideover
    v-model:open="isOpen"
    side="left"
    title="Menu"
    description="Menu nawigacyjne"
    :ui="{
      overlay: { background: 'bg-gray-900/50' },
      wrapper: { background: 'bg-white' },
      title: { font: 'font-medium text-pink-600' },
    }"
  >
    <template #body>
      <div class="h-full min-h-48 flex flex-col justify-between">
        <div class="flex flex-col space-y-4">
          <AppLink
            to="/"
            @click="isOpen = false"
            class="footer-link py-2 border-b border-gray-100 flex items-center"
          >
            <UIcon name="i-lucide-home" class="mr-2" /> Strona główna
          </AppLink>
          <AppLink
            to="/sklep"
            @click="isOpen = false"
            class="footer-link py-2 border-b border-gray-100 flex items-center"
          >
            <UIcon name="i-lucide-shopping-bag" class="mr-2" /> Sklep
          </AppLink>
          <AppLink
            to="/konto"
            @click="isOpen = false"
            class="footer-link py-2 border-b border-gray-100 flex items-center"
          >
            <UIcon name="i-lucide-user" class="mr-2" /> Konto
          </AppLink>
          <AppLink
            to="/koszyk"
            @click="isOpen = false"
            class="footer-link py-2 border-b border-gray-100 flex items-center"
          >
            <UIcon name="i-lucide-shopping-cart" class="mr-2" /> Koszyk
          </AppLink>
        </div>
        <div>
          <!-- Polish flag display instead of country selector -->
          <div class="flex items-center space-x-2">
            <span class="text-xs">Dostawa do:</span>
            <UIcon name="i-flag-PL-4x3" />
            <span class="text-xs">Polska</span>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <p class="text-xs text-color-muted">
        © 2025 {{ title }}. Wszelkie prawa zastrzeżone.
      </p>
    </template>
  </USlideover>
</template>

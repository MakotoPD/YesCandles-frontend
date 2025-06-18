<template>
  <div class="text-center py-8">
    <div class="flex justify-center mb-6">
      <div class="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center">
        <Icon name="i-lucide-shopping-cart" class="text-pink-500 w-8 h-8" />
      </div>
    </div>
    <p class="font-medium text-lg mb-6 max-w-md mx-auto text-gray-700">
      Twój koszyk jest pusty
    </p>
    <p class="text-sm mb-8 max-w-md mx-auto text-gray-500">
      Nie masz nic w koszyku. Zmień to, użyj przycisku poniżej, aby rozpocząć przeglądanie naszych produktów.
    </p>
    <div>
      <UButton
        to="/sklep"
        color="pink"
        class="bg-gradient-to-r from-pink-400 to-pink-600 text-white hover:opacity-90"
      >
        Przejdź do sklepu
      </UButton>
    </div>
  </div>
</template>

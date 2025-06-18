<script setup lang="ts">
</script>

<template>
  <div class="hero-section h-[75vh] w-full border-b border-pink-100 sm:p-32 gap-8">
    <UContainer class="pt-12 sm:pt-0 grid grid-cols-1 gap-8 md:grid-cols-2 text-center">
      <div class="flex flex-col justify-center items-start">
        <div>
          <h1 class="text-5xl text-left font-bold leading-15 tracking-tight text-pink-900 mb-2">
            Twórz chwile <span class="text-pink-500">spokoju</span> z każdym płomieniem
          </h1>
          <p class="text-xl text-left leading-10 tracking-tight text-gray-700">
            Świece stworzone z miłością i troską 
          </p>
        </div>
        <UButton
          to="/sklep"
          class="btn-yescandles mt-4"
          :trailing="true"
          size="xl"
          icon="i-lucide-arrow-right"
        >
          Przejdź do sklepu
        </UButton>
      </div>

      <div class="flex flex-col justify-center items-center">
        <NuxtImg
          src="/images/candle-homepage.jpg"
          alt="Logo Make It Cozy"
          class="w-xl h-xl object-cover rounded-4xl"
          loading="lazy"

        />
      </div>
    </UContainer>
    
  </div>
</template>

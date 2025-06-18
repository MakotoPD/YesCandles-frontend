<template>
    <UContainer class="w-full flex flex-col items-center mb-16">
        <h3 class="text-xl font-bold text-pink-600">FAQ</h3>
        <h2 class="text-4xl font-bold mb-8 text-pink-800">Masz jakieś pytania?</h2>
        <div class="w-5xl">
            <UAccordion v-model="active" :items="items" >
                <template #content="{ item }">
                    <p v-html="item.content"></p>
                </template>
            </UAccordion>
        </div>
        <div>
            <UButton
                to="/faq"
                class="btn-yescandles mt-4"
                :trailing="true"
                size="xl"
                icon="i-lucide-message-circle-question"
                >
                Masz jeszcze jakieś pytania?
            </UButton>
        </div>
    </UContainer>
</template>

<script lang="ts" setup>
import type { AccordionItem } from '@nuxt/ui'

const items: AccordionItem[] = [
  {
    label: 'Z jakich materiałów są wasze świece?',
    icon: 'i-lucide-leaf',
    content: 'Nasze świece oraz woski zapachowe wykonujemy tylko i wyłącznie z wosku sojowego. Nie używamy parafiny, by zapewnić naszym klientom najwyższą jakość produktów.'
  },
  {
    label: 'Czy świece są bezpieczne?',
    icon: 'i-lucide-shield-check',
    content: 'Wszystkie produkty dostępne w naszym sklepie są przetestowane i gotowe do użytku zgodnie z instrukcją. Korzystamy tylko z certyfikowanego szkła przeznaczonego do zalewu świec oraz wysokiej jakości aromatów i wosku sojowego.'
  },
  {
    label: 'Ile godzin pali się świeca sojowa?',
    icon: 'i-lucide-clock-4',
    content: 'Świece o pojemności 200ml palą się ok 35-40h. Czas może być różny w zależności od warunków oraz docinania knota.'
  },
  {
    label: 'Jak dbać o świece sojowe?',
    icon: 'i-lucide-badge-check',
    content: `
        <b>Knot</b> - każdorazowo przed paleniem świecy należy przyciąć knot do ok 0.5cm </br>
        <b>Wosk</b> - należy uważać by nie zanieczyścić wosku. Świecę po paleniu przykrywać lub odwracać by nie dostawał się do niej kurz </br>
        <b>Szkło</b> - świecę w szkle palimy zawsze na podkładce </br>
        <b>Pierwsze palenie</b> - świeca powinna palić się pierwszy raz do osiągnięcia pełnej tafli, aby nie powstało tunelowanie się </br>
    `
  },
  {
    label: 'Moja świeca odkleja się od szkła, co zrobić?',
    icon: 'i-lucide-glass-water',
    content: 'Nie ma powodu do zmartwień. Naturalne woski w tym sojowe mogą reagować na temperaturę otoczenia. Jeśli widać plamki między świecą, a szkłem, nie wpływa to w żadnym stopniu na jej jakość. Wosk może ponownie przylgnąć do szkła w cieplejszym otoczeniu.'
  },
  {
    label: 'Chcę złożyć spersonalizowane zamówienie, czy jest taka możliwość?',
    icon: 'i-lucide-mail-question',
    content: 'Oczywiście. Z przyjemnością zrealizujemy indywidualne zamówienie. W tej sprawie prosimy o kontakt mailowy.'
  }
]

const active = ref('0')

// onMounted(() => {
//   setInterval(() => {
//     active.value = String((Number(active.value) + 1) % items.length)
//   }, 8000)
// })
</script>
<template>
  <UContainer class="container mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold text-center mb-12">Najczęściej zadawane pytania</h1>
    
    <div class="max-w-3xl mx-auto">
      <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <!-- FAQ Categories -->
        <div class="flex flex-wrap border-b border-gray-200">
          <button 
            v-for="(category, index) in categories" 
            :key="index"
            @click="activeCategory = category"
            :class="[
              'px-4 py-3 font-medium transition-colors duration-200 focus:outline-none',
              activeCategory === category 
                ? 'text-primary-600 border-b-2 border-primary-600' 
                : 'text-gray-600 hover:text-primary-600'
            ]"
          >
            {{ category }}
          </button>
        </div>
        
        <!-- FAQ Items -->
        <div class="p-6">
          <div v-for="(item, index) in filteredFaqItems" :key="index" class="mb-6 last:mb-0">
            <button 
              @click="toggleItem(index)"
              class="flex justify-between items-center w-full text-left font-medium text-gray-900 focus:outline-none"
            >
              <span>{{ item.question }}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                :class="[
                  'h-5 w-5 transition-transform duration-200',
                  openItems.includes(index) ? 'transform rotate-180' : ''
                ]"
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            <div 
              v-show="openItems.includes(index)"
              class="mt-2 text-gray-600"
            >
              <p v-html="item.answer"></p>
            </div>
            <div v-if="index < filteredFaqItems.length - 1" class="border-b border-gray-200 my-6"></div>
          </div>
          
          <div v-if="filteredFaqItems.length === 0" class="text-center py-8">
            <p class="text-gray-500">Brak pytań w tej kategorii.</p>
          </div>
        </div>
      </div>
      
      <!-- Contact Section -->
      <div class="text-center">
        <h2 class="text-2xl font-bold mb-4">Nie znalazłeś odpowiedzi na swoje pytanie?</h2>
        <p class="text-gray-600 mb-6">Skontaktuj się z nami, a nasz zespół z przyjemnością Ci pomoże.</p>
        <NuxtLink 
          to="/kontakt" 
          class="px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition duration-150 ease-in-out inline-block"
        >
          Kontakt
        </NuxtLink>
      </div>
    </div>
  </UContainer>
</template>

<script setup>
import { ref, computed } from 'vue';

// FAQ categories
const categories = ['Wszystkie', 'Produkty', 'Zamówienia', 'Dostawa', 'Zwroty i reklamacje'];
const activeCategory = ref('Wszystkie');

// Track open/closed state of FAQ items
const openItems = ref([]);

// Toggle FAQ item open/closed
const toggleItem = (index) => {
  const position = openItems.value.indexOf(index);
  if (position > -1) {
    openItems.value.splice(position, 1);
  } else {
    openItems.value.push(index);
  }
};

// FAQ items data
const faqItems = [
  {
    category: 'Produkty',
    question: 'Z jakich materiałów wykonane są wasze świece?',
    answer: 'Nasze świece są wykonane z wysokiej jakości wosku sojowego, który jest bardziej ekologiczny niż tradycyjny wosk parafinowy. Wosk sojowy jest biodegradowalny, pali się dłużej i czystszym płomieniem. Używamy również bawełnianych knotów bez ołowiu oraz naturalnych olejków eterycznych do zapachów.'
  },
  {
    category: 'Produkty',
    question: 'Jak długo palą się wasze świece?',
    answer: 'Czas palenia zależy od rozmiaru świecy. Nasze małe świece (100g) palą się około 15-20 godzin, średnie (200g) około 30-40 godzin, a duże (300g) nawet do 60 godzin. Czas palenia może się różnić w zależności od warunków, w jakich świeca jest używana.'
  },
  {
    category: 'Produkty',
    question: 'Czy wasze świece są wegańskie?',
    answer: 'Tak, wszystkie nasze świece są w 100% wegańskie. Nie używamy produktów pochodzenia zwierzęcego ani nie testujemy naszych produktów na zwierzętach.'
  },
  {
    category: 'Produkty',
    question: 'Jak dbać o świecę, aby paliła się jak najdłużej?',
    answer: 'Aby świeca paliła się jak najdłużej i równomiernie, zalecamy:<br>1. Przy pierwszym zapaleniu pozwól świecy palić się, aż cała powierzchnia wosku się stopi (około 2-3 godziny).<br>2. Przycinaj knot do około 5-6 mm przed każdym zapaleniem.<br>3. Nie pal świecy dłużej niż 4 godziny jednorazowo.<br>4. Chroń świecę przed przeciągami.<br>5. Przechowuj świecę w chłodnym, suchym miejscu.'
  },
  {
    category: 'Zamówienia',
    question: 'Jak mogę złożyć zamówienie?',
    answer: 'Zamówienie możesz złożyć online poprzez naszą stronę internetową. Wybierz interesujące Cię produkty, dodaj je do koszyka, a następnie przejdź do kasy, gdzie podasz dane do wysyłki i wybierzesz metodę płatności.'
  },
  {
    category: 'Zamówienia',
    question: 'Jakie formy płatności akceptujecie?',
    answer: 'Akceptujemy płatności przelewem bankowym, kartą płatniczą oraz BLIK.'
  },
  {
    category: 'Zamówienia',
    question: 'Czy mogę zmienić lub anulować moje zamówienie?',
    answer: 'Zmiany lub anulowanie zamówienia są możliwe tylko przed jego wysyłką. Aby to zrobić, skontaktuj się z nami jak najszybciej poprzez e-mail: kontakt@yescandles.pl lub telefonicznie: +48 123 456 789.'
  },
  {
    category: 'Dostawa',
    question: 'Jakie są koszty dostawy?',
    answer: 'Koszt dostawy zależy od wybranej metody. Przesyłka kurierska kosztuje 15 zł, dostawa do paczkomatu 12 zł. Przy zamówieniach powyżej 150 zł dostawa jest darmowa.'
  },
  {
    category: 'Dostawa',
    question: 'Jak długo będę czekać na moje zamówienie?',
    answer: 'Standardowy czas realizacji zamówienia to 1-2 dni robocze. Czas dostawy zależy od wybranej metody i wynosi zazwyczaj 1-2 dni robocze od momentu nadania paczki. Łączny czas od złożenia zamówienia do otrzymania paczki to zwykle 2-4 dni robocze.'
  },
  {
    category: 'Dostawa',
    question: 'Czy wysyłacie zamówienia za granicę?',
    answer: 'Obecnie realizujemy dostawy tylko na terenie Polski. Planujemy rozszerzyć naszą ofertę o wysyłki międzynarodowe w przyszłości.'
  },
  {
    category: 'Zwroty i reklamacje',
    question: 'Jaka jest polityka zwrotów?',
    answer: 'Zgodnie z przepisami o prawach konsumenta, masz prawo odstąpić od umowy zawartej na odległość w ciągu 14 dni od otrzymania produktu bez podania przyczyny. Aby dokonać zwrotu, skontaktuj się z nami mailowo na adres kontakt@yescandles.pl.'
  },
  {
    category: 'Zwroty i reklamacje',
    question: 'Co zrobić, jeśli otrzymam uszkodzony produkt?',
    answer: 'Jeśli otrzymasz uszkodzony produkt, prosimy o kontakt w ciągu 48 godzin od otrzymania przesyłki. Wyślij nam zdjęcia uszkodzonego produktu oraz opakowania na adres kontakt@yescandles.pl. Wymienimy produkt na nowy lub zwrócimy pieniądze.'
  },
  {
    category: 'Zwroty i reklamacje',
    question: 'Czy mogę zwrócić produkt, jeśli zapach mi nie odpowiada?',
    answer: 'Tak, w ramach 14-dniowego prawa do odstąpienia od umowy możesz zwrócić produkt, jeśli zapach nie spełnia Twoich oczekiwań. Produkt powinien być w stanie niezmienionym, nieużywany lub używany tylko w celu sprawdzenia.'
  }
];

// Filter FAQ items based on active category
const filteredFaqItems = computed(() => {
  if (activeCategory.value === 'Wszystkie') {
    return faqItems;
  } else {
    return faqItems.filter(item => item.category === activeCategory.value);
  }
});
</script>

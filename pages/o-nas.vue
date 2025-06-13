<template>
  <div class="container mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold text-center mb-12">O nas</h1>
    
    <!-- Our Story -->
    <section class="mb-16">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div class="order-2 md:order-1">
          <h2 class="text-2xl font-bold mb-4">Nasza historia</h2>
          <p class="text-gray-700 mb-4">
            YesCandles to mała rodzinna manufaktura świec woskowych, która powstała z pasji do rzemiosła i miłości do naturalnych produktów. Nasza przygoda rozpoczęła się w 2018 roku, kiedy to w domowej kuchni zaczęliśmy eksperymentować z różnymi rodzajami wosku i zapachów.
          </p>
          <p class="text-gray-700 mb-4">
            Z czasem nasze świece zyskały uznanie wśród przyjaciół i rodziny, co zainspirowało nas do podzielenia się naszą pasją z szerszym gronem odbiorców. Dziś, nadal tworzymy każdą świeczkę ręcznie, z dbałością o najdrobniejsze detale i przy użyciu wyłącznie naturalnych składników.
          </p>
          <p class="text-gray-700">
            Nasza misja jest prosta: tworzyć piękne, ekologiczne świece, które wprowadzą do Twojego domu ciepło, przytulność i niepowtarzalny aromat.
          </p>
        </div>
        <div class="order-1 md:order-2">
          <img 
            src="/images/o-nas.jpg" 
            alt="Proces tworzenia świeczek" 
            class="rounded-lg shadow-lg w-full h-auto"
          >
        </div>
      </div>
    </section>
    
    <!-- Our Values -->
    <section class="mb-16">
      <h2 class="text-2xl font-bold text-center mb-8">Nasze wartości</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-primary-50 p-6 rounded-lg text-center">
          <div class="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2">Rzemiosło</h3>
          <p class="text-gray-700">
            Każda nasza świeca jest tworzona ręcznie, z pasją i dbałością o każdy detal. Wierzymy, że prawdziwe piękno tkwi w niedoskonałościach ręcznej pracy.
          </p>
        </div>
        
        <div class="bg-primary-50 p-6 rounded-lg text-center">
          <div class="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2">Ekologia</h3>
          <p class="text-gray-700">
            Dbamy o środowisko używając naturalnych, biodegradowalnych składników. Nasze opakowania są przyjazne dla planety i nadają się do recyklingu.
          </p>
        </div>
        
        <div class="bg-primary-50 p-6 rounded-lg text-center">
          <div class="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2">Jakość</h3>
          <p class="text-gray-700">
            Nie idziemy na kompromisy w kwestii jakości. Używamy tylko najlepszych składników, aby nasze świece były nie tylko piękne, ale i trwałe.
          </p>
        </div>
      </div>
    </section>
    
    <!-- Our Process -->
    <section class="mb-16">
      <h2 class="text-2xl font-bold text-center mb-8">Jak tworzymy nasze świeczki</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="text-center">
          <div class="relative">
            <div class="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span class="text-xl font-bold text-primary-600">1</span>
            </div>
            <div class="hidden md:block absolute top-8 left-full w-full h-0.5 bg-primary-200"></div>
          </div>
          <h3 class="text-lg font-semibold mb-2">Wybór składników</h3>
          <p class="text-gray-700">
            Starannie wybieramy najwyższej jakości wosk sojowy i pszczeli oraz naturalne olejki eteryczne.
          </p>
        </div>
        
        <div class="text-center">
          <div class="relative">
            <div class="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span class="text-xl font-bold text-primary-600">2</span>
            </div>
            <div class="hidden md:block absolute top-8 left-full w-full h-0.5 bg-primary-200"></div>
          </div>
          <h3 class="text-lg font-semibold mb-2">Przygotowanie formy</h3>
          <p class="text-gray-700">
            Każda forma jest ręcznie przygotowywana i wyposażana w bawełniany knot najwyższej jakości.
          </p>
        </div>
        
        <div class="text-center">
          <div class="relative">
            <div class="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span class="text-xl font-bold text-primary-600">3</span>
            </div>
            <div class="hidden md:block absolute top-8 left-full w-full h-0.5 bg-primary-200"></div>
          </div>
          <h3 class="text-lg font-semibold mb-2">Odlewanie wosku</h3>
          <p class="text-gray-700">
            Wosk jest topiony w odpowiedniej temperaturze, a następnie łączony z olejkami eterycznymi i barwnikami.
          </p>
        </div>
        
        <div class="text-center">
          <div class="relative">
            <div class="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span class="text-xl font-bold text-primary-600">4</span>
            </div>
          </div>
          <h3 class="text-lg font-semibold mb-2">Wykończenie</h3>
          <p class="text-gray-700">
            Po zastygnięciu, każda świeca jest starannie wykańczana i pakowana w ekologiczne opakowanie.
          </p>
        </div>
      </div>
    </section>
    
    <!-- Team -->
    <section class="mb-16">
      <h2 class="text-2xl font-bold text-center mb-8">Nasz zespół</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="text-center">
          <div class="mb-4 rounded-full overflow-hidden w-40 h-40 mx-auto">
            <img 
              src="/images/o-nas.jpg" 
              alt="Anna Kowalska" 
              class="w-full h-full object-cover"
            >
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA -->
    <section class="bg-primary-50 p-8 rounded-lg text-center">
      <h2 class="text-2xl font-bold mb-4">Odkryj nasze produkty</h2>
      <p class="text-gray-700 mb-6 max-w-2xl mx-auto">
        Zapraszamy do zapoznania się z naszą ofertą ręcznie robionych świec woskowych. Każda z nich jest wyjątkowa i stworzona z myślą o Tobie.
      </p>
      <NuxtLink 
        to="/sklep" 
        class="px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition duration-150 ease-in-out inline-block"
      >
        Przejdź do sklepu
      </NuxtLink>
    </section>
  </div>
</template>

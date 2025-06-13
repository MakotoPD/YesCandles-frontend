<template>
  <div class="relative">
    <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
    <div id="easypack-map" class="w-full h-[500px]"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue'

const emit = defineEmits(['select'])
const widgetLoaded = ref(false)
const isLoading = ref(true)

onBeforeUnmount(() => {
  // Clean up any global objects or event listeners if needed
  if (process.client) {
    // Clean up the observer if it exists
    if (window.loadingIconObserver) {
      window.loadingIconObserver.disconnect()
      delete window.loadingIconObserver
    }
    
    // Clean up the easyPack instance if it exists
    if (window.easyPackInstance) {
      // Any easyPack specific cleanup if needed
    }
  }
})

onMounted(() => {
  // Only run in client-side
  if (process.client) {
    loadEasyPackScript()
  }
})

function loadEasyPackScript() {
  // Check if script already exists
  if (document.getElementById('easypack-script')) {
    console.log('EasyPack script already loaded')
    initWidget()
    return
  }

  // Load easypack styles
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.type = 'text/css'
  link.href = 'https://geowidget.easypack24.net/css/easypack.css'
  document.head.appendChild(link)

  // Load the script
  const script = document.createElement('script')
  script.id = 'easypack-script'
  script.src = 'https://geowidget.easypack24.net/js/sdk-for-javascript.js'
  script.async = true
  
  script.onload = () => {
    console.log('EasyPack script loaded')
    setTimeout(() => {
      initWidget()
    }, 500)
  }
  
  script.onerror = (e) => {
    console.error('Error loading EasyPack script:', e)
  }
  
  document.head.appendChild(script)
}

function initWidget() {
  try {
    if (!window.easyPack) {
      console.error('easyPack not found in window object')
      isLoading.value = false
      return
    }
    
    console.log('Initializing easyPack widget')
    
    // Initialize the widget
    window.easyPack.init({
      defaultLocale: 'pl',
      mapType: 'osm',
      searchType: 'osm',
      points: {
        types: ['parcel_locker']
      },
      map: {
        initialTypes: ['parcel_locker'],
        useGeolocation: true
      }
    })
    
    // Create the map instance
    const map = window.easyPack.mapWidget('easypack-map', (point) => {
      console.log('Selected point:', point)
      emit('select', point)
    })
    
    // Store the instance for potential cleanup
    window.easyPackInstance = map
    
    // Set loading state to false and mark widget as loaded
    widgetLoaded.value = true
    isLoading.value = false
    console.log('Widget initialized successfully')
    
    // Setup a MutationObserver to detect and hide the loading-icon-wrapper
    setupLoadingIconObserver()
    
    // Add event listener to hide loading icon when map is fully loaded
    if (window.easyPack.mapWidget && map) {
      // The map is rendered when tiles are loaded
      setTimeout(() => {
        isLoading.value = false
        hideInPostLoadingIcon()
      }, 1000) // Give extra time for map to render completely
    }
  } catch (error) {
    console.error('Error initializing easyPack widget:', error)
    isLoading.value = false
  }
}

// Function to hide the InPost loading icon
function hideInPostLoadingIcon() {
  try {
    // Find and hide the loading-icon-wrapper
    const loadingIcons = document.querySelectorAll('.loading-icon-wrapper')
    if (loadingIcons.length > 0) {
      loadingIcons.forEach(icon => {
        icon.style.display = 'none'
      })
      console.log('InPost loading icons hidden')
    }
  } catch (error) {
    console.error('Error hiding InPost loading icon:', error)
  }
}

// Setup observer to detect when loading icon is added to DOM
function setupLoadingIconObserver() {
  try {
    // Create a MutationObserver to watch for the loading icon
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          // Check if any of the added nodes contain the loading icon
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              const loadingIcon = node.querySelector ? node.querySelector('.loading-icon-wrapper') : null
              if (loadingIcon || (node.classList && node.classList.contains('loading-icon-wrapper'))) {
                // Hide it after a short delay
                setTimeout(() => {
                  hideInPostLoadingIcon()
                }, 500)
              }
            }
          })
        }
      })
    })
    
    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true })
    
    // Store the observer for cleanup
    window.loadingIconObserver = observer
  } catch (error) {
    console.error('Error setting up loading icon observer:', error)
  }
}
</script>

<style scoped>
#geowidget {
  min-height: 600px;
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
}
</style>
  
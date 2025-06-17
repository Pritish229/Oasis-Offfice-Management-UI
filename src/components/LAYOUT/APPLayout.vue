<template>
  <SIDEBAR />
  <main class="main-content">
    <div class="position-relative iq-banner">
      <NAVBAR />
      <BREADCRUMB />
      <div class="conatiner-fluid  content-inner mt-n5 py-0">
        <RouterView />
      </div>
    </div>
  
    <FOOTER></FOOTER>
    <SETTINGS />

  </main>
</template>
<RouterView /> 

<script setup>
import {RouterView, } from 'vue-router'
import SIDEBAR from '@/components/UI/SIDEBAR.vue';
import FOOTER from '@/components/UI/FOOTER.vue';
import NAVBAR from '@/components/UI/NAVBAR.vue';
import BREADCRUMB from '@/components/UI/BREADCRUMB.vue';
import SETTINGS from '@/components/UI/SETTINGS.vue';
import { onMounted } from 'vue';

function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.async = false
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
    document.body.appendChild(script)
  })
}

onMounted(async () => {
  try {
    // Load core dependencies sequentially
    await loadScriptOnce('/assets/js/core/libs.min.js')
    await loadScriptOnce('/assets/js/core/external.min.js')

    // Load critical Hope UI scripts sequentially and **before** others
    await loadScriptOnce('/assets/js/plugins/setting.js')
    await loadScriptOnce('/assets/js/hope-ui.js')
    await loadScriptOnce('/assets/js/charts/dashboard.js')

    // Load the rest asynchronously (fire & forget)
    const otherScripts = [
      '/assets/js/charts/widgetcharts.js',
      '/assets/js/charts/vectore-chart.js',
      '/assets/js/charts/dashboard.js',
      '/assets/js/plugins/fslightbox.js',
      '/assets/js/plugins/slider-tabs.js',
      '/assets/js/plugins/form-wizard.js',
      '/assets/vendor/aos/dist/aos.js',
    ]

    otherScripts.forEach(src => loadScriptOnce(src))
  } catch (error) {
    console.error('Script loading error:', error)
  }
})




</script>
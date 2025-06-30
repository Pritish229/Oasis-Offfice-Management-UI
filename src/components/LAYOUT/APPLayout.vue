<template>
  <div class="layout-wrapper">
    <SIDEBAR />
    <main class="main-content">
      <div class="position-relative iq-banner">
        <NAVBAR />
        <BREADCRUMB />
        <div class="container-fluid content-inner mt-n5 py-0">
          <RouterView />
        </div>
      </div>
      <FOOTER />
      <SETTINGS />
    </main>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { onMounted, nextTick } from 'vue'

// Component Imports
import SIDEBAR from '@/components/UI/SIDEBAR.vue'
import FOOTER from '@/components/UI/FOOTER.vue'
import NAVBAR from '@/components/UI/NAVBAR.vue'
import BREADCRUMB from '@/components/UI/BREADCRUMB.vue'
import SETTINGS from '@/components/UI/SETTINGS.vue'

// Store & Socket
import { onSocket } from '@/utils/socketManager.js'
import { useAuthStore } from '@/stores/auth'

// Instantiate store
const auth = useAuthStore()

/**
 * Loads an external script only once.
 */
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
  await nextTick()

  try {
    // Real-time permission update listener
    onSocket('permissionUpdated', async ({ roleId }) => {
      const userRole = auth.user?.role?._id || auth.user?.role
      if (userRole === roleId) {
        await auth.fetchProfile()
      }
    })

    // Load critical scripts sequentially
    const criticalScripts = [
      '/assets/js/core/libs.min.js',
      '/assets/js/core/external.min.js',
      '/assets/js/plugins/setting.js',
      '/assets/js/hope-ui.js',
      '/assets/js/charts/dashboard.js'
    ]

    for (const src of criticalScripts) {
      await loadScriptOnce(src)
    }

    // Load non-critical scripts in parallel
    const otherScripts = [
      '/assets/js/charts/widgetcharts.js',
      '/assets/js/charts/vectore-chart.js',
      '/assets/js/plugins/fslightbox.js',
      '/assets/js/plugins/slider-tabs.js',
      '/assets/js/plugins/form-wizard.js',
      '/assets/vendor/aos/dist/aos.js'
    ]

    otherScripts.forEach(src =>
      loadScriptOnce(src).catch(err =>
        console.warn(`Optional script failed to load: ${src}`, err)
      )
    )
  } catch (error) {
    console.error('Critical script loading failed:', error)
  }
})
</script>

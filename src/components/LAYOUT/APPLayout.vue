<template>
  <SIDEBAR />
  <main class="main-content">
    <div class="position-relative iq-banner">
      <NAVBAR />
      <BREADCRUMB />
      <div class="conatiner-fluid  content-inner mt-n5 py-0">
        <slot name="main-content"></slot>
      </div>
    </div>
  
    <FOOTER></FOOTER>
    <SETTINGS />

  </main>
</template>

<script setup>
import SIDEBAR from '@/components/UI/SIDEBAR.vue';
import FOOTER from '@/components/UI/FOOTER.vue';
import NAVBAR from '@/components/UI/NAVBAR.vue';
import BREADCRUMB from '@/components/UI/BREADCRUMB.vue';
import SETTINGS from '@/components/UI/SETTINGS.vue';
import { onMounted } from 'vue'

onMounted(() => {
  // Wait a bit to ensure DOM is fully loaded
  setTimeout(() => {
    const script = document.createElement('script')
    script.src = '/assets/js/plugins/setting.js'
    script.defer = true
    document.body.appendChild(script)
  }, 500)
})


</script>
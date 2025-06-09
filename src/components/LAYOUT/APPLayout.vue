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



</script>
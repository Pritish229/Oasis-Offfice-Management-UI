<template>
    <SIDEBAR />
  <main class="main-content">
    <div class="position-relative iq-banner">
      
      <NAVBAR />
    </div>
    <BREADCRUMB />
    <div class="conatiner-fluid content-inner ">
    <div class="row">
      <div class="card p-4"></div>
    </div>
    </div>

    

    <!-- Footer Section Start -->
    <FOOTER></FOOTER>
    <SETTINGS />
    <!-- Footer Section End -->
  </main>
</template>

<script setup>
import SIDEBAR from '@/components/UI/SIDEBAR.vue';
import FOOTER from '@/components/UI/FOOTER.vue';
import NAVBAR from '../UI/NAVBAR.vue';
import BREADCRUMB from '../UI/BREADCRUMB.vue';
import SETTINGS from '../UI/SETTINGS.vue';


</script>
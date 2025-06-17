<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

const title = computed(() => route.meta?.title || route.name || '');

const breadcrumbs = computed(() => {
  return route.meta?.breadcrumb || [
    { label: 'Home', to: '/' },
    { label: title.value, to: route.fullPath }
  ];
});
</script>

<template>
  <div class="iq-navbar-header" style="min-height: 15rem;">
    <div class="container-fluid iq-container">
      <div class="row">
        <div class="col-md-12">
          <div class="flex-wrap d-flex justify-content-between align-items-center">
            <div>
              <h2>{{ title }}</h2>
              <div class="bd-example">
                <nav aria-label="breadcrumb">
                  <ol class="breadcrumb">
                    <li
                      v-for="(item, index) in breadcrumbs"
                      :key="index"
                      class="breadcrumb-item"
                      :class="{ active: index === breadcrumbs.length - 1 }"
                    >
                      <RouterLink v-if="index !== breadcrumbs.length - 1" :to="item.to">
                        {{ item.label }}
                      </RouterLink>
                      <span v-else>{{ item.label }}</span>
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Background Header Images -->
    <div class="iq-header-img">
      <img src="/assets/images/dashboard/top-header.png" alt="header" class="theme-color-default-img img-fluid w-100 h-100 animated-scaleX" />
      <img src="/assets/images/dashboard/top-header1.png" alt="header" class="theme-color-purple-img img-fluid w-100 h-100 animated-scaleX" />
      <img src="/assets/images/dashboard/top-header2.png" alt="header" class="theme-color-blue-img img-fluid w-100 h-100 animated-scaleX" />
      <img src="/assets/images/dashboard/top-header3.png" alt="header" class="theme-color-green-img img-fluid w-100 h-100 animated-scaleX" />
      <img src="/assets/images/dashboard/top-header4.png" alt="header" class="theme-color-yellow-img img-fluid w-100 h-100 animated-scaleX" />
      <img src="/assets/images/dashboard/top-header5.png" alt="header" class="theme-color-pink-img img-fluid w-100 h-100 animated-scaleX" />
    </div>
  </div>
</template>

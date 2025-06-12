<template>
  <aside :class="sidebarClasses">
    <div class="sidebar-header d-flex align-items-center justify-content-start">
      <router-link to="/app/dashboard" class="navbar-brand">
        <!-- Logo -->
        <div class="logo-main">
          <div class="logo-normal">
            <svg class="icon-30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="-0.757324" y="19.2427" width="28" height="4" rx="2" transform="rotate(-45 -0.757324 19.2427)" fill="currentColor" />
              <rect x="7.72803" y="27.728" width="28" height="4" rx="2" transform="rotate(-45 7.72803 27.728)" fill="currentColor" />
              <rect x="10.5366" y="16.3945" width="16" height="4" rx="2" transform="rotate(45 10.5366 16.3945)" fill="currentColor" />
              <rect x="10.5562" y="-0.556152" width="28" height="4" rx="2" transform="rotate(45 10.5562 -0.556152)" fill="currentColor" />
            </svg>
          </div>
          <div class="logo-mini">
            <svg class="icon-30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="-0.757324" y="19.2427" width="28" height="4" rx="2" transform="rotate(-45 -0.757324 19.2427)" fill="currentColor" />
              <rect x="7.72803" y="27.728" width="28" height="4" rx="2" transform="rotate(-45 7.72803 27.728)" fill="currentColor" />
              <rect x="10.5366" y="16.3945" width="16" height="4" rx="2" transform="rotate(45 10.5366 16.3945)" fill="currentColor" />
              <rect x="10.5562" y="-0.556152" width="28" height="4" rx="2" transform="rotate(45 10.5562 -0.556152)" fill="currentColor" />
            </svg>
          </div>
        </div>
        <h5 class="logo-title">BUBBLE OASIS</h5>
      </router-link>
      <div class="sidebar-toggle" data-toggle="sidebar" data-active="true">
        <i class="icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4.25 12.2744L19.25 12.2744" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10.2998 18.2988L4.2498 12.2748L10.2998 6.24976" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </i>
      </div>
    </div>

    <div class="sidebar-body pt-0 data-scrollbar">
      <div class="sidebar-list">
        <ul class="navbar-nav iq-main-menu" id="sidebar-menu">
          <li class="nav-item static-item">
            <a class="nav-link static-item disabled" href="#" tabindex="-1">
              <span class="default-icon">Home</span>
              <span class="mini-icon">-</span>
            </a>
          </li>

          <!-- Dashboard -->
          <li class="nav-item" v-if="hasPermission('view-dashboard')">
            <router-link to="/app/dashboard" class="nav-link" :class="{ active: route.path === '/app/dashboard' }">
              <FontAwesomeIcon :icon="['fas', 'house']" />
              <span class="item-name">Dashboard</span>
            </router-link>
          </li>

          <!-- Manage Users -->
          <li class="nav-item" v-if="hasPermission('manage-users')">
            <router-link to="/app/manage-users" class="nav-link" :class="{ active: route.path === '/app/manage-users' }">
              <FontAwesomeIcon :icon="['fas', 'users']" />
              <span class="item-name">Mange Users</span>
            </router-link>
          </li>

          <li><hr class="hr-horizontal"></li>

          <li class="nav-item static-item">
            <a class="nav-link static-item disabled" href="#" tabindex="-1">
              <span class="default-icon">Pages</span>
              <span class="mini-icon">-</span>
            </a>
          </li>

          <!-- Special Pages (no permission check for now) -->
          <li class="nav-item">
            <a class="nav-link" data-bs-toggle="collapse" href="#sidebar-special" role="button" aria-expanded="false" aria-controls="sidebar-special">
              <i class="icon">
                <!-- SVG Icon omitted for brevity -->
              </i>
              <span class="item-name">Special Pages</span>
              <i class="right-icon">
                <svg class="icon-18" xmlns="http://www.w3.org/2000/svg" width="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </i>
            </a>
            <ul class="sub-nav collapse" id="sidebar-special" data-bs-parent="#sidebar-menu">
              <li class="nav-item">
                <a class="nav-link" href="../../dashboard/special-pages/billing.html">
                  <i class="icon">
                    <svg class="icon-10" xmlns="http://www.w3.org/2000/svg" width="10" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="8" fill="currentColor"></circle>
                    </svg>
                  </i>
                  <i class="sidenav-mini-icon"> B </i>
                  <span class="item-name">Billing</span>
                </a>
              </li>
            </ul>
          </li>

          <li><hr class="hr-horizontal"></li>
        </ul>
      </div>
    </div>

    <div class="sidebar-footer"></div>
  </aside>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { router } from '@/router/index.js'

const auth = useAuthStore()
const route = useRoute()

const isMobile = ref(false)

const hasPermission = (permission) => {
  return auth.permissions?.includes(permission)
}

const checkScreenSize = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize)
})

const sidebarClasses = computed(() => {
  const baseClasses = [
    'sidebar',
    'sidebar-default',
    'sidebar-white',
    'sidebar-base',
    'navs-rounded-all'
  ]
  if (isMobile.value) {
    baseClasses.push('sidebar-mini')
  }
  return baseClasses
})
</script>

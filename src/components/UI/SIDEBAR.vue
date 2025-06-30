<template>
  <aside :class="sidebarClasses">
    <div class="sidebar-header d-flex align-items-center justify-content-start">
      <router-link to="/app/dashboard" class="navbar-brand">
        <div class="logo-main">
          <div class="logo-normal">
            <svg class="icon-30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="-0.757" y="19.243" width="28" height="4" rx="2" transform="rotate(-45 -0.757 19.243)"
                fill="currentColor" />
              <rect x="7.728" y="27.728" width="28" height="4" rx="2" transform="rotate(-45 7.728 27.728)"
                fill="currentColor" />
              <rect x="10.537" y="16.395" width="16" height="4" rx="2" transform="rotate(45 10.537 16.395)"
                fill="currentColor" />
              <rect x="10.556" y="-0.556" width="28" height="4" rx="2" transform="rotate(45 10.556 -0.556)"
                fill="currentColor" />
            </svg>
          </div>
          <div class="logo-mini">
            <div class="logo-mini">
              <svg class="icon-30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="-0.757" y="19.243" width="28" height="4" rx="2" transform="rotate(-45 -0.757 19.243)"
                  fill="currentColor" />
                <rect x="7.728" y="27.728" width="28" height="4" rx="2" transform="rotate(-45 7.728 27.728)"
                  fill="currentColor" />
                <rect x="10.537" y="16.395" width="16" height="4" rx="2" transform="rotate(45 10.537 16.395)"
                  fill="currentColor" />
                <rect x="10.556" y="-0.556" width="28" height="4" rx="2" transform="rotate(45 10.556 -0.556)"
                  fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>
        <h5 class="logo-title">BUBBLE OASIS</h5>
      </router-link>
      <div class="sidebar-toggle" data-toggle="sidebar">
        <i class="icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4.25 12.2744L19.25 12.2744" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M10.2998 18.2988L4.2498 12.2748L10.2998 6.24976" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round" />
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

          <li class="nav-item" v-if="hasPermission(['view-dashboard'])">
            <router-link to="/app/dashboard" class="nav-link" :class="{ active: route.path === '/app/dashboard' }">
              <FontAwesomeIcon :icon="['fas', 'house']" />
              <span class="item-name">Dashboard</span>
            </router-link>
          </li>

          <li class="nav-item" v-if="hasPermission(['manage-role'])">
            <router-link to="/app/managerole" class="nav-link" :class="{ active: route.path === '/app/managerole' }">
              <FontAwesomeIcon :icon="['fas', 'lock']" />
              <span class="item-name">Manage Roles</span>
            </router-link>
          </li>

          <li>
            <hr class="hr-horizontal" />
          </li>

          <li class="nav-item static-item">
            <a class="nav-link static-item disabled" href="#" tabindex="-1">
              <span class="default-icon">Pages</span>
              <span class="mini-icon">-</span>
            </a>
          </li>

          <!-- USERS DROPDOWN -->
          <li class="nav-item" v-if="hasPermission(['view-users','manage-users'])">
            <a href="javascript:void(0)" class="nav-link" @click="toggleDropdown('users')"
              :aria-expanded="dropdownState.users" :class="{ collapsed: !dropdownState.users }">
              <FontAwesomeIcon :icon="['fas', 'users']" />
              <span class="item-name">Users</span>
              <i class="right-icon">
                <svg class="icon-18" xmlns="http://www.w3.org/2000/svg" width="18" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </i>
            </a>
            <ul :class="['sub-nav', 'collapse', { show: dropdownState.users }]" id="sidebar-users">
              <li class="nav-item" v-if="hasPermission(['create-users','manage-users'])">
                <router-link class="nav-link" to="/app/users/add" :class="{ active: route.path === '/app/users/add' }">
                  <FontAwesomeIcon :icon="['fas', 'user-plus']" />
                  <span class="item-name">Add Users</span>
                </router-link>
              </li>
              <li class="nav-item" v-if="hasPermission(['manage-users','view-users'])">
                <router-link class="nav-link" to="/app/users/manage"
                  :class="{ active: route.path === '/app/users/manage' }">
                  <FontAwesomeIcon :icon="['fas', 'users']" />
                  <span class="item-name">Manage Users</span>
                </router-link>
              </li>
            </ul>
          </li>

   
          <!-- <li class="nav-item" v-if="hasPermission('manage-role')">
            <a href="javascript:void(0)" class="nav-link" @click="toggleDropdown('roles')"
              :aria-expanded="dropdownState.roles" :class="{ collapsed: !dropdownState.roles }">
              <FontAwesomeIcon :icon="['fas', 'shield-alt']" />
              <span class="item-name">Roles</span>
              <i class="right-icon">
                <svg class="icon-18" xmlns="http://www.w3.org/2000/svg" width="18" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </i>
            </a>
            <ul :class="['sub-nav', 'collapse', { show: dropdownState.roles }]" id="sidebar-roles">
              <li class="nav-item">
                <router-link class="nav-link" to="/app/roles/manage"
                  :class="{ active: route.path === '/app/roles/manage' }">
                  <FontAwesomeIcon :icon="['fas', 'users-cog']" />
                  <span class="item-name">Manage Roles</span>
                </router-link>
              </li>
            </ul>
          </li> -->

          <li>
            <hr class="hr-horizontal" />
          </li>
        </ul>
      </div>
    </div>

    <div class="sidebar-footer"></div>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Get current route and auth store
const route = useRoute()
const auth = useAuthStore()

// Track screen size for mobile sidebar
const isMobile = ref(false)

const checkScreenSize = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  updateDropdownStateFromRoute(route.path)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize)
})

// Compute sidebar class based on screen size
const sidebarClasses = computed(() => {
  const baseClasses = ['sidebar', 'sidebar-default', 'sidebar-white', 'sidebar-base', 'navs-rounded-all']
  if (isMobile.value) baseClasses.push('sidebar-mini')
  return baseClasses
})

// Permission check helper
const hasPermission = (permissions) => {
  if (!auth.permissions) return false
  if (Array.isArray(permissions)) {
    return permissions.some((perm) => auth.permissions.includes(perm))
  }
  return auth.permissions.includes(permissions)
}

// Reactive state for multiple dropdowns
const dropdownState = reactive({
  users: false,
  roles: false,
  // add other keys as needed
})

// Update dropdown open state based on route
function updateDropdownStateFromRoute(path) {
  Object.keys(dropdownState).forEach((key) => {
    dropdownState[key] = path.startsWith(`/app/${key}`)
  })
}

// Watch route changes
watch(() => route.path, (newPath) => {
  updateDropdownStateFromRoute(newPath)
})

// Toggle dropdown manually
function toggleDropdown(menu) {
  dropdownState[menu] = !dropdownState[menu]
}
</script>

<template>
  <nav class="nav navbar navbar-expand-lg navbar-light iq-navbar navs-sticky">
    <div class="container-fluid navbar-inner">
      <a href="" class="navbar-brand">
        <div class="logo-main">
          <div class="logo-normal">
            <svg class="text-primary icon-30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="-0.757324" y="19.2427" width="28" height="4" rx="2" transform="rotate(-45 -0.757324 19.2427)"
                fill="currentColor" />
              <rect x="7.72803" y="27.728" width="28" height="4" rx="2" transform="rotate(-45 7.72803 27.728)"
                fill="currentColor" />
              <rect x="10.5366" y="16.3945" width="16" height="4" rx="2" transform="rotate(45 10.5366 16.3945)"
                fill="currentColor" />
              <rect x="10.5562" y="-0.556152" width="28" height="4" rx="2" transform="rotate(45 10.5562 -0.556152)"
                fill="currentColor" />
            </svg>
          </div>
          <div class="logo-mini">
            <svg class="text-primary icon-30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="-0.757324" y="19.2427" width="28" height="4" rx="2" transform="rotate(-45 -0.757324 19.2427)"
                fill="currentColor" />
              <rect x="7.72803" y="27.728" width="28" height="4" rx="2" transform="rotate(-45 7.72803 27.728)"
                fill="currentColor" />
              <rect x="10.5366" y="16.3945" width="16" height="4" rx="2" transform="rotate(45 10.5366 16.3945)"
                fill="currentColor" />
              <rect x="10.5562" y="-0.556152" width="28" height="4" rx="2" transform="rotate(45 10.5562 -0.556152)"
                fill="currentColor" />
            </svg>
          </div>
        </div>
        <h4 class="logo-title">Admin</h4>
      </a>

      <div class="sidebar-toggle" data-toggle="sidebar" data-active="true">
        <i class="icon">
          <svg width="20px" class="icon-20" viewBox="0 0 24 24">
            <path fill="currentColor" d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
          </svg>
        </i>
      </div>

      <div class="input-group search-input">
        <span class="input-group-text" id="search-input">
          <svg class="icon-18" width="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11.7669" cy="11.7666" r="8.98856" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round"></circle>
            <path d="M18.0186 18.4851L21.5426 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round"></path>
          </svg>
        </span>
        <input type="search" class="form-control" placeholder="Search...">
      </div>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon">
          <span class="mt-2 navbar-toggler-bar bar1"></span>
          <span class="navbar-toggler-bar bar2"></span>
          <span class="navbar-toggler-bar bar3"></span>
        </span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="mb-2 navbar-nav ms-auto align-items-center navbar-list mb-lg-0">
          <li class="nav-item dropdown">
            <a class="py-0 nav-link d-flex align-items-center" href="#" id="navbarDropdown" role="button"
              data-bs-toggle="dropdown" aria-expanded="false">
              <img src="/assets/images/avatars/01.png" alt="User-Profile"
                class="theme-color-default-img img-fluid avatar avatar-50 avatar-rounded">
              <img src="/assets/images/avatars/avtar_1.png" alt="User-Profile"
                class="theme-color-purple-img img-fluid avatar avatar-50 avatar-rounded">
              <img src="/assets/images/avatars/avtar_2.png" alt="User-Profile"
                class="theme-color-blue-img img-fluid avatar avatar-50 avatar-rounded">
              <img src="/assets/images/avatars/avtar_4.png" alt="User-Profile"
                class="theme-color-green-img img-fluid avatar avatar-50 avatar-rounded">
              <img src="/assets/images/avatars/avtar_5.png" alt="User-Profile"
                class="theme-color-yellow-img img-fluid avatar avatar-50 avatar-rounded">
              <img src="/assets/images/avatars/avtar_3.png" alt="User-Profile"
                class="theme-color-pink-img img-fluid avatar avatar-50 avatar-rounded">
              <div class="caption ms-3 d-none d-md-block">
                <h6 class="mb-0 caption-title">{{ userDetails.email }}</h6>
                <p class="mb-0 caption-sub-title">{{ userDetails.username }}</p>
              </div>
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li><router-link class="dropdown-item" to="/app/profile">Profile</router-link></li>
              <li><a class="dropdown-item" href="">Privacy Setting</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><button class="dropdown-item" @click="logout()">Logout</button></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { onMounted, ref, reactive, nextTick } from 'vue'
import * as bootstrap from 'bootstrap'

const auth = useAuthStore()
const userDetails = reactive({
  username: '',
  email: '',
  fullName: '',
  gender: '',
  maritalStatus: '',
})

const fatchuser = async () => {
  const user = await auth.user
  userDetails.username = user.username
  userDetails.email = user.email
}

const router = useRouter()

const logout = async () => {
  const result = await Swal.fire({
    title: 'Are you sure you want to logout?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, logout',
    cancelButtonText: 'Cancel',
    confirmButtonColor: "red",
  })

  if (result.isConfirmed) {
    auth.logout()  // Properly clear Pinia state + localStorage


    router.push('/login')
  }
}

onMounted(async () => {
  await fatchuser()
  
  nextTick(() => {
    const dropdownElements = document.querySelectorAll('[data-bs-toggle="dropdown"]')
    dropdownElements.forEach(el => {
      new bootstrap.Dropdown(el)
    })
  })
})
</script>
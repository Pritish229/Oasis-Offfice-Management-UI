import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Auth/Login.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard/Home.vue'),
    meta: {
      requiresAuth: true,
      title: 'Dashboard',
      breadcrumb: [
        { label: 'Home', to: '/' },
        { label: 'Dashboard', to: '/dashboard' }
      ]
    }
  },
  {
    path: '/other',
    name: 'Other',
    component: () => import('@/views/Dashboard/Other.vue'),
    meta: {
      requiresAuth: true,
      title: 'Other',
      breadcrumb: [
        { label: 'Home', to: '/' },
        { label: 'Other', to: '/other' }
      ]
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 🔐 Navigation Guard
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router

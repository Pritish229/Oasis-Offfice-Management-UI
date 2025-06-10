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
  path: '/auth/reset-password',
  name: 'ResetPassword',
  component: () => import('@/views/Auth/ResetPassword.vue')
},
  {
    path: '/app',
    component: () => import('@/components/LAYOUT/APPLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard/Home.vue'),
        meta: {
          title: 'Dashboard',
          breadcrumb: [
            { label: 'Home', to: '/' },
            { label: 'Dashboard', to: '/app/dashboard' }
          ]
        }
      },
      {
        path: 'other',
        name: 'Other',
        component: () => import('@/views/Dashboard/Other.vue'),
        meta: {
          title: 'Other',
          breadcrumb: [
            { label: 'Home', to: '/' },
            { label: 'Other', to: '/app/other' }
          ]
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 🔐 Navigation Guard
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  const token = localStorage.getItem('token')

  // Try to restore auth state if token exists but store is not authenticated
  if (token && !auth.isAuthenticated) {
    try {
      await auth.restoreUserFromToken(token) // implement this in store if needed
    } catch (e) {
      localStorage.removeItem('token')
      return next('/login')
    }
  }
  if (to.meta.requiresAuth && !token) {
    return next('/login')
  }

  // Redirect from login if already authenticated
  if (to.path === '/login' && token) {
    return next('/app/dashboard')
  }

  next()
})

export default router

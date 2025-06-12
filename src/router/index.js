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
    path: '/Reset-Password',
    name: 'Reset-password',
    component: () => import('@/views/Auth/ResetPassword.vue')
  },
  // {
  //   path: '/unauthorized',
  //   name: 'Unauthorized',
  //   component: () => import('@/views/Auth/Unauthorized.vue') // Create this page if needed
  // },
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
          requiresAuth: true,
          permissions: ['view-dashboard'],
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
          requiresAuth: true,
          permissions: ['view-profile'],
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

// 🔐 Global Route Guard
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  const token = localStorage.getItem('token')

  if (token && !auth.user) {
    try {
      await auth.fetchProfile()
    } catch (e) {
      localStorage.removeItem('token')
      return next('/login')
    }
  }

  if (to.meta.requiresAuth && !token) {
    return next('/login')
  }

  if (to.path === '/login' && token) {
    return next('/app/dashboard')
  }

  if (to.meta.permissions && token) {
    const hasPermissions = to.meta.permissions.every(p => auth.permissions.includes(p))
    if (!hasPermissions) {
      return next('/unauthorized')
    }
  }

  next()
})

export default router

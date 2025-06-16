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
    path: '/reset-password/new/:useremail',
    component: () => import('@/views/Auth/SetNewPassword.vue'),
    beforeEnter: (to, from, next) => {
      const verified = localStorage.getItem('otp_verified') === 'true'
      if (verified) {
        next()
      } else {
        next('/reset-password')
      }
    }
  },
  {
    path: '/Reset-Password',
    name: 'Reset-password',
    component: () => import('@/views/Auth/ResetPassword.vue')
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('@/views/Auth/Unauthorized.vue')
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
          requiresAuth: true,
          permissions: ['view-dashboard'],
          title: 'Dashboard',
          breadcrumb: [
            { label: 'Home', to: '/' },
            { label: 'Dashboard', to: '/app/dashboard' }
          ]
        }
      },

      // ✅ Group under /app/users
      {
        path: 'users',
        meta: { requiresAuth: true },
        children: [
          {
            path: 'manage',
            name: 'ManageUsers',
            component: () => import('@/views/Dashboard/MangeUsers/UserList.vue'),
            meta: {
              permissions: ['manage-users'],
              title: 'Manage Users',
              breadcrumb: [
                { label: 'Home', to: '/app/dashboard' },
                { label: 'Manage Users', to: '/app/users/manage' }
              ]
            }
          },
          {
            path: 'add',
            name: 'AddUsers',
            component: () => import('@/views/Dashboard/MangeUsers/Addusers.vue'),
            meta: {
              permissions: ['create-users'],
              title: 'Add Users',
              breadcrumb: [
                { label: 'Home', to: '/app/dashboard' },
                { label: 'Manage Users', to: '/app/users/manage' },
                { label: 'Add Users', to: '/app/users/add' }
              ]
            }
          }
        ]
      }
    ]
  }

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  const token = localStorage.getItem('token')

  if (token && !auth.user) {
    try {
      await auth.fetchProfile()
    } catch (e) {
      auth.logout()
      return next('/login')
    }
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next('/login')
  }

  if (to.path === '/login' && auth.isAuthenticated) {
    return next('/app/dashboard')
  }

  if (to.meta.permissions && to.meta.permissions.length > 0) {
    const hasPermissions = to.meta.permissions.every(p => auth.permissions.includes(p))
    if (!hasPermissions) {
      return next('/unauthorized')
    }
  }

  next()
})

// ✅ Export both default and named for flexibility
export { router }
export default router

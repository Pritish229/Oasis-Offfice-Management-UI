import { createRouter, createWebHistory } from 'vue-router'

<<<<<<< Updated upstream
=======
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
    path: '/auth/recover-password',
    name: 'RecoverPassword',
    component: () => import('@/views/Auth/RecoverPassword.vue')
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
>>>>>>> Stashed changes

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard/Home.vue'),
      meta: {
        title: 'Dashboard',
        breadcrumb: [
          { label: 'Home', to: '/' },
          { label: 'Dashboard', to: '/' },
        ]
      }
    },
    {
      path: '/Other',
      name: 'Other',
      component: () => import('@/views/Dashboard/Other.vue'),
      meta: {
        title: 'Other',
        breadcrumb: [
          { label: 'Home', to: '/' },
          { label: 'Other', to: '/Other' }
        ]
      }
    },


  ],
})

export default router

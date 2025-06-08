import { createRouter, createWebHistory } from 'vue-router'


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
          { label: 'Dashboard', to: '/' }
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

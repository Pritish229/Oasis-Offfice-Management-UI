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
    }

  ],
})

export default router

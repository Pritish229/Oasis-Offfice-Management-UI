import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/Dashboard',
      name: 'home',
      component: ()=>import('@/views/Dashboard/Home.vue')
    },
   
  ],
})

export default router

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import('@/views/dashboard/Index'),
      children: [
        // Dashboard
        {
          name: 'Dashboard',
          path: '',
          component: () => import('@/views/dashboard/Dashboard'),
        },
        // Create new Antigen
        {
          name: 'Create Antigen',
          path: '/pages/antigen',
          component: () => import('@/views/dashboard/pages/CreateAntigen'),
        },
        // Search Antigens
        {
          name: 'Search Antigens',
          path: 'component/SearchAntigens',
          component: () => import('@/views/dashboard/component/SearchAntigens'),
        },
      ],
    },
  ],
})

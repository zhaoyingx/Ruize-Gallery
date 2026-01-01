import { createRouter, createWebHistory } from 'vue-router'

const DashboardLayout = () => import('@/BaseView.vue')
const GalleryView = () => import('@/views/GalleryView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DashboardLayout,
      redirect: '/gallery/2026',
      children: [
        {
          path: 'gallery/:year',
          component: GalleryView,
        },
      ],
    },
  ],
})

export default router

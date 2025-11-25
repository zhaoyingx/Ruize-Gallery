import { createRouter, createWebHistory } from 'vue-router'

const DashboardLayout = () => import('@/BaseView.vue')
const View2025 = () => import('@/views/2025GalleryView.vue')
const View2026 = () => import('@/views/2026GalleryView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DashboardLayout,
      redirect: '/gallery/2026',
      children: [
        {
          path: 'gallery/2026',
          component: View2026,
        },
        {
          path: 'gallery/2025',
          component: View2025,
        },
      ],
    },
  ],
})

export default router

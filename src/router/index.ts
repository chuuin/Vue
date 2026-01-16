import { createRouter, createWebHistory } from 'vue-router'

import BoardPage from '@/pages/BoardPage.vue'
import GuidePage from '@/pages/GuidePage.vue'
import InsightsPage from '@/pages/InsightsPage.vue'
import SettingsPage from '@/pages/SettingsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'board', component: BoardPage },
    { path: '/insights', name: 'insights', component: InsightsPage },
    { path: '/guide', name: 'guide', component: GuidePage },
    { path: '/settings', name: 'settings', component: SettingsPage }
  ]
})

export default router

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/pages/GridPage.vue'),
    },
    {
        path: '/start',
        name: 'Start',
        component: () => import('@/pages/StartPage.vue'),
    },
    {
        path: '/test',
        name: 'Test',
        component: () => import('@/pages/TestPage.vue'),
    },
    {
        path: '/new-start',
        name: 'NewStart',
        component: () => import('@/pages/NewStartPage.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router

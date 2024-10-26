import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/components/Login/Login.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/components/Login/Login.vue')
  },
  {
    path: '/logout',
    name: 'Login',
    component: () => import('@/components/Login/Login.vue')
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import('@/components/Login/SignUp.vue')
  },
  {
    path: '/main',
    name: 'Main',
    component: () => import('@/components/Main.vue')
  },
  {
    path: '/trash',
    name: 'Trash',
    component: () => import('@/components/Trash.vue')
  },
  {
    path: '/tags/:id/:name',
    name: 'Tags',
    component: () => import('@/components/Tags.vue')
  },
  {
    path: '/todos',
    name: 'TodosMain',
    component: () => import('@/components/TodosMain.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/components/Profile.vue')
  },
  {
    path: '/sockettest',
    name: 'SocketTest',
    component: () => import('@/components/SocketTest.vue')
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: require('@/components/Login/Login').default
    },
    {
        path: '/login',
        name: 'Login',
        component: require('@/components/Login/Login').default,
    },
    {
      path: '/logout',
      name: 'Login',
      component: require('@/components/Login/Login').default,
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: require('@/components/Login/SignUp').default,
    },
    {
        path: '/main',
        name: 'Main',
        component: require('@/components/Main').default,
    },
    {
      path: '/trash',
      name: 'Trash',
      component: require('@/components/Trash').default,
    },
    {
      path: '/tags/:id/:name',
      name: 'Tags',
      component: require('@/components/Tags').default,
    },
    {
      path: '/todos',
      name: 'TodosMain',
      component: require('@/components/TodosMain').default,
    },
    {
      path: '/profile',
      name: 'Profile',
      component: require('@/components/Profile').default,
    },
    {
      path: '/sockettest',
      name: 'SocketTest',
      component: require('@/components/SocketTest').default,
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

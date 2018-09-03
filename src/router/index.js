import Vue from 'vue'
import Router from 'vue-router'
import Habits from '@/components/HabitTracker'
import Login from '@/components/Login'
import SignUp from '@/components/SignUp'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/home',
      name: 'HabitTracker',
      component: Habits,
    }, 
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: SignUp, 
      meta: {
        requiresAuth: true
      }
    },
  ]
})

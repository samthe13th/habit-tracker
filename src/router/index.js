import Vue from 'vue'
import Router from 'vue-router'
import Habits from '@/components/HabitTracker'
import Login from '@/components/Login'
import SignUp from '@/components/SignUp'
import Dashboard from '@/components/Dashboard'
import Projects from '@/components/Projects'

Vue.use(Router);

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
      path: '/projects',
      component: Projects,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
    },
    {
      path: '/habits',
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

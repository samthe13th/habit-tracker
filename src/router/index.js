import Vue from 'vue'
import Router from 'vue-router'
import Products from '@/components/Products/Products'
import ProductPage from '@/components/ProductPage'
import Hello from '@/components/HabitTracker'
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
      path: '/demo',
      name: 'Products',
      component: Products
    },
    {
      path: '/shop/:product_id',
      name: 'ProductPage',
      component: ProductPage
    }, 
    {
      path: '/home',
      name: 'HabitTracker',
      component: Hello,
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

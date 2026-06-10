import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import ProductsView from './views/ProductsView.vue'
import ProductDetailsView from './views/ProductDetailsView.vue'
import CartView from './views/CartView.vue'
import FavoritesView from './views/FavoritesView.vue'
import OrdersView from './views/OrdersView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/products', name: 'products', component: ProductsView },
  { path: '/product/:id?', name: 'product', component: ProductDetailsView },
  { path: '/cart', name: 'cart', component: CartView },
  { path: '/favorites', name: 'favorites', component: FavoritesView },
  { path: '/orders', name: 'orders', component: OrdersView },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

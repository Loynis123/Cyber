<script setup>
// Icons and logo come from public/icons (exported from the design).
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { filters } from '../store.js'
import { cartCount } from '../cart.js'
import { favoritesCount } from '../favorites.js'
import { auth, isAuthed, logout, authModalOpen, openAuth } from '../user.js'
import AuthModal from './AuthModal.vue'

const router = useRouter()
const route = useRoute()

function submitSearch() {
  router.push('/products')
  mobileOpen.value = false
}

const menuOpen = ref(false)

function onAccountClick() {
  if (isAuthed.value) menuOpen.value = !menuOpen.value
  else openAuth()
}

function doLogout() {
  logout()
  menuOpen.value = false
  mobileOpen.value = false
  router.push('/')
}

function closeMenu() {
  menuOpen.value = false
}
onMounted(() => document.addEventListener('click', closeMenu))
onUnmounted(() => document.removeEventListener('click', closeMenu))

// Mobile drawer
const mobileOpen = ref(false)
function closeMobile() {
  mobileOpen.value = false
}
function mobileSignIn() {
  mobileOpen.value = false
  openAuth()
}
// Close the drawer whenever the route changes, and lock body scroll while open.
watch(() => route.fullPath, closeMobile)
watch(mobileOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})
</script>

<template>
  <header class="site-header">
    <div class="container header-inner">
      <router-link to="/" class="logo">
        <img src="/icons/logo.png" alt="cyber" />
      </router-link>

      <label class="search">
        <img class="search-icon" src="/icons/search.png" alt="" />
        <input
          v-model="filters.search"
          type="text"
          placeholder="Search"
          @keyup.enter="submitSearch"
        />
        <button v-if="filters.search" class="search-clear" aria-label="Clear search" @click="filters.search = ''">✕</button>
      </label>

      <div class="actions">
        <router-link to="/favorites" class="icon-btn cart-link" aria-label="Wishlist">
          <img src="/icons/favorites.png" alt="" />
          <span v-if="favoritesCount" class="badge">{{ favoritesCount }}</span>
        </router-link>
        <router-link to="/cart" class="icon-btn cart-link" aria-label="Cart">
          <img src="/icons/cart.png" alt="" />
          <span v-if="cartCount" class="badge">{{ cartCount }}</span>
        </router-link>

        <div class="account" @click.stop>
          <button class="icon-btn account-btn" :aria-label="isAuthed ? 'Account' : 'Sign in'" @click="onAccountClick">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-3.6 3.6-6 8-6s8 2.4 8 6" />
            </svg>
          </button>
          <transition name="fade">
            <div v-if="isAuthed && menuOpen" class="menu">
              <p class="menu-name">{{ auth.user?.name || auth.user?.email }}</p>
              <router-link to="/orders" class="menu-item" @click="menuOpen = false">My Orders</router-link>
              <router-link to="/cart" class="menu-item" @click="menuOpen = false">My Cart</router-link>
              <button class="menu-item" @click="doLogout">Log out</button>
            </div>
          </transition>
        </div>
      </div>

      <!-- Mobile hamburger -->
      <button class="burger" aria-label="Menu" @click="mobileOpen = true">
        <span></span><span></span><span></span>
      </button>
    </div>

    <!-- Mobile drawer -->
    <transition name="drawer">
      <div v-if="mobileOpen" class="drawer-root">
        <div class="drawer-overlay" @click="closeMobile"></div>
        <aside class="drawer">
          <div class="drawer-head">
            <router-link to="/" class="logo" @click="closeMobile"><img src="/icons/logo.png" alt="cyber" /></router-link>
            <button class="drawer-close" aria-label="Close menu" @click="closeMobile">✕</button>
          </div>

          <label class="drawer-search">
            <img class="search-icon" src="/icons/search.png" alt="" />
            <input v-model="filters.search" type="text" placeholder="Search" @keyup.enter="submitSearch" />
          </label>

          <nav class="drawer-nav">
            <router-link to="/" @click="closeMobile">Home</router-link>
            <router-link to="/products" @click="closeMobile">Catalog</router-link>
            <router-link to="/favorites" @click="closeMobile">
              Favorites <span v-if="favoritesCount" class="pill">{{ favoritesCount }}</span>
            </router-link>
            <router-link to="/cart" @click="closeMobile">
              Cart <span v-if="cartCount" class="pill">{{ cartCount }}</span>
            </router-link>
            <router-link v-if="isAuthed" to="/orders" @click="closeMobile">My Orders</router-link>
          </nav>

          <div class="drawer-account">
            <template v-if="isAuthed">
              <p class="drawer-user">{{ auth.user?.name || auth.user?.email }}</p>
              <button class="btn-outline drawer-btn" @click="doLogout">Log out</button>
            </template>
            <button v-else class="btn-solid drawer-btn" @click="mobileSignIn">Sign in</button>
          </div>
        </aside>
      </div>
    </transition>

    <AuthModal :open="authModalOpen" @close="authModalOpen = false" />
  </header>
</template>

<style scoped>
.site-header {
  border-bottom: 1px solid var(--line);
  background: var(--white);
}

.header-inner {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  height: 76px;
}

.logo {
  display: inline-flex;
  align-items: center;
}
.logo img {
  height: 26px;
  width: auto;
}

.search {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 388px;
  height: 46px;
  padding: 0 18px;
  background: var(--search);
  border-radius: 8px;
}
.search-icon {
  width: 18px;
  height: 18px;
  opacity: 0.6;
}
.search input {
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  font-size: 15px;
  color: var(--ink);
}
.search input::placeholder {
  color: var(--muted);
}
.search-clear {
  font-size: 13px;
  color: var(--muted);
  padding: 2px 4px;
  line-height: 1;
}
.search-clear:hover {
  color: var(--ink);
}

.actions {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 22px;
}
.icon-btn {
  display: inline-flex;
}
.icon-btn img {
  width: 24px;
  height: 24px;
  transition: opacity 0.15s ease;
}
.icon-btn:hover img {
  opacity: 0.6;
}
.cart-link {
  position: relative;
}

.account {
  position: relative;
  display: inline-flex;
}
.account-btn {
  color: var(--ink);
}
.account-btn:hover {
  opacity: 0.6;
}
.menu {
  position: absolute;
  top: 38px;
  right: 0;
  z-index: 50;
  min-width: 180px;
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: 10px;
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.12);
  padding: 8px;
}
.menu-name {
  font-size: 13px;
  color: var(--muted);
  padding: 6px 10px 10px;
  border-bottom: 1px solid var(--line);
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.menu-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 9px 10px;
  border-radius: 6px;
  font-size: 14px;
  color: var(--ink);
}
.menu-item:hover {
  background: var(--search);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.badge {
  position: absolute;
  top: -7px;
  right: -8px;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  border-radius: 9px;
  background: var(--black);
  color: var(--white);
  font-size: 11px;
  font-weight: 600;
  line-height: 17px;
  text-align: center;
}

/* Hamburger — hidden on desktop */
.burger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 28px;
  height: 28px;
  justify-self: end;
}
.burger span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--ink);
  border-radius: 2px;
}

/* Mobile drawer */
.drawer-root {
  position: fixed;
  inset: 0;
  z-index: 100;
}
.drawer-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
}
.drawer {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: min(82vw, 320px);
  background: var(--white);
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.18);
  padding: 18px 22px 28px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  overflow-y: auto;
}
.drawer-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.drawer-head .logo img {
  height: 24px;
}
.drawer-close {
  font-size: 20px;
  color: var(--ink);
  padding: 4px;
  line-height: 1;
}
.drawer-search {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 44px;
  padding: 0 14px;
  background: var(--search);
  border-radius: 8px;
}
.drawer-search input {
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  font-size: 15px;
  color: var(--ink);
}
.drawer-nav {
  display: flex;
  flex-direction: column;
}
.drawer-nav a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 0;
  font-size: 17px;
  font-style: italic;
  color: var(--ink);
  border-bottom: 1px solid var(--line);
}
.drawer-nav a.router-link-exact-active {
  font-weight: 600;
}
.pill {
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: var(--black);
  color: var(--white);
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
  text-align: center;
}
.drawer-account {
  margin-top: auto;
}
.drawer-user {
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 12px;
  word-break: break-word;
}
.drawer-btn {
  width: 100%;
  height: 48px;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.2s ease;
}
.drawer-enter-active .drawer,
.drawer-leave-active .drawer {
  transition: transform 0.25s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-from .drawer,
.drawer-leave-to .drawer {
  transform: translateX(100%);
}

@media (max-width: 600px) {
  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
  }
  .logo img {
    height: 22px;
  }
  .search,
  .actions {
    display: none;
  }
  .burger {
    display: flex;
  }
}
</style>

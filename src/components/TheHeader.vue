<script setup>
// Icons and logo come from public/icons (exported from the design).
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { filters } from '../store.js'
import { cartCount } from '../cart.js'
import { favoritesCount } from '../favorites.js'
import { auth, isAuthed, logout, authModalOpen, openAuth } from '../user.js'
import AuthModal from './AuthModal.vue'

const router = useRouter()

function submitSearch() {
  router.push('/products')
}

const menuOpen = ref(false)

function onAccountClick() {
  if (isAuthed.value) menuOpen.value = !menuOpen.value
  else openAuth()
}

function doLogout() {
  logout()
  menuOpen.value = false
  router.push('/')
}

function closeMenu() {
  menuOpen.value = false
}
onMounted(() => document.addEventListener('click', closeMenu))
onUnmounted(() => document.removeEventListener('click', closeMenu))
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
    </div>

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

@media (max-width: 720px) {
  .search {
    width: 100%;
    max-width: 220px;
  }
}

@media (max-width: 480px) {
  .header-inner {
    grid-template-columns: auto minmax(0, 1fr) auto;
    height: 64px;
    gap: 10px;
  }
  .logo img {
    height: 22px;
  }
  .search {
    max-width: none;
    height: 42px;
    padding: 0 14px;
  }
  .actions {
    gap: 16px;
  }
  .icon-btn img {
    width: 22px;
    height: 22px;
  }
}
</style>

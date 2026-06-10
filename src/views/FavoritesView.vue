<script setup>
import { favorites } from '../favorites.js'
</script>

<template>
  <div class="fav-page">
    <div class="fav-col">
      <h1 class="title">Favorite</h1>
      <div class="title-rule"></div>

      <p v-if="!favorites.items.length" class="empty">
        No favorites yet. <router-link to="/products">Browse products →</router-link>
      </p>

      <ul class="list">
        <li v-for="item in favorites.items" :key="item.key" class="row">
          <router-link :to="item.productId ? `/product/${item.productId}` : '/product'" class="row-photo">
            <img v-if="item.image" :src="item.image" :alt="item.name" />
          </router-link>

          <div class="row-info">
            <router-link :to="item.productId ? `/product/${item.productId}` : '/product'" class="row-name">{{ item.name }}</router-link>
            <p class="row-article">{{ item.article }}</p>
          </div>

          <button class="row-remove" aria-label="Remove from favorites" @click="favorites.remove(item.key)">
            ✕
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.fav-page {
  display: flex;
  justify-content: center;
  padding: 56px 24px 110px;
}
.fav-col {
  width: 100%;
  max-width: 460px;
}

.title {
  font-size: 24px;
  font-weight: 500;
  color: var(--ink);
  margin-bottom: 18px;
}
.title-rule {
  height: 1px;
  background: var(--line);
  margin-bottom: 8px;
}

.empty {
  padding: 30px 0;
  font-size: 15px;
  color: var(--muted);
}
.empty a {
  color: var(--ink);
  text-decoration: underline;
}

.list {
  display: flex;
  flex-direction: column;
}
.row {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  align-items: center;
  gap: 22px;
  padding: 30px 0;
  border-bottom: 1px solid var(--line);
}
.row-photo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 76px;
}
.row-photo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.row-name {
  display: block;
  font-size: 15px;
  font-weight: 500;
  font-style: italic;
  line-height: 1.4;
  color: var(--ink);
}
.row-name:hover {
  text-decoration: underline;
}
.row-article {
  font-size: 12px;
  color: var(--muted);
  margin-top: 8px;
}
.row-remove {
  font-size: 15px;
  color: var(--muted);
  padding: 6px;
  align-self: flex-start;
  transition: color 0.15s ease;
}
.row-remove:hover {
  color: var(--ink);
}
</style>

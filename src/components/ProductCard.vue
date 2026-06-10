<script setup>
import { ref, computed } from 'vue'
import TheIcon from './TheIcon.vue'
import { cart } from '../cart.js'
import { favorites } from '../favorites.js'

const props = defineProps({
  id: { type: Number, default: null },
  name: { type: String, required: true },
  price: { type: [String, Number], required: true },
  image: { type: String, default: '' },
  favorite: { type: Boolean, default: false },
})

const liked = computed(() => favorites.has(props.id ?? props.name))

function toggleLike() {
  favorites.toggle({ id: props.id, name: props.name, price: props.price, image: props.image })
}

const added = ref(false)
let addedTimer = null

function addToCart() {
  cart.add({ id: props.id, name: props.name, price: props.price, image: props.image })
  added.value = true
  clearTimeout(addedTimer)
  addedTimer = setTimeout(() => (added.value = false), 1400)
}
</script>

<template>
  <article class="card">
    <button class="like" :class="{ on: liked }" @click="toggleLike" aria-label="Add to wishlist">
      <TheIcon :name="liked ? 'heartFilled' : 'heart'" :size="20" />
    </button>

    <router-link :to="id ? `/product/${id}` : '/product'" class="photo">
      <img v-if="image" :src="image" :alt="name" />
    </router-link>

    <router-link :to="id ? `/product/${id}` : '/product'" class="name">{{ name }}</router-link>
    <p class="price">{{ typeof price === 'number' ? '$' + price : price }}</p>
    <button class="btn-solid buy" :class="{ added }" @click="addToCart">
      {{ added ? 'Added ✓' : 'Buy Now' }}
    </button>
  </article>
</template>

<style scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--card);
  border-radius: 8px;
  padding: 16px 16px 24px;
  text-align: center;
}
.like {
  position: absolute;
  top: 14px;
  right: 14px;
  color: var(--ink);
  display: inline-flex;
}
.like.on {
  color: var(--heart);
}
.photo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 190px;
  margin-bottom: 4px;
}
.photo img {
  max-width: 78%;
  max-height: 100%;
  object-fit: contain;
}
.name {
  display: block;
  font-size: 15px;
  font-weight: 500;
  font-style: italic;
  line-height: 1.35;
  color: var(--ink);
  margin: 6px 0 14px;
  min-height: 41px;
  max-width: 90%;
}
.name:hover {
  text-decoration: underline;
}
.price {
  font-size: 24px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 18px;
}
.buy {
  width: 100%;
}
.buy.added {
  background: #1b8f3a;
}

@media (max-width: 600px) {
  .card {
    padding: 12px 12px 16px;
  }
  .like {
    top: 10px;
    right: 10px;
  }
  .photo {
    height: 150px;
  }
  .name {
    font-size: 13px;
    min-height: 36px;
    margin: 6px 0 10px;
    max-width: 100%;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .price {
    font-size: 20px;
    margin-bottom: 12px;
  }
  .buy {
    height: 42px;
    font-size: 13px;
    padding: 0 12px;
  }
}
</style>

<script setup>
// Device photos intentionally left as empty space — filled later.
const desc =
  'iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.'

const banners = [
  { title: 'Popular Products', theme: 'light', image: '/imgs/airpods-card.png' },
  { title: 'Ipad Pro', theme: 'gray', image: '/imgs/ipad.png' },
  { title: 'Samsung Galaxy', theme: 'gray', image: '/imgs/galaxy-fold.png' },
  { title: 'Macbook Pro', theme: 'dark', image: '/imgs/macbook.png' },
]
</script>

<template>
  <section class="promos">
    <article v-for="b in banners" :key="b.title" class="promo" :class="b.theme">
      <div class="photo"><img :src="b.image" :alt="b.title" /></div>
      <h3 class="title">{{ b.title }}</h3>
      <p class="desc">{{ desc }}</p>
      <router-link to="/products" class="btn-outline" :class="{ 'on-dark': b.theme === 'dark' }">Shop Now</router-link>
    </article>
  </section>
</template>

<style scoped>
.promos {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
.promo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 40px;
  min-height: 420px;
}
.promo.light {
  background: #ffffff;
}
.promo.gray {
  background: var(--panel-2);
}
.promo.dark {
  background: var(--dark);
  color: var(--white);
}

.photo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  margin-bottom: 22px;
}
.photo img {
  max-width: 80%;
  max-height: 100%;
  object-fit: contain;
}
.title {
  font-size: 28px;
  font-weight: 500;
  color: inherit;
  margin-bottom: 12px;
}
.desc {
  font-size: 14px;
  line-height: 1.55;
  color: var(--muted);
  margin-bottom: 22px;
  max-width: 250px;
}
.promo.dark .desc {
  color: #b3b3b3;
}

@media (max-width: 900px) {
  .promos {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 520px) {
  .promos {
    grid-template-columns: 1fr;
  }
}
</style>

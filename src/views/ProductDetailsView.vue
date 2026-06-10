<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { fetchProduct, fetchAllProducts } from '../catalog-api.js'
import { getVariants } from '../product-variants.js'
import { cart } from '../cart.js'
import { favorites } from '../favorites.js'

const route = useRoute()
const router = useRouter()

// Fallback product so the page renders even without an id in the URL.
const FALLBACK = { name: 'Apple iPhone 14 Pro Max', price: 1399, oldPrice: 1499, image: '/imgs/iphone-purple.png', category: 'Phones' }
const product = ref(FALLBACK)
const allProducts = ref([])

const liked = computed(() => favorites.has(product.value.id ?? product.value.name))
function toggleWishlist() {
  favorites.toggle({
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    image: product.value.image,
  })
}

// Variant model — colour drives the image, memory drives the price.
const variants = computed(() => getVariants(product.value))
const colors = computed(() => variants.value.colors)
const memories = computed(() => variants.value.memories)

const activeColor = ref(0)
const activeMemory = ref(0)

// Thumbnails are the colour renders (each colour = one image).
const gallery = computed(() => {
  const imgs = colors.value.map((c) => c.image).filter(Boolean)
  return imgs.length ? imgs : [product.value.image].filter(Boolean)
})
const currentImage = computed(
  () => colors.value[activeColor.value]?.image || product.value.image || '',
)

const memoryDelta = computed(() => memories.value[activeMemory.value]?.delta || 0)
const displayPrice = computed(() => Number(product.value.price || 0) + memoryDelta.value)
const displayOldPrice = computed(() =>
  product.value.oldPrice ? Number(product.value.oldPrice) + memoryDelta.value : null,
)

function formatPrice(n) {
  return '$' + (Number.isInteger(n) ? n : Number(n).toFixed(2))
}

async function load() {
  const id = route.params.id
  try {
    if (id) product.value = await fetchProduct(id)
    if (!allProducts.value.length) allProducts.value = await fetchAllProducts()
  } catch (err) {
    console.error('Failed to load product', err)
  }
  // Reset selection; pre-select the colour whose render matches the product image.
  const match = colors.value.findIndex((c) => c.image === product.value.image)
  activeColor.value = match >= 0 ? match : 0
  activeMemory.value = 0
}
watch(() => route.params.id, load, { immediate: true })

const related = computed(() => {
  const cur = product.value
  const sameCat = allProducts.value.filter((p) => p.id !== cur.id && p.category === cur.category)
  const pool = sameCat.length ? sameCat : allProducts.value.filter((p) => p.id !== cur.id)
  return pool.slice(0, 4)
})

const specs = [
  { icon: '/icons/spec-screen.png', label: 'Screen size', value: '6.7"' },
  { icon: '/icons/spec-cpu.png', label: 'CPU', value: 'Apple A16 Bionic' },
  { icon: '/icons/spec-cores.png', label: 'Number of Cores', value: '6' },
  { icon: '/icons/spec-main-cam.png', label: 'Main camera', value: '48-12-12 MP' },
  { icon: '/icons/spec-front-cam.png', label: 'Front-camera', value: '12 MP' },
  { icon: '/icons/spec-battery.png', label: 'Battery capacity', value: '4323 mAh' },
]

const guarantees = [
  { icon: '/icons/info-delivery.png', label: 'Free Delivery', value: '1-2 day' },
  { icon: '/icons/info-stock.png', label: 'In Stock', value: 'Today' },
  { icon: '/icons/info-guarantee.png', label: 'Guaranteed', value: '1 year' },
]

const detailsTable = [
  { label: 'Screen diagonal', value: ['6.7"'] },
  { label: 'The screen resolution', value: ['2796x1290'] },
  { label: 'The screen refresh rate', value: ['120 Hz'] },
  { label: 'The pixel density', value: ['460 ppi'] },
  { label: 'Screen type', value: ['OLED'] },
  {
    label: 'Additionally',
    value: ['Dynamic Island', 'Always-On display', 'HDR display', 'True Tone', 'Wide color (P3)'],
  },
  { label: 'CPU', value: ['A16 Bionic'] },
  { label: 'Number of cores', value: ['6'] },
  { label: 'Main camera', value: ['48-12-12 MP'] },
  { label: 'Front-camera', value: ['12 MP'] },
]

const rating = 4.8
const reviewCount = 125

function addToCart() {
  cart.add({
    id: product.value.id,
    name: product.value.name,
    price: displayPrice.value,
    image: currentImage.value,
    color: colors.value[activeColor.value]?.name || '',
    memory: memories.value[activeMemory.value]?.label || '',
  })
  router.push('/cart')
}
</script>

<template>
  <div class="pdp">
    <div class="container">
      <!-- breadcrumb -->
      <nav class="crumbs">
        <router-link to="/">Home</router-link><span>›</span>
        <router-link to="/products">Catalog</router-link><span>›</span>
        <router-link to="/products">Smartphones</router-link><span>›</span>
        <router-link to="/products">Apple</router-link><span>›</span>
        <span class="current">iPhone 14 Pro</span>
      </nav>

      <!-- main -->
      <section class="hero">
        <div class="gallery">
          <div class="thumbs">
            <button
              v-for="(g, i) in gallery"
              :key="i"
              class="thumb"
              :class="{ active: i === activeColor }"
              @click="activeColor = i"
            >
              <img :src="g" alt="" />
            </button>
          </div>
          <div class="stage">
            <img v-if="currentImage" :src="currentImage" :alt="product.name" />
          </div>
        </div>

        <div class="info">
          <h1 class="title">{{ product.name }}</h1>
          <div class="price-row">
            <span class="price">{{ formatPrice(displayPrice) }}</span>
            <span v-if="displayOldPrice" class="price-old">{{ formatPrice(displayOldPrice) }}</span>
          </div>

          <div v-if="colors.length > 1 || memories.length > 1" class="selectors">
            <div v-if="colors.length > 1" class="block">
              <span class="block-label">Select color : <b>{{ colors[activeColor]?.name }}</b></span>
              <div class="swatches">
                <button
                  v-for="(c, i) in colors"
                  :key="c.name"
                  class="swatch"
                  :class="{ active: i === activeColor }"
                  :style="{ background: c.hex }"
                  :title="c.name"
                  @click="activeColor = i"
                />
              </div>
            </div>

            <div v-if="memories.length > 1" class="memories">
              <button
                v-for="(m, i) in memories"
                :key="m.label"
                class="mem"
                :class="{ active: i === activeMemory }"
                @click="activeMemory = i"
              >
                {{ m.label }}
              </button>
            </div>
          </div>

          <ul class="specs">
            <li v-for="s in specs" :key="s.label" class="spec">
              <img class="spec-icon" :src="s.icon" alt="" />
              <div class="spec-text">
                <span class="spec-label">{{ s.label }}</span>
                <span class="spec-value">{{ s.value }}</span>
              </div>
            </li>
          </ul>

          <p class="desc">
            Enhanced capabilities thanks to an enlarged display of 6.7 inches and work without
            recharging throughout the day. Incredible photos both in weak and in bright light using
            the new system with two cameras <a href="#" class="more">more...</a>
          </p>

          <div class="actions">
            <button class="btn-outline wish" :class="{ on: liked }" @click="toggleWishlist">
              {{ liked ? 'In Wishlist ♥' : 'Add to Wishlist' }}
            </button>
            <button class="btn-solid cart" @click="addToCart">Add to Card</button>
          </div>

          <div class="guarantees">
            <div v-for="g in guarantees" :key="g.label" class="guarantee">
              <span class="g-icon"><img :src="g.icon" alt="" /></span>
              <div class="g-text">
                <span class="g-label">{{ g.label }}</span>
                <span class="g-value">{{ g.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- details -->
    <div class="container">
      <section class="details">
        <h2 class="section-title">Details</h2>
        <p class="details-intro">
          Just as a book is judged by its cover, the first thing you notice when you pick up a modern
          smartphone is the display. Nothing surprising, because advanced technologies allow you to
          practically level the display frames and cutouts for the front camera and speaker, leaving
          no room for bold design solutions. And how good that in such realities Apple everything is
          fine with displays. Both critics and mass consumers always praise the quality of the
          picture provided by the products of the Californian brand. And last year's 6.7-inch Retina
          panels, which had ProMotion, caused real admiration for many.
        </p>

        <dl class="spec-table">
          <div v-for="row in detailsTable" :key="row.label" class="spec-row">
            <dt>{{ row.label }}</dt>
            <dd>
              <span v-for="v in row.value" :key="v">{{ v }}</span>
            </dd>
          </div>
        </dl>
      </section>

      <!-- reviews -->
      <section class="reviews">
        <div class="rating-card">
          <div class="rating-num">{{ rating }}</div>
          <div class="stars" aria-hidden="true">★★★★<span class="half">★</span></div>
          <div class="rating-sub">of {{ reviewCount }} reviews</div>
        </div>
      </section>

      <!-- related -->
      <section class="related">
        <h2 class="section-title plain">Related Products</h2>
        <div class="related-grid">
          <ProductCard
            v-for="p in related"
            :key="p.id ?? p.name"
            :id="p.id"
            :name="p.name"
            :price="p.price"
            :image="p.image"
            :favorite="p.favorite"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.pdp {
  padding: 28px 0 80px;
}

.crumbs {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--muted);
  margin-bottom: 34px;
}
.crumbs a:hover {
  color: var(--ink);
}
.crumbs span {
  color: var(--line-strong);
}
.crumbs .current {
  color: var(--ink);
}

/* main */
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-bottom: 70px;
}

.gallery {
  display: flex;
  gap: 20px;
}
.thumbs {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.thumb {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  background: var(--card);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  outline: 2px solid transparent;
  outline-offset: -2px;
  transition: outline 0.15s ease;
}
.thumb img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.thumb.active {
  outline-color: var(--ink);
}
.stage {
  flex: 1;
  background: var(--card);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  min-height: 460px;
}
.stage img {
  max-width: 82%;
  max-height: 430px;
  object-fit: contain;
}

.info {
  padding-top: 6px;
}
.title {
  font-size: 40px;
  font-weight: 500;
  font-style: italic;
  line-height: 1.1;
  color: var(--ink);
  margin-bottom: 16px;
}
.price-row {
  display: flex;
  align-items: baseline;
  gap: 14px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--line);
  margin-bottom: 26px;
}
.price {
  font-size: 28px;
  font-weight: 600;
  font-style: italic;
  color: var(--ink);
}
.price-old {
  font-size: 24px;
  font-style: italic;
  color: var(--muted);
  text-decoration: line-through;
}

.selectors {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;
}
.block-label {
  display: block;
  font-size: 14px;
  color: var(--muted);
  margin-bottom: 12px;
}
.block-label b {
  color: var(--ink);
  font-weight: 600;
}
.swatches {
  display: flex;
  gap: 14px;
}
.swatch {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.12);
  outline: 2px solid transparent;
  outline-offset: 2px;
  transition: outline 0.15s ease;
}
.swatch.active {
  outline-color: var(--ink);
}
.memories {
  display: flex;
  gap: 12px;
}
.mem {
  min-width: 72px;
  height: 44px;
  padding: 0 16px;
  border: 1px solid var(--line-strong);
  border-radius: 8px;
  font-size: 14px;
  color: var(--ink);
  background: var(--white);
  transition: all 0.15s ease;
}
.mem.active {
  background: var(--ink);
  border-color: var(--ink);
  color: var(--white);
}

.specs {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 26px;
}
.spec {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--card);
  border-radius: 10px;
  padding: 14px;
}
.spec-icon {
  width: 26px;
  height: 26px;
  opacity: 0.55;
}
.spec-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.spec-label {
  font-size: 11px;
  color: var(--muted);
}
.spec-value {
  font-size: 13px;
  font-style: italic;
  color: var(--ink);
}

.desc {
  font-size: 15px;
  line-height: 1.7;
  color: var(--muted-2);
  margin-bottom: 28px;
}
.more {
  color: var(--ink);
  text-decoration: underline;
}

.actions {
  display: flex;
  gap: 16px;
  margin-bottom: 36px;
}
.actions .wish,
.actions .cart {
  flex: 1;
  height: 56px;
  font-style: normal;
  font-size: 15px;
}
.actions .wish.on {
  background: var(--ink);
  color: var(--white);
}

.guarantees {
  display: flex;
  gap: 30px;
}
.guarantee {
  display: flex;
  align-items: center;
  gap: 12px;
}
.g-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: var(--card);
  border-radius: 10px;
}
.g-icon img {
  width: 22px;
  height: 22px;
  opacity: 0.7;
}
.g-text {
  display: flex;
  flex-direction: column;
}
.g-label {
  font-size: 13px;
  color: var(--muted);
}
.g-value {
  font-size: 14px;
  font-style: italic;
  color: var(--ink);
}

/* details */
.section-title {
  font-size: 28px;
  font-weight: 600;
  font-style: italic;
  color: var(--ink);
  margin-bottom: 26px;
}
.section-title.plain {
  font-style: italic;
}
.details {
  background: #fafafa;
  border-radius: 14px;
  padding: 46px 50px;
  margin-bottom: 60px;
}
.details-intro {
  font-size: 14px;
  line-height: 1.8;
  font-style: italic;
  color: var(--muted);
  margin-bottom: 26px;
}
.spec-table {
  display: flex;
  flex-direction: column;
}
.spec-row {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 16px 0;
  border-top: 1px solid #e6e6e6;
}
.spec-row dt {
  font-size: 14px;
  color: var(--ink-soft);
}
.spec-row dd {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  font-size: 14px;
  color: var(--ink);
  text-align: right;
}

/* reviews */
.reviews {
  margin-bottom: 64px;
}
.rating-card {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: var(--card);
  border-radius: 12px;
  padding: 26px 38px;
}
.rating-num {
  font-size: 44px;
  font-weight: 700;
  color: var(--ink);
  line-height: 1;
}
.stars {
  color: #f5a623;
  font-size: 16px;
  letter-spacing: 2px;
}
.stars .half {
  opacity: 0.4;
}
.rating-sub {
  font-size: 13px;
  font-style: italic;
  color: var(--muted);
}

/* related */
.related-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 36px;
  }
  .specs {
    grid-template-columns: 1fr 1fr;
  }
  .related-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .details {
    padding: 32px 24px;
  }
}
@media (max-width: 560px) {
  .gallery {
    flex-direction: column-reverse;
  }
  .thumbs {
    flex-direction: row;
  }
  .thumb {
    width: 64px;
    height: 64px;
  }
  .stage {
    min-height: 320px;
    padding: 28px;
  }
  .stage img {
    max-height: 280px;
  }
  .title {
    font-size: 28px;
  }
  .selectors {
    flex-direction: column;
    align-items: flex-start;
  }
  .specs {
    grid-template-columns: 1fr 1fr;
  }
  .actions {
    flex-direction: column;
  }
  .guarantees {
    flex-wrap: wrap;
    gap: 16px 24px;
  }
  .details {
    padding: 28px 18px;
  }
  .spec-row {
    flex-direction: column;
    gap: 6px;
  }
  .spec-row dd {
    align-items: flex-start;
    text-align: left;
  }
  .related-grid {
    grid-template-columns: 1fr;
  }
}
</style>

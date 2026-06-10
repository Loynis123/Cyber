<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import FilterSidebar from '../components/FilterSidebar.vue'
import MobileFilters from '../components/MobileFilters.vue'
import ProductCard from '../components/ProductCard.vue'
import { fetchProducts, fetchCatalogMeta, fetchPriceBounds } from '../catalog-api.js'
import { filters } from '../store.js'

const PAGE_SIZE = 9

const brands = ref([])
const filterGroups = ref([])
const sortOptions = ref(['By rating'])

// group name -> product property it filters on (also the API query-param key)
const groupProp = computed(() => ({
  Brand: 'brand',
  ...Object.fromEntries(filterGroups.value.map((g) => [g.name, g.prop])),
}))

function emptySelection(brandDefault = []) {
  const s = { Brand: brandDefault }
  filterGroups.value.forEach((g) => (s[g.name] = []))
  return s
}

const selected = ref({ Brand: ['Apple'] })
const sortBy = ref('By rating')
const sortOpen = ref(false)
const page = ref(1)

// Mobile full-page filters
const filtersOpen = ref(false)
watch(filtersOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) window.scrollTo({ top: 0 })
})
function applyMobileFilters() {
  filtersOpen.value = false
}

// Price filter
const priceBounds = ref({ min: 0, max: 0 })
const priceRange = ref({ min: 0, max: 0 })
const priceNarrowed = computed(
  () => priceRange.value.min > priceBounds.value.min || priceRange.value.max < priceBounds.value.max,
)

// Server-driven results.
const items = ref([])
const total = ref(0)
const pageCount = ref(1)
const loading = ref(false)

const hasActiveFilters = computed(
  () =>
    Object.values(selected.value).some((arr) => arr.length) ||
    !!filters.search.trim() ||
    priceNarrowed.value,
)

// Translate the selection buckets + sort + search + price into API query params.
function buildParams() {
  const params = { sort: sortBy.value, q: filters.search.trim(), page: page.value, pageSize: PAGE_SIZE }
  for (const group in selected.value) {
    const sel = selected.value[group]
    if (sel.length) params[groupProp.value[group]] = sel
  }
  if (priceRange.value.min > priceBounds.value.min) params.minPrice = priceRange.value.min
  if (priceRange.value.max < priceBounds.value.max) params.maxPrice = priceRange.value.max
  return params
}

async function load() {
  loading.value = true
  try {
    const data = await fetchProducts(buildParams())
    items.value = data.items
    total.value = data.total
    pageCount.value = data.pageCount
    // If filters shrank the result set below the current page, clamp and refetch.
    if (page.value > pageCount.value) {
      page.value = pageCount.value
      return load()
    }
  } catch (err) {
    console.error('Failed to load products', err)
  } finally {
    loading.value = false
  }
}

// Debounced reload for filter/sort/search changes (resets to page 1). Guarded
// by `ready` so the initial selection-bucket setup on mount doesn't double-fetch.
let ready = false
let debounceTimer = null
function reloadFromStart() {
  if (!ready) return
  page.value = 1
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(load, 200)
}

onMounted(async () => {
  try {
    const [meta, bounds] = await Promise.all([fetchCatalogMeta(), fetchPriceBounds()])
    brands.value = meta.brands
    filterGroups.value = meta.filterGroups
    sortOptions.value = meta.sortOptions
    priceBounds.value = bounds
    priceRange.value = { min: bounds.min, max: bounds.max }
    // ensure a selection bucket exists for every group
    selected.value = { ...emptySelection([]), ...selected.value }
  } catch (err) {
    console.error('Failed to load catalog meta', err)
  }
  await load()
  ready = true
})

watch(selected, reloadFromStart, { deep: true })
watch(sortBy, reloadFromStart)
watch(priceRange, reloadFromStart, { deep: true })
watch(() => filters.search, reloadFromStart)

const pages = computed(() => {
  const n = pageCount.value
  if (n <= 4) return Array.from({ length: n }, (_, i) => i + 1)
  return [1, 2, 3, '…', n]
})

function go(p) {
  if (typeof p !== 'number') return
  const next = Math.min(Math.max(1, p), pageCount.value)
  if (next === page.value) return
  page.value = next
  load()
}

function pick(option) {
  sortBy.value = option
  sortOpen.value = false
}

function resetFilters() {
  selected.value = emptySelection([])
  filters.search = ''
  priceRange.value = { min: priceBounds.value.min, max: priceBounds.value.max }
}

function formatPrice(n) {
  return '$' + (Number.isInteger(n) ? n : n.toFixed(2))
}

function closeSort() {
  sortOpen.value = false
}
onMounted(() => document.addEventListener('click', closeSort))
onUnmounted(() => document.removeEventListener('click', closeSort))
</script>

<template>
  <section class="products-page">
    <!-- Mobile full-page filters (opened by the Filters button) -->
    <div v-if="filtersOpen" class="container mobile-filters-wrap">
      <MobileFilters
        v-model="selected"
        :brands="brands"
        :groups="filterGroups"
        :price-bounds="priceBounds"
        :price="priceRange"
        :result-count="total"
        @update:price="priceRange = $event"
        @apply="applyMobileFilters"
        @close="filtersOpen = false"
      />
    </div>

    <div v-show="!filtersOpen" class="container layout">
      <div class="filter-panel">
        <FilterSidebar v-model="selected" :brands="brands" :groups="filterGroups" />
      </div>

      <div class="main">
        <div class="toolbar">
          <button class="filters-btn" @click="filtersOpen = true">
            Filters
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round">
              <line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" />
              <circle cx="9" cy="7" r="2" fill="var(--white)" /><circle cx="15" cy="12" r="2" fill="var(--white)" /><circle cx="8" cy="17" r="2" fill="var(--white)" />
            </svg>
          </button>

          <p class="count">
            Products Result : <b>{{ total }}</b>
            <button v-if="hasActiveFilters" class="reset" @click="resetFilters">Reset filters ✕</button>
          </p>

          <div class="sort" :class="{ open: sortOpen }" @click.stop>
            <button class="sort-btn" @click="sortOpen = !sortOpen">
              <span>{{ sortBy }}</span>
              <span class="chev"></span>
            </button>
            <ul v-show="sortOpen" class="sort-menu">
              <li v-for="o in sortOptions" :key="o" :class="{ active: o === sortBy }" @click="pick(o)">
                {{ o }}
              </li>
            </ul>
          </div>
        </div>

        <div v-if="items.length" class="grid">
          <ProductCard
            v-for="(p, i) in items"
            :key="p.id ?? p.name + i"
            :id="p.id"
            :name="p.name"
            :price="formatPrice(p.price)"
            :image="p.image"
          />
        </div>
        <p v-else-if="!loading" class="empty">No products match the selected filters.</p>

        <nav v-if="pageCount > 1" class="pagination">
          <button class="pg arrow" :disabled="page === 1" @click="go(page - 1)">
            <span class="chev-l"></span>
          </button>
          <template v-for="(p, i) in pages" :key="i">
            <span v-if="p === '…'" class="dots">….</span>
            <button v-else class="pg" :class="{ active: p === page }" @click="go(p)">{{ p }}</button>
          </template>
          <button class="pg arrow" :disabled="page === pageCount" @click="go(page + 1)">
            <span class="chev-r"></span>
          </button>
        </nav>
      </div>
    </div>
  </section>
</template>

<style scoped>
.products-page {
  padding: 40px 0 70px;
}
.layout {
  display: grid;
  grid-template-columns: 248px 1fr;
  gap: 50px;
  align-items: start;
}

/* Filters button + full-page filters are mobile-only. */
.filters-btn {
  display: none;
}
.mobile-filters-wrap {
  padding-top: 8px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}
.count {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  font-size: 16px;
  font-style: italic;
  color: var(--ink);
}
.count b {
  font-weight: 700;
}
.reset {
  font-size: 13px;
  font-style: normal;
  color: var(--muted);
  padding: 5px 12px;
  border: 1px solid var(--line-strong);
  border-radius: 6px;
  transition: color 0.15s ease, border-color 0.15s ease;
}
.reset:hover {
  color: var(--ink);
  border-color: var(--ink);
}

/* sort dropdown */
.sort {
  position: relative;
  width: 190px;
}
.sort-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 44px;
  padding: 0 16px;
  border: 1px solid var(--line-strong);
  border-radius: 8px;
  font-size: 14px;
  color: var(--ink);
}
.sort .chev {
  width: 9px;
  height: 9px;
  border-right: 1.5px solid var(--ink);
  border-bottom: 1.5px solid var(--ink);
  transform: rotate(45deg);
  margin-bottom: 4px;
  transition: transform 0.2s ease;
}
.sort.open .chev {
  transform: rotate(-135deg);
  margin-bottom: -4px;
}
.sort-menu {
  position: absolute;
  top: 50px;
  left: 0;
  right: 0;
  z-index: 20;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
.sort-menu li {
  padding: 11px 16px;
  font-size: 14px;
  color: var(--ink-soft);
  cursor: pointer;
}
.sort-menu li:hover {
  background: var(--search);
}
.sort-menu li.active {
  color: var(--ink);
  font-weight: 600;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.empty {
  padding: 30px 0;
  font-style: italic;
  color: var(--muted);
}

/* pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 44px;
}
.pg {
  min-width: 40px;
  height: 40px;
  padding: 0 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: var(--card);
  font-size: 15px;
  font-style: italic;
  color: var(--ink);
  transition: background 0.15s ease;
}
.pg:hover {
  background: #ededed;
}
.pg.active {
  background: var(--black);
  color: #fff;
}
.pg.arrow {
  background: transparent;
}
.pg.arrow:disabled {
  opacity: 0.3;
  cursor: default;
}
.dots {
  color: var(--muted);
  letter-spacing: 2px;
  padding: 0 2px;
}
.chev-l,
.chev-r {
  width: 9px;
  height: 9px;
  border-top: 1.6px solid var(--ink);
  border-right: 1.6px solid var(--ink);
}
.chev-l {
  transform: rotate(-135deg);
}
.chev-r {
  transform: rotate(45deg);
}

@media (max-width: 900px) {
  .products-page {
    padding: 28px 0 56px;
  }
  .layout {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  /* Desktop sidebar hidden — mobile uses the full-page MobileFilters view. */
  .filter-panel {
    display: none;
  }

  /* Toolbar: [Filters] [sort] on one row, count below. */
  .toolbar {
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 22px;
  }
  .filters-btn {
    order: 1;
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    height: 44px;
    border: 1px solid var(--line-strong);
    border-radius: 8px;
    font-size: 14px;
    color: var(--ink);
  }
  .sort {
    order: 2;
    flex: 1;
    width: auto;
  }
  .count {
    order: 3;
    flex-basis: 100%;
    font-size: 14px;
    color: var(--muted-2);
  }
}
</style>

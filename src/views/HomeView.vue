<script setup>
import { ref, onMounted } from 'vue'
import HeroSection from '../components/HeroSection.vue'
import CategoryShowcase from '../components/CategoryShowcase.vue'
import BrowseByCategory from '../components/BrowseByCategory.vue'
import ProductSection from '../components/ProductSection.vue'
import PromoBanners from '../components/PromoBanners.vue'
import SummerSale from '../components/SummerSale.vue'
import { fetchAllProducts } from '../catalog-api.js'

// Homepage product tabs (New Arrival / Bestseller / Featured).
const tabs = [
  { key: 'new', label: 'New Arrival' },
  { key: 'best', label: 'Bestseller' },
  { key: 'featured', label: 'Featured Products' },
]

const catalog = ref([])
const discounts = ref([])

onMounted(async () => {
  try {
    const all = await fetchAllProducts()
    catalog.value = all
    discounts.value = all.filter((p) => p.discount)
  } catch (err) {
    console.error('Failed to load catalog', err)
  }
})
</script>

<template>
  <HeroSection />
  <CategoryShowcase />
  <BrowseByCategory />
  <ProductSection id="catalog" :tabs="tabs" :catalog="catalog" filterable />
  <PromoBanners />
  <ProductSection heading="Discounts up to -50%" :products="discounts" />
  <SummerSale />
</template>

<script setup>
import { filters, setCategory } from '../store.js'

const categories = [
  { label: 'Phones', icon: '/icons/cat-phones.png' },
  { label: 'Smart Watches', icon: '/icons/cat-watches.png' },
  { label: 'Cameras', icon: '/icons/cat-cameras.png' },
  { label: 'Headphones', icon: '/icons/cat-headphones.png' },
  { label: 'Computers', icon: '/icons/cat-computers.png' },
  { label: 'Gaming', icon: '/icons/cat-gaming.png' },
]

function scrollToCatalog() {
  document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function onChip(label) {
  setCategory(label)
  if (filters.category) scrollToCatalog()
}

function step(dir) {
  const labels = categories.map((c) => c.label)
  const cur = labels.indexOf(filters.category)
  const next = cur === -1 ? (dir > 0 ? 0 : labels.length - 1) : (cur + dir + labels.length) % labels.length
  filters.category = labels[next]
  scrollToCatalog()
}
</script>

<template>
  <section class="browse">
    <div class="container">
      <div class="head">
        <h2 class="heading">Browse By Category</h2>
        <div class="nav">
          <button class="nav-btn flip" aria-label="Previous category" @click="step(-1)"><img src="/icons/arrow.png" alt="" /></button>
          <button class="nav-btn" aria-label="Next category" @click="step(1)"><img src="/icons/arrow.png" alt="" /></button>
        </div>
      </div>

      <div class="grid">
        <button
          v-for="c in categories"
          :key="c.label"
          class="chip"
          :class="{ active: filters.category === c.label }"
          @click="onChip(c.label)"
        >
          <img class="chip-icon" :src="c.icon" alt="" />
          <span class="chip-label">{{ c.label }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.browse {
  padding: 70px 0 10px;
}
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}
.heading {
  font-size: 32px;
  font-weight: 600;
  font-style: italic;
  color: var(--ink);
}
.nav {
  display: inline-flex;
  gap: 18px;
}
.nav-btn {
  display: inline-flex;
  transition: opacity 0.15s ease;
}
.nav-btn img {
  width: 22px;
  height: 22px;
}
.nav-btn.flip img {
  transform: scaleX(-1);
}
.nav-btn:hover {
  opacity: 0.5;
}

.grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 28px;
}
.chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  height: 128px;
  background: var(--chip);
  border-radius: 12px;
  color: var(--ink);
  transition: background 0.15s ease;
}
.chip:hover {
  background: #e4e4e4;
}
.chip.active {
  background: #e2e2e2;
  outline: 2px solid var(--ink);
  outline-offset: -2px;
}
.chip-icon {
  width: 44px;
  height: 44px;
  object-fit: contain;
}
.chip-label {
  font-size: 16px;
  font-style: italic;
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 600px) {
  .browse {
    padding: 48px 0 10px;
  }
  .heading {
    font-size: 24px;
  }
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  .chip {
    height: 150px;
    gap: 16px;
  }
  .chip-icon {
    width: 40px;
    height: 40px;
  }
  .chip-label {
    font-size: 15px;
  }
}
</style>

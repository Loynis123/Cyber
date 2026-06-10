<script setup>
import { ref, reactive, computed } from 'vue'

const props = defineProps({
  brands: { type: Array, default: () => [] },
  groups: { type: Array, default: () => [] },
  modelValue: { type: Object, required: true }, // selected buckets keyed by group name
  priceBounds: { type: Object, default: () => ({ min: 0, max: 0 }) },
  price: { type: Object, default: () => ({ min: 0, max: 0 }) }, // current {min,max}
  resultCount: { type: Number, default: 0 },
})
const emit = defineEmits(['update:modelValue', 'update:price', 'apply', 'close'])

// Group order shown on the mobile filters page (Price + Brand are rendered separately).
const ORDER = ['Built-in memory', 'Protection class', 'Screen diagonal', 'Screen type', 'Battery capacity']
const orderedGroups = computed(() =>
  [...props.groups].sort((a, b) => ORDER.indexOf(a.name) - ORDER.indexOf(b.name)),
)

const open = ref({ Price: true, Brand: true, 'Built-in memory': true })
function toggleGroup(name) {
  open.value[name] = !open.value[name]
}
function hasSearch(name) {
  return name === 'Built-in memory'
}

// Checkbox selection
function isOn(group, option) {
  return (props.modelValue[group] || []).includes(option)
}
function toggle(group, option) {
  const next = { ...props.modelValue }
  const set = new Set(next[group] || [])
  set.has(option) ? set.delete(option) : set.add(option)
  next[group] = [...set]
  emit('update:modelValue', next)
}

// Per-list search queries
const brandQuery = ref('')
const queries = reactive({})
const filteredBrands = computed(() => {
  const q = brandQuery.value.trim().toLowerCase()
  return q ? props.brands.filter((b) => b.name.toLowerCase().includes(q)) : props.brands
})
function filteredOptions(g) {
  const q = (queries[g.name] || '').trim().toLowerCase()
  return q ? g.options.filter((o) => o.toLowerCase().includes(q)) : g.options
}

// Price range
const lo = computed(() => props.priceBounds.min)
const hi = computed(() => props.priceBounds.max)
function clamp(v, a, b) {
  return Math.min(Math.max(v, a), b)
}
function setMin(v) {
  const min = clamp(Math.round(+v || lo.value), lo.value, props.price.max)
  emit('update:price', { min, max: props.price.max })
}
function setMax(v) {
  const max = clamp(Math.round(+v || hi.value), props.price.min, hi.value)
  emit('update:price', { min: props.price.min, max })
}
const fillStyle = computed(() => {
  const span = hi.value - lo.value || 1
  const l = ((props.price.min - lo.value) / span) * 100
  const r = ((hi.value - props.price.max) / span) * 100
  return { left: `${l}%`, right: `${r}%` }
})
</script>

<template>
  <div class="filters-page">
    <button class="back" @click="emit('close')">
      <span class="back-arrow"></span> Filters
    </button>

    <!-- Price -->
    <section class="group">
      <button class="group-head" @click="toggleGroup('Price')">
        <span class="group-title">Price</span>
        <span class="chev" :class="{ up: open.Price }"></span>
      </button>
      <div v-show="open.Price" class="group-body">
        <div class="price-fields">
          <label class="price-field">
            <span>From</span>
            <input type="number" :value="price.min" @change="setMin($event.target.value)" />
          </label>
          <span class="price-sep"></span>
          <label class="price-field">
            <span>To</span>
            <input type="number" :value="price.max" @change="setMax($event.target.value)" />
          </label>
        </div>
        <div class="slider">
          <div class="slider-rail"></div>
          <div class="slider-fill" :style="fillStyle"></div>
          <input
            class="slider-input"
            type="range"
            :min="lo"
            :max="hi"
            :value="price.min"
            @input="setMin($event.target.value)"
          />
          <input
            class="slider-input"
            type="range"
            :min="lo"
            :max="hi"
            :value="price.max"
            @input="setMax($event.target.value)"
          />
        </div>
      </div>
    </section>

    <!-- Brand -->
    <section class="group">
      <button class="group-head" @click="toggleGroup('Brand')">
        <span class="group-title">Brand</span>
        <span class="chev" :class="{ up: open.Brand }"></span>
      </button>
      <div v-show="open.Brand" class="group-body">
        <label class="opt-search">
          <img src="/icons/search.png" alt="" />
          <input v-model="brandQuery" type="text" placeholder="Search" />
        </label>
        <ul class="opt-list scroll">
          <li v-for="b in filteredBrands" :key="b.name">
            <label class="opt-row">
              <span class="cb" :class="{ on: isOn('Brand', b.name) }"></span>
              <input class="sr-only" type="checkbox" :checked="isOn('Brand', b.name)" @change="toggle('Brand', b.name)" />
              <span class="opt-name">{{ b.name }}</span>
              <span class="opt-count">{{ b.count }}</span>
            </label>
          </li>
        </ul>
      </div>
    </section>

    <!-- Secondary groups -->
    <section v-for="g in orderedGroups" :key="g.name" class="group">
      <button class="group-head" @click="toggleGroup(g.name)">
        <span class="group-title">{{ g.name }}</span>
        <span class="chev" :class="{ up: open[g.name] }"></span>
      </button>
      <div v-show="open[g.name]" class="group-body">
        <label v-if="hasSearch(g.name)" class="opt-search">
          <img src="/icons/search.png" alt="" />
          <input v-model="queries[g.name]" type="text" placeholder="Search" />
        </label>
        <ul class="opt-list" :class="{ scroll: hasSearch(g.name) }">
          <li v-for="o in filteredOptions(g)" :key="o">
            <label class="opt-row">
              <span class="cb" :class="{ on: isOn(g.name, o) }"></span>
              <input class="sr-only" type="checkbox" :checked="isOn(g.name, o)" @change="toggle(g.name, o)" />
              <span class="opt-name">{{ o }}</span>
            </label>
          </li>
        </ul>
      </div>
    </section>

    <button class="apply btn-solid" @click="emit('apply')">Apply</button>
  </div>
</template>

<style scoped>
.filters-page {
  padding: 8px 0 24px;
}
.back {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  font-size: 22px;
  font-weight: 500;
  color: var(--ink);
  padding: 10px 0 22px;
}
.back-arrow {
  width: 11px;
  height: 11px;
  border-left: 2px solid var(--ink);
  border-bottom: 2px solid var(--ink);
  transform: rotate(45deg);
}

.group {
  border-bottom: 1px solid var(--line);
  padding: 20px 0;
}
.group-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.group-title {
  font-size: 18px;
  font-weight: 600;
  font-style: italic;
  color: var(--ink);
}
.chev {
  width: 11px;
  height: 11px;
  border-right: 2px solid var(--ink);
  border-bottom: 2px solid var(--ink);
  transform: rotate(45deg);
  margin-bottom: 4px;
  transition: transform 0.2s ease;
}
.chev.up {
  transform: rotate(-135deg);
  margin-bottom: -4px;
}
.group-body {
  margin-top: 20px;
}

/* Price */
.price-fields {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 22px;
}
.price-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 16px;
  border: 1px solid var(--line-strong);
  border-radius: 8px;
}
.price-field span {
  font-size: 12px;
  color: var(--muted);
}
.price-field input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  color: var(--ink);
  width: 100%;
}
.price-sep {
  width: 14px;
  height: 1px;
  background: var(--line-strong);
}

.slider {
  position: relative;
  height: 26px;
  display: flex;
  align-items: center;
}
.slider-rail {
  position: absolute;
  left: 0;
  right: 0;
  height: 4px;
  border-radius: 2px;
  background: var(--line-strong);
}
.slider-fill {
  position: absolute;
  height: 4px;
  border-radius: 2px;
  background: var(--ink);
}
.slider-input {
  position: absolute;
  left: 0;
  width: 100%;
  margin: 0;
  background: none;
  pointer-events: none;
  -webkit-appearance: none;
  appearance: none;
}
.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  pointer-events: auto;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--ink);
  border: 3px solid #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}
.slider-input::-moz-range-thumb {
  pointer-events: auto;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--ink);
  border: 3px solid #fff;
  cursor: pointer;
}

/* Option lists */
.opt-search {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 44px;
  padding: 0 14px;
  background: var(--search);
  border-radius: 8px;
  margin-bottom: 16px;
}
.opt-search img {
  width: 16px;
  height: 16px;
  opacity: 0.55;
}
.opt-search input {
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  font-size: 14px;
}
.opt-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.opt-list.scroll {
  max-height: 232px;
  overflow-y: auto;
  padding-right: 6px;
}
.opt-row {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}
.cb {
  position: relative;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border: 1.5px solid #c9c9c9;
  border-radius: 5px;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.cb.on {
  background: var(--black);
  border-color: var(--black);
}
.cb.on::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
  transform: rotate(45deg);
}
.opt-name {
  font-size: 15px;
  font-style: italic;
  color: var(--ink);
}
.opt-count {
  font-size: 12px;
  color: var(--muted);
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.apply {
  width: 100%;
  height: 54px;
  margin-top: 28px;
  font-style: normal;
  font-size: 15px;
}
</style>

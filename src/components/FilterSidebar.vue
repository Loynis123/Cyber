<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  brands: { type: Array, required: true },
  groups: { type: Array, default: () => [] },
  // { 'Brand': [...], 'Battery capacity': [...], ... }
  modelValue: { type: Object, required: true },
})
const emit = defineEmits(['update:modelValue'])

const brandQuery = ref('')
// open state per group; Brand starts open
const open = ref({ Brand: true })

function toggleGroup(name) {
  open.value[name] = !open.value[name]
}

const filteredBrands = computed(() => {
  const q = brandQuery.value.trim().toLowerCase()
  return q ? props.brands.filter((b) => b.name.toLowerCase().includes(q)) : props.brands
})

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
</script>

<template>
  <aside class="sidebar">
    <!-- Brand -->
    <section class="group">
      <button class="group-head" @click="toggleGroup('Brand')">
        <span class="group-title">Brand</span>
        <span class="chev" :class="{ up: open.Brand }"></span>
      </button>

      <div v-show="open.Brand" class="group-body">
        <label class="brand-search">
          <img src="/icons/search.png" alt="" />
          <input v-model="brandQuery" type="text" placeholder="Search" />
        </label>

        <ul class="opt-list">
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
    <section v-for="g in groups" :key="g.name" class="group">
      <button class="group-head" @click="toggleGroup(g.name)">
        <span class="group-title">{{ g.name }}</span>
        <span class="chev" :class="{ up: open[g.name] }"></span>
      </button>

      <div v-show="open[g.name]" class="group-body">
        <ul class="opt-list">
          <li v-for="o in g.options" :key="o">
            <label class="opt-row">
              <span class="cb" :class="{ on: isOn(g.name, o) }"></span>
              <input class="sr-only" type="checkbox" :checked="isOn(g.name, o)" @change="toggle(g.name, o)" />
              <span class="opt-name">{{ o }}</span>
            </label>
          </li>
        </ul>
      </div>
    </section>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 100%;
}
.group {
  border-bottom: 1px solid var(--line);
  padding: 22px 0;
}
.group:first-child {
  padding-top: 0;
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
  transition: transform 0.2s ease;
  margin-bottom: 4px;
}
.chev.up {
  transform: rotate(-135deg);
  margin-bottom: -4px;
}

.group-body {
  margin-top: 18px;
}

.brand-search {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 40px;
  padding: 0 14px;
  background: var(--search);
  border-radius: 8px;
  margin-bottom: 16px;
}
.brand-search img {
  width: 16px;
  height: 16px;
  opacity: 0.55;
}
.brand-search input {
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  font-size: 14px;
}
.brand-search input::placeholder {
  color: var(--muted);
}

.opt-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.opt-row {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}
.cb {
  position: relative;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border: 1.5px solid #c9c9c9;
  border-radius: 4px;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.cb.on {
  background: var(--black);
  border-color: var(--black);
}
.cb.on::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 1px;
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
</style>

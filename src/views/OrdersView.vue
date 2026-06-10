<script setup>
import { ref, onMounted, watch } from 'vue'
import { fetchOrders } from '../orders-api.js'
import { isAuthed, openAuth } from '../user.js'

const orders = ref([])
const loading = ref(false)
const error = ref('')

function money(n) {
  return '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 })
}

function formatDate(s) {
  if (!s) return ''
  // SQLite stores UTC "YYYY-MM-DD HH:MM:SS"; render it in a friendly local form.
  const d = new Date(s.replace(' ', 'T') + 'Z')
  if (Number.isNaN(d.getTime())) return s
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

function variantLabel(item) {
  return [item.color, item.memory].filter(Boolean).join(' · ')
}

async function load() {
  if (!isAuthed.value) {
    orders.value = []
    return
  }
  loading.value = true
  error.value = ''
  try {
    orders.value = await fetchOrders()
  } catch (err) {
    error.value = err.message || 'Failed to load orders'
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(isAuthed, load)
</script>

<template>
  <div class="orders-page">
    <div class="container">
      <h1 class="page-title">My Orders</h1>

      <!-- not signed in -->
      <div v-if="!isAuthed" class="state">
        <p>Please sign in to view your orders.</p>
        <button class="btn-solid" @click="openAuth">Sign in</button>
      </div>

      <p v-else-if="loading" class="state muted">Loading…</p>
      <p v-else-if="error" class="state error">{{ error }}</p>

      <!-- empty -->
      <div v-else-if="!orders.length" class="state">
        <p class="muted">You haven't placed any orders yet.</p>
        <router-link to="/products" class="btn-solid">Browse products</router-link>
      </div>

      <!-- list -->
      <ul v-else class="order-list">
        <li v-for="o in orders" :key="o.id" class="order">
          <header class="order-head">
            <div class="order-meta">
              <span class="order-id">Order #{{ o.id }}</span>
              <span class="order-date">{{ formatDate(o.created_at) }}</span>
            </div>
            <div class="order-right">
              <span class="status" :class="o.status">{{ o.status }}</span>
              <span class="order-total">{{ money(o.total) }}</span>
            </div>
          </header>

          <ul class="lines">
            <li v-for="it in o.items" :key="it.id" class="line">
              <div class="line-photo">
                <img v-if="it.image" :src="it.image" :alt="it.name" />
              </div>
              <div class="line-info">
                <p class="line-name">{{ it.name }}</p>
                <p v-if="variantLabel(it)" class="line-variant">{{ variantLabel(it) }}</p>
              </div>
              <div class="line-qty">×{{ it.qty }}</div>
              <div class="line-price">{{ money(it.price * it.qty) }}</div>
            </li>
          </ul>

          <dl class="order-totals">
            <div><dt>Subtotal</dt><dd>{{ money(o.subtotal) }}</dd></div>
            <div><dt>Tax</dt><dd>{{ money(o.tax) }}</dd></div>
            <div><dt>Shipping &amp; Handling</dt><dd>{{ money(o.shipping) }}</dd></div>
            <div class="grand"><dt>Total</dt><dd>{{ money(o.total) }}</dd></div>
          </dl>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.orders-page {
  padding: 48px 0 90px;
}
.page-title {
  font-size: 32px;
  font-weight: 500;
  color: var(--ink);
  margin-bottom: 32px;
}

.state {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
  padding: 24px 0;
  font-size: 16px;
}
.state.muted,
.muted {
  color: var(--muted);
}
.state.error,
.error {
  color: #c0392b;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.order {
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 24px 28px;
}
.order-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--line);
}
.order-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.order-id {
  font-size: 17px;
  font-weight: 600;
  font-style: italic;
  color: var(--ink);
}
.order-date {
  font-size: 13px;
  color: var(--muted);
}
.order-right {
  display: flex;
  align-items: center;
  gap: 18px;
}
.status {
  font-size: 12px;
  text-transform: capitalize;
  color: #1b8f3a;
  background: rgba(27, 143, 58, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
}
.order-total {
  font-size: 18px;
  font-weight: 600;
  font-style: italic;
  color: var(--ink);
}

.lines {
  display: flex;
  flex-direction: column;
  padding: 8px 0;
}
.line {
  display: grid;
  grid-template-columns: 64px 1fr auto auto;
  align-items: center;
  gap: 18px;
  padding: 16px 0;
  border-bottom: 1px solid var(--line);
}
.line:last-child {
  border-bottom: none;
}
.line-photo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 60px;
}
.line-photo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.line-name {
  font-size: 14px;
  font-weight: 500;
  font-style: italic;
  color: var(--ink);
  line-height: 1.4;
}
.line-variant {
  font-size: 12px;
  color: var(--muted);
  margin-top: 4px;
}
.line-qty {
  font-size: 14px;
  color: var(--muted);
}
.line-price {
  font-size: 15px;
  font-weight: 600;
  font-style: italic;
  color: var(--ink);
  min-width: 72px;
  text-align: right;
}

.order-totals {
  margin-top: 16px;
  margin-left: auto;
  max-width: 280px;
}
.order-totals > div {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  font-size: 14px;
  color: var(--muted);
  margin-bottom: 8px;
}
.order-totals .grand {
  color: var(--ink);
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 0;
}

@media (max-width: 560px) {
  .page-title {
    font-size: 26px;
  }
  .order {
    padding: 18px 16px;
  }
  .order-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .line {
    grid-template-columns: 52px 1fr auto;
    gap: 12px;
  }
  .line-qty {
    display: none;
  }
  .order-totals {
    max-width: none;
  }
}
</style>

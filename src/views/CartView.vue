<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { cart, cartSubtotal } from '../cart.js'
import { api } from '../api.js'
import { isAuthed, openAuth } from '../user.js'

const router = useRouter()

const promo = ref('')
const bonusCard = ref('')

const ESTIMATED_TAX = 50
const ESTIMATED_SHIPPING = 29

const subtotal = cartSubtotal
const total = computed(() =>
  cart.items.length ? subtotal.value + ESTIMATED_TAX + ESTIMATED_SHIPPING : 0,
)

const placing = ref(false)
const placedOrder = ref(null)
const checkoutError = ref('')

function money(n) {
  return '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 })
}

function applyBonus() {
  // Demo only — no real bonus backend.
  bonusCard.value = ''
}

async function checkout() {
  if (!cart.items.length || placing.value) return
  if (!isAuthed.value) {
    openAuth() // must be signed in to place an order
    return
  }
  placing.value = true
  checkoutError.value = ''
  try {
    const order = await api.post('/orders')
    await cart.clear()
    placedOrder.value = order
    router.push('/orders')
  } catch (err) {
    checkoutError.value = err.message || 'Checkout failed'
  } finally {
    placing.value = false
  }
}
</script>

<template>
  <div class="cart-page">
    <div class="container">
      <h1 class="page-title">Shopping Cart</h1>

      <div class="layout">
        <!-- items -->
        <section class="items">
          <p v-if="!cart.items.length" class="empty">
            Your cart is empty. <router-link to="/products">Browse products →</router-link>
          </p>

          <div v-for="item in cart.items" :key="item.key" class="item">
            <div class="item-photo">
              <img v-if="item.image" :src="item.image" :alt="item.name" />
            </div>

            <div class="item-info">
              <p class="item-name">{{ item.name }}</p>
              <p class="item-article">{{ item.article }}</p>
            </div>

            <div class="stepper">
              <button aria-label="Decrease" @click="cart.decrement(item.key)">−</button>
              <span class="qty">{{ item.qty }}</span>
              <button aria-label="Increase" @click="cart.increment(item.key)">+</button>
            </div>

            <div class="item-price">{{ money(item.price * item.qty) }}</div>

            <button class="item-remove" aria-label="Remove" @click="cart.remove(item.key)">✕</button>
          </div>
        </section>

        <!-- order summary -->
        <aside class="summary">
          <h2 class="summary-title">Order Summary</h2>

          <label class="field-label">Discount code / Promo code</label>
          <input v-model="promo" class="field" type="text" placeholder="Code" />

          <label class="field-label">Your bonus card number</label>
          <div class="bonus">
            <input v-model="bonusCard" class="field" type="text" placeholder="Enter Card Number" />
            <button class="apply" @click="applyBonus">Apply</button>
          </div>

          <dl class="totals">
            <div class="total-row">
              <dt>Subtotal</dt>
              <dd>{{ money(subtotal) }}</dd>
            </div>
            <div class="total-row muted">
              <dt>Estimated Tax</dt>
              <dd>{{ money(cart.items.length ? ESTIMATED_TAX : 0) }}</dd>
            </div>
            <div class="total-row muted">
              <dt>Estimated shipping &amp; Handling</dt>
              <dd>{{ money(cart.items.length ? ESTIMATED_SHIPPING : 0) }}</dd>
            </div>
            <div class="total-row grand">
              <dt>Total</dt>
              <dd>{{ money(total) }}</dd>
            </div>
          </dl>

          <button class="checkout" :disabled="!cart.items.length || placing" @click="checkout">
            {{ placing ? 'Placing…' : isAuthed ? 'Checkout' : 'Sign in to checkout' }}
          </button>
          <p v-if="checkoutError" class="checkout-msg error">{{ checkoutError }}</p>
          <p v-if="placedOrder" class="checkout-msg ok">
            Order #{{ placedOrder.id }} placed — total {{ money(placedOrder.total) }}. Thank you!
          </p>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-page {
  padding: 48px 0 90px;
}
.page-title {
  font-size: 32px;
  font-weight: 500;
  color: var(--ink);
  margin-bottom: 36px;
}

.layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 80px;
  align-items: start;
}

/* items */
.items {
  min-height: 100px;
}
.empty {
  font-size: 16px;
  color: var(--muted);
}
.empty a {
  color: var(--ink);
  text-decoration: underline;
}

.item {
  display: grid;
  grid-template-columns: 96px 1fr auto auto auto;
  align-items: center;
  gap: 22px;
  padding: 22px 0;
  border-bottom: 1px solid var(--line);
}
.item:first-child {
  padding-top: 0;
}
.item-photo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 80px;
}
.item-photo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.item-name {
  font-size: 15px;
  font-weight: 500;
  font-style: italic;
  line-height: 1.4;
  color: var(--ink);
  max-width: 230px;
}
.item-article {
  font-size: 12px;
  color: var(--muted);
  margin-top: 6px;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 14px;
}
.stepper button {
  width: 26px;
  height: 26px;
  border: 1px solid var(--line-strong);
  border-radius: 6px;
  font-size: 16px;
  line-height: 1;
  color: var(--ink);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease;
}
.stepper button:hover {
  background: var(--chip);
}
.qty {
  min-width: 28px;
  text-align: center;
  font-size: 15px;
  color: var(--ink);
}

.item-price {
  font-size: 18px;
  font-weight: 600;
  font-style: italic;
  color: var(--ink);
  min-width: 70px;
  text-align: right;
}
.item-remove {
  font-size: 16px;
  color: var(--muted);
  padding: 4px;
  transition: color 0.15s ease;
}
.item-remove:hover {
  color: var(--ink);
}

/* summary */
.summary {
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 30px;
}
.summary-title {
  font-size: 22px;
  font-weight: 500;
  color: var(--ink);
  margin-bottom: 24px;
}
.field-label {
  display: block;
  font-size: 13px;
  font-style: italic;
  color: var(--muted);
  margin-bottom: 8px;
}
.field {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1px solid var(--line-strong);
  border-radius: 8px;
  font-size: 14px;
  color: var(--ink);
  outline: none;
  margin-bottom: 18px;
}
.field::placeholder {
  color: var(--muted);
}
.field:focus {
  border-color: var(--ink);
}
.bonus {
  position: relative;
  margin-bottom: 6px;
}
.bonus .field {
  padding-right: 84px;
  margin-bottom: 0;
}
.apply {
  position: absolute;
  top: 7px;
  right: 7px;
  height: 34px;
  padding: 0 16px;
  border: 1px solid var(--line-strong);
  border-radius: 6px;
  font-size: 13px;
  color: var(--ink);
  background: var(--white);
  transition: background 0.15s ease;
}
.apply:hover {
  background: var(--chip);
}

.totals {
  margin: 26px 0;
}
.total-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 15px;
  color: var(--ink);
}
.total-row.muted {
  color: var(--muted);
}
.total-row dd {
  font-weight: 500;
}
.total-row.grand {
  font-size: 18px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 0;
}

.checkout {
  width: 100%;
  height: 54px;
  margin-top: 24px;
  background: var(--black);
  color: var(--white);
  border-radius: 8px;
  font-size: 15px;
  font-style: italic;
  transition: opacity 0.15s ease;
}
.checkout:hover {
  opacity: 0.88;
}
.checkout:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.checkout-msg {
  margin-top: 14px;
  font-size: 13px;
  text-align: center;
}
.checkout-msg.error {
  color: #d13434;
}
.checkout-msg.ok {
  color: #1b8f3a;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}
@media (max-width: 560px) {
  .cart-page {
    padding: 32px 0 64px;
  }
  .page-title {
    font-size: 26px;
    margin-bottom: 24px;
  }
  .summary {
    padding: 24px 20px;
  }
  .item-name {
    max-width: none;
  }
  .item {
    grid-template-columns: 72px 1fr auto;
    grid-template-areas:
      'photo info remove'
      'photo stepper price';
    gap: 14px;
  }
  .item-photo {
    grid-area: photo;
  }
  .item-info {
    grid-area: info;
  }
  .stepper {
    grid-area: stepper;
  }
  .item-price {
    grid-area: price;
  }
  .item-remove {
    grid-area: remove;
    justify-self: end;
  }
}
</style>

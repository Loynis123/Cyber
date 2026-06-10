<script setup>
import { ref, reactive, watch } from 'vue'
import { login, register } from '../user.js'

const props = defineProps({
  open: { type: Boolean, default: false },
})
const emit = defineEmits(['close'])

const mode = ref('login') // 'login' | 'register'
const form = reactive({ name: '', email: '', password: '' })
const error = ref('')
const loading = ref(false)

watch(
  () => props.open,
  (open) => {
    if (open) {
      error.value = ''
      loading.value = false
    }
  },
)

function switchMode(next) {
  mode.value = next
  error.value = ''
}

async function submit() {
  error.value = ''
  loading.value = true
  try {
    if (mode.value === 'login') {
      await login({ email: form.email, password: form.password })
    } else {
      await register({ email: form.email, password: form.password, name: form.name })
    }
    form.password = ''
    emit('close')
  } catch (err) {
    error.value = err.message || 'Something went wrong'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <transition name="fade">
    <div v-if="open" class="overlay" @click.self="emit('close')">
      <div class="modal" role="dialog" aria-modal="true">
        <button class="close" aria-label="Close" @click="emit('close')">✕</button>

        <div class="tabs">
          <button :class="{ active: mode === 'login' }" @click="switchMode('login')">Sign In</button>
          <button :class="{ active: mode === 'register' }" @click="switchMode('register')">Register</button>
        </div>

        <form @submit.prevent="submit">
          <label v-if="mode === 'register'" class="field">
            <span>Name</span>
            <input v-model="form.name" type="text" placeholder="Your name" autocomplete="name" />
          </label>

          <label class="field">
            <span>Email</span>
            <input v-model="form.email" type="email" placeholder="you@example.com" autocomplete="email" required />
          </label>

          <label class="field">
            <span>Password</span>
            <input v-model="form.password" type="password" placeholder="••••••" autocomplete="current-password" required minlength="6" />
          </label>

          <p v-if="error" class="error">{{ error }}</p>

          <button class="submit" type="submit" :disabled="loading">
            {{ loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create account' }}
          </button>
        </form>

        <p v-if="mode === 'login'" class="hint">Demo: demo@cyber.test / password123</p>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.5);
}
.modal {
  position: relative;
  width: 100%;
  max-width: 380px;
  background: var(--white);
  border-radius: 14px;
  padding: 34px 30px 28px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
}
.close {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 16px;
  color: var(--muted);
  padding: 4px;
}
.close:hover {
  color: var(--ink);
}

.tabs {
  display: flex;
  gap: 26px;
  margin-bottom: 26px;
}
.tabs button {
  position: relative;
  font-size: 18px;
  font-weight: 600;
  font-style: italic;
  color: var(--muted);
  padding-bottom: 8px;
}
.tabs button.active {
  color: var(--ink);
}
.tabs button.active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 100%;
  height: 2px;
  background: var(--black);
}

.field {
  display: block;
  margin-bottom: 16px;
}
.field span {
  display: block;
  font-size: 13px;
  font-style: italic;
  color: var(--muted);
  margin-bottom: 6px;
}
.field input {
  width: 100%;
  height: 46px;
  padding: 0 14px;
  border: 1px solid var(--line-strong);
  border-radius: 8px;
  font-size: 14px;
  color: var(--ink);
  outline: none;
}
.field input:focus {
  border-color: var(--ink);
}

.error {
  font-size: 13px;
  color: #d13434;
  margin-bottom: 14px;
}

.submit {
  width: 100%;
  height: 50px;
  margin-top: 6px;
  background: var(--black);
  color: var(--white);
  border-radius: 8px;
  font-size: 15px;
  font-style: italic;
  transition: opacity 0.15s ease;
}
.submit:hover {
  opacity: 0.88;
}
.submit:disabled {
  opacity: 0.5;
  cursor: default;
}

.hint {
  margin-top: 16px;
  font-size: 12px;
  color: var(--muted);
  text-align: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

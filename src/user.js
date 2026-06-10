import { reactive, computed, ref } from 'vue'
import { api, getToken, setToken, ApiError } from './api.js'

// Auth/user store. Token lives in localStorage (see api.js); this holds the
// reactive user + token state the UI reacts to. Cart/favorites watch isAuthed
// to sync with the server (they import this module; this one imports neither,
// to avoid a circular dependency).
const state = reactive({
  user: null,
  token: getToken(),
  ready: false, // becomes true once the initial /me check resolves
})

export const auth = state
export const isAuthed = computed(() => !!state.token)

// Shared auth-modal visibility so any view (e.g. checkout) can prompt sign-in.
export const authModalOpen = ref(false)
export function openAuth() {
  authModalOpen.value = true
}

function applySession({ token, user }) {
  state.token = token
  state.user = user
  setToken(token)
}

export async function register({ email, password, name }) {
  const data = await api.post('/auth/register', { email, password, name })
  applySession(data)
  return data.user
}

export async function login({ email, password }) {
  const data = await api.post('/auth/login', { email, password })
  applySession(data)
  return data.user
}

export function logout() {
  state.user = null
  state.token = ''
  setToken('')
}

// Called once on app start: if a token is stored, validate it and load the user.
export async function initAuth() {
  if (!state.token) {
    state.ready = true
    return
  }
  try {
    const { user } = await api.get('/auth/me')
    state.user = user
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) logout()
  } finally {
    state.ready = true
  }
}

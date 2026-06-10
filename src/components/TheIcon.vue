<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 24 },
})

// body = inner SVG markup, fill = true for solid icons (else stroked)
const icons = {
  logo: {
    fill: true,
    viewBox: '0 0 30 26',
    body: '<path d="M2 2.5 L18 2.5 L11.2 12 Z" /><path d="M12.5 2.5 L28 2.5 L15 23 Z" opacity="0.55" />',
  },
  search: {
    viewBox: '0 0 24 24',
    body: '<circle cx="11" cy="11" r="7.2" /><line x1="16.5" y1="16.5" x2="21" y2="21" />',
  },
  heart: {
    viewBox: '0 0 24 24',
    body: '<path d="M12 20.5 C12 20.5 3.5 15.2 3.5 8.9 C3.5 6.1 5.7 4 8.4 4 C10 4 11.4 4.9 12 6.2 C12.6 4.9 14 4 15.6 4 C18.3 4 20.5 6.1 20.5 8.9 C20.5 15.2 12 20.5 12 20.5 Z" />',
  },
  heartFilled: {
    fill: true,
    viewBox: '0 0 24 24',
    body: '<path d="M12 20.5 C12 20.5 3.5 15.2 3.5 8.9 C3.5 6.1 5.7 4 8.4 4 C10 4 11.4 4.9 12 6.2 C12.6 4.9 14 4 15.6 4 C18.3 4 20.5 6.1 20.5 8.9 C20.5 15.2 12 20.5 12 20.5 Z" />',
  },
  cart: {
    viewBox: '0 0 24 24',
    body: '<path d="M2.5 3 H5 L6.2 5 M6.2 5 L7.8 14.5 H19 L21.2 6 H6.2 Z" /><circle cx="9" cy="19" r="1.4" /><circle cx="18" cy="19" r="1.4" />',
  },
  chevronLeft: {
    viewBox: '0 0 24 24',
    body: '<polyline points="15 5 8 12 15 19" />',
  },
  chevronRight: {
    viewBox: '0 0 24 24',
    body: '<polyline points="9 5 16 12 9 19" />',
  },
  phone: {
    viewBox: '0 0 40 40',
    body: '<rect x="13" y="7" width="14" height="26" rx="2.5" /><line x1="18" y1="29" x2="22" y2="29" />',
  },
  watch: {
    viewBox: '0 0 40 40',
    body: '<rect x="13" y="13" width="14" height="14" rx="4" /><path d="M16 13 L16.8 8 H23.2 L24 13" /><path d="M16 27 L16.8 32 H23.2 L24 27" /><line x1="20" y1="17" x2="20" y2="20" /><line x1="17.5" y1="22" x2="22.5" y2="22" />',
  },
  camera: {
    viewBox: '0 0 40 40',
    body: '<rect x="7" y="13" width="26" height="17" rx="2.5" /><path d="M15 13 L17 9 H23 L25 13" /><circle cx="20" cy="21.5" r="5" />',
  },
  headphones: {
    viewBox: '0 0 40 40',
    body: '<path d="M9 23 V20 a11 11 0 0 1 22 0 V23" /><rect x="6.5" y="22" width="5.5" height="9" rx="2.5" /><rect x="28" y="22" width="5.5" height="9" rx="2.5" />',
  },
  monitor: {
    viewBox: '0 0 40 40',
    body: '<rect x="8" y="10" width="24" height="16" rx="2" /><line x1="20" y1="26" x2="20" y2="30" /><line x1="14" y1="31" x2="26" y2="31" />',
  },
  gamepad: {
    viewBox: '0 0 40 40',
    body: '<rect x="8" y="14" width="24" height="12" rx="6" /><line x1="14" y1="18" x2="14" y2="22" /><line x1="12" y1="20" x2="16" y2="20" /><circle cx="25" cy="19" r="1" /><circle cx="28" cy="22" r="1" />',
  },
  twitter: {
    fill: true,
    viewBox: '0 0 24 24',
    body: '<path d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7A11.6 11.6 0 0 1 3.4 4.6a4.1 4.1 0 0 0 1.3 5.5c-.7 0-1.3-.2-1.8-.5v.1c0 2 1.4 3.6 3.3 4-.6.2-1.3.2-1.9.1.5 1.7 2.1 2.9 4 2.9A8.2 8.2 0 0 1 2 18.4 11.6 11.6 0 0 0 8.3 20c7.5 0 11.6-6.2 11.6-11.6v-.5c.8-.6 1.5-1.3 2.1-2z" />',
  },
  facebook: {
    fill: true,
    viewBox: '0 0 24 24',
    body: '<path d="M14 8.5V6.7c0-.8.2-1.2 1.3-1.2H17V2.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v1.9H8.2V11h2.4v9h3.1v-9h2.4l.4-2.5H14z" />',
  },
  tiktok: {
    fill: true,
    viewBox: '0 0 24 24',
    body: '<path d="M16.5 2h-2.7v12.6a2.3 2.3 0 1 1-2.3-2.3c.2 0 .4 0 .6.1V9.6a5 5 0 0 0-.6 0 5.1 5.1 0 1 0 5.1 5.1V8.4a6.3 6.3 0 0 0 3.6 1.1V6.8a3.6 3.6 0 0 1-3.6-3.6V2z" />',
  },
  instagram: {
    viewBox: '0 0 24 24',
    body: '<rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none" />',
  },
}

const icon = computed(() => icons[props.name] || icons.search)
</script>

<template>
  <svg
    :viewBox="icon.viewBox"
    :width="size"
    :height="size"
    :fill="icon.fill ? 'currentColor' : 'none'"
    :stroke="icon.fill ? 'none' : 'currentColor'"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    v-html="icon.body"
  />
</template>

<style scoped>
svg {
  display: block;
  flex-shrink: 0;
}
</style>

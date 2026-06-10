import { reactive } from 'vue'

// Global, app-wide filter state shared by the header search,
// the category chips and the product catalog.
export const filters = reactive({
  search: '',
  category: null,
})

export function setCategory(category) {
  filters.category = filters.category === category ? null : category
}

export function clearFilters() {
  filters.search = ''
  filters.category = null
}

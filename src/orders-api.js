import { api } from './api.js'

// Order history for the signed-in user. The server returns each order with its
// line items already joined in.
export async function fetchOrders() {
  return api.get('/orders')
}

export async function fetchOrder(id) {
  return api.get(`/orders/${id}`)
}

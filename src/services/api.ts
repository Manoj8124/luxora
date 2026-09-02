/**
 * Typed API Client for LUXORA Fashion E-Commerce
 */

import {
  User,
  Product,
  Category,
  Address,
  Order,
  Review,
  AdminAnalytics,
  CartItem
} from '../types.js';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('luxora_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'An unexpected error occurred');
  }
  return data as T;
}

export const api = {
  // Auth
  async register(data: { name: string; email: string; password: string; phone?: string }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<{ user: User; token: string; message: string }>(res);
  },

  async login(data: { email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<{ user: User; token: string; message: string }>(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ user: User }>(res);
  },

  async updateProfile(data: Partial<User>) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<{ user: User; message: string }>(res);
  },

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<{ message: string }>(res);
  },

  // Products
  async getProducts(params?: Record<string, any>) {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, String(val));
        }
      });
    }
    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    return handleResponse<{ products: Product[]; total: number; page: number; totalPages: number }>(res);
  },

  async getProduct(idOrSlug: string) {
    const res = await fetch(`${API_BASE}/products/${idOrSlug}`);
    return handleResponse<Product>(res);
  },

  async createProduct(data: Partial<Product>) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<Product>(res);
  },

  async updateProduct(id: string, data: Partial<Product>) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<Product>(res);
  },

  async deleteProduct(id: string) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  // Categories
  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    return handleResponse<Category[]>(res);
  },

  async createCategory(data: Partial<Category>) {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<Category>(res);
  },

  // Cart
  async getCart() {
    const res = await fetch(`${API_BASE}/cart`, {
      headers: getAuthHeaders()
    });
    return handleResponse<CartItem[]>(res);
  },

  async addToCart(productId: string, size: string, color: string, quantity = 1) {
    const res = await fetch(`${API_BASE}/cart`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, size, color, quantity })
    });
    return handleResponse<CartItem[]>(res);
  },

  async updateCartQuantity(itemId: string, quantity: number) {
    const res = await fetch(`${API_BASE}/cart/${itemId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity })
    });
    return handleResponse<CartItem[]>(res);
  },

  async removeFromCart(itemId: string) {
    const res = await fetch(`${API_BASE}/cart/${itemId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<CartItem[]>(res);
  },

  async clearCart() {
    const res = await fetch(`${API_BASE}/cart`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<CartItem[]>(res);
  },

  // Wishlist
  async getWishlist() {
    const res = await fetch(`${API_BASE}/wishlist`, {
      headers: getAuthHeaders()
    });
    return handleResponse<Product[]>(res);
  },

  async toggleWishlist(productId: string) {
    const res = await fetch(`${API_BASE}/wishlist/toggle`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId })
    });
    return handleResponse<{ wishlist: Product[]; added: boolean }>(res);
  },

  // Addresses
  async getAddresses() {
    const res = await fetch(`${API_BASE}/addresses`, {
      headers: getAuthHeaders()
    });
    return handleResponse<Address[]>(res);
  },

  async createAddress(data: Partial<Address>) {
    const res = await fetch(`${API_BASE}/addresses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<Address>(res);
  },

  async updateAddress(id: string, data: Partial<Address>) {
    const res = await fetch(`${API_BASE}/addresses/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<Address>(res);
  },

  async deleteAddress(id: string) {
    const res = await fetch(`${API_BASE}/addresses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  // Coupons
  async validateCoupon(code: string, orderSubtotal: number) {
    const res = await fetch(`${API_BASE}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, orderSubtotal })
    });
    return handleResponse<{
      valid: boolean;
      code: string;
      discountPercentage: number;
      discountAmount: number;
      description: string;
    }>(res);
  },

  // Orders
  async getOrders(all = false) {
    const res = await fetch(`${API_BASE}/orders${all ? '?all=true' : ''}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<Order[]>(res);
  },

  async getOrder(id: string) {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<Order>(res);
  },

  async getOrderTracking(id: string) {
    const res = await fetch(`${API_BASE}/orders/${id}/tracking`);
    return handleResponse<{
      orderNumber: string;
      carrierName: string;
      trackingNumber: string;
      estimatedDelivery: string;
      orderStatus: string;
      tracking: any[];
    }>(res);
  },

  async placeOrder(orderData: any) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData)
    });
    return handleResponse<{ order: Order; message: string }>(res);
  },

  async cancelOrder(id: string, reason?: string) {
    const res = await fetch(`${API_BASE}/orders/${id}/cancel`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason })
    });
    return handleResponse<{ order: Order; message: string }>(res);
  },

  async updateOrderStatus(id: string, status: string, note?: string) {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, note })
    });
    return handleResponse<{ order: Order; message: string }>(res);
  },

  // Reviews
  async getProductReviews(productId: string) {
    const res = await fetch(`${API_BASE}/products/${productId}/reviews`);
    return handleResponse<Review[]>(res);
  },

  async submitReview(productId: string, data: { rating: number; title: string; comment: string }) {
    const res = await fetch(`${API_BASE}/products/${productId}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<Review>(res);
  },

  // Admin Analytics
  async getAdminAnalytics() {
    const res = await fetch(`${API_BASE}/admin/analytics`, {
      headers: getAuthHeaders()
    });
    return handleResponse<AdminAnalytics>(res);
  },

  async getAdminUsers() {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getAuthHeaders()
    });
    return handleResponse<(User & { ordersCount: number; totalSpent: number })[]>(res);
  },

  // Product aliases
  getProductBySlugOrId(idOrSlug: string) {
    return this.getProduct(idOrSlug);
  },
  createAdminProduct(data: Partial<Product>) {
    return this.createProduct(data);
  },
  updateAdminProduct(id: string, data: Partial<Product>) {
    return this.updateProduct(id, data);
  },
  deleteAdminProduct(id: string) {
    return this.deleteProduct(id);
  },

  // Address aliases
  addAddress(data: Partial<Address>) {
    return this.createAddress(data);
  },

  // Order aliases
  getMyOrders() {
    return this.getOrders(false);
  },
  getAdminOrders() {
    return this.getOrders(true);
  },
  getOrderById(id: string) {
    return this.getOrder(id);
  },
  createOrder(data: any) {
    return this.placeOrder(data).then(res => res.order);
  },
  updateAdminOrderStatus(id: string, status: string, note?: string) {
    return this.updateOrderStatus(id, status, note);
  },

  // Newsletter
  async subscribeNewsletter(email: string) {
    const res = await fetch(`${API_BASE}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  }
};

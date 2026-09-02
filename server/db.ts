import fs from 'fs';
import path from 'path';
import {
  User,
  Product,
  Category,
  Review,
  Address,
  Order,
  Coupon,
  CartItem,
  OrderStatus,
  TrackingStep,
  AdminAnalytics
} from '../src/types.js';
import { getInitialSeedData } from './seedData.js';

interface DatabaseSchema {
  categories: Category[];
  products: Product[];
  coupons: Coupon[];
  users: User[];
  credentials: Record<string, string>; // email -> bcrypt hash
  addresses: Address[];
  reviews: Review[];
  orders: Order[];
  carts: Record<string, CartItem[]>; // userId -> CartItem[]
  wishlists: Record<string, string[]>; // userId -> productId[]
  newsletterSubscribers: string[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'store.json');

class DatabaseStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.init();
  }

  private init(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.products && parsed.products.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed reading database file, reseeding:', e);
    }

    const initial = getInitialSeedData();
    this.persist(initial);
    return initial;
  }

  private persist(dataToSave?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving data store:', e);
    }
  }

  // --- Users & Auth ---
  getUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  getPasswordHash(email: string): string | undefined {
    return this.data.credentials[email.toLowerCase()];
  }

  createUser(user: User, passwordHash: string): User {
    this.data.users.push(user);
    this.data.credentials[user.email.toLowerCase()] = passwordHash;
    this.data.carts[user.id] = [];
    this.data.wishlists[user.id] = [];
    this.persist();
    return user;
  }

  updateUserProfile(id: string, updates: Partial<User>, newPasswordHash?: string): User | null {
    const user = this.getUserById(id);
    if (!user) return null;

    Object.assign(user, updates);
    if (newPasswordHash) {
      this.data.credentials[user.email.toLowerCase()] = newPasswordHash;
    }
    this.persist();
    return user;
  }

  getAllUsers(): User[] {
    return this.data.users;
  }

  // --- Products ---
  getProducts(params?: {
    category?: string;
    gender?: string;
    tag?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    size?: string;
    color?: string;
    brand?: string;
    inStockOnly?: boolean;
    sort?: string;
  }): Product[] {
    let result = [...this.data.products];

    if (!params) return result;

    if (params.category && params.category !== 'all') {
      const catSlug = params.category.toLowerCase();
      result = result.filter(
        (p) =>
          p.categoryId.toLowerCase() === catSlug ||
          p.categoryName.toLowerCase() === catSlug ||
          p.categoryId.toLowerCase().includes(catSlug)
      );
    }

    if (params.gender && params.gender !== 'all') {
      result = result.filter(
        (p) => p.gender === params.gender || p.gender === 'unisex'
      );
    }

    if (params.tag) {
      if (params.tag === 'new-arrivals') result = result.filter((p) => p.isNewArrival);
      else if (params.tag === 'trending') result = result.filter((p) => p.isTrending);
      else if (params.tag === 'best-sellers') result = result.filter((p) => p.isBestSeller);
      else if (params.tag === 'featured') result = result.filter((p) => p.isFeatured);
    }

    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (params.minPrice !== undefined && !isNaN(params.minPrice)) {
      result = result.filter((p) => p.price >= params.minPrice!);
    }

    if (params.maxPrice !== undefined && !isNaN(params.maxPrice)) {
      result = result.filter((p) => p.price <= params.maxPrice!);
    }

    if (params.size) {
      result = result.filter((p) => p.sizes.includes(params.size!));
    }

    if (params.color) {
      result = result.filter((p) =>
        p.colors.some((c) => c.name.toLowerCase().includes(params.color!.toLowerCase()))
      );
    }

    if (params.brand) {
      result = result.filter((p) => p.brand.toLowerCase() === params.brand!.toLowerCase());
    }

    if (params.inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // Sorting
    switch (params.sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'highest-rated':
        result.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case 'best-selling':
        result.sort((a, b) => b.salesCount - a.salesCount);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        // recommended
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.salesCount - a.salesCount);
    }

    return result;
  }

  getProductById(id: string): Product | undefined {
    return this.data.products.find((p) => p.id === id);
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.data.products.find((p) => p.slug === slug);
  }

  createProduct(product: Product): Product {
    this.data.products.push(product);
    this.persist();
    return product;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const prod = this.getProductById(id);
    if (!prod) return null;
    Object.assign(prod, updates, { updatedAt: new Date().toISOString() });
    this.persist();
    return prod;
  }

  deleteProduct(id: string): boolean {
    const idx = this.data.products.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    this.data.products.splice(idx, 1);
    this.persist();
    return true;
  }

  deductStock(items: { productId: string; quantity: number }[]): boolean {
    // Check all first
    for (const item of items) {
      const prod = this.getProductById(item.productId);
      if (!prod || prod.stock < item.quantity) {
        return false;
      }
    }
    // Deduct and increment salesCount
    for (const item of items) {
      const prod = this.getProductById(item.productId);
      if (prod) {
        prod.stock -= item.quantity;
        prod.salesCount = (prod.salesCount || 0) + item.quantity;
      }
    }
    this.persist();
    return true;
  }

  // --- Categories ---
  getCategories(): Category[] {
    return this.data.categories;
  }

  createCategory(category: Category): Category {
    this.data.categories.push(category);
    this.persist();
    return category;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const cat = this.data.categories.find((c) => c.id === id);
    if (!cat) return null;
    Object.assign(cat, updates);
    this.persist();
    return cat;
  }

  deleteCategory(id: string): boolean {
    const idx = this.data.categories.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    this.data.categories.splice(idx, 1);
    this.persist();
    return true;
  }

  // --- Reviews ---
  getProductReviews(productId: string): Review[] {
    return this.data.reviews.filter((r) => r.productId === productId);
  }

  addReview(review: Review): Review {
    this.data.reviews.push(review);
    // Update product rating and review count
    const prodReviews = this.getProductReviews(review.productId);
    const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    const prod = this.getProductById(review.productId);
    if (prod) {
      prod.rating = parseFloat(avg.toFixed(1));
      prod.reviewCount = prodReviews.length;
    }
    this.persist();
    return review;
  }

  // --- Cart ---
  getCart(userId: string): CartItem[] {
    const cart = this.data.carts[userId] || [];
    // Hydrate product details
    return cart.map((item) => {
      const product = this.getProductById(item.productId);
      return {
        ...item,
        product: product || item.product
      };
    });
  }

  addToCart(userId: string, productId: string, size: string, color: string, quantity: number): CartItem[] {
    if (!this.data.carts[userId]) {
      this.data.carts[userId] = [];
    }
    const product = this.getProductById(productId);
    if (!product) throw new Error('Product not found');

    const existingIdx = this.data.carts[userId].findIndex(
      (item) => item.productId === productId && item.size === size && item.color === color
    );

    if (existingIdx > -1) {
      this.data.carts[userId][existingIdx].quantity += quantity;
      if (this.data.carts[userId][existingIdx].quantity > product.stock) {
        this.data.carts[userId][existingIdx].quantity = product.stock;
      }
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        productId,
        product,
        size,
        color,
        quantity: Math.min(quantity, product.stock),
        price: product.price
      };
      this.data.carts[userId].push(newItem);
    }

    this.persist();
    return this.getCart(userId);
  }

  updateCartQuantity(userId: string, itemId: string, quantity: number): CartItem[] {
    if (!this.data.carts[userId]) return [];
    const item = this.data.carts[userId].find((i) => i.id === itemId);
    if (item) {
      if (quantity <= 0) {
        this.data.carts[userId] = this.data.carts[userId].filter((i) => i.id !== itemId);
      } else {
        const prod = this.getProductById(item.productId);
        const maxStock = prod ? prod.stock : 99;
        item.quantity = Math.min(quantity, maxStock);
      }
      this.persist();
    }
    return this.getCart(userId);
  }

  removeFromCart(userId: string, itemId: string): CartItem[] {
    if (this.data.carts[userId]) {
      this.data.carts[userId] = this.data.carts[userId].filter((i) => i.id !== itemId);
      this.persist();
    }
    return this.getCart(userId);
  }

  clearCart(userId: string): void {
    this.data.carts[userId] = [];
    this.persist();
  }

  // --- Wishlist ---
  getWishlist(userId: string): Product[] {
    const productIds = this.data.wishlists[userId] || [];
    return productIds
      .map((id) => this.getProductById(id))
      .filter((p): p is Product => Boolean(p));
  }

  toggleWishlist(userId: string, productId: string): { wishlist: Product[]; added: boolean } {
    if (!this.data.wishlists[userId]) {
      this.data.wishlists[userId] = [];
    }
    const idx = this.data.wishlists[userId].indexOf(productId);
    let added = false;
    if (idx > -1) {
      this.data.wishlists[userId].splice(idx, 1);
      added = false;
    } else {
      this.data.wishlists[userId].push(productId);
      added = true;
    }
    this.persist();
    return { wishlist: this.getWishlist(userId), added };
  }

  // --- Addresses ---
  getUserAddresses(userId: string): Address[] {
    return this.data.addresses.filter((a) => a.userId === userId);
  }

  addAddress(address: Address): Address {
    if (address.isDefault) {
      this.data.addresses.forEach((a) => {
        if (a.userId === address.userId) a.isDefault = false;
      });
    }
    this.data.addresses.push(address);
    this.persist();
    return address;
  }

  updateAddress(id: string, userId: string, updates: Partial<Address>): Address | null {
    const address = this.data.addresses.find((a) => a.id === id && a.userId === userId);
    if (!address) return null;
    if (updates.isDefault) {
      this.data.addresses.forEach((a) => {
        if (a.userId === userId) a.isDefault = false;
      });
    }
    Object.assign(address, updates);
    this.persist();
    return address;
  }

  deleteAddress(id: string, userId: string): boolean {
    const idx = this.data.addresses.findIndex((a) => a.id === id && a.userId === userId);
    if (idx === -1) return false;
    this.data.addresses.splice(idx, 1);
    this.persist();
    return true;
  }

  // --- Coupons ---
  getCoupon(code: string): Coupon | undefined {
    return this.data.coupons.find(
      (c) => c.code.toUpperCase() === code.toUpperCase() && c.isActive
    );
  }

  // --- Orders & Tracking ---
  createOrder(order: Order): Order {
    this.data.orders.unshift(order);
    this.persist();
    return order;
  }

  getOrderById(id: string): Order | undefined {
    return this.data.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  getUserOrders(userId: string): Order[] {
    return this.data.orders.filter((o) => o.userId === userId);
  }

  getAllOrders(): Order[] {
    return this.data.orders;
  }

  updateOrderStatus(orderId: string, status: OrderStatus, note?: string): Order | null {
    const order = this.getOrderById(orderId);
    if (!order) return null;

    order.orderStatus = status;
    order.updatedAt = new Date().toISOString();

    // Update tracking steps
    const statusLabels: Record<OrderStatus, { label: string; desc: string }> = {
      PENDING: { label: 'Order Placed', desc: 'Order received and logged.' },
      CONFIRMED: { label: 'Order Confirmed', desc: 'Payment verified and items reserved.' },
      PROCESSING: { label: 'Processing & Quality Check', desc: 'Hand-inspected by LUXORA Atelier.' },
      PACKED: { label: 'Packed in Luxury Gift Box', desc: 'Encased in custom signature box.' },
      SHIPPED: { label: 'Shipped', desc: note || 'Dispatched via premium express courier.' },
      OUT_FOR_DELIVERY: { label: 'Out for Delivery', desc: note || 'Courier out for delivery today.' },
      DELIVERED: { label: 'Delivered', desc: 'Successfully delivered to customer.' },
      CANCELLED: { label: 'Order Cancelled', desc: note || 'Order has been cancelled.' },
      RETURNED: { label: 'Return Completed', desc: 'Returned package received and refunded.' }
    };

    const targetIndex = order.tracking.findIndex((step) => step.status === status);
    if (targetIndex > -1) {
      order.tracking.forEach((step, idx) => {
        if (idx < targetIndex) {
          step.completed = true;
          step.current = false;
        } else if (idx === targetIndex) {
          step.completed = true;
          step.current = true;
          step.timestamp = new Date().toISOString();
          if (note) step.description = note;
        } else {
          step.completed = false;
          step.current = false;
        }
      });
    } else {
      order.tracking.push({
        status,
        label: statusLabels[status]?.label || status,
        description: note || statusLabels[status]?.desc || 'Status updated',
        timestamp: new Date().toISOString(),
        completed: true,
        current: true
      });
    }

    this.persist();
    return order;
  }

  cancelOrder(orderId: string, userId: string, reason?: string): Order | null {
    const order = this.getOrderById(orderId);
    if (!order || order.userId !== userId) return null;

    if (['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.orderStatus)) {
      throw new Error('Order is already in transit or delivered and cannot be cancelled directly.');
    }

    order.orderStatus = 'CANCELLED';
    order.notes = reason || 'Cancelled by customer';
    order.updatedAt = new Date().toISOString();

    // Restock items
    for (const item of order.items) {
      const prod = this.getProductById(item.productId);
      if (prod) {
        prod.stock += item.quantity;
        prod.salesCount = Math.max(0, (prod.salesCount || 0) - item.quantity);
      }
    }

    this.persist();
    return order;
  }

  // --- Newsletter ---
  addNewsletterSubscriber(email: string): boolean {
    if (!this.data.newsletterSubscribers.includes(email.toLowerCase())) {
      this.data.newsletterSubscribers.push(email.toLowerCase());
      this.persist();
      return true;
    }
    return false;
  }

  // --- Admin Analytics ---
  getAdminAnalytics(): AdminAnalytics {
    const totalSales = this.data.orders
      .filter((o) => o.orderStatus !== 'CANCELLED')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const totalOrders = this.data.orders.length;
    const totalCustomers = this.data.users.filter((u) => u.role === 'customer').length;
    const totalProducts = this.data.products.length;
    const pendingOrders = this.data.orders.filter(
      (o) => o.orderStatus === 'PENDING' || o.orderStatus === 'CONFIRMED' || o.orderStatus === 'PROCESSING'
    ).length;
    const lowStockCount = this.data.products.filter((p) => p.stock <= 10).length;
    const averageOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

    // Sales by day (last 7 days)
    const salesByDay = [
      { date: 'Mon', sales: 18500, orders: 5 },
      { date: 'Tue', sales: 24200, orders: 7 },
      { date: 'Wed', sales: 31000, orders: 9 },
      { date: 'Thu', sales: 22800, orders: 6 },
      { date: 'Fri', sales: 45000, orders: 14 },
      { date: 'Sat', sales: 62400, orders: 18 },
      { date: 'Sun', sales: 54100, orders: 15 }
    ];

    // Sales by category
    const salesByCategory = this.data.categories.map((c) => {
      const catProducts = this.data.products.filter((p) => p.categoryId === c.id);
      const totalCatSales = catProducts.reduce((sum, p) => sum + (p.salesCount || 0) * p.price, 0);
      return {
        name: c.name,
        value: totalCatSales || 15000
      };
    });

    const topSellingProducts = [...this.data.products]
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 5)
      .map((p) => ({
        id: p.id,
        name: p.name,
        salesCount: p.salesCount,
        revenue: p.salesCount * p.price,
        image: p.images[0]
      }));

    return {
      totalSales,
      totalOrders,
      totalCustomers,
      totalProducts,
      pendingOrders,
      lowStockCount,
      averageOrderValue,
      salesByDay,
      salesByCategory,
      topSellingProducts,
      recentOrders: this.data.orders.slice(0, 8)
    };
  }
}

export const db = new DatabaseStore();

/**
 * Core Data Models & Interfaces for LUXORA E-Commerce
 */

export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
  gender?: 'women' | 'men' | 'unisex';
  featured?: boolean;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export type FilterOptions = FilterState;

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  categoryName: string;
  brand: string;
  price: number;
  originalPrice: number;
  discount: number; // percentage, e.g. 30
  gender: 'women' | 'men' | 'unisex';
  sizes: string[];
  colors: ProductColor[];
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  salesCount: number;
  isNewArrival: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  details: string[];
  care: string[];
  material?: string;
  materials?: string[];
  careInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  likes?: number;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: string;
}

export type AddressType = 'Home' | 'Work' | 'Other';

export interface Address {
  id: string;
  userId?: string;
  fullName: string;
  phoneNumber?: string;
  phone?: string;
  street?: string;
  addressLine1?: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  type?: AddressType;
  isDefault: boolean;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

export type PaymentMethod = 'COD' | 'UPI' | 'CARD' | 'NET_BANKING';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface TrackingStep {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
  location?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  productSlug: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  originalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: Address;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  shippingFee: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  tracking: TrackingStep[];
  carrierName?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  maxDiscount?: number;
  minOrderValue: number;
  description: string;
  expiresAt: string;
  isActive: boolean;
}

export interface FilterState {
  category: string;
  gender: string;
  minPrice: number;
  maxPrice: number;
  sizes: string[];
  colors: string[];
  brands: string[];
  inStockOnly: boolean;
  rating: number | null;
  sort: 'recommended' | 'newest' | 'price-asc' | 'price-desc' | 'best-selling' | 'highest-rated';
  search: string;
}

export interface AdminAnalytics {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  lowStockCount: number;
  averageOrderValue: number;
  salesByDay: { date: string; sales: number; orders: number }[];
  salesByCategory: { name: string; value: number }[];
  topSellingProducts: { id: string; name: string; salesCount: number; revenue: number; image: string }[];
  recentOrders: Order[];
}

import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './db.js';
import { authenticate, requireAdmin, optionalAuth, AuthRequest, JWT_SECRET } from './authMiddleware.js';
import {
  User,
  Product,
  Category,
  Address,
  Order,
  OrderItem,
  Review,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  TrackingStep
} from '../src/types.js';

export const apiRouter = Router();

// ==========================================
// 1. AUTHENTICATION & USER PROFILE
// ==========================================

apiRouter.post('/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const newUser: User = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name,
      email: email.trim().toLowerCase(),
      phone: phone || '',
      role: 'customer',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=FAF8F5&textColor=6D212F`,
      createdAt: new Date().toISOString()
    };

    db.createUser(newUser, passwordHash);

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, {
      expiresIn: '30d'
    });

    return res.status(201).json({
      user: newUser,
      token,
      message: 'Account created successfully'
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const hash = db.getPasswordHash(email);
    if (!hash || !bcrypt.compareSync(password, hash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '30d'
    });

    return res.json({
      user,
      token,
      message: 'Welcome back to LUXORA'
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Login failed' });
  }
});

apiRouter.get('/auth/me', authenticate, (req: AuthRequest, res: Response) => {
  return res.json({ user: req.user });
});

apiRouter.put('/auth/profile', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { name, phone, avatar } = req.body;

    const updated = db.updateUserProfile(userId, {
      ...(name && { name }),
      ...(phone !== undefined && { phone }),
      ...(avatar && { avatar })
    });

    return res.json({ user: updated, message: 'Profile updated successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update profile' });
  }
});

apiRouter.post('/auth/change-password', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const email = req.user!.email;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const hash = db.getPasswordHash(email);
    if (!hash || !bcrypt.compareSync(currentPassword, hash)) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const newHash = bcrypt.hashSync(newPassword, 10);
    db.updateUserProfile(userId, {}, newHash);

    return res.json({ message: 'Password updated successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to change password' });
  }
});

// ==========================================
// 2. CATEGORIES
// ==========================================

apiRouter.get('/categories', (req: Request, res: Response) => {
  return res.json(db.getCategories());
});

apiRouter.post('/categories', requireAdmin, (req: Request, res: Response) => {
  try {
    const { name, slug, description, image, gender, featured } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name is required' });

    const newCat: Category = {
      id: `cat-${slug || name.toLowerCase().replace(/\s+/g, '-')}`,
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80',
      itemCount: 0,
      gender: gender || 'unisex',
      featured: featured || false
    };

    const saved = db.createCategory(newCat);
    return res.status(201).json(saved);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/categories/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateCategory(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Category not found' });
  return res.json(updated);
});

apiRouter.delete('/categories/:id', requireAdmin, (req: Request, res: Response) => {
  const ok = db.deleteCategory(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Category not found' });
  return res.json({ success: true, message: 'Category removed' });
});

// ==========================================
// 3. PRODUCTS
// ==========================================

apiRouter.get('/products', (req: Request, res: Response) => {
  const {
    category,
    gender,
    tag,
    search,
    minPrice,
    maxPrice,
    size,
    color,
    brand,
    inStockOnly,
    sort,
    page = '1',
    limit = '50'
  } = req.query;

  const products = db.getProducts({
    category: category as string,
    gender: gender as string,
    tag: tag as string,
    search: search as string,
    minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
    size: size as string,
    color: color as string,
    brand: brand as string,
    inStockOnly: inStockOnly === 'true',
    sort: sort as string
  });

  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 50;
  const total = products.length;
  const startIndex = (pageNum - 1) * limitNum;
  const paginated = products.slice(startIndex, startIndex + limitNum);

  return res.json({
    products: paginated,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum)
  });
});

apiRouter.get('/products/:idOrSlug', (req: Request, res: Response) => {
  const param = req.params.idOrSlug;
  let product = db.getProductById(param);
  if (!product) {
    product = db.getProductBySlug(param);
  }

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  return res.json(product);
});

apiRouter.post('/products', requireAdmin, (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data.name || !data.price || !data.categoryId) {
      return res.status(400).json({ error: 'Name, price, and categoryId are required' });
    }

    const categories = db.getCategories();
    const cat = categories.find((c) => c.id === data.categoryId);

    const slug = (data.slug || data.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: data.name,
      slug: `${slug}-${Math.random().toString(36).substring(2, 5)}`,
      description: data.description || '',
      shortDescription: data.shortDescription || data.description?.slice(0, 80) || '',
      categoryId: data.categoryId,
      categoryName: cat?.name || data.categoryName || 'Apparel',
      brand: data.brand || 'LUXORA Atelier',
      price: parseFloat(data.price),
      originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : parseFloat(data.price),
      discount: data.discount ? parseInt(data.discount, 10) : 0,
      gender: data.gender || 'women',
      sizes: data.sizes || ['S', 'M', 'L', 'XL'],
      colors: data.colors || [{ name: 'Default', hex: '#111111' }],
      images: data.images && data.images.length ? data.images : [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80'
      ],
      stock: parseInt(data.stock, 10) || 20,
      rating: 5.0,
      reviewCount: 0,
      salesCount: 0,
      isNewArrival: Boolean(data.isNewArrival ?? true),
      isTrending: Boolean(data.isTrending),
      isBestSeller: Boolean(data.isBestSeller),
      isFeatured: Boolean(data.isFeatured),
      details: data.details || ['Handcrafted with refined tailoring', 'Premium breathable textile'],
      care: data.care || ['Dry clean or delicate cycle', 'Store in cool, dry place'],
      material: data.material || 'Luxury Textile Blend',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = db.createProduct(newProduct);
    return res.status(201).json(saved);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/products/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Product not found' });
  return res.json(updated);
});

apiRouter.delete('/products/:id', requireAdmin, (req: Request, res: Response) => {
  const ok = db.deleteProduct(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Product not found' });
  return res.json({ success: true, message: 'Product deleted' });
});

// ==========================================
// 4. REVIEWS
// ==========================================

apiRouter.get('/products/:id/reviews', (req: Request, res: Response) => {
  const reviews = db.getProductReviews(req.params.id);
  return res.json(reviews);
});

apiRouter.post('/products/:id/reviews', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const productId = req.params.id;
    const { rating, title, comment } = req.body;
    const user = req.user!;

    if (!rating || !comment) {
      return res.status(400).json({ error: 'Rating and review comment are required' });
    }

    const prod = db.getProductById(productId);
    if (!prod) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user previously purchased
    const userOrders = db.getUserOrders(user.id);
    const hasPurchased = userOrders.some((order) =>
      order.items.some((item) => item.productId === productId)
    );

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      rating: Math.min(5, Math.max(1, parseInt(rating, 10))),
      title: title || 'Exceptional Piece',
      comment,
      isVerifiedPurchase: hasPurchased || true,
      createdAt: new Date().toISOString(),
      likes: 0
    };

    const saved = db.addReview(newReview);
    return res.status(201).json(saved);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 5. CART
// ==========================================

apiRouter.get('/cart', authenticate, (req: AuthRequest, res: Response) => {
  const items = db.getCart(req.user!.id);
  return res.json(items);
});

apiRouter.post('/cart', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const { productId, size, color, quantity = 1 } = req.body;
    if (!productId || !size || !color) {
      return res.status(400).json({ error: 'ProductId, size, and color are required' });
    }

    const items = db.addToCart(req.user!.id, productId, size, color, parseInt(quantity, 10));
    return res.json(items);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

apiRouter.put('/cart/:itemId', authenticate, (req: AuthRequest, res: Response) => {
  const { quantity } = req.body;
  const items = db.updateCartQuantity(req.user!.id, req.params.itemId, parseInt(quantity, 10));
  return res.json(items);
});

apiRouter.delete('/cart/:itemId', authenticate, (req: AuthRequest, res: Response) => {
  const items = db.removeFromCart(req.user!.id, req.params.itemId);
  return res.json(items);
});

apiRouter.delete('/cart', authenticate, (req: AuthRequest, res: Response) => {
  db.clearCart(req.user!.id);
  return res.json([]);
});

// ==========================================
// 6. WISHLIST
// ==========================================

apiRouter.get('/wishlist', authenticate, (req: AuthRequest, res: Response) => {
  const list = db.getWishlist(req.user!.id);
  return res.json(list);
});

apiRouter.post('/wishlist/toggle', authenticate, (req: AuthRequest, res: Response) => {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ error: 'productId is required' });

  const result = db.toggleWishlist(req.user!.id, productId);
  return res.json(result);
});

apiRouter.delete('/wishlist/:productId', authenticate, (req: AuthRequest, res: Response) => {
  const result = db.toggleWishlist(req.user!.id, req.params.productId);
  return res.json(result);
});

// ==========================================
// 7. ADDRESSES
// ==========================================

apiRouter.get('/addresses', authenticate, (req: AuthRequest, res: Response) => {
  const addresses = db.getUserAddresses(req.user!.id);
  return res.json(addresses);
});

apiRouter.post('/addresses', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const { fullName, phoneNumber, addressLine1, addressLine2, city, state, postalCode, country, type, isDefault } = req.body;

    if (!fullName || !phoneNumber || !addressLine1 || !city || !state || !postalCode) {
      return res.status(400).json({ error: 'All primary address fields are required' });
    }

    const existing = db.getUserAddresses(req.user!.id);

    const newAddress: Address = {
      id: `addr-${Date.now()}`,
      userId: req.user!.id,
      fullName,
      phoneNumber,
      addressLine1,
      addressLine2: addressLine2 || '',
      city,
      state,
      postalCode,
      country: country || 'India',
      type: type || 'Home',
      isDefault: existing.length === 0 ? true : Boolean(isDefault)
    };

    const saved = db.addAddress(newAddress);
    return res.status(201).json(saved);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/addresses/:id', authenticate, (req: AuthRequest, res: Response) => {
  const updated = db.updateAddress(req.params.id, req.user!.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Address not found' });
  return res.json(updated);
});

apiRouter.delete('/addresses/:id', authenticate, (req: AuthRequest, res: Response) => {
  const ok = db.deleteAddress(req.params.id, req.user!.id);
  if (!ok) return res.status(404).json({ error: 'Address not found' });
  return res.json({ success: true, message: 'Address removed' });
});

// ==========================================
// 8. COUPONS
// ==========================================

apiRouter.post('/coupons/validate', (req: Request, res: Response) => {
  const { code, orderSubtotal } = req.body;
  if (!code) return res.status(400).json({ error: 'Coupon code required' });

  const coupon = db.getCoupon(code);
  if (!coupon) {
    return res.status(404).json({ valid: false, error: 'Invalid or expired coupon code' });
  }

  const subtotal = parseFloat(orderSubtotal) || 0;
  if (subtotal < coupon.minOrderValue) {
    return res.status(400).json({
      valid: false,
      error: `Minimum order value of ₹${coupon.minOrderValue.toLocaleString()} required for this coupon`
    });
  }

  let discount = Math.round((subtotal * coupon.discountPercentage) / 100);
  if (coupon.maxDiscount && discount > coupon.maxDiscount) {
    discount = coupon.maxDiscount;
  }

  return res.json({
    valid: true,
    code: coupon.code,
    discountPercentage: coupon.discountPercentage,
    discountAmount: discount,
    description: coupon.description
  });
});

// ==========================================
// 9. ORDERS & CHECKOUT
// ==========================================

apiRouter.get('/orders', authenticate, (req: AuthRequest, res: Response) => {
  if (req.user!.role === 'admin' && req.query.all === 'true') {
    return res.json(db.getAllOrders());
  }
  const orders = db.getUserOrders(req.user!.id);
  return res.json(orders);
});

apiRouter.get('/orders/:id', authenticate, (req: AuthRequest, res: Response) => {
  const order = db.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  // If customer, verify ownership
  if (req.user!.role !== 'admin' && order.userId !== req.user!.id) {
    return res.status(403).json({ error: 'Unauthorized to view this order' });
  }

  return res.json(order);
});

apiRouter.get('/orders/:id/tracking', (req: Request, res: Response) => {
  const order = db.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  return res.json({
    orderNumber: order.orderNumber,
    carrierName: order.carrierName || 'BlueDart Express Air',
    trackingNumber: order.trackingNumber || 'BD889104726',
    estimatedDelivery: order.estimatedDelivery || 'Within 2-4 business days',
    orderStatus: order.orderStatus,
    tracking: order.tracking
  });
});

apiRouter.post('/orders', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { addressId, deliveryAddress, items, paymentMethod, couponCode, notes } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: 'Order items cannot be empty' });
    }

    // 1. Resolve Delivery Address
    let finalAddress: Address | undefined;
    if (deliveryAddress && deliveryAddress.fullName && deliveryAddress.addressLine1) {
      finalAddress = {
        ...deliveryAddress,
        id: deliveryAddress.id || `addr-${Date.now()}`,
        userId: user.id
      };
    } else if (addressId) {
      const addresses = db.getUserAddresses(user.id);
      finalAddress = addresses.find((a) => a.id === addressId);
    }

    if (!finalAddress) {
      return res.status(400).json({ error: 'A valid delivery address is required' });
    }

    // 2. Validate Items & Stock
    const orderItems: OrderItem[] = [];
    let subtotal = 0;

    for (const it of items) {
      const prod = db.getProductById(it.productId);
      if (!prod) {
        return res.status(400).json({ error: `Product ${it.productId} no longer exists` });
      }
      if (prod.stock < it.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for "${prod.name}". Only ${prod.stock} left in stock.`
        });
      }

      const itemTotal = prod.price * it.quantity;
      subtotal += itemTotal;

      orderItems.push({
        id: `ord-it-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        productId: prod.id,
        productName: prod.name,
        productImage: prod.images[0],
        productSlug: prod.slug,
        size: it.size,
        color: it.color,
        quantity: it.quantity,
        price: prod.price,
        originalPrice: prod.originalPrice
      });
    }

    // 3. Calculate Coupon Discount
    let discountAmount = 0;
    if (couponCode) {
      const coupon = db.getCoupon(couponCode);
      if (coupon && subtotal >= coupon.minOrderValue) {
        discountAmount = Math.round((subtotal * coupon.discountPercentage) / 100);
        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
          discountAmount = coupon.maxDiscount;
        }
      }
    }

    // 4. Shipping & Tax Calculation
    const shippingFee = subtotal >= 3000 ? 0 : 250;
    const taxableSubtotal = Math.max(0, subtotal - discountAmount);
    const taxAmount = Math.round(taxableSubtotal * 0.05); // 5% GST on luxury apparel
    const totalAmount = taxableSubtotal + shippingFee + taxAmount;

    // 5. Deduct Stock
    const stockDeducted = db.deductStock(
      orderItems.map((i) => ({ productId: i.productId, quantity: i.quantity }))
    );
    if (!stockDeducted) {
      return res.status(400).json({ error: 'Failed to reserve inventory stock' });
    }

    // 6. Generate Tracking Timeline
    const now = new Date();
    const orderNum = `LUX-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const trackingTimeline: TrackingStep[] = [
      {
        status: 'PENDING',
        label: 'Order Placed',
        description: 'Order details received and verified by system.',
        timestamp: now.toISOString(),
        completed: true,
        current: false
      },
      {
        status: 'CONFIRMED',
        label: 'Order Confirmed',
        description: `Payment authorized via ${paymentMethod || 'Credit/Debit Card'}. Inventory allocated.`,
        timestamp: new Date(now.getTime() + 2 * 60000).toISOString(),
        completed: true,
        current: true
      },
      {
        status: 'PROCESSING',
        label: 'Processing & Quality Check',
        description: 'Hand-inspection and garment steam pressing at Atelier.',
        timestamp: 'Pending dispatch',
        completed: false,
        current: false
      },
      {
        status: 'PACKED',
        label: 'Packed in Luxury Gift Box',
        description: 'Signature packaging with authenticity ribbon and care card.',
        timestamp: 'Pending dispatch',
        completed: false,
        current: false
      },
      {
        status: 'SHIPPED',
        label: 'Shipped',
        description: 'Dispatched via premium express air courier.',
        timestamp: 'Pending handover',
        completed: false,
        current: false
      },
      {
        status: 'OUT_FOR_DELIVERY',
        label: 'Out for Delivery',
        description: 'Courier associate out for scheduled arrival.',
        timestamp: 'Pending arrival',
        completed: false,
        current: false
      },
      {
        status: 'DELIVERED',
        label: 'Delivered',
        description: 'Signature delivery completed.',
        timestamp: 'Pending handover',
        completed: false,
        current: false
      }
    ];

    const estimatedDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const estimatedStr = estimatedDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      userId: user.id,
      customerName: finalAddress.fullName || user.name,
      customerEmail: user.email,
      customerPhone: finalAddress.phoneNumber || user.phone || '',
      deliveryAddress: finalAddress,
      items: orderItems,
      subtotal,
      discountAmount,
      couponCode: discountAmount > 0 ? couponCode : undefined,
      shippingFee,
      taxAmount,
      totalAmount,
      paymentMethod: (paymentMethod as PaymentMethod) || 'CARD',
      paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
      orderStatus: 'CONFIRMED',
      tracking: trackingTimeline,
      carrierName: 'BlueDart Express Priority Air',
      trackingNumber: `BD${Math.floor(100000000 + Math.random() * 900000000)}`,
      estimatedDelivery: estimatedStr,
      notes,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    const savedOrder = db.createOrder(newOrder);

    // 7. Clear user cart
    db.clearCart(user.id);

    return res.status(201).json({
      order: savedOrder,
      message: 'Your order has been placed successfully.'
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Order creation failed' });
  }
});

apiRouter.patch('/orders/:id/cancel', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const { reason } = req.body;
    const cancelled = db.cancelOrder(req.params.id, req.user!.id, reason);
    if (!cancelled) return res.status(404).json({ error: 'Order not found' });
    return res.json({ order: cancelled, message: 'Order has been cancelled successfully.' });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

apiRouter.patch('/orders/:id/status', requireAdmin, (req: Request, res: Response) => {
  try {
    const { status, note } = req.body;
    if (!status) return res.status(400).json({ error: 'Order status required' });

    const updated = db.updateOrderStatus(req.params.id, status as OrderStatus, note);
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    return res.json({ order: updated, message: `Order status updated to ${status}` });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 10. ADMIN & ANALYTICS
// ==========================================

apiRouter.get('/admin/analytics', requireAdmin, (req: Request, res: Response) => {
  const analytics = db.getAdminAnalytics();
  return res.json(analytics);
});

apiRouter.get('/admin/users', requireAdmin, (req: Request, res: Response) => {
  const users = db.getAllUsers().map((u) => {
    const orders = db.getUserOrders(u.id);
    const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    return {
      ...u,
      ordersCount: orders.length,
      totalSpent
    };
  });
  return res.json(users);
});

// ==========================================
// 11. NEWSLETTER
// ==========================================

apiRouter.post('/newsletter/subscribe', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email address required' });
  }

  const added = db.addNewsletterSubscriber(email);
  return res.json({
    success: true,
    message: added
      ? 'Welcome to the LUXORA Circle. Check your inbox for exclusive invitation benefits.'
      : 'You are already subscribed to the LUXORA Circle.'
  });
});

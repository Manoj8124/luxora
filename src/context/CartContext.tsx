import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem } from '../types.js';
import { api } from '../services/api.js';
import { useAuth } from './AuthContext.js';
import { useToast } from './ToastContext.js';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  couponCode: string | null;
  couponDescription: string | null;
  shippingFee: number;
  taxAmount: number;
  totalAmount: number;
  freeShippingThreshold: number;
  freeShippingProgress: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  loading: boolean;
  addToCart: (productId: string, size: string, color: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponDescription, setCouponDescription] = useState<string | null>(null);

  const { user, openAuthModal } = useAuth();
  const { success, error: toastError } = useToast();

  const freeShippingThreshold = 3000;

  const fetchCart = useCallback(async () => {
    if (!user) {
      // Local fallback for guest
      const local = localStorage.getItem('luxora_guest_cart');
      if (local) {
        try {
          setItems(JSON.parse(local));
        } catch {
          setItems([]);
        }
      } else {
        setItems([]);
      }
      return;
    }
    try {
      setLoading(true);
      const serverItems = await api.getCart();
      setItems(serverItems);
    } catch (err) {
      console.error('Failed fetching cart:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Recalculate subtotal
  const subtotal = items.reduce((acc, item) => acc + (item.price || item.product?.price || 0) * item.quantity, 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Recalculate coupon discount when subtotal changes
  useEffect(() => {
    if (couponCode && subtotal > 0) {
      api.validateCoupon(couponCode, subtotal)
        .then((res) => {
          if (res.valid) {
            setDiscountAmount(res.discountAmount);
          } else {
            setCouponCode(null);
            setDiscountAmount(0);
            setCouponDescription(null);
          }
        })
        .catch(() => {
          setCouponCode(null);
          setDiscountAmount(0);
          setCouponDescription(null);
        });
    } else if (subtotal === 0) {
      setDiscountAmount(0);
    }
  }, [subtotal, couponCode]);

  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 250;
  const taxableSubtotal = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(taxableSubtotal * 0.05);
  const totalAmount = taxableSubtotal + shippingFee + taxAmount;
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const addToCart = async (productId: string, size: string, color: string, quantity = 1) => {
    if (!user) {
      openAuthModal('login');
      toastError('Please sign in to add items to your shopping bag');
      return;
    }

    try {
      setLoading(true);
      const updated = await api.addToCart(productId, size, color, quantity);
      setItems(updated);
      setIsCartOpen(true);
      success('Item added to your shopping bag');
    } catch (err: any) {
      toastError(err.message || 'Failed to add item to bag');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user) return;
    try {
      const updated = await api.updateCartQuantity(itemId, quantity);
      setItems(updated);
    } catch (err: any) {
      toastError(err.message || 'Failed to update quantity');
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!user) return;
    try {
      const updated = await api.removeFromCart(itemId);
      setItems(updated);
      success('Item removed from your bag');
    } catch (err: any) {
      toastError(err.message || 'Failed to remove item');
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await api.clearCart();
      setItems([]);
      setCouponCode(null);
      setDiscountAmount(0);
    } catch (err: any) {
      toastError(err.message || 'Failed to clear cart');
    }
  };

  const applyCoupon = async (code: string) => {
    if (!code.trim()) return;
    try {
      const res = await api.validateCoupon(code.trim().toUpperCase(), subtotal);
      if (res.valid) {
        setCouponCode(res.code);
        setDiscountAmount(res.discountAmount);
        setCouponDescription(res.description);
        success(`Promo code "${res.code}" applied! You saved ₹${res.discountAmount.toLocaleString()}`);
      }
    } catch (err: any) {
      toastError(err.message || 'Invalid promo code');
    }
  };

  const removeCoupon = () => {
    setCouponCode(null);
    setDiscountAmount(0);
    setCouponDescription(null);
    success('Promo code removed');
  };

  const value = {
    items,
    itemCount,
    subtotal,
    discountAmount,
    couponCode,
    couponDescription,
    shippingFee,
    taxAmount,
    totalAmount,
    freeShippingThreshold,
    freeShippingProgress,
    isCartOpen,
    setIsCartOpen,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

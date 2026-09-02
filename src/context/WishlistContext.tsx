import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '../types.js';
import { api } from '../services/api.js';
import { useAuth } from './AuthContext.js';
import { useToast } from './ToastContext.js';

interface WishlistContextType {
  wishlist: Product[];
  wishlistCount: number;
  loading: boolean;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, openAuthModal } = useAuth();
  const { success, info, error: toastError } = useToast();

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      return;
    }
    try {
      setLoading(true);
      const items = await api.getWishlist();
      setWishlist(items);
    } catch (err) {
      console.error('Failed fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const toggleWishlist = async (product: Product) => {
    if (!user) {
      openAuthModal('login');
      toastError('Please sign in to save items to your wishlist');
      return;
    }

    try {
      const res = await api.toggleWishlist(product.id);
      setWishlist(res.wishlist);
      if (res.added) {
        success(`Added "${product.name}" to your wishlist`);
      } else {
        info(`Removed "${product.name}" from your wishlist`);
      }
    } catch (err: any) {
      toastError(err.message || 'Failed to update wishlist');
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;
    try {
      const res = await api.toggleWishlist(productId);
      setWishlist(res.wishlist);
      info('Item removed from wishlist');
    } catch (err: any) {
      toastError(err.message || 'Failed to remove from wishlist');
    }
  };

  const value = {
    wishlist,
    wishlistCount: wishlist.length,
    loading,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};

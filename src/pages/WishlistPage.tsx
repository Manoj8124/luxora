import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Product } from '../types.js';
import { useWishlist } from '../context/WishlistContext.js';
import { useCart } from '../context/CartContext.js';
import { ProductCard } from '../components/common/ProductCard.js';

interface WishlistPageProps {
  onNavigate: (route: string, param?: string) => void;
  onQuickView: (product: Product) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onNavigate, onQuickView }) => {
  const { wishlist, wishlistCount } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-[#E8E1D7] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#6D212F]">
            Saved Curations
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#12100E] mt-1">
            My Wishlist ({wishlistCount})
          </h1>
        </div>

        <button
          onClick={() => onNavigate('shop')}
          className="text-xs uppercase tracking-wider font-semibold text-[#12100E] hover:text-[#6D212F] flex items-center gap-1.5 transition-colors"
        >
          <span>Continue Exploring</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {wishlist.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-[#E8E1D7] p-8 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E8E1D7] flex items-center justify-center text-[#8C827A] mx-auto mb-4">
            <Heart className="w-8 h-8 stroke-1" />
          </div>
          <h2 className="text-2xl font-serif text-[#12100E] mb-2">Your Wishlist is Empty</h2>
          <p className="text-xs text-[#8C827A] max-w-sm mx-auto mb-6">
            Tap the heart on any silhouette in our runway collections to curate your personal capsule.
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="px-6 py-3 bg-[#12100E] hover:bg-[#6D212F] text-white rounded-xl text-xs font-semibold uppercase tracking-widest transition-colors shadow-md"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlist.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

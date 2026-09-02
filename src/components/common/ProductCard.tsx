import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../../types.js';
import { useWishlist } from '../../context/WishlistContext.js';
import { useCart } from '../../context/CartContext.js';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onNavigate: (route: string, param?: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView, onNavigate }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [showSizePicker, setShowSizePicker] = useState(false);

  const isFavorited = isInWishlist(product.id);

  // Badge priority
  let badge: { text: string; bg: string } | null = null;
  if (product.isBestSeller) {
    badge = { text: 'BEST SELLER', bg: 'bg-[#12100E] text-[#C8A97E]' };
  } else if (product.isTrending) {
    badge = { text: 'TRENDING', bg: 'bg-[#6D212F] text-white' };
  } else if (product.isNewArrival) {
    badge = { text: 'NEW', bg: 'bg-[#FAF8F5] text-[#1E1B18] border border-[#E8E1D7]' };
  } else if (product.discount >= 30) {
    badge = { text: `${product.discount}% OFF`, bg: 'bg-[#C8A97E] text-[#12100E]' };
  }

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.sizes.length > 1 && !showSizePicker) {
      setShowSizePicker(true);
      return;
    }
    const colorName = product.colors[0]?.name || 'Default';
    await addToCart(product.id, selectedSize, colorName, 1);
    setShowSizePicker(false);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="group flex flex-col bg-white rounded-xl overflow-hidden border border-[#E8E1D7]/70 hover:border-[#12100E]/30 hover:shadow-lg transition-all duration-300 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowSizePicker(false);
      }}
    >
      {/* 1. Image Canvas & Badges */}
      <div
        className="relative w-full aspect-[3/4] bg-[#F5F1EA] overflow-hidden cursor-pointer"
        onClick={() => onNavigate('product', product.slug || product.id)}
      >
        <img
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Top-Left Badge */}
        {badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded shadow-sm ${badge.bg}`}>
              {badge.text}
            </span>
          </div>
        )}

        {/* Top-Right Wishlist Action */}
        <button
          id={`btn-wishlist-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
            isFavorited
              ? 'bg-[#6D212F] text-white shadow-md'
              : 'bg-white/85 text-[#1E1B18] hover:bg-white hover:text-[#6D212F] shadow-sm'
          }`}
          aria-label="Add to wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current text-white' : ''}`} />
        </button>

        {/* Quick View Button (Reveals on Hover) */}
        <div className="absolute inset-x-3 bottom-3 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
          <button
            id={`btn-quickview-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 py-2.5 px-3 bg-white/95 backdrop-blur-md hover:bg-[#12100E] hover:text-white text-[#12100E] text-xs font-semibold uppercase tracking-wider rounded-lg shadow-md flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>

        {/* Stock status indicator if low */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-3 left-3 bg-[#6D212F]/90 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
            Only {product.stock} left
          </div>
        )}
      </div>

      {/* 2. Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#8C827A] mb-1">
            <span>{product.brand}</span>
            <div className="flex items-center gap-1 text-[#C8A97E]">
              <Star className="w-3 h-3 fill-current" />
              <span className="font-semibold text-[#1E1B18] text-[11px]">{product.rating}</span>
              <span className="text-[#8C827A]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onNavigate('product', product.slug || product.id)}
            className="text-sm font-medium text-[#12100E] hover:text-[#6D212F] cursor-pointer transition-colors line-clamp-1 mb-1 font-serif-luxury"
          >
            {product.name}
          </h3>

          {/* Price & Discounts */}
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-base font-semibold text-[#12100E]">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-xs text-[#8C827A] line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-[#6D212F] bg-[#6D212F]/10 px-1.5 py-0.5 rounded">
                  {product.discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* Color Dots */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2.5">
              {product.colors.slice(0, 4).map((col, idx) => (
                <div
                  key={idx}
                  title={col.name}
                  className="w-3 h-3 rounded-full border border-black/20 shadow-xs"
                  style={{ backgroundColor: col.hex }}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-[#8C827A]">+{product.colors.length - 4}</span>
              )}
            </div>
          )}
        </div>

        {/* 3. Inline Quick Size Picker / Add to Bag */}
        <div className="mt-3.5 pt-3 border-t border-[#E8E1D7]/50">
          {showSizePicker ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#8C827A]">
                <span>Select Size:</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSizePicker(false);
                  }}
                  className="text-xs text-[#12100E] underline"
                >
                  Cancel
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSize(s);
                      const colorName = product.colors[0]?.name || 'Default';
                      addToCart(product.id, s, colorName, 1);
                      setShowSizePicker(false);
                    }}
                    className={`px-2.5 py-1 text-xs font-semibold rounded border transition-all ${
                      selectedSize === s
                        ? 'bg-[#12100E] text-white border-[#12100E]'
                        : 'bg-white text-[#1E1B18] border-[#E8E1D7] hover:border-[#12100E]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              id={`btn-add-cart-${product.id}`}
              onClick={handleQuickAdd}
              disabled={product.stock <= 0}
              className={`w-full py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                product.stock <= 0
                  ? 'bg-[#E8E1D7] text-[#8C827A] cursor-not-allowed'
                  : 'bg-[#FAF8F5] border border-[#E8E1D7] text-[#12100E] hover:bg-[#12100E] hover:text-white hover:border-[#12100E]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{product.stock <= 0 ? 'Out of Stock' : 'Add to Bag'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

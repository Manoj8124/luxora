import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Heart, ShoppingBag, Truck, Shield, ArrowRight } from 'lucide-react';
import { Product } from '../../types.js';
import { useCart } from '../../context/CartContext.js';
import { useWishlist } from '../../context/WishlistContext.js';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string, param?: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onNavigate
}) => {
  if (!product) return null;

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    await addToCart(product.id, selectedSize, selectedColor || 'Default', quantity);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-[#E8E1D7] my-8"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-[#1E1B18] hover:bg-[#12100E] hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left Column: Image Showcase */}
              <div className="p-6 bg-[#FAF8F5] flex flex-col justify-between">
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-white shadow-xs">
                  <img
                    src={product.images[activeImageIdx] || product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Thumbnails */}
                {product.images.length > 1 && (
                  <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIdx(idx)}
                        className={`w-16 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                          activeImageIdx === idx
                            ? 'border-[#6D212F] shadow-sm'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Details & Customizer */}
              <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
                <div className="space-y-4">
                  {/* Brand & Stars */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8C827A]">
                      {product.brand}
                    </span>
                    <div className="flex items-center gap-1 text-[#C8A97E]">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-xs font-bold text-[#1E1B18]">{product.rating}</span>
                      <span className="text-xs text-[#8C827A]">({product.reviewCount} reviews)</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-normal text-[#12100E] font-serif leading-tight">
                    {product.name}
                  </h2>

                  {/* Price Block */}
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-bold text-[#12100E]">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice > product.price && (
                      <>
                        <span className="text-sm text-[#8C827A] line-through">
                          MRP ₹{product.originalPrice.toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-[#6D212F] bg-[#6D212F]/10 px-2 py-0.5 rounded">
                          {product.discount}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#4A453E] leading-relaxed line-clamp-3">
                    {product.description}
                  </p>

                  {/* Color Selector */}
                  {product.colors && product.colors.length > 0 && (
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-2">
                        Color: <span className="text-[#8C827A] font-normal">{selectedColor}</span>
                      </label>
                      <div className="flex gap-2.5">
                        {product.colors.map((c) => (
                          <button
                            key={c.name}
                            onClick={() => setSelectedColor(c.name)}
                            className={`w-7 h-7 rounded-full border transition-all p-0.5 ${
                              selectedColor === c.name
                                ? 'ring-2 ring-[#12100E] ring-offset-2'
                                : 'hover:scale-110'
                            }`}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Size Selector */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs uppercase tracking-wider font-semibold text-[#1E1B18]">
                        Select Size:
                      </label>
                      {sizeError && (
                        <span className="text-xs text-red-600 font-medium">Please select a size</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setSelectedSize(s);
                            setSizeError(false);
                          }}
                          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
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

                  {/* Quantity */}
                  <div className="flex items-center gap-4">
                    <label className="text-xs uppercase tracking-wider font-semibold text-[#1E1B18]">
                      Quantity:
                    </label>
                    <div className="flex items-center border border-[#E8E1D7] rounded-lg bg-[#FAF8F5]">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1 text-sm font-semibold hover:bg-white transition-colors"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-bold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="px-3 py-1 text-sm font-semibold hover:bg-white transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs text-[#8C827A]">
                      ({product.stock} available in atelier)
                    </span>
                  </div>
                </div>

                {/* Actions & Full Page CTA */}
                <div className="mt-8 space-y-3 pt-4 border-t border-[#E8E1D7]">
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock <= 0}
                      className="flex-1 py-3.5 px-4 bg-[#12100E] hover:bg-[#6D212F] text-white rounded-xl text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-md"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Shopping Bag</span>
                    </button>

                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                        isFavorited
                          ? 'bg-[#6D212F] border-[#6D212F] text-white'
                          : 'border-[#E8E1D7] hover:border-[#6D212F] text-[#1E1B18]'
                      }`}
                      aria-label="Wishlist"
                    >
                      <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onNavigate('product', product.slug || product.id);
                    }}
                    className="w-full py-2 text-xs uppercase tracking-wider font-semibold text-[#8C827A] hover:text-[#12100E] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>View Complete Product Details & Care</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

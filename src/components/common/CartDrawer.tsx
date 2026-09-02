import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Sparkles, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext.js';

interface CartDrawerProps {
  onNavigate: (route: string, param?: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const {
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
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    await applyCoupon(promoInput.trim());
    setPromoLoading(false);
    setPromoInput('');
  };

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-[#E8E1D7]"
            >
              {/* 1. Header */}
              <div className="p-5 border-b border-[#E8E1D7] flex items-center justify-between bg-[#FAF8F5]">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-[#6D212F]" />
                  <h2 className="text-base font-serif uppercase tracking-wider font-normal text-[#12100E]">
                    Shopping Bag ({itemCount})
                  </h2>
                </div>
                <button
                  id="btn-close-cart-drawer"
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-full text-[#8C827A] hover:text-[#12100E] hover:bg-white transition-colors"
                  aria-label="Close bag"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 2. Free Shipping Progress Bar */}
              <div className="px-5 py-3 bg-[#12100E] text-[#FAF8F5] text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1.5 text-[#E8E1D7]">
                    <Sparkles className="w-3.5 h-3.5 text-[#C8A97E]" />
                    {remainingForFreeShipping === 0
                      ? 'Complimentary Express Delivery Unlocked!'
                      : `Add ₹${remainingForFreeShipping.toLocaleString()} more for Free Shipping`}
                  </span>
                  <span className="font-bold text-[#C8A97E]">{freeShippingProgress}%</span>
                </div>
                <div className="w-full bg-white/15 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#C8A97E] h-full transition-all duration-500 rounded-full"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* 3. Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E8E1D7] flex items-center justify-center text-[#8C827A] mb-4">
                      <ShoppingBag className="w-8 h-8 stroke-1" />
                    </div>
                    <p className="text-base font-serif text-[#12100E] mb-1">
                      Your bag is waiting for something beautiful.
                    </p>
                    <p className="text-xs text-[#8C827A] max-w-xs mb-6">
                      Explore our new arrivals and timeless tailoring to curate your wardrobe.
                    </p>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        onNavigate('shop');
                      }}
                      className="px-6 py-2.5 bg-[#12100E] text-white rounded-lg text-xs font-semibold uppercase tracking-widest hover:bg-[#6D212F] transition-colors"
                    >
                      Explore Catalog
                    </button>
                  </div>
                ) : (
                  items.map((item) => {
                    const prod = item.product;
                    return (
                      <div
                        key={item.id}
                        className="flex gap-4 p-3 rounded-xl border border-[#E8E1D7] bg-[#FAF8F5]/50 relative group"
                      >
                        {/* Image */}
                        <div
                          className="w-20 h-24 rounded-lg bg-white overflow-hidden shrink-0 cursor-pointer"
                          onClick={() => {
                            setIsCartOpen(false);
                            onNavigate('product', prod?.slug || item.productId);
                          }}
                        >
                          <img
                            src={prod?.images?.[0] || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80'}
                            alt={prod?.name || 'Product'}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start pr-6">
                              <h4
                                onClick={() => {
                                  setIsCartOpen(false);
                                  onNavigate('product', prod?.slug || item.productId);
                                }}
                                className="text-xs font-semibold text-[#12100E] hover:text-[#6D212F] cursor-pointer line-clamp-1 font-serif-luxury"
                              >
                                {prod?.name}
                              </h4>
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-[#8C827A] mt-1">
                              <span>Size: <strong className="text-[#1E1B18]">{item.size}</strong></span>
                              <span>•</span>
                              <span>Color: <strong className="text-[#1E1B18]">{item.color}</strong></span>
                            </div>

                            <div className="text-xs font-bold text-[#12100E] mt-1.5">
                              ₹{(item.price || prod?.price || 0).toLocaleString()}
                            </div>
                          </div>

                          {/* Quantity and Remove */}
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E8E1D7]/60">
                            <div className="flex items-center border border-[#E8E1D7] rounded-md bg-white">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 hover:text-[#6D212F] transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2.5 text-xs font-semibold">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 hover:text-[#6D212F] transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-[#8C827A] hover:text-red-600 transition-colors p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* 4. Footer & Summary */}
              {items.length > 0 && (
                <div className="p-5 border-t border-[#E8E1D7] bg-[#FAF8F5] space-y-4">
                  {/* Coupon Promo Input */}
                  {couponCode ? (
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#6D212F]/10 border border-[#6D212F]/20 text-xs">
                      <div className="flex items-center gap-2 text-[#6D212F]">
                        <Tag className="w-4 h-4" />
                        <span><strong>{couponCode}</strong> applied (-₹{discountAmount.toLocaleString()})</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-xs text-red-600 font-semibold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        placeholder="Promo code (e.g. WELCOME10)"
                        className="flex-1 bg-white border border-[#E8E1D7] rounded-lg px-3 py-2 text-xs uppercase placeholder:normal-case placeholder:text-[#8C827A] focus:outline-none focus:border-[#12100E]"
                      />
                      <button
                        type="submit"
                        disabled={promoLoading || !promoInput.trim()}
                        className="px-4 py-2 bg-[#12100E] text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#6D212F] transition-colors disabled:opacity-50"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {/* Pricing Breakdown */}
                  <div className="space-y-1.5 text-xs text-[#4A453E]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-[#12100E]">₹{subtotal.toLocaleString()}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-[#6D212F]">
                        <span>Atelier Promo Discount</span>
                        <span className="font-semibold">-₹{discountAmount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Estimated Shipping</span>
                      <span>{shippingFee === 0 ? <strong className="text-emerald-700">COMPLIMENTARY</strong> : `₹${shippingFee}`}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Applicable Taxes (GST 5%)</span>
                      <span>₹{taxAmount.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-sm font-bold text-[#12100E] pt-2 border-t border-[#E8E1D7]">
                      <span>Estimated Total</span>
                      <span>₹{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-1">
                    <button
                      id="btn-drawer-checkout"
                      onClick={() => {
                        setIsCartOpen(false);
                        onNavigate('checkout');
                      }}
                      className="w-full py-3.5 bg-[#12100E] hover:bg-[#6D212F] text-white rounded-xl text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-md"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        onNavigate('cart');
                      }}
                      className="w-full py-2 text-xs font-semibold text-[#8C827A] hover:text-[#12100E] uppercase tracking-wider transition-colors"
                    >
                      View Full Bag Details
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

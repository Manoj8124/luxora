import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Star,
  Heart,
  ShoppingBag,
  Ruler,
  Truck,
  RefreshCw,
  Shield,
  ChevronRight,
  Sparkles,
  Share2,
  Check,
  MessageSquare,
  ThumbsUp
} from 'lucide-react';
import { Product, Review } from '../types.js';
import { api } from '../services/api.js';
import { useCart } from '../context/CartContext.js';
import { useWishlist } from '../context/WishlistContext.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { SizeGuideModal } from '../components/common/SizeGuideModal.js';
import { ProductCard } from '../components/common/ProductCard.js';

interface ProductDetailPageProps {
  slugOrId: string;
  onNavigate: (route: string, param?: string) => void;
  onQuickView: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  slugOrId,
  onNavigate,
  onQuickView
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  // Reviews submission state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user, openAuthModal } = useAuth();
  const { success, error: toastError } = useToast();

  const [reviewsList, setReviewsList] = useState<Review[]>([]);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const prod = await api.getProduct(slugOrId);
        setProduct(prod);
        setSelectedSize(prod.sizes[0] || '');
        setSelectedColor(prod.colors[0]?.name || '');
        setActiveImageIdx(0);

        // Fetch reviews
        const revs = await api.getProductReviews(prod.id);
        setReviewsList(revs);

        // Fetch related products in the same category
        const relRes = await api.getProducts({ category: prod.categoryId, limit: 5 });
        setRelatedProducts(relRes.products.filter((p) => p.id !== prod.id).slice(0, 4));
      } catch (err) {
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slugOrId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse space-y-6 max-w-2xl mx-auto">
          <div className="aspect-[3/4] bg-[#E8E1D7]/50 rounded-2xl w-80 mx-auto" />
          <div className="h-6 bg-[#E8E1D7]/50 rounded w-1/2 mx-auto" />
          <div className="h-4 bg-[#E8E1D7]/50 rounded w-1/3 mx-auto" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif text-[#12100E] mb-2">Silhouette Not Found</h2>
        <p className="text-xs text-[#8C827A] mb-6">This piece may have retired from our current capsule.</p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-2.5 bg-[#12100E] text-white rounded-xl text-xs font-semibold uppercase tracking-wider"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    await addToCart(product.id, selectedSize, selectedColor || 'Default', quantity);
  };

  const handleBuyNow = async () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    await addToCart(product.id, selectedSize, selectedColor || 'Default', quantity);
    onNavigate('checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }
    if (!reviewComment.trim()) {
      toastError('Please write your review comment');
      return;
    }

    try {
      setSubmittingReview(true);
      const newReview = await api.submitReview(product.id, {
        rating: reviewRating,
        title: reviewTitle.trim() || 'Exquisite piece',
        comment: reviewComment.trim()
      });
      setReviewsList((prev) => [newReview, ...prev]);
      setProduct((prev) => (prev ? { ...prev, reviewCount: (prev.reviewCount || 0) + 1 } : prev));
      success('Thank you! Your verified review has been published.');
      setShowReviewForm(false);
      setReviewComment('');
      setReviewTitle('');
    } catch (err: any) {
      toastError(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      success('Link copied to clipboard');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-[#8C827A]">
        <button onClick={() => onNavigate('home')} className="hover:text-[#12100E]">Home</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => onNavigate('shop')} className="hover:text-[#12100E]">Shop</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => onNavigate('shop', product.categoryId)} className="hover:text-[#12100E] capitalize">
          {product.category}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#12100E] font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* 2. Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Gallery Section (7 columns on desktop) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Vertical Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0 pb-2 sm:pb-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-16 sm:w-20 aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-[#FAF8F5] ${
                    activeImageIdx === idx
                      ? 'border-[#6D212F] shadow-md'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>
          )}

          {/* Main Hero Image */}
          <div className="flex-1 aspect-[3/4] rounded-2xl overflow-hidden bg-[#FAF8F5] relative shadow-md group">
            <img
              src={product.images[activeImageIdx] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            {product.isBestSeller && (
              <span className="absolute top-4 left-4 bg-[#12100E] text-[#C8A97E] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded shadow-sm">
                Best Seller
              </span>
            )}
            {product.isTrending && (
              <span className="absolute top-4 left-4 bg-[#6D212F] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded shadow-sm">
                Trending
              </span>
            )}
          </div>
        </div>

        {/* Product Details Section (5 columns on desktop) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#8C827A]">
                {product.brand} Atelier
              </span>
              <button
                onClick={handleShare}
                className="p-2 text-[#8C827A] hover:text-[#12100E] rounded-full hover:bg-[#FAF8F5] transition-colors"
                title="Share silhouette"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#12100E] leading-tight">
              {product.name}
            </h1>

            {/* Rating Stars */}
            <div className="flex items-center gap-2.5 mt-2.5">
              <div className="flex text-[#C8A97E]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'fill-current' : 'opacity-40'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-[#12100E]">{product.rating}</span>
              <span className="text-xs text-[#8C827A]">
                ({product.reviewCount} client reviews)
              </span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D7] flex items-baseline gap-3">
            <span className="text-3xl font-bold text-[#12100E]">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-sm text-[#8C827A] line-through">
                  MRP ₹{product.originalPrice.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-[#6D212F] bg-[#6D212F]/10 px-2.5 py-1 rounded">
                  {product.discount}% SAVINGS
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#4A453E] leading-relaxed font-light">
            {product.description}
          </p>

          {/* Color Chooser */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-2.5">
                Color: <span className="text-[#8C827A] font-normal">{selectedColor}</span>
              </label>
              <div className="flex gap-3">
                {product.colors.map((col) => (
                  <button
                    key={col.name}
                    onClick={() => setSelectedColor(col.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all ${
                      selectedColor === col.name
                        ? 'border-[#12100E] bg-[#12100E] text-white shadow-xs'
                        : 'border-[#E8E1D7] bg-white text-[#1E1B18] hover:border-[#12100E]'
                    }`}
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-black/20"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span>{col.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Chooser with Size Guide Trigger */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#1E1B18]">
                Select Size:
              </label>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="text-xs text-[#6D212F] font-semibold flex items-center gap-1 hover:underline"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size & Measurements</span>
              </button>
            </div>

            {sizeError && (
              <p className="text-xs text-red-600 font-medium mb-2">Please select a size to proceed</p>
            )}

            <div className="flex flex-wrap gap-2.5">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSelectedSize(s);
                    setSizeError(false);
                  }}
                  className={`min-w-12 h-10 px-3 text-xs font-semibold rounded-xl border transition-all ${
                    selectedSize === s
                      ? 'bg-[#12100E] text-white border-[#12100E] shadow-sm'
                      : 'bg-white text-[#1E1B18] border-[#E8E1D7] hover:border-[#12100E]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Stock & Quantity */}
          <div className="flex items-center justify-between py-2 border-y border-[#E8E1D7]">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#1E1B18]">Quantity:</span>
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
            </div>

            <span className="text-xs text-[#6D212F] font-medium">
              {product.stock <= 5 ? `Only ${product.stock} left in atelier stock` : 'In Stock & Ready to Dispatch'}
            </span>
          </div>

          {/* Call to Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              <button
                id="btn-add-to-bag-pdp"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 py-4 bg-[#12100E] hover:bg-[#6D212F] text-white rounded-xl text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag</span>
              </button>

              <button
                id="btn-wishlist-pdp"
                onClick={() => toggleWishlist(product)}
                className={`w-14 h-14 rounded-xl flex items-center justify-center border transition-all ${
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
              id="btn-buy-now-pdp"
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="w-full py-3.5 bg-[#FAF8F5] border border-[#12100E] text-[#12100E] hover:bg-[#12100E] hover:text-white rounded-xl text-xs font-semibold uppercase tracking-widest transition-all"
            >
              Instant Buy Now
            </button>
          </div>

          {/* Atelier Guarantees */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D7] space-y-3 text-xs text-[#4A453E]">
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-[#6D212F] shrink-0" />
              <span>Complimentary insured shipping on orders over ₹3,000</span>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-[#6D212F] shrink-0" />
              <span>14-day atelier return & exchange policy</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-[#6D212F] shrink-0" />
              <span>100% certified authentic couture with provenance tag</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Specifications, Materials, and Care */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 rounded-3xl bg-white border border-[#E8E1D7]">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#6D212F] mb-3">
            Artisanal Materials
          </h3>
          <ul className="space-y-2 text-xs text-[#4A453E]">
            {(product.materials || product.details || [product.material || '100% Certified Mulberry Silk, French Jacquard']).map((m, i) => (
              <li key={i} className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C8A97E]" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#6D212F] mb-3">
            Garment Care
          </h3>
          <p className="text-xs text-[#4A453E] leading-relaxed">
            {product.careInstructions || (product.care ? product.care.join('. ') : 'Specialist dry clean only. Store in breathable garment bag away from direct sunlight.')}
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#6D212F] mb-3">
            Tailoring & Fit
          </h3>
          <p className="text-xs text-[#4A453E] leading-relaxed">
            Designed for an elegant tailored drape. Fits true to standard international sizing. Model is 5'10" (178cm) wearing size S.
          </p>
        </div>
      </div>

      {/* 4. Client Reviews Section */}
      <section className="space-y-8 pt-8 border-t border-[#E8E1D7]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-serif text-[#12100E]">Client Reviews & Atelier Ratings</h2>
            <p className="text-xs text-[#8C827A] mt-1">Verified feedback from connoisseurs</p>
          </div>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-5 py-2.5 bg-[#12100E] text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-[#6D212F] transition-colors"
          >
            {showReviewForm ? 'Cancel' : 'Write a Review'}
          </button>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <form onSubmit={handleReviewSubmit} className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D7] space-y-4 max-w-2xl">
            <h3 className="text-sm font-semibold text-[#12100E]">Share your experience with this silhouette</h3>
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                Your Rating
              </label>
              <div className="flex gap-2 text-[#C8A97E]">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setReviewRating(num)}
                    className="p-1"
                  >
                    <Star className={`w-5 h-5 ${num <= reviewRating ? 'fill-current' : 'opacity-40'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                Review Headline
              </label>
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="e.g. Stunning fabric and silhouette"
                className="w-full bg-white border border-[#E8E1D7] rounded-xl px-4 py-2 text-xs text-[#12100E] focus:outline-none focus:border-[#12100E]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                Review Comments
              </label>
              <textarea
                rows={4}
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Describe the fit, fabric texture, and how you styled it..."
                className="w-full bg-white border border-[#E8E1D7] rounded-xl p-4 text-xs text-[#12100E] focus:outline-none focus:border-[#12100E]"
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="px-6 py-3 bg-[#6D212F] text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-[#8B2C3C] transition-colors"
            >
              {submittingReview ? 'Submitting...' : 'Post Verified Review'}
            </button>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviewsList.length === 0 ? (
            <p className="text-xs text-[#8C827A] italic">No reviews yet for this silhouette. Be the first to share your thoughts.</p>
          ) : (
            reviewsList.map((rev) => (
              <div key={rev.id} className="p-6 rounded-2xl bg-white border border-[#E8E1D7] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#12100E]">{rev.userName}</span>
                    {rev.isVerifiedPurchase && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                        Verified Buyer
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#8C827A]">
                    {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <div className="flex text-[#C8A97E]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <h4 className="text-xs font-semibold text-[#12100E]">{rev.title}</h4>
                <p className="text-xs text-[#4A453E] leading-relaxed">{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 5. Complete The Look / Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-8 border-t border-[#E8E1D7]">
          <h2 className="text-2xl font-serif text-[#12100E]">Complete The Silhouette</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickView={onQuickView}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ArrowRight, Sparkles, TrendingUp, Star } from 'lucide-react';
import { Product } from '../../types.js';
import { api } from '../../services/api.js';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string, param?: string) => void;
}

const POPULAR_SEARCHES = [
  'Satin Evening Dress',
  'Tailored Wool Blazer',
  'Linen Shirt',
  'Palazzo Trousers',
  'Cashmere Jumper',
  'Selvedge Denim',
  'Gold Hoop Earrings'
];

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await api.getProducts({ search: query.trim(), limit: 6 });
        setResults(res.products);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectProduct = (product: Product) => {
    onClose();
    onNavigate('product', product.slug || product.id);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      onNavigate('shop', `search:${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          <div className="relative min-h-screen px-4 pt-16 pb-20 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E8E1D7] z-10"
            >
              {/* Search Bar Input */}
              <form onSubmit={handleSearchSubmit} className="p-4 sm:p-6 border-b border-[#E8E1D7] flex items-center gap-3 bg-[#FAF8F5]">
                <Search className="w-5 h-5 text-[#8C827A]" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search silhouettes, fabrics, blazers, evening gowns..."
                  className="flex-1 bg-transparent text-sm sm:text-base font-medium text-[#12100E] placeholder:text-[#8C827A] focus:outline-none"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="p-1 text-[#8C827A] hover:text-[#12100E]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs uppercase tracking-wider font-semibold px-3 py-1.5 rounded-lg border border-[#E8E1D7] text-[#8C827A] hover:text-[#12100E] hover:border-[#12100E] transition-all"
                >
                  ESC
                </button>
              </form>

              {/* Suggestions / Results */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {query.trim() === '' ? (
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#8C827A] mb-3">
                        <TrendingUp className="w-3.5 h-3.5 text-[#6D212F]" />
                        <span>Trending Searches</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {POPULAR_SEARCHES.map((term) => (
                          <button
                            key={term}
                            onClick={() => setQuery(term)}
                            className="px-3 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E8E1D7] text-xs text-[#1E1B18] hover:border-[#6D212F] hover:text-[#6D212F] transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#E8E1D7]/60">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#8C827A] mb-3">
                        <Sparkles className="w-3.5 h-3.5 text-[#C8A97E]" />
                        <span>Curated Collections</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <button
                          onClick={() => {
                            onClose();
                            onNavigate('new-arrivals');
                          }}
                          className="p-3 rounded-xl bg-[#FAF8F5] text-left hover:bg-[#12100E] hover:text-white transition-all group"
                        >
                          <p className="text-xs font-semibold group-hover:text-white">New Arrivals</p>
                          <p className="text-[10px] text-[#8C827A] group-hover:text-[#C8A97E]">Autumn 2026</p>
                        </button>

                        <button
                          onClick={() => {
                            onClose();
                            onNavigate('shop', 'cat-dresses');
                          }}
                          className="p-3 rounded-xl bg-[#FAF8F5] text-left hover:bg-[#12100E] hover:text-white transition-all group"
                        >
                          <p className="text-xs font-semibold group-hover:text-white">Dresses & Gowns</p>
                          <p className="text-[10px] text-[#8C827A] group-hover:text-[#C8A97E]">Silk & Satin</p>
                        </button>

                        <button
                          onClick={() => {
                            onClose();
                            onNavigate('shop', 'cat-outerwear');
                          }}
                          className="p-3 rounded-xl bg-[#FAF8F5] text-left hover:bg-[#12100E] hover:text-white transition-all group"
                        >
                          <p className="text-xs font-semibold group-hover:text-white">Tailored Blazers</p>
                          <p className="text-[10px] text-[#8C827A] group-hover:text-[#C8A97E]">Virgin Wool</p>
                        </button>

                        <button
                          onClick={() => {
                            onClose();
                            onNavigate('best-sellers');
                          }}
                          className="p-3 rounded-xl bg-[#FAF8F5] text-left hover:bg-[#12100E] hover:text-white transition-all group"
                        >
                          <p className="text-xs font-semibold group-hover:text-white">Best Sellers</p>
                          <p className="text-[10px] text-[#8C827A] group-hover:text-[#C8A97E]">Most Coveted</p>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : loading ? (
                  <div className="py-12 text-center text-xs text-[#8C827A]">
                    Searching LUXORA catalog...
                  </div>
                ) : results.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-base font-serif text-[#12100E] mb-1">No silhouettes found for "{query}"</p>
                    <p className="text-xs text-[#8C827A] max-w-sm mx-auto mb-4">
                      Try exploring our categories or searching by fabric like "silk", "cashmere", or "linen".
                    </p>
                    <button
                      onClick={() => {
                        onClose();
                        onNavigate('shop');
                      }}
                      className="px-5 py-2 bg-[#12100E] text-white rounded-lg text-xs font-semibold uppercase tracking-wider"
                    >
                      Browse Entire Shop
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#8C827A] mb-4">
                      <span>Found {results.length} matching silhouettes</span>
                      <button
                        onClick={handleSearchSubmit}
                        className="text-[#6D212F] font-semibold hover:underline flex items-center gap-1"
                      >
                        <span>View all results</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {results.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleSelectProduct(product)}
                          className="flex gap-3.5 p-3 rounded-xl border border-[#E8E1D7] hover:border-[#12100E] hover:bg-[#FAF8F5] transition-all cursor-pointer group"
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-16 h-20 rounded-lg object-cover bg-[#FAF8F5] shrink-0"
                          />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-[#8C827A]">{product.brand}</p>
                              <h4 className="text-xs font-semibold text-[#12100E] group-hover:text-[#6D212F] transition-colors line-clamp-1 font-serif-luxury">
                                {product.name}
                              </h4>
                              <div className="flex items-center gap-1 text-[#C8A97E] text-[10px] mt-0.5">
                                <Star className="w-3 h-3 fill-current" />
                                <span>{product.rating}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-[#12100E]">
                              <span>₹{product.price.toLocaleString()}</span>
                              {product.originalPrice > product.price && (
                                <span className="text-[10px] text-[#8C827A] line-through font-normal">
                                  ₹{product.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

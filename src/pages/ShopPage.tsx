import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
  Sparkles,
  LayoutGrid,
  Grid2X2,
  Check
} from 'lucide-react';
import { Product, Category, FilterOptions } from '../types.js';
import { api } from '../services/api.js';
import { ProductCard } from '../components/common/ProductCard.js';

interface ShopPageProps {
  initialFilterParam?: string;
  onNavigate: (route: string, param?: string) => void;
  onQuickView: (product: Product) => void;
}

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const AVAILABLE_COLORS = [
  { name: 'Black', hex: '#12100E' },
  { name: 'Burgundy', hex: '#6D212F' },
  { name: 'Ivory', hex: '#FAF8F5' },
  { name: 'Champagne', hex: '#C8A97E' },
  { name: 'Emerald', hex: '#1B4332' },
  { name: 'Navy', hex: '#1B263B' },
  { name: 'Camel', hex: '#C19A6B' },
  { name: 'Terracotta', hex: '#E07A5F' },
];
const AVAILABLE_FABRICS = ['Silk & Satin', 'Virgin Wool', 'Pure Cashmere', 'Italian Linen', 'Organic Cotton', 'Italian Nappa Leather'];

export const ShopPage: React.FC<ShopPageProps> = ({
  initialFilterParam,
  onNavigate,
  onQuickView
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [columns, setColumns] = useState<3 | 4>(4);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Parse initial filter param if passed (e.g. "cat-dresses", "gender:women", "search:blazer")
  useEffect(() => {
    if (!initialFilterParam) return;
    if (initialFilterParam.startsWith('cat-')) {
      setSelectedCategory(initialFilterParam);
    } else if (initialFilterParam.startsWith('gender:')) {
      setSelectedGender(initialFilterParam.replace('gender:', ''));
    } else if (initialFilterParam.startsWith('search:')) {
      const q = decodeURIComponent(initialFilterParam.replace('search:', ''));
      setSearchQuery(q);
    } else if (initialFilterParam === 'new-arrivals') {
      setSortBy('newest');
    } else if (initialFilterParam === 'trending') {
      setSortBy('trending');
    } else if (initialFilterParam === 'best-sellers') {
      setSortBy('rating');
    }
  }, [initialFilterParam]);

  // Fetch initial data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [cats, prods] = await Promise.all([
          api.getCategories(),
          api.getProducts({ limit: 100 })
        ]);
        setCategories(cats);
        setProducts(prods.products);
      } catch (err) {
        console.error('Failed fetching shop data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter and sort products client-side for ultra-fast response
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchTags) return false;
        }

        // Category
        if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
          return false;
        }

        // Gender
        if (selectedGender !== 'all' && p.gender !== selectedGender && p.gender !== 'unisex') {
          return false;
        }

        // Price
        if (p.price < priceRange[0] || p.price > priceRange[1]) {
          return false;
        }

        // Sizes
        if (selectedSizes.length > 0) {
          const hasSize = selectedSizes.some((s) => p.sizes.includes(s));
          if (!hasSize) return false;
        }

        // Colors
        if (selectedColors.length > 0) {
          const hasColor = selectedColors.some((c) =>
            p.colors.some((pc) => pc.name.toLowerCase() === c.toLowerCase())
          );
          if (!hasColor) return false;
        }

        // Fabrics
        if (selectedFabrics.length > 0) {
          const hasFabric = selectedFabrics.some((f) =>
            p.materials.some((m) => m.toLowerCase().includes(f.toLowerCase())) ||
            p.description.toLowerCase().includes(f.toLowerCase())
          );
          if (!hasFabric) return false;
        }

        // In Stock Only
        if (inStockOnly && p.stock <= 0) return false;

        // On Sale Only
        if (onSaleOnly && p.discount <= 0) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        if (sortBy === 'trending') return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
        return 0; // default featured
      });
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedGender,
    priceRange,
    selectedSizes,
    selectedColors,
    selectedFabrics,
    inStockOnly,
    onSaleOnly,
    sortBy
  ]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

  const toggleFabric = (fabric: string) => {
    setSelectedFabrics((prev) =>
      prev.includes(fabric) ? prev.filter((f) => f !== fabric) : [...prev, fabric]
    );
  };

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSelectedGender('all');
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedFabrics([]);
    setPriceRange([0, 30000]);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedGender !== 'all' ||
    selectedSizes.length > 0 ||
    selectedColors.length > 0 ||
    selectedFabrics.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 30000 ||
    inStockOnly ||
    onSaleOnly ||
    searchQuery !== '';

  const activeCategoryName =
    selectedCategory === 'all'
      ? 'All Haute Couture'
      : categories.find((c) => c.id === selectedCategory)?.name || 'Catalog';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 1. Shop Hero Header */}
      <div className="mb-8 pb-6 border-b border-[#E8E1D7]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-semibold text-[#6D212F]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LUXORA Collection</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#12100E] mt-1">
              {searchQuery ? `Results for "${searchQuery}"` : activeCategoryName}
            </h1>
            <p className="text-xs text-[#8C827A] mt-1.5 max-w-xl">
              Immerse yourself in exceptional craftsmanship, tailored silhouettes, and luxurious materials.
            </p>
          </div>

          {/* Quick Gender Tabs */}
          <div className="flex rounded-xl bg-[#FAF8F5] p-1 border border-[#E8E1D7] self-start md:self-auto">
            {['all', 'women', 'men'].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGender(g)}
                className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all ${
                  selectedGender === g
                    ? 'bg-[#12100E] text-white shadow-xs'
                    : 'text-[#8C827A] hover:text-[#12100E]'
                }`}
              >
                {g === 'all' ? 'All Genders' : g === 'women' ? 'Women' : 'Men'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Top Controls Bar (Mobile Filter Toggle, Counts, Sorting, Grid views) */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E1D7]">
        <div className="flex items-center gap-3">
          {/* Mobile Filter Trigger */}
          <button
            id="btn-open-mobile-filter"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-[#12100E] text-white text-xs font-semibold uppercase tracking-wider shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          <span className="text-xs text-[#4A453E]">
            Showing <strong>{filteredProducts.length}</strong> of {products.length} silhouettes
          </span>

          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="hidden sm:flex items-center gap-1 text-xs text-[#6D212F] font-semibold hover:underline ml-2"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset all</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Grid Layout Switcher */}
          <div className="hidden sm:flex items-center border border-[#E8E1D7] rounded-lg bg-white p-0.5">
            <button
              onClick={() => setColumns(3)}
              className={`p-1.5 rounded ${columns === 3 ? 'bg-[#FAF8F5] text-[#12100E]' : 'text-[#8C827A]'}`}
              title="3 Columns"
            >
              <Grid2X2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setColumns(4)}
              className={`p-1.5 rounded ${columns === 4 ? 'bg-[#FAF8F5] text-[#12100E]' : 'text-[#8C827A]'}`}
              title="4 Columns"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-[#8C827A] hidden sm:inline">Sort By:</label>
            <div className="relative">
              <select
                id="select-sort-shop"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-[#E8E1D7] rounded-xl px-4 py-2 pr-8 text-xs font-semibold text-[#12100E] focus:outline-none focus:border-[#12100E] cursor-pointer"
              >
                <option value="featured">Featured Curations</option>
                <option value="newest">Newest Arrivals</option>
                <option value="trending">Trending Styles</option>
                <option value="rating">Top Customer Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#8C827A] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Body: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* DESKTOP SIDEBAR FILTERS */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6 sticky top-24 bg-white p-6 rounded-2xl border border-[#E8E1D7]">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E1D7]">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#12100E]">
              <SlidersHorizontal className="w-4 h-4 text-[#6D212F]" />
              <span>Atelier Filters</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-xs text-[#6D212F] font-semibold hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Category List */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#12100E] mb-3">
              Categories
            </h3>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left py-1.5 px-2 rounded-lg flex items-center justify-between transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-[#12100E] text-white font-semibold'
                    : 'text-[#4A453E] hover:bg-[#FAF8F5]'
                }`}
              >
                <span>All Categories</span>
                <span className="text-[10px] opacity-75">{products.length}</span>
              </button>
              {categories.map((c) => {
                const count = products.filter((p) => p.categoryId === c.id).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`w-full text-left py-1.5 px-2 rounded-lg flex items-center justify-between transition-colors ${
                      selectedCategory === c.id
                        ? 'bg-[#12100E] text-white font-semibold'
                        : 'text-[#4A453E] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] opacity-75">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="pt-4 border-t border-[#E8E1D7]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#12100E]">
                Price Range
              </h3>
              <span className="text-xs font-semibold text-[#6D212F]">
                ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="30000"
              step="500"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full accent-[#6D212F] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8C827A] mt-1">
              <span>₹0</span>
              <span>₹15,000</span>
              <span>₹30,000</span>
            </div>
          </div>

          {/* Sizes Filter */}
          <div className="pt-4 border-t border-[#E8E1D7]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#12100E] mb-3">
              Sizes
            </h3>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSize(s)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    selectedSizes.includes(s)
                      ? 'bg-[#12100E] text-white border-[#12100E]'
                      : 'bg-[#FAF8F5] text-[#1E1B18] border-[#E8E1D7] hover:border-[#12100E]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Colors Filter */}
          <div className="pt-4 border-t border-[#E8E1D7]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#12100E] mb-3">
              Colors
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {AVAILABLE_COLORS.map((c) => {
                const isSelected = selectedColors.includes(c.name);
                return (
                  <button
                    key={c.name}
                    onClick={() => toggleColor(c.name)}
                    className={`flex flex-col items-center gap-1 p-1.5 rounded-lg border transition-all ${
                      isSelected ? 'border-[#12100E] bg-[#FAF8F5]' : 'border-transparent hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full border border-black/20 flex items-center justify-center"
                      style={{ backgroundColor: c.hex }}
                    >
                      {isSelected && <Check className={`w-3 h-3 ${c.name === 'Ivory' ? 'text-black' : 'text-white'}`} />}
                    </div>
                    <span className="text-[10px] text-[#4A453E]">{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Premium Fabrics */}
          <div className="pt-4 border-t border-[#E8E1D7]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#12100E] mb-3">
              Atelier Fabrics
            </h3>
            <div className="space-y-1.5 text-xs">
              {AVAILABLE_FABRICS.map((f) => (
                <label key={f} className="flex items-center gap-2 cursor-pointer text-[#4A453E] hover:text-[#12100E]">
                  <input
                    type="checkbox"
                    checked={selectedFabrics.includes(f)}
                    onChange={() => toggleFabric(f)}
                    className="rounded accent-[#6D212F]"
                  />
                  <span>{f}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Special Toggles */}
          <div className="pt-4 border-t border-[#E8E1D7] space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#4A453E]">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded accent-[#6D212F]"
              />
              <span>In Stock Only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#4A453E]">
              <input
                type="checkbox"
                checked={onSaleOnly}
                onChange={(e) => setOnSaleOnly(e.target.checked)}
                className="rounded accent-[#6D212F]"
              />
              <span>On Sale / Special Archive Price</span>
            </label>
          </div>
        </aside>

        {/* PRODUCTS GRID */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 py-12">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-3">
                  <div className="aspect-[3/4] bg-[#E8E1D7]/50 rounded-xl" />
                  <div className="h-4 bg-[#E8E1D7]/50 rounded w-3/4" />
                  <div className="h-4 bg-[#E8E1D7]/50 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E8E1D7] p-12 text-center my-8">
              <p className="text-xl font-serif text-[#12100E] mb-2">No silhouettes match your criteria</p>
              <p className="text-xs text-[#8C827A] max-w-sm mx-auto mb-6">
                Try widening your price filters, selecting alternative sizes, or clearing your current search keywords.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-6 py-2.5 bg-[#12100E] text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-[#6D212F] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div
              className={`grid grid-cols-2 ${
                columns === 3
                  ? 'sm:grid-cols-2 md:grid-cols-3'
                  : 'sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
              } gap-4 sm:gap-6`}
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={onQuickView}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* 4. MOBILE FILTER SLIDE-OVER DRAWER */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 max-w-full flex pl-10"
            >
              <div className="w-screen max-w-sm bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#E8E1D7]">
                    <h3 className="text-base font-serif uppercase tracking-wider text-[#12100E]">
                      Refine Collection
                    </h3>
                    <button
                      onClick={() => setMobileFilterOpen(false)}
                      className="p-1 text-[#8C827A] hover:text-[#12100E]"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Categories */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#12100E] mb-2">Category</h4>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E1D7] rounded-lg p-2.5 text-xs text-[#12100E]"
                    >
                      <option value="all">All Categories</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sizes */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#12100E] mb-2">Sizes</h4>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_SIZES.map((s) => (
                        <button
                          key={s}
                          onClick={() => toggleSize(s)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border ${
                            selectedSizes.includes(s)
                              ? 'bg-[#12100E] text-white border-[#12100E]'
                              : 'bg-[#FAF8F5] text-[#1E1B18] border-[#E8E1D7]'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Max Price */}
                  <div>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-[#12100E] mb-2">
                      <span>Max Price</span>
                      <span className="text-[#6D212F]">₹{priceRange[1].toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="30000"
                      step="500"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full accent-[#6D212F]"
                    />
                  </div>
                </div>

                {/* Apply Button */}
                <div className="pt-6 border-t border-[#E8E1D7] space-y-2">
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="w-full py-3 bg-[#12100E] text-white rounded-xl text-xs font-semibold uppercase tracking-widest"
                  >
                    View {filteredProducts.length} Results
                  </button>
                  <button
                    onClick={resetAllFilters}
                    className="w-full py-2 text-xs font-semibold text-[#8C827A] hover:text-[#12100E] uppercase tracking-wider"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

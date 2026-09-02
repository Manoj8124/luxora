import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Star, Quote, ChevronRight, Shield, Award, HeartHandshake } from 'lucide-react';
import { Product, Category } from '../types.js';
import { api } from '../services/api.js';
import { ProductCard } from '../components/common/ProductCard.js';

interface HomePageProps {
  onNavigate: (route: string, param?: string) => void;
  onQuickView: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onQuickView }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        const [cats, prodsRes] = await Promise.all([
          api.getCategories(),
          api.getProducts({ limit: 40 })
        ]);

        setCategories(cats);

        const allProds = prodsRes.products;
        setNewArrivals(allProds.filter((p) => p.isNewArrival).slice(0, 8));
        setTrending(allProds.filter((p) => p.isTrending).slice(0, 8));
        setBestSellers(allProds.filter((p) => p.isBestSeller).slice(0, 6));
      } catch (err) {
        console.error('Failed loading home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const testimonials = [
    {
      id: 1,
      quote: "The Satin Draped Evening Dress is an architectural masterpiece. The weight of the silk and how it catches ambient light turned heads all evening.",
      author: "Camilla De Rossi",
      role: "Vogue Contributor & Stylist",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 2,
      quote: "Finally, a luxury label that respects tailoring precision. The Double-Breasted Wool Blazer has sharp, clean lines that rival Savile Row bespoke suits.",
      author: "Julian Sterling",
      role: "Creative Director",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 3,
      quote: "Impeccable packaging, seamless same-week delivery, and fabric textures that whisper effortless elegance. LUXORA is my permanent wardrobe staple.",
      author: "Aria Montgomery",
      role: "Verified Purchaser",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#12100E]">
        {/* Background Image with Cinematic Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85"
            alt="LUXORA Editorial Campaign"
            className="w-full h-full object-cover object-center opacity-60 scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12100E] via-[#12100E]/40 to-transparent" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#12100E]/30 to-[#12100E]/70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A97E] mb-6 shadow-lg"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Autumn / Winter Atelier Collection</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif tracking-tight text-4xl sm:text-6xl md:text-7xl font-normal leading-[1.08] text-white drop-shadow-sm max-w-4xl mx-auto"
          >
            Style That Speaks For You
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg md:text-xl text-[#FAF8F5]/85 font-light max-w-2xl mx-auto leading-relaxed"
          >
            Discover contemporary luxury designed for every moment. Sculptural silhouettes, pure silk satins, and tailored wools crafted to perfection.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
          >
            <button
              id="hero-btn-shop-women"
              onClick={() => onNavigate('shop', 'gender:women')}
              className="w-full sm:w-auto px-8 py-4 bg-[#FAF8F5] text-[#12100E] hover:bg-[#6D212F] hover:text-white rounded-xl text-xs font-semibold uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-2 group"
            >
              <span>Shop Women</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="hero-btn-shop-men"
              onClick={() => onNavigate('shop', 'gender:men')}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-xl text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
            >
              <span>Shop Men</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#E8E1D7]">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#6D212F]">
              Curated Wardrobe
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal font-serif text-[#12100E] mt-1">
              Shop by Category
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="mt-4 md:mt-0 text-xs font-semibold uppercase tracking-wider text-[#8C827A] hover:text-[#12100E] flex items-center gap-1.5 transition-colors group"
          >
            <span>Explore All Categories</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.slice(0, 8).map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('shop', cat.id)}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 bg-[#FAF8F5]"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
              
              <div className="absolute inset-x-4 bottom-5 text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#C8A97E] font-semibold block mb-0.5">
                  {cat.itemCount || 10}+ Silhouettes
                </span>
                <h3 className="text-lg sm:text-xl font-serif text-white font-normal group-hover:translate-x-1 transition-transform">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-[#FAF8F5]/80 font-light line-clamp-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {cat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. NEW ARRIVALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#E8E1D7]">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-semibold text-[#6D212F]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fresh Off The Runway</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-normal font-serif text-[#12100E] mt-1">
              New Arrivals
            </h2>
          </div>
          <button
            onClick={() => onNavigate('new-arrivals')}
            className="mt-4 md:mt-0 text-xs font-semibold uppercase tracking-wider text-[#12100E] hover:text-[#6D212F] flex items-center gap-1.5 transition-colors group"
          >
            <span>View All New Arrivals</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </section>

      {/* 4. PROMOTIONAL EDITORIAL CAMPAIGN BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#1E1B18] text-white shadow-2xl min-h-[480px] lg:min-h-[540px] flex items-center">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=80"
            alt="The New Season Edit"
            className="absolute inset-0 w-full h-full object-cover object-top opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#12100E] via-[#12100E]/70 to-transparent" />

          <div className="relative z-10 max-w-xl p-8 sm:p-12 lg:p-16 space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#C8A97E] block">
              Editorial Spotlight
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-normal leading-[1.15] text-white">
              THE NEW SEASON EDIT
            </h2>
            <p className="text-sm sm:text-base text-[#E8E1D7]/90 font-light leading-relaxed">
              "Elevate your everyday wardrobe with bespoke tailoring, understated cashmere layers, and radiant satin fluid drapes engineered for seamless confidence."
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('shop', 'tag:featured')}
                className="px-8 py-4 bg-[#6D212F] hover:bg-[#8B2C3C] text-white rounded-xl text-xs font-semibold uppercase tracking-[0.2em] transition-all shadow-lg flex items-center gap-2 group"
              >
                <span>Explore Capsule Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TRENDING NOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#E8E1D7]">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#6D212F]">
              Most Desired
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal font-serif text-[#12100E] mt-1">
              Trending Now
            </h2>
          </div>
          <button
            onClick={() => onNavigate('trending')}
            className="mt-4 md:mt-0 text-xs font-semibold uppercase tracking-wider text-[#12100E] hover:text-[#6D212F] flex items-center gap-1.5 transition-colors group"
          >
            <span>View All Trending</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {trending.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </section>

      {/* 6. BEST SELLERS */}
      <section className="bg-[#FAF8F5] py-16 border-y border-[#E8E1D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#E8E1D7]">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#6D212F]">
                Iconic Classics
              </span>
              <h2 className="text-3xl sm:text-4xl font-normal font-serif text-[#12100E] mt-1">
                Best Sellers
              </h2>
            </div>
            <button
              onClick={() => onNavigate('best-sellers')}
              className="mt-4 md:mt-0 text-xs font-semibold uppercase tracking-wider text-[#12100E] hover:text-[#6D212F] flex items-center gap-1.5 transition-colors group"
            >
              <span>View All Best Sellers</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {bestSellers.map((product, idx) => (
              <div
                key={product.id}
                onClick={() => onNavigate('product', product.slug || product.id)}
                className="group flex flex-col bg-white rounded-xl p-3 border border-[#E8E1D7] hover:border-[#12100E] hover:shadow-md transition-all cursor-pointer relative"
              >
                <div className="absolute top-2 left-2 z-10 w-6 h-6 rounded-full bg-[#12100E] text-[#C8A97E] text-xs font-bold flex items-center justify-center font-mono">
                  #{idx + 1}
                </div>
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-[#FAF8F5] mb-2.5">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="text-xs font-medium text-[#12100E] group-hover:text-[#6D212F] line-clamp-1 font-serif-luxury">
                  {product.name}
                </h4>
                <p className="text-xs font-bold text-[#12100E] mt-1">
                  ₹{product.price.toLocaleString()}
                </p>
                <span className="text-[10px] text-[#8C827A] mt-0.5">
                  {product.salesCount} sold this season
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. VERIFIED CUSTOMER REVIEWS / TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#6D212F]">
            Client Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal font-serif text-[#12100E] mt-1">
            Voices of the LUXORA Circle
          </h2>
          <p className="text-xs sm:text-sm text-[#8C827A] mt-2">
            Read authentic reviews from tastemakers, stylists, and collectors worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="p-8 rounded-2xl bg-white border border-[#E8E1D7] shadow-sm flex flex-col justify-between space-y-6 relative"
            >
              <Quote className="w-8 h-8 text-[#C8A97E]/30 absolute top-6 right-6" />
              <div className="space-y-4">
                <div className="flex text-[#C8A97E]">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-[#38332E] italic leading-relaxed font-light">
                  "{item.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#E8E1D7]/60">
                <img
                  src={item.avatar}
                  alt={item.author}
                  className="w-11 h-11 rounded-full object-cover border border-[#E8E1D7]"
                />
                <div>
                  <h4 className="text-sm font-semibold text-[#12100E]">{item.author}</h4>
                  <p className="text-xs text-[#8C827A]">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

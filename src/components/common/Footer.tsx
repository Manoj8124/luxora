import React, { useState } from 'react';
import { Mail, ArrowRight, Instagram, Facebook, Youtube, Shield, RefreshCw, Truck, Sparkles } from 'lucide-react';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';

interface FooterProps {
  onNavigate: (route: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const { success, error: toastError } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toastError('Please enter a valid email address');
      return;
    }
    try {
      setSubscribing(true);
      const res = await api.subscribeNewsletter(email);
      success(res.message || 'Thank you for joining the LUXORA Circle');
      setEmail('');
    } catch (err: any) {
      toastError(err.message || 'Subscription failed');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-[#12100E] text-[#FAF8F5] pt-16 pb-12 border-t border-white/10">
      {/* 1. Value Pillars Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-b border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-white/5 text-[#C8A97E]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wider uppercase text-white">Artisanal Craftsmanship</h4>
              <p className="text-xs text-[#E8E1D7]/60 mt-1 leading-relaxed">
                Hand-finished garments cut from 100% certified silk, pure cashmere, and European flax.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-white/5 text-[#C8A97E]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wider uppercase text-white">Complimentary Delivery</h4>
              <p className="text-xs text-[#E8E1D7]/60 mt-1 leading-relaxed">
                Free express insured shipping on all orders exceeding ₹3,000 across India and globally.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-white/5 text-[#C8A97E]">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wider uppercase text-white">14-Day Atelier Returns</h4>
              <p className="text-xs text-[#E8E1D7]/60 mt-1 leading-relaxed">
                Hassle-free doorstep exchanges and complimentary return pickup with full refunds.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-white/5 text-[#C8A97E]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wider uppercase text-white">Guaranteed Authenticity</h4>
              <p className="text-xs text-[#E8E1D7]/60 mt-1 leading-relaxed">
                Every silhouette is issued with a certified LUXORA provenance security tag.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Manifesto & Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <span className="font-serif tracking-[0.25em] text-3xl uppercase font-normal text-white">
                LUXORA
              </span>
              <p className="text-xs uppercase tracking-[0.35em] text-[#C8A97E] mt-1">
                Haute Couture & Ready-to-Wear
              </p>
            </div>
            <p className="text-sm text-[#E8E1D7]/70 font-light leading-relaxed max-w-sm">
              Discover contemporary luxury tailored for effortless elegance. Designed in our Milan and Mumbai ateliers for modern tastemakers worldwide.
            </p>

            {/* Newsletter Form */}
            <div className="pt-2">
              <p className="text-xs uppercase tracking-widest font-semibold text-white mb-2">
                Join the LUXORA Circle
              </p>
              <p className="text-xs text-[#E8E1D7]/60 mb-3">
                Receive private capsule previews, runway invitations, and ₹500 off your first purchase.
              </p>
              <form onSubmit={handleSubscribe} className="flex max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="bg-white/5 border border-white/15 rounded-l-lg px-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#C8A97E] flex-1"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="bg-[#6D212F] hover:bg-[#8B2C3C] text-white px-5 rounded-r-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  <span>{subscribing ? 'Joining...' : 'Subscribe'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Shop Columns */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#C8A97E] mb-5">Shop Catalog</h4>
            <ul className="space-y-3 text-xs text-[#E8E1D7]/80">
              <li>
                <button onClick={() => onNavigate('new-arrivals')} className="hover:text-white transition-colors">
                  New Arrivals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('trending')} className="hover:text-white transition-colors">
                  Trending Now
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('best-sellers')} className="hover:text-white transition-colors">
                  Best Sellers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'cat-dresses')} className="hover:text-white transition-colors">
                  Dresses & Gowns
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'cat-outerwear')} className="hover:text-white transition-colors">
                  Outerwear & Blazers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'cat-tops')} className="hover:text-white transition-colors">
                  Tops & Blouses
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'cat-bottoms')} className="hover:text-white transition-colors">
                  Trousers & Pants
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'cat-men')} className="hover:text-white transition-colors">
                  Men’s Collection
                </button>
              </li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#C8A97E] mb-5">Client Services</h4>
            <ul className="space-y-3 text-xs text-[#E8E1D7]/80">
              <li>
                <button onClick={() => onNavigate('track-order')} className="hover:text-white transition-colors">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Contact Concierge
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  Atelier Heritage
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Size Guide & Measurements
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Shipping & Customs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Returns & Exchanges
                </button>
              </li>
            </ul>
          </div>

          {/* Account & Connect */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#C8A97E] mb-5">Atelier & Legal</h4>
            <ul className="space-y-3 text-xs text-[#E8E1D7]/80">
              <li>
                <button onClick={() => onNavigate('account', 'profile')} className="hover:text-white transition-colors">
                  My Profile
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('account', 'orders')} className="hover:text-white transition-colors">
                  Order History
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wishlist')} className="hover:text-white transition-colors">
                  Saved Wishlist
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  Sustainability Pledge
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  Privacy & Cookie Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="pt-6 flex items-center space-x-3 text-[#E8E1D7]/70">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-full hover:text-white hover:bg-white/10 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-full hover:text-white hover:bg-white/10 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-full hover:text-white hover:bg-white/10 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Copyright & Payment Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E8E1D7]/50 gap-4">
        <p>© 2026 LUXORA Haute Couture Ltd. All rights reserved.</p>
        <div className="flex items-center space-x-3 text-[11px] font-mono tracking-wider text-[#C8A97E]">
          <span>VISA</span>
          <span>•</span>
          <span>MASTERCARD</span>
          <span>•</span>
          <span>UPI</span>
          <span>•</span>
          <span>AMEX</span>
          <span>•</span>
          <span>COD AVAILABLE</span>
        </div>
      </div>
    </footer>
  );
};

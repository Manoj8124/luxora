import React from 'react';
import { Sparkles, Award, Shield, HeartHandshake, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (route: string, param?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 sm:space-y-24">
      {/* 1. Atelier Manifesto Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#6D212F]">
          Atelier Heritage
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif text-[#12100E] leading-tight">
          Crafting Contemporary Elegance
        </h1>
        <p className="text-sm sm:text-base text-[#4A453E] leading-relaxed font-light">
          Founded on the uncompromising pursuit of sartorial excellence, LUXORA bridges the gap between historical haute couture discipline and modern ready-to-wear versatility.
        </p>
      </div>

      {/* 2. Visual Story Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl bg-[#FAF8F5]">
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80"
            alt="LUXORA Atelier Tailoring"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#C8A97E]">
            Pure Organic Provenance
          </span>
          <h2 className="text-3xl font-serif text-[#12100E]">
            Materiality Without Compromise
          </h2>
          <p className="text-xs sm:text-sm text-[#4A453E] leading-relaxed font-light">
            Every thread woven into a LUXORA silhouette is ethically sourced from generational mills across Como, Biella, and Lyon. From Grade-A mulberry silk to ultra-fine 15.5-micron Mongolian cashmere, our textiles undergo rigorous environmental certification.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E8E1D7]">
            <div>
              <p className="text-2xl font-serif font-bold text-[#12100E]">100%</p>
              <p className="text-xs text-[#8C827A]">Traceable Certified Fibers</p>
            </div>
            <div>
              <p className="text-2xl font-serif font-bold text-[#12100E]">Zero</p>
              <p className="text-xs text-[#8C827A]">Deadstock Waste Strategy</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Three Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-white border border-[#E8E1D7] shadow-sm space-y-4">
          <Award className="w-8 h-8 text-[#6D212F]" />
          <h3 className="text-lg font-serif text-[#12100E]">Master Craftsmanship</h3>
          <p className="text-xs text-[#4A453E] leading-relaxed">
            Each garment requires up to 36 hours of hand-cutting, steam molding, and bespoke seam finishing by master artisans.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-[#E8E1D7] shadow-sm space-y-4">
          <Shield className="w-8 h-8 text-[#6D212F]" />
          <h3 className="text-lg font-serif text-[#12100E]">Guaranteed Provenance</h3>
          <p className="text-xs text-[#4A453E] leading-relaxed">
            Every LUXORA purchase includes a unique serialized authenticity tag ensuring genuine couture fabrication and collector value.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-[#E8E1D7] shadow-sm space-y-4">
          <HeartHandshake className="w-8 h-8 text-[#6D212F]" />
          <h3 className="text-lg font-serif text-[#12100E]">Client Concierge</h3>
          <p className="text-xs text-[#4A453E] leading-relaxed">
            Personal stylists and atelier tailoring consultations available via video or in our Milan and Mumbai salons.
          </p>
        </div>
      </div>

      {/* 4. CTA Banner */}
      <div className="text-center py-12 px-6 rounded-3xl bg-[#12100E] text-white space-y-6">
        <h2 className="text-3xl font-serif text-white max-w-xl mx-auto">
          Experience the Art of Haute Ready-to-Wear
        </h2>
        <button
          onClick={() => onNavigate('shop')}
          className="px-8 py-3.5 bg-[#FAF8F5] text-[#12100E] hover:bg-[#6D212F] hover:text-white rounded-xl text-xs font-semibold uppercase tracking-widest transition-colors shadow-xl inline-flex items-center gap-2"
        >
          <span>Explore Current Capsule</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

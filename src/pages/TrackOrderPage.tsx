import React, { useState } from 'react';
import { Truck, Search, ArrowRight, Package, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api.js';
import { Order } from '../types.js';
import { useToast } from '../context/ToastContext.js';

interface TrackOrderPageProps {
  onNavigate: (route: string, param?: string) => void;
}

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const { error: toastError } = useToast();

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      setLoading(true);
      const fetched = await api.getOrderById(query.trim());
      setOrder(fetched);
    } catch (err: any) {
      toastError(err.message || 'Order or tracking number not found');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#6D212F]">
          Live Logistics Concierge
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#12100E]">
          Track Your Atelier Consignment
        </h1>
        <p className="text-xs text-[#8C827A] max-w-md mx-auto">
          Enter your Order ID (e.g. ord-101) or Tracking Number to monitor your delivery status in real time.
        </p>
      </div>

      <form onSubmit={handleTrack} className="flex gap-2 max-w-lg mx-auto">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8C827A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Order ID (e.g. ord-101)"
            className="w-full bg-[#FAF8F5] border border-[#E8E1D7] rounded-xl pl-10 pr-4 py-3 text-xs text-[#12100E] focus:bg-white focus:outline-none focus:border-[#12100E]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-[#12100E] hover:bg-[#6D212F] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-md disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Track'}
        </button>
      </form>

      {/* Demo helper */}
      <div className="text-center">
        <p className="text-[11px] text-[#8C827A]">
          Try searching demo order: <button type="button" onClick={() => setQuery('ord-101')} className="text-[#6D212F] underline font-mono">ord-101</button> or <button type="button" onClick={() => setQuery('ord-102')} className="text-[#6D212F] underline font-mono">ord-102</button>
        </p>
      </div>

      {order && (
        <div className="p-8 rounded-3xl bg-white border border-[#E8E1D7] shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#E8E1D7]">
            <div>
              <span className="text-xs text-[#8C827A]">Consignment Reference</span>
              <p className="text-lg font-mono font-bold text-[#12100E]">#{order.id}</p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              Status: {order.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[#8C827A] block">Courier Partner</span>
              <p className="font-semibold text-[#12100E]">BlueDart Apex Priority</p>
            </div>
            <div>
              <span className="text-[#8C827A] block">Waybill Tracking Number</span>
              <p className="font-mono font-semibold text-[#12100E]">{order.trackingNumber}</p>
            </div>
            <div>
              <span className="text-[#8C827A] block">Recipient Location</span>
              <p className="font-semibold text-[#12100E]">{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E8E1D7] flex justify-end">
            <button
              onClick={() => onNavigate('order-confirmation', order.id)}
              className="px-5 py-2.5 bg-[#12100E] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
            >
              <span>View Full Order Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

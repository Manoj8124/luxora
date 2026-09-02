import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Calendar,
  Clock,
  Download,
  ArrowRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Order } from '../types.js';
import { api } from '../services/api.js';

interface OrderConfirmationPageProps {
  orderId: string;
  onNavigate: (route: string, param?: string) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  orderId,
  onNavigate
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        const fetched = await api.getOrderById(orderId);
        setOrder(fetched);
      } catch (err) {
        console.error('Failed loading order:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="animate-pulse space-y-4">
          <div className="w-16 h-16 bg-[#E8E1D7] rounded-full mx-auto" />
          <div className="h-6 bg-[#E8E1D7] w-1/3 mx-auto rounded" />
          <div className="h-4 bg-[#E8E1D7] w-1/4 mx-auto rounded" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif text-[#12100E] mb-2">Order Not Found</h2>
        <p className="text-xs text-[#8C827A] mb-6">Could not retrieve order details for #{orderId}.</p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-2.5 bg-[#12100E] text-white rounded-xl text-xs font-semibold uppercase tracking-wider"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const steps = [
    { title: 'Order Confirmed', desc: 'Atelier received order', date: 'Just now', done: true },
    { title: 'Garment Inspection', desc: 'Hand finishing & packaging', date: 'Today', done: true },
    { title: 'Courier Dispatch', desc: 'Insured express transit', date: 'Tomorrow', done: order.status === 'shipped' || order.status === 'delivered' },
    { title: 'Delivered', desc: 'Direct to your residence', date: 'Within 2-4 days', done: order.status === 'delivered' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* 1. Success Splash Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#6D212F]">
          Acquisition Confirmed
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#12100E]">
          Thank You For Your Order
        </h1>
        <p className="text-xs sm:text-sm text-[#8C827A] max-w-md mx-auto">
          An invoice and live courier tracking confirmation have been dispatched to your email.
        </p>
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#FAF8F5] border border-[#E8E1D7] rounded-xl text-xs font-mono text-[#12100E] mt-2">
          <span>Order Reference: <strong>#{order.id}</strong></span>
          <span>•</span>
          <span>Tracking: <strong>{order.trackingNumber}</strong></span>
        </div>
      </div>

      {/* 2. Live Order Tracking Timeline */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E1D7] shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E1D7]">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#6D212F]" />
            <h2 className="text-base font-serif uppercase tracking-wider text-[#12100E]">
              Live Atelier Fulfillment Timeline
            </h2>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            {order.status}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="flex sm:flex-col items-start gap-3 sm:gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                  step.done
                    ? 'bg-[#12100E] text-white'
                    : 'bg-[#FAF8F5] text-[#8C827A] border border-[#E8E1D7]'
                }`}
              >
                {step.done ? '✓' : idx + 1}
              </div>
              <div>
                <p className="text-xs font-bold text-[#12100E]">{step.title}</p>
                <p className="text-[11px] text-[#8C827A]">{step.desc}</p>
                <p className="text-[10px] text-[#C8A97E] font-medium mt-0.5">{step.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Items & Pricing Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Items List */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8E1D7] shadow-sm space-y-4">
          <h3 className="text-sm font-serif uppercase tracking-wider text-[#12100E] pb-3 border-b border-[#E8E1D7]">
            Acquired Garments ({order.items.length})
          </h3>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-3 text-xs">
                <img
                  src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80'}
                  alt=""
                  className="w-14 h-18 rounded-lg object-cover bg-[#FAF8F5] shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-[#12100E] line-clamp-1">{item.product?.name}</h4>
                    <p className="text-[11px] text-[#8C827A]">
                      Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-[#12100E]">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#E8E1D7] space-y-1.5 text-xs text-[#4A453E]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{order.subtotal.toLocaleString()}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-[#6D212F]">
                <span>Promo Savings</span>
                <span>-₹{order.discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{order.shippingFee === 0 ? 'COMPLIMENTARY' : `₹${order.shippingFee}`}</span>
            </div>
            <div className="flex justify-between">
              <span>GST Taxes</span>
              <span>₹{order.taxAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#12100E] pt-2 border-t border-[#E8E1D7]">
              <span>Grand Total</span>
              <span>₹{order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Info */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8E1D7] shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-serif uppercase tracking-wider text-[#12100E] pb-3 border-b border-[#E8E1D7] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#6D212F]" />
              <span>Shipping Address</span>
            </h3>
            <div className="mt-3 text-xs text-[#4A453E] space-y-1">
              <p className="font-bold text-[#12100E]">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p className="text-[#8C827A] pt-1">Contact: {order.shippingAddress.phone}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-serif uppercase tracking-wider text-[#12100E] pb-3 border-b border-[#E8E1D7]">
              Payment Information
            </h3>
            <div className="mt-3 text-xs text-[#4A453E] space-y-1">
              <p>Method: <strong>{order.paymentMethod}</strong></p>
              <p>Status: <strong className="text-emerald-700 capitalize">{order.paymentStatus}</strong></p>
              <p className="text-[#8C827A]">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={() => onNavigate('shop')}
          className="w-full sm:w-auto px-8 py-3.5 bg-[#12100E] hover:bg-[#6D212F] text-white rounded-xl text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-md"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => onNavigate('account', 'orders')}
          className="w-full sm:w-auto px-8 py-3.5 bg-[#FAF8F5] hover:bg-white border border-[#E8E1D7] text-[#12100E] rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          View All My Orders
        </button>
      </div>
    </div>
  );
};

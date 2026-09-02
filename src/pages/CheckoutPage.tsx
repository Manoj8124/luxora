import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  MapPin,
  CheckCircle2,
  Lock,
  ArrowRight,
  Plus,
  QrCode,
  Banknote,
  Building2,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { Address, Order } from '../types.js';
import { api } from '../services/api.js';
import { useCart } from '../context/CartContext.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';

interface CheckoutPageProps {
  onNavigate: (route: string, param?: string) => void;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate, onOrderPlaced }) => {
  const {
    items,
    itemCount,
    subtotal,
    discountAmount,
    couponCode,
    shippingFee,
    taxAmount,
    totalAmount,
    clearCart
  } = useCart();
  const { user, openAuthModal } = useAuth();
  const { success, error: toastError } = useToast();

  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  // New Address Form State
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<'express' | 'priority'>('express');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod' | 'netbanking'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [cardHolder, setCardHolder] = useState(user?.name || 'Aria Montgomery');
  const [upiId, setUpiId] = useState('aria@oksbi');

  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      setSavedAddresses(user.addresses);
      const def = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setSelectedAddressId(def.id);
    } else {
      setIsAddingNewAddress(true);
    }
  }, [user]);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E8E1D7] flex items-center justify-center text-[#8C827A] mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif text-[#12100E] mb-2">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-[#8C827A] mb-6">Add garments from the catalog before proceeding to checkout.</p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-2.5 bg-[#12100E] text-white rounded-xl text-xs font-semibold uppercase tracking-wider"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }

    let shippingAddress: Address;
    if (isAddingNewAddress) {
      if (!fullName || !phone || !street || !city || !state || !postalCode) {
        toastError('Please complete all shipping address fields');
        return;
      }
      shippingAddress = {
        id: `addr-${Date.now()}`,
        fullName,
        phone,
        street,
        city,
        state,
        postalCode,
        country,
        isDefault: false
      };
    } else {
      const found = savedAddresses.find((a) => a.id === selectedAddressId);
      if (!found) {
        toastError('Please select a delivery address');
        return;
      }
      shippingAddress = found;
    }

    try {
      setPlacingOrder(true);
      const newOrder = await api.createOrder({
        shippingAddress,
        paymentMethod: paymentMethod === 'card' ? 'Credit / Debit Card' : paymentMethod === 'upi' ? 'UPI Instant Pay' : paymentMethod === 'cod' ? 'Cash on Delivery' : 'Net Banking',
        couponCode: couponCode || undefined,
        notes: `Shipping Method: ${shippingMethod === 'express' ? 'Complimentary Express Atelier' : 'Next-Day White Glove'}`
      });

      await clearCart();
      success('Order placed successfully! Thank you for choosing LUXORA.');
      onOrderPlaced(newOrder);
      onNavigate('order-confirmation', newOrder.id);
    } catch (err: any) {
      toastError(err.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 pb-4 border-b border-[#E8E1D7] flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#6D212F]">
            Secure Atelier Checkout
          </span>
          <h1 className="text-3xl font-serif text-[#12100E] mt-1">Finalize Your Acquisition</h1>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full font-medium">
          <Lock className="w-3.5 h-3.5" />
          <span>256-Bit SSL Encrypted</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Side: Steps (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Step 1: Shipping Address */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E8E1D7] shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#12100E] text-white flex items-center justify-center text-xs font-bold font-mono">
                  1
                </div>
                <h2 className="text-lg font-serif text-[#12100E]">Delivery Destination</h2>
              </div>

              {savedAddresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}
                  className="text-xs text-[#6D212F] font-semibold flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingNewAddress ? 'Use Saved Address' : 'Add New Address'}</span>
                </button>
              )}
            </div>

            {/* Saved addresses selector */}
            {!isAddingNewAddress && savedAddresses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {savedAddresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      selectedAddressId === addr.id
                        ? 'border-[#6D212F] bg-[#6D212F]/5'
                        : 'border-[#E8E1D7] hover:border-[#12100E]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="selectedAddress"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="accent-[#6D212F]"
                        />
                        <span className="text-xs font-bold text-[#12100E]">{addr.fullName}</span>
                      </div>
                      {addr.isDefault && (
                        <span className="text-[10px] bg-[#FAF8F5] text-[#8C827A] px-2 py-0.5 rounded border border-[#E8E1D7]">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#4A453E] mt-2 leading-relaxed">
                      {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                    </p>
                    <p className="text-[11px] text-[#8C827A] mt-1">{addr.phone}</p>
                  </label>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                    Recipient Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Aria Montgomery"
                    className="w-full bg-[#FAF8F5] border border-[#E8E1D7] rounded-xl px-4 py-2.5 text-xs text-[#12100E] focus:bg-white focus:outline-none focus:border-[#12100E]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#FAF8F5] border border-[#E8E1D7] rounded-xl px-4 py-2.5 text-xs text-[#12100E] focus:bg-white focus:outline-none focus:border-[#12100E]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                    Street Address & Apartment/Suite
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Penthouse 4B, 18 Palais Royale, Worli"
                    className="w-full bg-[#FAF8F5] border border-[#E8E1D7] rounded-xl px-4 py-2.5 text-xs text-[#12100E] focus:bg-white focus:outline-none focus:border-[#12100E]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Mumbai"
                    className="w-full bg-[#FAF8F5] border border-[#E8E1D7] rounded-xl px-4 py-2.5 text-xs text-[#12100E] focus:bg-white focus:outline-none focus:border-[#12100E]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                    State / Province
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Maharashtra"
                    className="w-full bg-[#FAF8F5] border border-[#E8E1D7] rounded-xl px-4 py-2.5 text-xs text-[#12100E] focus:bg-white focus:outline-none focus:border-[#12100E]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                    Postal PIN Code
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="400018"
                    className="w-full bg-[#FAF8F5] border border-[#E8E1D7] rounded-xl px-4 py-2.5 text-xs text-[#12100E] focus:bg-white focus:outline-none focus:border-[#12100E]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E1D7] rounded-xl px-4 py-2.5 text-xs text-[#12100E] focus:bg-white focus:outline-none focus:border-[#12100E]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Delivery Method */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E8E1D7] shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#12100E] text-white flex items-center justify-center text-xs font-bold font-mono">
                2
              </div>
              <h2 className="text-lg font-serif text-[#12100E]">Shipping Method</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  shippingMethod === 'express'
                    ? 'border-[#6D212F] bg-[#6D212F]/5'
                    : 'border-[#E8E1D7] hover:border-[#12100E]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="accent-[#6D212F]"
                    />
                    <span className="text-xs font-bold text-[#12100E]">Complimentary Atelier Express</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-800">FREE</span>
                </div>
                <p className="text-[11px] text-[#8C827A] mt-1 ml-5">Delivered in 2-4 business days with insured signature.</p>
              </label>

              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  shippingMethod === 'priority'
                    ? 'border-[#6D212F] bg-[#6D212F]/5'
                    : 'border-[#E8E1D7] hover:border-[#12100E]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === 'priority'}
                      onChange={() => setShippingMethod('priority')}
                      className="accent-[#6D212F]"
                    />
                    <span className="text-xs font-bold text-[#12100E]">Next-Day White Glove</span>
                  </div>
                  <span className="text-xs font-bold text-[#12100E]">₹499</span>
                </div>
                <p className="text-[11px] text-[#8C827A] mt-1 ml-5">Guaranteed next-day priority courier in luxury box.</p>
              </label>
            </div>
          </div>

          {/* Step 3: Payment Options */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E8E1D7] shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#12100E] text-white flex items-center justify-center text-xs font-bold font-mono">
                3
              </div>
              <h2 className="text-lg font-serif text-[#12100E]">Payment Method</h2>
            </div>

            {/* Payment Method Selector Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'card', label: 'Credit Card', icon: CreditCard },
                { id: 'upi', label: 'UPI / QR', icon: QrCode },
                { id: 'netbanking', label: 'Net Banking', icon: Building2 },
                { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
              ].map((pm) => {
                const Icon = pm.icon;
                const isSelected = paymentMethod === pm.id;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                      isSelected
                        ? 'border-[#12100E] bg-[#12100E] text-white shadow-sm'
                        : 'border-[#E8E1D7] bg-[#FAF8F5] text-[#1E1B18] hover:border-[#12100E]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-semibold">{pm.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Method specific inputs */}
            {paymentMethod === 'card' && (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E1D7] rounded-xl px-4 py-2.5 text-xs text-[#12100E] focus:outline-none focus:border-[#12100E]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E1D7] rounded-xl px-4 py-2.5 text-xs text-[#12100E] focus:outline-none focus:border-[#12100E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E1D7] rounded-xl px-4 py-2.5 text-xs text-[#12100E] focus:outline-none focus:border-[#12100E]"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="space-y-3 pt-2">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18]">
                  Enter Virtual Payment Address (UPI ID)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="username@okhdfcbank"
                  className="w-full bg-[#FAF8F5] border border-[#E8E1D7] rounded-xl px-4 py-2.5 text-xs text-[#12100E] focus:outline-none focus:border-[#12100E]"
                />
                <p className="text-[11px] text-[#8C827A]">
                  You will receive a collection request on your Google Pay / PhonePe / Paytm app.
                </p>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E1D7] text-xs text-[#4A453E] space-y-1">
                <p className="font-semibold text-[#12100E]">Cash on Delivery Available:</p>
                <p>Pay upon arrival to the courier agent. Please keep exact cash ready.</p>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="space-y-3 pt-2">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18]">
                  Select Your Bank
                </label>
                <select className="w-full bg-[#FAF8F5] border border-[#E8E1D7] rounded-xl px-4 py-2.5 text-xs text-[#12100E]">
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>State Bank of India</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Order Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#E8E1D7] shadow-sm space-y-6 sticky top-24">
            <h3 className="text-base font-serif uppercase tracking-wider text-[#12100E] pb-3 border-b border-[#E8E1D7]">
              Order Summary ({itemCount} {itemCount === 1 ? 'Item' : 'Items'})
            </h3>

            {/* Items list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 text-xs">
                  <img
                    src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80'}
                    alt=""
                    className="w-12 h-16 rounded-lg object-cover bg-[#FAF8F5] shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-semibold text-[#12100E] line-clamp-1">{item.product?.name}</p>
                      <p className="text-[11px] text-[#8C827A]">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-[#12100E]">
                      ₹{((item.price || item.product?.price || 0) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 pt-4 border-t border-[#E8E1D7] text-xs text-[#4A453E]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#12100E]">₹{subtotal.toLocaleString()}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#6D212F]">
                  <span>Promo Code ({couponCode})</span>
                  <span className="font-semibold">-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Atelier Shipping</span>
                <span className="font-semibold text-emerald-800">
                  {shippingFee === 0 ? 'COMPLIMENTARY' : `₹${shippingFee}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Taxes (GST 5%)</span>
                <span>₹{taxAmount.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-base font-bold text-[#12100E] pt-3 border-t border-[#E8E1D7]">
                <span>Total Amount</span>
                <span>₹{(totalAmount + (shippingMethod === 'priority' ? 499 : 0)).toLocaleString()}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              id="btn-confirm-place-order"
              type="submit"
              disabled={placingOrder}
              className="w-full py-4 bg-[#12100E] hover:bg-[#6D212F] text-white rounded-xl text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50"
            >
              <span>{placingOrder ? 'Confirming Acquisition...' : 'Authorize & Place Order'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#8C827A]">
              <ShieldCheck className="w-4 h-4 text-[#C8A97E]" />
              <span>Complimentary Returns within 14 Days</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

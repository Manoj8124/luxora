import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  User as UserIcon,
  Package,
  MapPin,
  Heart,
  LogOut,
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle2,
  Truck,
  ArrowRight
} from 'lucide-react';
import { User, Order, Address } from '../types.js';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';

interface AccountPageProps {
  initialTab?: string;
  onNavigate: (route: string, param?: string) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ initialTab = 'profile', onNavigate }) => {
  const { user, isAdmin, logout, updateProfile } = useAuth();
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>(
    (initialTab as any) || 'profile'
  );

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  // Profile Edit State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // New Address State
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrPin, setAddrPin] = useState('');

  useEffect(() => {
    if (initialTab && ['profile', 'orders', 'addresses'].includes(initialTab)) {
      setActiveTab(initialTab as any);
    }
  }, [initialTab]);

  useEffect(() => {
    if (activeTab === 'orders') {
      async function loadOrders() {
        try {
          setLoadingOrders(true);
          const data = await api.getMyOrders();
          setOrders(data);
        } catch (err) {
          console.error('Failed loading orders:', err);
        } finally {
          setLoadingOrders(false);
        }
      }
      loadOrders();
    } else if (activeTab === 'addresses') {
      async function loadAddresses() {
        try {
          setLoadingAddresses(true);
          const data = await api.getAddresses();
          setAddresses(data);
        } catch (err) {
          console.error('Failed loading addresses:', err);
        } finally {
          setLoadingAddresses(false);
        }
      }
      loadAddresses();
    }
  }, [activeTab]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif text-[#12100E] mb-2">Please Sign In</h2>
        <p className="text-xs text-[#8C827A] mb-6">Sign in to access your orders, profile, and saved addresses.</p>
        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-2.5 bg-[#12100E] text-white rounded-xl text-xs font-semibold uppercase tracking-wider"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdatingProfile(true);
      await updateProfile({ name, phone });
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrName || !addrPhone || !addrStreet || !addrCity || !addrState || !addrPin) {
      toastError('Please fill in all address fields');
      return;
    }
    try {
      const newAddr = await api.addAddress({
        fullName: addrName,
        phone: addrPhone,
        street: addrStreet,
        city: addrCity,
        state: addrState,
        postalCode: addrPin,
        country: 'India',
        isDefault: addresses.length === 0
      });
      setAddresses((prev) => [...prev, newAddr]);
      setShowAddAddress(false);
      setAddrName('');
      setAddrPhone('');
      setAddrStreet('');
      setAddrCity('');
      setAddrState('');
      setAddrPin('');
      success('New address added to your address book');
    } catch (err: any) {
      toastError(err.message || 'Failed adding address');
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await api.deleteAddress(addressId);
      setAddresses((prev) => prev.filter((a) => a.id !== addressId));
      success('Address removed');
    } catch (err: any) {
      toastError(err.message || 'Failed deleting address');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 pb-4 border-b border-[#E8E1D7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#6D212F]">
            Client Atelier
          </span>
          <h1 className="text-3xl font-serif text-[#12100E] mt-1">My Account</h1>
        </div>
        {isAdmin && (
          <button
            onClick={() => onNavigate('admin')}
            className="px-4 py-2 bg-[#6D212F] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 self-start"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Open Admin Suite</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-3 space-y-2 bg-white p-4 rounded-2xl border border-[#E8E1D7]">
          <div className="flex items-center gap-3 p-3 bg-[#FAF8F5] rounded-xl mb-4">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
              alt={user.name}
              className="w-11 h-11 rounded-full object-cover border border-[#E8E1D7]"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-[#12100E] truncate">{user.name}</p>
              <p className="text-[11px] text-[#8C827A] truncate">{user.email}</p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-colors ${
              activeTab === 'profile'
                ? 'bg-[#12100E] text-white'
                : 'text-[#4A453E] hover:bg-[#FAF8F5]'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profile Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-colors ${
              activeTab === 'orders'
                ? 'bg-[#12100E] text-white'
                : 'text-[#4A453E] hover:bg-[#FAF8F5]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-colors ${
              activeTab === 'addresses'
                ? 'bg-[#12100E] text-white'
                : 'text-[#4A453E] hover:bg-[#FAF8F5]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses</span>
          </button>

          <button
            onClick={() => onNavigate('wishlist')}
            className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-3 text-[#4A453E] hover:bg-[#FAF8F5] transition-colors"
          >
            <Heart className="w-4 h-4" />
            <span>My Wishlist</span>
          </button>

          <div className="pt-4 border-t border-[#E8E1D7] mt-4">
            <button
              onClick={logout}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E1D7] shadow-sm">
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-xl">
              <h2 className="text-xl font-serif text-[#12100E]">Profile Details</h2>
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E1D7] rounded-xl px-4 py-2.5 text-xs text-[#12100E] focus:bg-white focus:outline-none focus:border-[#12100E]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                    Email Address (Registered)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full bg-[#FAF8F5]/50 border border-[#E8E1D7] rounded-xl px-4 py-2.5 text-xs text-[#8C827A] cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#FAF8F5] border border-[#E8E1D7] rounded-xl px-4 py-2.5 text-xs text-[#12100E] focus:bg-white focus:outline-none focus:border-[#12100E]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updatingProfile}
                  className="px-6 py-3 bg-[#12100E] text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-[#6D212F] transition-colors"
                >
                  {updatingProfile ? 'Saving Changes...' : 'Save Profile'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-xl font-serif text-[#12100E]">Order History</h2>
              {loadingOrders ? (
                <p className="text-xs text-[#8C827A]">Loading your orders...</p>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center">
                  <Package className="w-10 h-10 text-[#8C827A] mx-auto mb-2 stroke-1" />
                  <p className="text-base font-serif text-[#12100E]">No orders placed yet</p>
                  <p className="text-xs text-[#8C827A] mb-4">Explore our runway capsules to place your first acquisition.</p>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="px-5 py-2 bg-[#12100E] text-white rounded-xl text-xs font-semibold uppercase tracking-wider"
                  >
                    Shop Collection
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-5 rounded-2xl border border-[#E8E1D7] bg-[#FAF8F5]/60 space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E8E1D7]">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-bold text-[#12100E]">#{ord.id}</span>
                          <span className="text-[11px] text-[#8C827A]">
                            {new Date(ord.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider bg-[#6D212F] text-white px-2.5 py-0.5 rounded-full">
                          {ord.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="flex gap-2.5 text-xs">
                              <img
                                src={it.product?.images?.[0] || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80'}
                                alt=""
                                className="w-10 h-12 rounded object-cover bg-white shrink-0"
                              />
                              <div>
                                <p className="font-semibold text-[#12100E] line-clamp-1">{it.product?.name}</p>
                                <p className="text-[10px] text-[#8C827A]">
                                  Size: {it.size} • Qty: {it.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col justify-between sm:items-end text-xs">
                          <div>
                            <p className="text-[#8C827A]">Total Amount Paid</p>
                            <p className="text-base font-bold text-[#12100E]">₹{ord.totalAmount.toLocaleString()}</p>
                          </div>
                          <button
                            onClick={() => onNavigate('order-confirmation', ord.id)}
                            className="mt-3 sm:mt-0 text-xs text-[#6D212F] font-semibold hover:underline flex items-center gap-1"
                          >
                            <span>View Live Tracking & Receipt</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-serif text-[#12100E]">Address Book</h2>
                <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="px-4 py-2 bg-[#12100E] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showAddAddress ? 'Cancel' : 'Add New Address'}</span>
                </button>
              </div>

              {/* Add form */}
              {showAddAddress && (
                <form onSubmit={handleAddAddress} className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D7] space-y-4">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-[#12100E]">New Address</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={addrName}
                      onChange={(e) => setAddrName(e.target.value)}
                      className="bg-white border border-[#E8E1D7] rounded-xl px-3 py-2 text-xs"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number"
                      value={addrPhone}
                      onChange={(e) => setAddrPhone(e.target.value)}
                      className="bg-white border border-[#E8E1D7] rounded-xl px-3 py-2 text-xs"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Street & Apartment"
                      value={addrStreet}
                      onChange={(e) => setAddrStreet(e.target.value)}
                      className="sm:col-span-2 bg-white border border-[#E8E1D7] rounded-xl px-3 py-2 text-xs"
                    />
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      className="bg-white border border-[#E8E1D7] rounded-xl px-3 py-2 text-xs"
                    />
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={addrState}
                      onChange={(e) => setAddrState(e.target.value)}
                      className="bg-white border border-[#E8E1D7] rounded-xl px-3 py-2 text-xs"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Postal PIN Code"
                      value={addrPin}
                      onChange={(e) => setAddrPin(e.target.value)}
                      className="bg-white border border-[#E8E1D7] rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#6D212F] text-white rounded-xl text-xs font-semibold uppercase tracking-wider"
                  >
                    Save to Address Book
                  </button>
                </form>
              )}

              {/* Saved addresses grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.length === 0 ? (
                  <p className="text-xs text-[#8C827A] col-span-2">No saved addresses yet. Click "Add New Address" above.</p>
                ) : (
                  addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-5 rounded-2xl border border-[#E8E1D7] bg-[#FAF8F5]/60 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-[#12100E]">{addr.fullName}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-[#12100E] text-white px-2 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#4A453E] leading-relaxed">
                          {addr.street || addr.addressLine1}, {addr.city}, {addr.state} - {addr.postalCode}
                        </p>
                        <p className="text-[11px] text-[#8C827A] mt-1">{addr.phone || addr.phoneNumber}</p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-[#E8E1D7] flex justify-end">
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-xs text-red-600 hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

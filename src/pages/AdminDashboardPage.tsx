import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';
import { Product, Order, Category } from '../types.js';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';

interface AdminDashboardPageProps {
  onNavigate: (route: string, param?: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { user, isAdmin, loginDemo } = useAuth();
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'analytics'>('products');
  const [analytics, setAnalytics] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [productSearch, setProductSearch] = useState('');

  // Add / Edit Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form Fields
  const [pName, setPName] = useState('');
  const [pBrand, setPBrand] = useState('LUXORA Atelier');
  const [pCategory, setPCategory] = useState('cat-dresses');
  const [pGender, setPGender] = useState<'women' | 'men' | 'unisex'>('women');
  const [pPrice, setPPrice] = useState('12500');
  const [pOriginalPrice, setPOriginalPrice] = useState('18000');
  const [pDiscount, setPDiscount] = useState('30');
  const [pStock, setPStock] = useState('15');
  const [pDescription, setPDescription] = useState('');
  const [pMaterials, setPMaterials] = useState('100% Mulberry Silk, Silk Charmeuse');
  const [pCare, setPCare] = useState('Specialist dry clean only. Store in breathable garment bag.');
  const [pImages, setPImages] = useState('https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=85');
  const [pSizes, setPSizes] = useState('XS, S, M, L');

  const loadData = async () => {
    try {
      setLoading(true);
      const [stats, prodsRes, cats, ords] = await Promise.all([
        api.getAdminAnalytics(),
        api.getProducts({ limit: 100 }),
        api.getCategories(),
        api.getAdminOrders()
      ]);
      setAnalytics(stats);
      setProducts(prodsRes.products);
      setCategories(cats);
      setOrders(ords);
    } catch (err) {
      console.error('Failed loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!user || !isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#6D212F]/10 text-[#6D212F] flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif text-[#12100E]">Atelier Admin Access Required</h2>
        <p className="text-xs text-[#8C827A]">
          You are currently not signed in with administrator credentials. Click below for 1-click demo access.
        </p>
        <button
          onClick={() => loginDemo('admin')}
          className="w-full py-3 bg-[#12100E] hover:bg-[#6D212F] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-md"
        >
          Sign In as Eleanor Vance (Admin)
        </button>
      </div>
    );
  }

  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setPName('');
    setPBrand('LUXORA Atelier');
    setPCategory(categories[0]?.id || 'cat-dresses');
    setPGender('women');
    setPPrice('12500');
    setPOriginalPrice('18000');
    setPDiscount('30');
    setPStock('15');
    setPDescription('Hand-finished garment tailored with exquisite precision in our atelier.');
    setPMaterials('100% Certified Mulberry Silk, French Jacquard');
    setPCare('Specialist dry clean only. Store in breathable garment bag.');
    setPImages('https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=85');
    setPSizes('XS, S, M, L, XL');
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProductId(p.id);
    setPName(p.name);
    setPBrand(p.brand);
    setPCategory(p.categoryId);
    setPGender(p.gender);
    setPPrice(p.price.toString());
    setPOriginalPrice(p.originalPrice.toString());
    setPDiscount(p.discount.toString());
    setPStock(p.stock.toString());
    setPDescription(p.description);
    setPMaterials(p.materials.join(', '));
    setPCare(p.careInstructions || '');
    setPImages(p.images.join(', '));
    setPSizes(p.sizes.join(', '));
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const productPayload = {
      name: pName,
      brand: pBrand,
      categoryId: pCategory,
      category: categories.find((c) => c.id === pCategory)?.name || 'Dresses',
      gender: pGender,
      price: parseFloat(pPrice) || 0,
      originalPrice: parseFloat(pOriginalPrice) || parseFloat(pPrice),
      discount: parseInt(pDiscount) || 0,
      stock: parseInt(pStock) || 10,
      description: pDescription,
      materials: pMaterials.split(',').map((s) => s.trim()).filter(Boolean),
      careInstructions: pCare,
      images: pImages.split(',').map((s) => s.trim()).filter(Boolean),
      sizes: pSizes.split(',').map((s) => s.trim()).filter(Boolean),
      colors: [
        { name: 'Noir Black', hex: '#12100E' },
        { name: 'Burgundy Crimson', hex: '#6D212F' },
        { name: 'Champagne Gold', hex: '#C8A97E' }
      ]
    };

    try {
      if (editingProductId) {
        await api.updateAdminProduct(editingProductId, productPayload);
        success(`Product "${pName}" updated successfully`);
      } else {
        await api.createAdminProduct(productPayload);
        success(`New silhouette "${pName}" added to catalog`);
      }
      setIsProductModalOpen(false);
      loadData();
    } catch (err: any) {
      toastError(err.message || 'Failed saving product');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to retire "${name}" from the catalog?`)) return;
    try {
      await api.deleteAdminProduct(id);
      success(`Silhouette removed from active inventory`);
      loadData();
    } catch (err: any) {
      toastError(err.message || 'Failed deleting product');
    }
  };

  const handleOrderStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await api.updateAdminOrderStatus(orderId, newStatus);
      success(`Order #${orderId} marked as ${newStatus}`);
      loadData();
    } catch (err: any) {
      toastError(err.message || 'Failed updating status');
    }
  };

  const filteredProducts = products.filter((p) => {
    if (!productSearch.trim()) return true;
    const q = productSearch.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. Header */}
      <div className="pb-4 border-b border-[#E8E1D7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-semibold text-[#6D212F]">
            <ShieldCheck className="w-4 h-4" />
            <span>LUXORA Administrative Suite</span>
          </div>
          <h1 className="text-3xl font-serif text-[#12100E] mt-1">Atelier Business Dashboard</h1>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-[#12100E] hover:bg-[#6D212F] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Silhouette</span>
        </button>
      </div>

      {/* 2. Key Metrics Cards */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-2xl bg-white border border-[#E8E1D7] shadow-sm space-y-1">
            <div className="flex items-center justify-between text-[#8C827A]">
              <span className="text-xs uppercase tracking-wider font-semibold">Total Revenue</span>
              <DollarSign className="w-4 h-4 text-[#6D212F]" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[#12100E]">
              ₹{analytics.totalRevenue.toLocaleString()}
            </p>
            <p className="text-[11px] text-emerald-700 font-medium">+18.4% vs last month</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E8E1D7] shadow-sm space-y-1">
            <div className="flex items-center justify-between text-[#8C827A]">
              <span className="text-xs uppercase tracking-wider font-semibold">Total Orders</span>
              <ShoppingBag className="w-4 h-4 text-[#6D212F]" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[#12100E]">
              {analytics.totalOrders}
            </p>
            <p className="text-[11px] text-[#8C827A]">Real-time live count</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E8E1D7] shadow-sm space-y-1">
            <div className="flex items-center justify-between text-[#8C827A]">
              <span className="text-xs uppercase tracking-wider font-semibold">Catalog Inventory</span>
              <Package className="w-4 h-4 text-[#6D212F]" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[#12100E]">
              {analytics.totalProducts}
            </p>
            <p className="text-[11px] text-[#8C827A]">Active silhouettes</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E8E1D7] shadow-sm space-y-1">
            <div className="flex items-center justify-between text-[#8C827A]">
              <span className="text-xs uppercase tracking-wider font-semibold">Average Order (AOV)</span>
              <TrendingUp className="w-4 h-4 text-[#6D212F]" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[#12100E]">
              ₹{analytics.averageOrderValue.toLocaleString()}
            </p>
            <p className="text-[11px] text-emerald-700 font-medium">High luxury index</p>
          </div>
        </div>
      )}

      {/* 3. Navigation Tabs */}
      <div className="flex border-b border-[#E8E1D7] space-x-6 text-xs uppercase tracking-widest font-semibold">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'products' ? 'text-[#6D212F] font-bold' : 'text-[#8C827A] hover:text-[#12100E]'
          }`}
        >
          <span>Catalog Management ({products.length})</span>
          {activeTab === 'products' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6D212F]" />}
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'orders' ? 'text-[#6D212F] font-bold' : 'text-[#8C827A] hover:text-[#12100E]'
          }`}
        >
          <span>Order Fulfillment ({orders.length})</span>
          {activeTab === 'orders' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6D212F]" />}
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'analytics' ? 'text-[#6D212F] font-bold' : 'text-[#8C827A] hover:text-[#12100E]'
          }`}
        >
          <span>Sales & Top Performers</span>
          {activeTab === 'analytics' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6D212F]" />}
        </button>
      </div>

      {/* 4. Tab 1: Product Catalog Table */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-sm flex-1">
              <Search className="w-4 h-4 text-[#8C827A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products by title, category..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#E8E1D7] rounded-xl text-xs text-[#12100E] focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-2xl border border-[#E8E1D7] shadow-sm">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF8F5] border-b border-[#E8E1D7] text-[#8C827A] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Silhouette</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Gender</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Sales</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E1D7]">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt=""
                        className="w-10 h-12 rounded object-cover bg-[#FAF8F5] shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-[#12100E] line-clamp-1">{p.name}</p>
                        <p className="text-[10px] text-[#8C827A]">{p.brand}</p>
                      </div>
                    </td>
                    <td className="p-4 text-[#4A453E] capitalize">{p.category}</td>
                    <td className="p-4 text-[#4A453E] capitalize">{p.gender}</td>
                    <td className="p-4 font-bold text-[#12100E]">₹{p.price.toLocaleString()}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.stock <= 5
                            ? 'bg-red-100 text-red-700'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {p.stock} in stock
                      </span>
                    </td>
                    <td className="p-4 text-[#8C827A]">{p.salesCount} sold</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-1.5 hover:text-[#6D212F] transition-colors"
                        title="Edit product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="p-1.5 hover:text-red-600 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Tab 2: Orders Management */}
      {activeTab === 'orders' && (
        <div className="overflow-x-auto bg-white rounded-2xl border border-[#E8E1D7] shadow-sm">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF8F5] border-b border-[#E8E1D7] text-[#8C827A] uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E1D7]">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                  <td className="p-4 font-mono font-bold text-[#12100E]">#{ord.id}</td>
                  <td className="p-4">
                    <p className="font-semibold text-[#12100E]">{ord.shippingAddress?.fullName || 'Client'}</p>
                    <p className="text-[10px] text-[#8C827A]">{ord.shippingAddress?.city}</p>
                  </td>
                  <td className="p-4 font-bold text-[#12100E]">₹{ord.totalAmount.toLocaleString()}</td>
                  <td className="p-4">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={ord.status}
                      onChange={(e) => handleOrderStatusUpdate(ord.id, e.target.value)}
                      className="bg-[#FAF8F5] border border-[#E8E1D7] rounded-lg px-2.5 py-1 text-xs font-semibold text-[#12100E]"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing in Atelier</option>
                      <option value="shipped">Shipped via Courier</option>
                      <option value="delivered">Delivered to Client</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4 text-[#8C827A]">
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 6. Tab 3: Sales Analytics & Top Sellers */}
      {activeTab === 'analytics' && analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-3xl bg-white border border-[#E8E1D7] shadow-sm space-y-4">
            <h3 className="text-base font-serif text-[#12100E] pb-3 border-b border-[#E8E1D7]">
              Top 5 Best-Selling Silhouettes
            </h3>
            <div className="space-y-3">
              {analytics.topSellingProducts.map((p: any, idx: number) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs text-[#6D212F]">#{idx + 1}</span>
                    <img src={p.image} alt="" className="w-10 h-12 rounded object-cover" />
                    <div>
                      <p className="text-xs font-semibold text-[#12100E] line-clamp-1">{p.name}</p>
                      <p className="text-[10px] text-[#8C827A]">{p.salesCount} units dispatched</p>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-[#12100E]">₹{p.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#12100E] text-white shadow-sm space-y-4">
            <h3 className="text-base font-serif text-white pb-3 border-b border-white/10">
              Atelier Operational Health
            </h3>
            <div className="space-y-4 text-xs">
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-[#E8E1D7]/70">Inventory Turn Rate</span>
                <span className="font-bold text-[#C8A97E]">4.2x / quarter</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-[#E8E1D7]/70">Client Retention & Repeat Purchases</span>
                <span className="font-bold text-[#C8A97E]">68.5%</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-[#E8E1D7]/70">On-Time Atelier Dispatch Rate</span>
                <span className="font-bold text-[#C8A97E]">99.4%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProductModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E8E1D7] z-10 p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E1D7]">
                <h3 className="text-lg font-serif text-[#12100E]">
                  {editingProductId ? 'Edit Silhouette' : 'Create New Atelier Silhouette'}
                </h3>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1 text-[#8C827A] hover:text-[#12100E]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 mt-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                    Garment Name
                  </label>
                  <input
                    type="text"
                    required
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    placeholder="e.g. Draped Silk Velvet Column Gown"
                    className="w-full bg-[#FAF8F5] border border-[#E8E1D7] rounded-xl px-4 py-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                      Category
                    </label>
                    <select
                      value={pCategory}
                      onChange={(e) => setPCategory(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E1D7] rounded-xl px-4 py-2 text-xs"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                      Gender
                    </label>
                    <select
                      value={pGender}
                      onChange={(e) => setPGender(e.target.value as any)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E1D7] rounded-xl px-4 py-2 text-xs"
                    >
                      <option value="women">Women's Collection</option>
                      <option value="men">Men's Collection</option>
                      <option value="unisex">Unisex / Haute Accessories</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                      Selling Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={pPrice}
                      onChange={(e) => setPPrice(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E1D7] rounded-xl px-4 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                      MRP (₹)
                    </label>
                    <input
                      type="number"
                      value={pOriginalPrice}
                      onChange={(e) => setPOriginalPrice(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E1D7] rounded-xl px-4 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                      Stock Count
                    </label>
                    <input
                      type="number"
                      value={pStock}
                      onChange={(e) => setPStock(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E1D7] rounded-xl px-4 py-2 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                    Image URLs (Comma separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={pImages}
                    onChange={(e) => setPImages(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E1D7] rounded-xl px-4 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                    Description & Narrative
                  </label>
                  <textarea
                    rows={3}
                    value={pDescription}
                    onChange={(e) => setPDescription(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E1D7] rounded-xl p-3 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                    Materials (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={pMaterials}
                    onChange={(e) => setPMaterials(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E1D7] rounded-xl px-4 py-2 text-xs"
                  />
                </div>

                <div className="pt-4 border-t border-[#E8E1D7] flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#8C827A] hover:text-[#12100E]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#12100E] hover:bg-[#6D212F] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-md"
                  >
                    Save Silhouette
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

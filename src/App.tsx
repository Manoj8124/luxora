/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext.js';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { CartProvider } from './context/CartContext.js';
import { WishlistProvider } from './context/WishlistContext.js';
import { Header } from './components/common/Header.js';
import { Footer } from './components/common/Footer.js';
import { QuickViewModal } from './components/common/QuickViewModal.js';
import { CartDrawer } from './components/common/CartDrawer.js';
import { SearchModal } from './components/common/SearchModal.js';
import { SizeGuideModal } from './components/common/SizeGuideModal.js';
import { AuthModal } from './components/common/AuthModal.js';

// Pages
import { HomePage } from './pages/HomePage.js';
import { ShopPage } from './pages/ShopPage.js';
import { ProductDetailPage } from './pages/ProductDetailPage.js';
import { CheckoutPage } from './pages/CheckoutPage.js';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage.js';
import { AccountPage } from './pages/AccountPage.js';
import { WishlistPage } from './pages/WishlistPage.js';
import { AdminDashboardPage } from './pages/AdminDashboardPage.js';
import { TrackOrderPage } from './pages/TrackOrderPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { ContactPage } from './pages/ContactPage.js';
import { Product, Order } from './types.js';

function MainApp() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [routeParam, setRouteParam] = useState<string>('');

  // Modals state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  const { isAuthModalOpen, closeAuthModal } = useAuth();

  const handleNavigate = (route: string, param?: string) => {
    setCurrentRoute(route);
    setRouteParam(param || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1E1B18] selection:bg-[#6D212F] selection:text-white font-sans antialiased">
      {/* Top Header */}
      <Header
        onNavigate={handleNavigate}
        onOpenCart={() => setIsCartDrawerOpen(true)}
        onOpenSearch={() => setIsSearchModalOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onQuickView={handleOpenQuickView}
          />
        )}

        {currentRoute === 'shop' && (
          <ShopPage
            initialCategory={routeParam}
            onNavigate={handleNavigate}
            onQuickView={handleOpenQuickView}
          />
        )}

        {currentRoute === 'product' && (
          <ProductDetailPage
            slugOrId={routeParam}
            onNavigate={handleNavigate}
            onQuickView={handleOpenQuickView}
          />
        )}

        {currentRoute === 'checkout' && (
          <CheckoutPage
            onNavigate={handleNavigate}
            onOrderPlaced={(order) => {
              setLastPlacedOrder(order);
            }}
          />
        )}

        {currentRoute === 'order-confirmation' && (
          <OrderConfirmationPage
            orderId={routeParam || lastPlacedOrder?.id || 'ord-101'}
            onNavigate={handleNavigate}
          />
        )}

        {currentRoute === 'account' && (
          <AccountPage
            initialTab={routeParam || 'profile'}
            onNavigate={handleNavigate}
          />
        )}

        {currentRoute === 'wishlist' && (
          <WishlistPage
            onNavigate={handleNavigate}
            onQuickView={handleOpenQuickView}
          />
        )}

        {currentRoute === 'admin' && (
          <AdminDashboardPage
            onNavigate={handleNavigate}
          />
        )}

        {currentRoute === 'track' && (
          <TrackOrderPage
            onNavigate={handleNavigate}
          />
        )}

        {currentRoute === 'about' && (
          <AboutPage
            onNavigate={handleNavigate}
          />
        )}

        {currentRoute === 'contact' && (
          <ContactPage />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Global Modals & Drawers */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onNavigate={handleNavigate}
      />

      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        onNavigate={handleNavigate}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onNavigate={handleNavigate}
      />

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <MainApp />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

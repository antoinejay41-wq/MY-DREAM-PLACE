/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { MarketplaceProvider, useMarketplace } from './contexts/MarketplaceContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PropertyComparisonModal } from './components/PropertyComparisonModal';
import { PropertyAssistantWidget } from './components/PropertyAssistantWidget';
import { AuthDemoModal } from './components/AuthDemoModal';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { AgentsPage } from './pages/AgentsPage';
import { PropertyDetailsPage } from './pages/PropertyDetailsPage';
import { ListPropertyPage } from './pages/ListPropertyPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { OwnerDashboardPage } from './pages/OwnerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const AppShell: React.FC = () => {
  const { toastMessage, websiteSettings } = useMarketplace();

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#161616]">
      <Header />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-22 right-4 sm:right-6 z-50 max-w-sm bg-[#0D0D0D] text-white px-4 py-3 rounded-xl shadow-2xl border border-white/15 flex items-center gap-2.5 text-xs font-ui font-medium"
        >
          <CheckCircle2 className="w-4 h-4 text-[#76A2FA] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/buy" element={<CatalogPage mode="sale" />} />
          <Route path="/rent" element={<CatalogPage mode="rent" />} />
          <Route path="/land" element={<CatalogPage mode="land" />} />
          <Route path="/events" element={<CatalogPage mode="event" />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/property/:id" element={<PropertyDetailsPage />} />
          <Route path="/list-property" element={<ListPropertyPage />} />
          <Route path="/dashboard/customer" element={<CustomerDashboardPage />} />
          <Route path="/dashboard/owner" element={<OwnerDashboardPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/dashboard/admin" element={<AdminDashboardPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      <Footer />

      {/* Interactive Modals & Floating Marketplace Assistant */}
      {websiteSettings.enablePropertyComparison && <PropertyComparisonModal />}
      {websiteSettings.enableAssistantWidget && <PropertyAssistantWidget />}
      <AuthDemoModal />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <MarketplaceProvider>
        <AppShell />
      </MarketplaceProvider>
    </BrowserRouter>
  );
}

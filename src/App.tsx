/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { APIProvider } from '@vis.gl/react-google-maps';
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
import { getGoogleMapsApiKey } from './utils/googleMapsConfig';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

const AppShell: React.FC = () => {
  const { toastMessage, websiteSettings, language } = useMarketplace();
  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => {
      setMapsQuotaExceeded(true);
    };
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    };
  }, []);

  const mapsApiKey = getGoogleMapsApiKey();
  const mapsLang = language === 'ht' ? 'fr' : language;

  const content = (
    <div className="min-h-screen flex flex-col bg-white text-[#161616]">
      <ScrollToTop />

      {/* Required In-App Quota Banner (Case A: Auto-Provisioned Demo Key) */}
      {mapsQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

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
          <Route path="/explore" element={<CatalogPage mode="sale" />} />
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

  if (mapsApiKey) {
    return (
      <APIProvider
        apiKey={mapsApiKey}
        libraries={['places', 'marker', 'routes']}
        language={mapsLang}
      >
        {content}
      </APIProvider>
    );
  }

  return content;
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

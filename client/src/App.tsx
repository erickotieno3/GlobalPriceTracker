import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import CountryPage from "@/pages/country-page";
import StorePage from "@/pages/store-page";
import ComparePage from "@/pages/compare-page";
import NewsletterPage from "@/pages/newsletter-page";
import VendorDashboard from "@/pages/vendor-dashboard";
import AppDownloadPage from "@/pages/app-download-page";
import CheckoutPage from "@/pages/checkout-page";
import PaymentConfirmation from "@/pages/payment-confirmation";
import TestPage from "@/pages/test-page";
import SimpleTest from "@/pages/simple-test";
import MobileConnection from "@/pages/mobile-connection";
import WebSocketTest from "@/pages/websocket-test";
import ProductFinder from "@/pages/product-finder";
import AlphabeticalSearch from "@/pages/alphabetical-search";
import AffiliateDashboard from "@/pages/affiliate-dashboard";
import AdvertisePage from "@/pages/advertise";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { initializeAdSense } from "@/lib/adsense";
import { initializeAffiliateTracking } from "@/lib/affiliate";

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/country/:code" component={CountryPage} />
      <Route path="/store/:id" component={StorePage} />
      <Route path="/compare/:id?" component={ComparePage} />
      <Route path="/newsletter" component={NewsletterPage} />
      <Route path="/vendor-dashboard" component={VendorDashboard} />
      <Route path="/download-app" component={AppDownloadPage} />
      <Route path="/app-download" component={AppDownloadPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/payment-confirmation" component={PaymentConfirmation} />
      <Route path="/test" component={TestPage} />
      <Route path="/simple-test" component={SimpleTest} />
      <Route path="/mobile-connection" component={MobileConnection} />
      <Route path="/websocket-test" component={WebSocketTest} />
      <Route path="/product-finder" component={ProductFinder} />
      <Route path="/alphabetical-search" component={AlphabeticalSearch} />
      <Route path="/affiliate-dashboard" component={AffiliateDashboard} />
      <Route path="/advertise" component={AdvertisePage} />
      <Route path="/privacy" component={() => {
        window.location.href = "/legal/PRIVACY_POLICY.md";
        return null;
      }} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { i18n } = useTranslation();
  
  // Set document language attribute based on current i18n language
  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);
  
  // Initialize Google AdSense and affiliate tracking when the app loads
  useEffect(() => {
    initializeAdSense();
    initializeAffiliateTracking();
  }, []);
  
  return (
    <TooltipProvider>
      <ScrollToTop />
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;

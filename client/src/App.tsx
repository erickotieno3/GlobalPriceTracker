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
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

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
  
  return (
    <TooltipProvider>
      <ScrollToTop />
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;

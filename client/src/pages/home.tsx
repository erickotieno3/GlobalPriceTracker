import { useTranslation } from "react-i18next";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileNavigation from "@/components/layout/mobile-navigation";
import HeroBanner from "@/components/sections/hero-banner";
import CountrySelector from "@/components/sections/country-selector";
import FeaturedStores from "@/components/sections/featured-stores";
import SearchBar from "@/components/sections/search-bar";
import TrendingDeals from "@/components/sections/trending-deals";
import HowItWorks from "@/components/sections/how-it-works";
import Newsletter from "@/components/sections/newsletter";
import ProductComparison from "@/components/sections/product-comparison";
import CountriesSupport from "@/components/sections/countries-support";
import AppDownload from "@/components/sections/app-download";
import { useMobile } from "@/hooks/use-media-query";

export default function Home() {
  const { t } = useTranslation("home");
  const isMobile = useMobile();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow">
        <HeroBanner />
        
        <CountrySelector />
        
        <FeaturedStores />
        
        <SearchBar />
        
        <TrendingDeals />
        
        <HowItWorks />
        
        <Newsletter />
        
        <ProductComparison />
        
        <CountriesSupport />
        
        <AppDownload />
      </main>
      
      <Footer />
      
      {isMobile && <MobileNavigation />}
    </div>
  );
}

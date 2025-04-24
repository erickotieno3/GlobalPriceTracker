import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useEffect } from "react";

// Import mobile app mockup images
import appScreenshotPath from "@assets/1ffdaf21-cfcd-47b8-b990-8c99eefa7949.png";

export default function AppDownloadPage() {
  const { t } = useTranslation("common");
  
  // This would integrate with Google Analytics in production
  useEffect(() => {
    const trackPageView = () => {
      // In a real implementation, this would use the Google Analytics API
      console.log("Page view tracked: App Download Page");
    };
    
    const trackButtonClick = (buttonType: string) => {
      // In a real implementation, this would use the Google Analytics API
      console.log(`Button click tracked: ${buttonType}`);
    };
    
    // Track page view on component mount
    trackPageView();
    
    // Add global tracking function for button clicks
    window.trackAppDownload = (store: string) => {
      trackButtonClick(`Download from ${store}`);
    };
    
    return () => {
      // Clean up
      delete window.trackAppDownload;
    };
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        <section className="py-12 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-[#333333] mb-6">
                  {t("downloadApp.title", "Download the Tesco Price Comparison App")}
                </h1>
                
                <p className="text-lg text-gray-600 mb-8">
                  {t("downloadApp.description", "Compare supermarket prices across multiple stores, find the best deals, and save money on your shopping with our easy-to-use mobile app.")}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <a 
                    href="https://play.google.com/store" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => window.trackAppDownload?.('Google Play')}
                    className="flex-1"
                  >
                    <Button className="w-full h-16 bg-[#00539F] hover:bg-[#00407c] text-white rounded-lg">
                      <div className="flex flex-col items-start">
                        <span className="text-xs">GET IT ON</span>
                        <span className="text-lg font-semibold">Google Play</span>
                      </div>
                    </Button>
                  </a>
                  
                  <a 
                    href="https://apps.apple.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => window.trackAppDownload?.('App Store')}
                    className="flex-1"
                  >
                    <Button className="w-full h-16 bg-[#00539F] hover:bg-[#00407c] text-white rounded-lg">
                      <div className="flex flex-col items-start">
                        <span className="text-xs">DOWNLOAD ON THE</span>
                        <span className="text-lg font-semibold">App Store</span>
                      </div>
                    </Button>
                  </a>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#00539F] flex items-center justify-center text-white">
                      1
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-[#333333]">{t("downloadApp.feature1.title", "Compare Prices Instantly")}</h3>
                      <p className="text-gray-600">{t("downloadApp.feature1.description", "Find the best deals across multiple supermarkets in your country.")}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#00539F] flex items-center justify-center text-white">
                      2
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-[#333333]">{t("downloadApp.feature2.title", "Save Shopping Lists")}</h3>
                      <p className="text-gray-600">{t("downloadApp.feature2.description", "Create and save lists of products you buy regularly.")}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#00539F] flex items-center justify-center text-white">
                      3
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-[#333333]">{t("downloadApp.feature3.title", "Get Price Alerts")}</h3>
                      <p className="text-gray-600">{t("downloadApp.feature3.description", "Receive notifications when products you're watching drop in price.")}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <div className="relative w-[280px] h-[560px] bg-[#00539F] rounded-[36px] p-3 shadow-xl">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-[#00539F] rounded-b-xl"></div>
                  <div className="w-full h-full bg-white rounded-[28px] overflow-hidden">
                    <img 
                      src={appScreenshotPath} 
                      alt="Tesco App Screenshot" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-[#333333] text-center mb-10">
              {t("downloadApp.featuresTitle", "Why Choose Our App?")}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 shadow-sm hover:shadow transition-shadow">
                <h3 className="text-xl font-semibold text-[#333333] mb-4">{t("downloadApp.card1.title", "Real-time Price Updates")}</h3>
                <p className="text-gray-600">{t("downloadApp.card1.description", "Our app provides the latest prices from all major supermarkets, updated in real-time.")}</p>
              </Card>
              
              <Card className="p-6 shadow-sm hover:shadow transition-shadow">
                <h3 className="text-xl font-semibold text-[#333333] mb-4">{t("downloadApp.card2.title", "Available in Multiple Countries")}</h3>
                <p className="text-gray-600">{t("downloadApp.card2.description", "Compare prices across Kenya, Uganda, Tanzania, South Africa, UK, and more.")}</p>
              </Card>
              
              <Card className="p-6 shadow-sm hover:shadow transition-shadow">
                <h3 className="text-xl font-semibold text-[#333333] mb-4">{t("downloadApp.card3.title", "Multi-language Support")}</h3>
                <p className="text-gray-600">{t("downloadApp.card3.description", "Use the app in English, Swahili, French, German, or Arabic.")}</p>
              </Card>
            </div>
          </div>
        </section>
        
        <section className="py-12 bg-[#00539F] text-white text-center">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-6">{t("downloadApp.cta.title", "Download the Tesco App Today")}</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">{t("downloadApp.cta.description", "Join thousands of smart shoppers who are already saving money with the Tesco Price Comparison App.")}</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="https://play.google.com/store" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => window.trackAppDownload?.('Google Play')}
              >
                <Button className="w-full sm:w-48 h-14 bg-white hover:bg-gray-100 text-[#00539F] rounded-lg">
                  <div className="flex flex-col items-start">
                    <span className="text-xs">GET IT ON</span>
                    <span className="font-semibold">Google Play</span>
                  </div>
                </Button>
              </a>
              
              <a 
                href="https://apps.apple.com" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => window.trackAppDownload?.('App Store')}
              >
                <Button className="w-full sm:w-48 h-14 bg-white hover:bg-gray-100 text-[#00539F] rounded-lg">
                  <div className="flex flex-col items-start">
                    <span className="text-xs">DOWNLOAD ON THE</span>
                    <span className="font-semibold">App Store</span>
                  </div>
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

// Add type definition for the global window object
declare global {
  interface Window {
    trackAppDownload?: (store: string) => void;
  }
}
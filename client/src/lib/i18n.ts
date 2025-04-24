import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { apiRequest } from "./queryClient";
import { Language } from "@shared/schema";

// Define the translation namespaces
const namespaces = ["common", "home", "country", "store", "compare", "newsletter"];

// Define default translations for fallback
const resources = {
  en: {
    common: {
      "language": "Language",
      "home": "Home",
      "countries": "Countries",
      "trendingDeals": "Trending Deals",
      "about": "About",
      "search": "Search",
      "account": "Account",
      "loading": "Loading...",
      "error": "An error occurred",
      "retry": "Retry",
      "viewAll": "View All",
      "compareNow": "Compare Now",
      "startComparing": "Start Comparing",
    },
    home: {
      "heroTitle": "Compare Supermarket Prices Globally",
      "heroSubtitle": "Find the best deals across stores in multiple countries with real-time price comparisons",
      "selectCountry": "Select Your Country",
      "featuredStores": "Featured Stores",
      "featuredStoresSubtitle": "Compare prices across these popular retailers",
      "searchPlaceholder": "Search for products...",
      "howItWorks": "How It Works",
      "step1Title": "1. Select Country",
      "step1Description": "Choose from our list of supported countries to begin your price comparison",
      "step2Title": "2. Browse Stores",
      "step2Description": "View products from different supermarkets and chainstores",
      "step3Title": "3. Compare Prices",
      "step3Description": "See which store offers the best deals on the products you want",
      "countriesSupport": "Countries We Support",
      "countriesSupportSubtitle": "We're continually expanding our coverage to bring you price comparisons from more countries",
      "comingSoon": "Coming Soon:",
      "downloadApp": "Download Our Mobile App",
      "downloadAppDescription": "Get real-time price comparisons on the go with our mobile app. Available for iOS and Android.",
      "appStore": "Download on App Store",
      "googlePlay": "Get it on Google Play",
    },
    newsletter: {
      "title": "Sign Up for Our Newsletter",
      "description": "Subscribe to receive the latest deals and updates from the app.",
      "placeholder": "Email address",
      "subscribe": "Subscribe",
      "success": "Thank you for subscribing!",
      "error": "Failed to subscribe. Please try again.",
    },
    country: {
      "storesIn": "Stores in {{country}}",
      "noStores": "No stores available in this country yet",
      "backToCountries": "Back to Countries",
    },
    store: {
      "products": "Products",
      "noProducts": "No products available in this store yet",
      "backToStores": "Back to Stores",
      "filter": "Filter",
      "sort": "Sort",
      "price": "Price",
      "discount": "Discount",
      "availability": "Availability",
      "inStock": "In Stock",
      "outOfStock": "Out of Stock",
      "compare": "Compare",
    },
    compare: {
      "priceComparison": "Price Comparison",
      "store": "Store",
      "price": "Price",
      "availability": "Availability",
      "lastUpdated": "Last Updated",
      "action": "Action",
      "viewDeal": "View Deal",
      "backToProduct": "Back to Product",
      "pricesUpdatedRealtime": "Prices updated in real-time. Last checked: {{time}}",
      "today": "Today",
      "yesterday": "Yesterday",
      "daysAgo": "{{days}} days ago",
    },
  },
};

async function loadLanguages() {
  try {
    const response = await apiRequest("GET", "/api/languages");
    const languages: Language[] = await response.json();
    return languages;
  } catch (error) {
    console.error("Failed to load languages:", error);
    return [];
  }
}

const i18nInstance = {
  ...i18n,
  async init() {
    // Initialize with default English resources
    await i18n
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        resources,
        fallbackLng: "en",
        supportedLngs: ["en", "sw", "fr", "de", "ar"],
        ns: namespaces,
        defaultNS: "common",
        detection: {
          order: ["localStorage", "navigator"],
          caches: ["localStorage"],
        },
        interpolation: {
          escapeValue: false,
        },
      });
    
    // Load languages from the API
    const languages = await loadLanguages();
    
    // Update supported languages based on API response
    const languageCodes = languages.map(lang => lang.code);
    if (languageCodes.length > 0) {
      // Set supported languages dynamically
      i18n.options.supportedLngs = languageCodes;
    }
    
    return i18n;
  }
};

export default i18nInstance;

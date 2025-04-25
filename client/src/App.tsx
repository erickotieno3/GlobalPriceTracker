import { Route, Switch, Link } from "wouter";
import MarketplaceComparisonPage from "@/pages/marketplace-comparison";
import AlphabeticalSearchPage from "@/pages/alphabetical-search";
import AutoPilotDashboardPage from "@/pages/auto-pilot-dashboard";
import AIAssistantPage from "@/pages/ai-assistant";

import { useEffect, useState } from "react";
import { getProductRecommendations } from "@/lib/ai";
import { Sparkles, Loader2 } from "lucide-react";

function HomePage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoadingRecommendations(true);
      try {
        const result = await getProductRecommendations(undefined, undefined, "Electronics");
        setRecommendations(result.recommendations || []);
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      } finally {
        setIsLoadingRecommendations(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Tesco Price Comparison</h1>
      <p className="text-xl mb-2">Welcome to the Global E-commerce Price Comparison Platform</p>
      <p className="text-gray-600 mb-8">Compare prices across multiple stores and marketplaces worldwide</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-4">Store Comparison</h2>
          <p className="mb-4">Compare prices between supermarkets and chain stores</p>
          <Link href="/store-comparison">
            <span className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 inline-block cursor-pointer">
              Compare Stores
            </span>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-4">Marketplace Comparison</h2>
          <p className="mb-4">Compare prices across global online marketplaces</p>
          <Link href="/marketplace-comparison">
            <span className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 inline-block cursor-pointer">
              Compare Marketplaces
            </span>
          </Link>
        </div>
      </div>
      
      {/* AI-powered recommendations section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-blue-700">AI-Powered Recommendations</h2>
        </div>
        
        {isLoadingRecommendations ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            <span className="ml-2 text-blue-600">Loading recommendations...</span>
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recommendations.slice(0, 3).map((product, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-4 text-left">
                <div className="aspect-video bg-gray-100 mb-3 flex items-center justify-center overflow-hidden rounded">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400">No image</div>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-1 truncate">{product.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {product.description || 'No description available'}
                </p>
                {product.price && (
                  <p className="mt-2 font-bold text-blue-600">
                    £{typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 py-4">
            Explore our AI-powered shopping assistant for personalized recommendations.
          </p>
        )}
        
        <div className="mt-4">
          <Link href="/ai-assistant">
            <span className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 inline-block cursor-pointer">
              Explore AI Features
            </span>
          </Link>
        </div>
      </div>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Application Status</h2>
        <p className="mb-2">
          All systems operational
        </p>
        <p className="text-gray-600">
          Last Updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <span className="text-2xl font-bold text-blue-600 cursor-pointer">Tesco Compare</span>
          </Link>
          
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/">
                  <span className="hover:text-blue-600 cursor-pointer">Home</span>
                </Link>
              </li>
              <li>
                <Link href="/marketplace-comparison">
                  <span className="hover:text-blue-600 cursor-pointer">Marketplaces</span>
                </Link>
              </li>
              <li>
                <Link href="/store-comparison">
                  <span className="hover:text-blue-600 cursor-pointer">Stores</span>
                </Link>
              </li>
              <li>
                <Link href="/alphabetical-search">
                  <span className="hover:text-blue-600 cursor-pointer">Product Search</span>
                </Link>
              </li>
              <li>
                <Link href="/ai-assistant">
                  <span className="text-blue-600 font-medium hover:text-blue-800 cursor-pointer">AI Assistant</span>
                </Link>
              </li>
              <li>
                <Link href="/auto-pilot-dashboard">
                  <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded hover:bg-amber-200 cursor-pointer">Admin</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">Tesco Price Comparison</h3>
            <p className="text-gray-600">
              Compare prices across multiple stores and marketplaces worldwide.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/marketplace-comparison">
                  <span className="text-gray-600 hover:text-blue-600 cursor-pointer">Marketplace Comparison</span>
                </Link>
              </li>
              <li>
                <Link href="/store-comparison">
                  <span className="text-gray-600 hover:text-blue-600 cursor-pointer">Store Comparison</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms">
                  <span className="text-gray-600 hover:text-blue-600 cursor-pointer">Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <span className="text-gray-600 hover:text-blue-600 cursor-pointer">Privacy Policy</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Tesco Price Comparison. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-8">The page you are looking for does not exist.</p>
      <Link href="/">
        <span className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 inline-block cursor-pointer">
          Go Back Home
        </span>
      </Link>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/marketplace-comparison" component={MarketplaceComparisonPage} />
          <Route path="/alphabetical-search" component={AlphabeticalSearchPage} />
          <Route path="/ai-assistant" component={AIAssistantPage} />
          <Route path="/auto-pilot-dashboard" component={AutoPilotDashboardPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;

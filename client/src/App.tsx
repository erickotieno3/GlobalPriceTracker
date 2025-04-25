import { Route, Switch, Link } from "wouter";
import MarketplaceComparisonPage from "@/pages/marketplace-comparison";
import AlphabeticalSearchPage from "@/pages/alphabetical-search";
import AutoPilotDashboardPage from "@/pages/auto-pilot-dashboard";

function HomePage() {
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
          <Route path="/auto-pilot-dashboard" component={AutoPilotDashboardPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;

import { Route, Switch, Link } from "wouter";
import MarketplaceComparisonPage from "@/pages/marketplace-comparison";

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
            <a className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 inline-block">
              Compare Stores
            </a>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-4">Marketplace Comparison</h2>
          <p className="mb-4">Compare prices across global online marketplaces</p>
          <Link href="/marketplace-comparison">
            <a className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 inline-block">
              Compare Marketplaces
            </a>
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
            <a className="text-2xl font-bold text-blue-600">Tesco Compare</a>
          </Link>
          
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/">
                  <a className="hover:text-blue-600">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/marketplace-comparison">
                  <a className="hover:text-blue-600">Marketplaces</a>
                </Link>
              </li>
              <li>
                <Link href="/store-comparison">
                  <a className="hover:text-blue-600">Stores</a>
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
                  <a className="text-gray-600 hover:text-blue-600">Marketplace Comparison</a>
                </Link>
              </li>
              <li>
                <Link href="/store-comparison">
                  <a className="text-gray-600 hover:text-blue-600">Store Comparison</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms">
                  <a className="text-gray-600 hover:text-blue-600">Terms of Service</a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a className="text-gray-600 hover:text-blue-600">Privacy Policy</a>
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
        <a className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
          Go Back Home
        </a>
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
          <Route component={NotFound} />
        </Switch>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;

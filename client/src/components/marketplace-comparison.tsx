import { useState, useEffect } from 'react';
import { marketplaceAffiliates, getMarketplacesByRegion } from '@shared/marketplace-affiliates';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, ShoppingBag, Filter, ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MarketplaceProductResult {
  id: string;
  name: string;
  price: number;
  currency: string;
  url: string;
  image: string;
  marketplace: string;
  rating?: number;
  reviews?: number;
  shipping?: number;
  freeShipping?: boolean;
}

export function MarketplaceComparison() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [results, setResults] = useState<MarketplaceProductResult[]>([]);
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('price_asc');
  const [region, setRegion] = useState('UK');
  const { toast } = useToast();

  // Get available marketplaces for the selected region
  const availableMarketplaces = getMarketplacesByRegion(region);

  // Handle search form submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast({
        title: 'Search query required',
        description: 'Please enter a product to search for',
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    setResults([]);
    
    try {
      const marketplacesParam = selectedMarketplaces.length > 0 
        ? selectedMarketplaces.join(',') 
        : availableMarketplaces.map(m => m.id).join(',');
      
      const params = new URLSearchParams({
        query: searchQuery,
        marketplaces: marketplacesParam
      });
      
      if (category) params.append('category', category);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      
      const response = await apiRequest('GET', `/api/marketplace/search?${params.toString()}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setResults(data.data);
      } else {
        toast({
          title: 'Search failed',
          description: data.message || 'Unable to search products at this time',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Marketplace search error:', error);
      toast({
        title: 'Search error',
        description: 'An error occurred while searching. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle marketplace selection
  const toggleMarketplace = (marketplaceId: string) => {
    if (selectedMarketplaces.includes(marketplaceId)) {
      setSelectedMarketplaces(selectedMarketplaces.filter(id => id !== marketplaceId));
    } else {
      setSelectedMarketplaces([...selectedMarketplaces, marketplaceId]);
    }
  };

  // Handle region change
  const handleRegionChange = (newRegion: string) => {
    setRegion(newRegion);
    setSelectedMarketplaces([]);
  };

  // Sort the results based on the selected sort option
  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'rating_desc':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6">Marketplace Product Search</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Refine your search</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Region</label>
                  <Select value={region} onValueChange={handleRegionChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="KE">Kenya</SelectItem>
                      <SelectItem value="UG">Uganda</SelectItem>
                      <SelectItem value="TZ">Tanzania</SelectItem>
                      <SelectItem value="ZA">South Africa</SelectItem>
                      <SelectItem value="DE">Germany</SelectItem>
                      <SelectItem value="FR">France</SelectItem>
                      <SelectItem value="IT">Italy</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Marketplaces</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {availableMarketplaces.map(marketplace => (
                      <Badge 
                        key={marketplace.id}
                        variant={selectedMarketplaces.includes(marketplace.id) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleMarketplace(marketplace.id)}
                      >
                        {marketplace.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Computers">Computers</SelectItem>
                      <SelectItem value="Home">Home & Kitchen</SelectItem>
                      <SelectItem value="Clothing">Clothing</SelectItem>
                      <SelectItem value="Beauty">Beauty</SelectItem>
                      <SelectItem value="Toys">Toys</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Price Range</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleSearch}
                disabled={isLoading}
              >
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Search Results</CardTitle>
                <div className="flex items-center space-x-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price_asc">Price: Low to High</SelectItem>
                      <SelectItem value="price_desc">Price: High to Low</SelectItem>
                      <SelectItem value="rating_desc">Best Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading}>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </form>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center my-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : sortedResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {sortedResults.map((product, index) => {
                    const marketplace = marketplaceAffiliates.find(m => m.id === product.marketplace);
                    
                    return (
                      <Card key={index} className="overflow-hidden h-full flex flex-col">
                        <div className="aspect-video relative bg-gray-100 flex items-center justify-center">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="object-contain w-full h-full" 
                            />
                          ) : (
                            <ShoppingBag className="h-12 w-12 text-gray-400" />
                          )}
                          {marketplace && (
                            <div className="absolute top-2 left-2">
                              <Badge variant="secondary">
                                {marketplace.name}
                              </Badge>
                            </div>
                          )}
                        </div>
                        <CardContent className="flex-1 flex flex-col py-4">
                          <h3 className="font-medium line-clamp-2 mb-2">{product.name}</h3>
                          <div className="mt-auto">
                            <div className="text-xl font-bold">
                              {product.currency} {product.price.toFixed(2)}
                            </div>
                            {product.rating && (
                              <div className="flex items-center text-sm text-yellow-500">
                                {'★'.repeat(Math.round(product.rating))}
                                {'☆'.repeat(5 - Math.round(product.rating))}
                                {product.reviews && (
                                  <span className="text-gray-500 ml-1">({product.reviews})</span>
                                )}
                              </div>
                            )}
                            {product.shipping !== undefined && (
                              <div className="text-sm text-gray-500">
                                {product.freeShipping ? 'Free shipping' : `Shipping: ${product.currency} ${product.shipping.toFixed(2)}`}
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Button 
                            className="w-full" 
                            variant="outline"
                            onClick={() => window.open(product.url, '_blank')}
                          >
                            View Product
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  {searchQuery ? (
                    <div>
                      <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-lg font-medium">No products found</p>
                      <p className="text-gray-500">Try adjusting your search or filters</p>
                    </div>
                  ) : (
                    <div>
                      <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-lg font-medium">Start searching</p>
                      <p className="text-gray-500">Enter a product name to search across marketplaces</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
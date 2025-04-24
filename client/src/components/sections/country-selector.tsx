import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Country } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ChevronDown } from "lucide-react";

export default function CountrySelector() {
  const { t } = useTranslation("home");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  
  const { data: countries, isLoading, error } = useQuery<Country[]>({
    queryKey: ["/api/countries"],
  });

  // Set Kenya as default country once data is loaded
  useEffect(() => {
    if (countries && countries.length > 0 && !selectedCountry) {
      const kenya = countries.find(country => country.code === "KE");
      if (kenya) {
        setSelectedCountry(kenya);
      } else {
        setSelectedCountry(countries[0]);
      }
    }
  }, [countries, selectedCountry]);
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const selectCountry = (country: Country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
  };
  
  return (
    <section className="py-4 bg-white">
      <div className="px-4">
        {/* Country Dropdown */}
        <div className="relative">
          <button 
            onClick={toggleDropdown}
            className="w-full flex items-center justify-between border border-gray-300 rounded-lg py-3 px-4 bg-white"
          >
            <div className="flex items-center">
              {selectedCountry ? (
                <>
                  <div className="w-6 h-4 mr-2">
                    <img 
                      src={selectedCountry.flagUrl || `https://flagcdn.com/w80/${selectedCountry.code.toLowerCase()}.png`} 
                      alt={`${selectedCountry.name} flag`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-medium">{selectedCountry.name}</span>
                </>
              ) : isLoading ? (
                <Skeleton className="h-6 w-24" />
              ) : (
                <span className="text-gray-500">Select Country</span>
              )}
            </div>
            <ChevronDown className={`h-5 w-5 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
          </button>
          
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="p-3">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : error ? (
                <div className="p-3">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Failed to load countries. Please try again.
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                countries?.map((country) => (
                  <button
                    key={country.id}
                    className="w-full flex items-center px-4 py-3 hover:bg-gray-100 transition"
                    onClick={() => selectCountry(country)}
                  >
                    <div className="w-6 h-4 mr-2">
                      <img 
                        src={country.flagUrl || `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`} 
                        alt={`${country.name} flag`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium">{country.name}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

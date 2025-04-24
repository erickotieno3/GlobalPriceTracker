import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { StoreWithCountry } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function FeaturedStores() {
  const { t } = useTranslation("home");
  
  const { data: stores, isLoading, error } = useQuery<StoreWithCountry[]>({
    queryKey: ["/api/stores/featured"],
  });
  
  const renderStores = () => {
    if (isLoading) {
      return Array(8).fill(0).map((_, index) => (
        <div key={index} className="flex flex-col items-center p-4">
          <Skeleton className="h-16 w-16 rounded mb-3" />
          <Skeleton className="h-5 w-24 mb-1" />
          <Skeleton className="h-4 w-20" />
        </div>
      ));
    }
    
    if (error) {
      return (
        <div className="col-span-full">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load stores. Please try again.
            </AlertDescription>
          </Alert>
        </div>
      );
    }
    
    return stores?.map((store) => (
      <Link key={store.id} href={`/store/${store.id}`}>
        <a className="store-card bg-white rounded-lg shadow hover:shadow-md transition p-4 flex flex-col items-center cursor-pointer">
          <div className="w-16 h-16 mb-3 flex items-center justify-center">
            <img src={store.logoUrl} alt={store.name} className="max-w-full max-h-full" />
          </div>
          <h3 className="font-medium text-center">{store.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{store.country.name}</p>
        </a>
      </Link>
    ));
  };
  
  return (
    <section className="py-10 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="font-inter font-semibold text-2xl md:text-3xl text-center mb-2">
          {t("featuredStores")}
        </h2>
        <p className="text-center text-gray-600 mb-8">{t("featuredStoresSubtitle")}</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {renderStores()}
        </div>
      </div>
    </section>
  );
}

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HeroBanner() {
  const { t } = useTranslation("home");
  
  return (
    <section className="bg-primary text-white py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto text-left">
          <h1 className="font-bold text-4xl leading-tight mb-3">
            Compare<br />Supermarket Prices
          </h1>
          <Link href="/compare">
            <Button 
              size="lg" 
              className="bg-white hover:bg-gray-100 text-primary font-semibold py-3 px-8 rounded-full shadow-md transition"
            >
              Start Comparing
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

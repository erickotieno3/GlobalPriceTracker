import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

export default function Header() {
  const { i18n } = useTranslation("common");
  
  return (
    <header className="bg-white sticky top-0 z-50 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Tesco Logo */}
        <Link href="/">
          <a className="flex items-center">
            <div className="text-[#EE1C2E] font-bold text-2xl">
              TESCO
            </div>
            <div className="ml-1 flex flex-col">
              <div className="bg-[#00539F] h-1 w-4 mb-0.5"></div>
              <div className="bg-[#00539F] h-1 w-4 mb-0.5"></div>
              <div className="bg-[#00539F] h-1 w-4 mb-0.5"></div>
              <div className="bg-[#00539F] h-1 w-4"></div>
            </div>
          </a>
        </Link>

        {/* Navigation */}
        <div className="flex items-center space-x-8">
          <div className="relative group">
            <button className="flex items-center text-gray-800 font-medium">
              Navigation <ChevronDown className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          <div className="text-gray-800 font-medium">
            English
          </div>
          
          <div className="text-gray-800 font-medium">
            Login
          </div>
        </div>
      </div>
    </header>
  );
}

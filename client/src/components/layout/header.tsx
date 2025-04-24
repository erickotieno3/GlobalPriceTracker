import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

export default function Header() {
  const { i18n } = useTranslation("common");
  
  // Get current language display
  const getCurrentLanguageDisplay = () => {
    return i18n.language.toUpperCase().slice(0, 2);
  };
  
  return (
    <header className="bg-white sticky top-0 z-50 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className="font-bold text-2xl text-black">
            tesco
          </a>
        </Link>

        {/* Right side elements */}
        <div className="flex items-center space-x-3">
          {/* Website URL */}
          <div className="text-sm text-gray-600 hidden sm:block">
            hyrisecrown.com
          </div>
          
          {/* Language Selector */}
          <div className="flex items-center">
            <Globe className="h-5 w-5 mr-1 text-gray-600" />
            <span className="font-medium">{getCurrentLanguageDisplay()}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

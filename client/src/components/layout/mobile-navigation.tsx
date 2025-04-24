import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Home, Globe, Search, User } from "lucide-react";

export default function MobileNavigation() {
  const { t } = useTranslation("common");
  const [location] = useLocation();
  
  const isActive = (path: string) => {
    return location === path ? "text-primary" : "text-gray-500 hover:text-primary";
  };
  
  return (
    <div className="block md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="flex justify-around items-center py-2">
        <Link href="/">
          <a className={`flex flex-col items-center p-2 ${isActive("/")}`}>
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">{t("home")}</span>
          </a>
        </Link>
        <Link href="/countries">
          <a className={`flex flex-col items-center p-2 ${isActive("/countries")}`}>
            <Globe className="h-5 w-5" />
            <span className="text-xs mt-1">{t("countries")}</span>
          </a>
        </Link>
        <Link href="/search">
          <a className={`flex flex-col items-center p-2 ${isActive("/search")}`}>
            <Search className="h-5 w-5" />
            <span className="text-xs mt-1">{t("search")}</span>
          </a>
        </Link>
        <Link href="/account">
          <a className={`flex flex-col items-center p-2 ${isActive("/account")}`}>
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">{t("account")}</span>
          </a>
        </Link>
      </div>
    </div>
  );
}

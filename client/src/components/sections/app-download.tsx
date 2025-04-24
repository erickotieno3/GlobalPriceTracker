import { useTranslation } from "react-i18next";
import { AppleIcon, TabletSmartphone } from "lucide-react";

export default function AppDownload() {
  const { t } = useTranslation("home");
  
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="font-inter font-semibold text-2xl md:text-3xl mb-4">
              {t("downloadApp")}
            </h2>
            <p className="text-gray-600 mb-6">
              {t("downloadAppDescription")}
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="inline-block bg-black text-white rounded-lg px-4 py-2 flex items-center">
                <AppleIcon className="h-6 w-6 mr-2" />
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="text-lg font-semibold">App Store</div>
                </div>
              </a>
              <a href="#" className="inline-block bg-black text-white rounded-lg px-4 py-2 flex items-center">
                <TabletSmartphone className="h-6 w-6 mr-2" />
                <div>
                  <div className="text-xs">Get it on</div>
                  <div className="text-lg font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="max-w-full h-auto max-h-[400px] rounded-lg shadow-lg overflow-hidden bg-gray-200 w-[300px] h-[500px]">
              <img 
                src="https://via.placeholder.com/300x500?text=App+Preview" 
                alt="App Preview" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

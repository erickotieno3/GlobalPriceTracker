import React from 'react';
import AffiliateLink from './AffiliateLink';
import { Card, CardContent } from '@/components/ui/card';

interface AffiliateBannerProps {
  storeName: string;
  productId: number | string;
  productName: string;
  productUrl: string;
  bannerText: string;
  bannerImage?: string;
  className?: string;
}

/**
 * AffiliateBanner Component
 * 
 * A promotional banner with tracking for affiliate programs.
 * This can be used to highlight special deals or promotions.
 */
export default function AffiliateBanner({
  storeName,
  productId,
  productName,
  productUrl,
  bannerText,
  bannerImage,
  className = '',
}: AffiliateBannerProps) {
  return (
    <div className={`affiliate-banner ${className}`}>
      <Card className="overflow-hidden">
        <AffiliateLink
          storeName={storeName}
          productId={productId}
          productName={productName}
          productUrl={productUrl}
          className="block hover:opacity-95 transition-opacity"
        >
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row items-center">
              {bannerImage && (
                <div className="w-full sm:w-1/3">
                  <img 
                    src={bannerImage} 
                    alt={`${storeName} - ${productName}`} 
                    className="w-full h-auto object-cover" 
                  />
                </div>
              )}
              <div className={`p-4 ${bannerImage ? 'sm:w-2/3' : 'w-full'}`}>
                <div className="text-sm text-muted-foreground mb-1">
                  Sponsored by {storeName}
                </div>
                <div className="text-lg font-medium mb-2">
                  {productName}
                </div>
                <div className="text-sm">
                  {bannerText}
                </div>
                <div className="mt-3">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    Shop Now
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </AffiliateLink>
      </Card>
    </div>
  );
}
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, ShoppingCart } from 'lucide-react';
import AffiliateLink from './AffiliateLink';

interface ProductAffiliateButtonProps {
  storeName: string;
  productId: number | string;
  productName: string;
  productUrl: string;
  buttonText?: string;
  variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

/**
 * ProductAffiliateButton Component
 * 
 * A button that links to a product on a retailer's website with affiliate tracking.
 */
export default function ProductAffiliateButton({
  storeName,
  productId,
  productName,
  productUrl,
  buttonText = 'Buy Now',
  variant = 'default',
  size = 'default',
  className = '',
}: ProductAffiliateButtonProps) {
  return (
    <AffiliateLink
      storeName={storeName}
      productId={productId}
      productName={productName}
      productUrl={productUrl}
      className={className}
    >
      <Button variant={variant} size={size} className="w-full sm:w-auto">
        <ShoppingCart className="mr-2 h-4 w-4" />
        {buttonText}
        <ExternalLink className="ml-2 h-4 w-4" />
      </Button>
    </AffiliateLink>
  );
}
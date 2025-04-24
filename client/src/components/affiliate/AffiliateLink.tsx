import React from 'react';
import { trackAffiliateClick, AffiliateClickProps } from '@/lib/affiliate';

/**
 * AffiliateLink Component
 * 
 * A link component that automatically tracks clicks and applies the appropriate
 * affiliate parameters to the destination URL.
 */
export default function AffiliateLink({
  storeName,
  productId,
  productName,
  productUrl,
  className = '',
  children,
  ...rest
}: AffiliateClickProps & React.HTMLAttributes<HTMLAnchorElement>) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (rest.onClick) {
      rest.onClick(e);
    }
  };

  // Generate the affiliate tracking URL
  const affiliateUrl = trackAffiliateClick(storeName, productId, productName, productUrl);

  return (
    <a
      href={affiliateUrl}
      className={`affiliate-link ${className}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      {...rest}
      data-store={storeName}
      data-product-id={productId}
    >
      {children}
    </a>
  );
}
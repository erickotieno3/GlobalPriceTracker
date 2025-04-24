# Payment Integration Guide

This document provides detailed instructions on how to integrate different payment methods into the Tesco Price Comparison platform.

## Currently Supported Payment Methods

1. **Stripe** - Global credit/debit card processing
2. **PayPal** - Global digital wallet payments
3. **M-Pesa** - Mobile money payments (popular in Africa)

## Adding a New Payment Method

### Step 1: Install Required Dependencies

Use the package manager to install any required packages for the payment gateway:

```bash
npm install payment-gateway-sdk
```

### Step 2: Obtain API Keys

Each payment gateway requires authentication credentials:

1. Create an account with the payment provider
2. Generate API keys (usually a public key for the frontend and a secret key for the backend)
3. Add the keys to the environment variables:

```
PAYMENT_PROVIDER_PUBLIC_KEY=your_public_key
PAYMENT_PROVIDER_SECRET_KEY=your_secret_key
```

### Step 3: Create the Backend Integration

Add routes to `server/payment-routes.ts`:

```typescript
// Add new payment method routes
paymentRouter.post('/new-provider/create-payment', async (req: Request, res: Response) => {
  try {
    const { amount, currency } = req.body;
    
    // Initialize the payment gateway client with your credentials
    const paymentClient = new PaymentGatewayClient({
      apiKey: process.env.PAYMENT_PROVIDER_SECRET_KEY
    });
    
    // Create a payment session/intent
    const paymentSession = await paymentClient.createPayment({
      amount,
      currency,
      successUrl: `${req.protocol}://${req.get('host')}/payment-confirmation`,
      cancelUrl: `${req.protocol}://${req.get('host')}/checkout`,
    });
    
    // Return the payment session details to the client
    res.json({
      sessionId: paymentSession.id,
      clientSecret: paymentSession.clientSecret,
      // other relevant data needed by the frontend
    });
  } catch (error: any) {
    console.error('Payment creation error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Webhook for receiving payment events from the provider
paymentRouter.post('/new-provider/webhook', async (req: Request, res: Response) => {
  try {
    // Verify the webhook signature to ensure it came from the payment provider
    const signature = req.headers['provider-signature'] as string;
    const client = new PaymentGatewayClient({
      apiKey: process.env.PAYMENT_PROVIDER_SECRET_KEY
    });
    
    const event = client.verifyWebhookEvent(req.body, signature);
    
    // Handle different event types
    switch (event.type) {
      case 'payment.succeeded':
        // Update order status, trigger fulfillment, etc.
        break;
      case 'payment.failed':
        // Handle payment failure
        break;
      // Other event types...
    }
    
    // Acknowledge receipt of the webhook
    res.status(200).send();
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});
```

### Step 4: Create the Frontend Component

Create a new component in `client/src/components/payments`:

```typescript
// client/src/components/payments/NewProviderPaymentForm.tsx
import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface NewProviderPaymentFormProps {
  amount: number;
  currency: string;
  onSuccess: (paymentResult: any) => void;
  onError: (error: Error) => void;
}

const NewProviderPaymentForm: React.FC<NewProviderPaymentFormProps> = ({
  amount,
  currency,
  onSuccess,
  onError
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentSession, setPaymentSession] = useState<any>(null);
  const { toast } = useToast();
  
  // Initialize the payment provider SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://provider-sdk.com/sdk.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  // Create a payment session when the component mounts
  useEffect(() => {
    const createPaymentSession = async () => {
      try {
        setLoading(true);
        const response = await apiRequest('POST', '/api/payments/new-provider/create-payment', {
          amount,
          currency
        });
        
        const data = await response.json();
        setPaymentSession(data);
      } catch (error) {
        toast({
          title: "Payment Error",
          description: "Failed to initialize payment. Please try again.",
          variant: "destructive"
        });
        onError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    
    createPaymentSession();
  }, [amount, currency]);
  
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentSession) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Use the payment provider's SDK to complete the payment
      const paymentProvider = (window as any).PaymentProvider;
      
      const result = await paymentProvider.confirmPayment({
        sessionId: paymentSession.sessionId,
        clientSecret: paymentSession.clientSecret,
        // Additional payment details from the form
      });
      
      if (result.success) {
        onSuccess(result);
      } else {
        throw new Error(result.errorMessage || 'Payment failed');
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      onError(error as Error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !paymentSession) {
    return <div>Initializing payment...</div>;
  }
  
  return (
    <form onSubmit={handlePaymentSubmit}>
      {/* Payment form fields specific to the provider */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Payment Details</label>
        {/* Provider-specific input fields */}
      </div>
      
      <Button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  );
};

export default NewProviderPaymentForm;
```

### Step 5: Integrate into the Checkout Page

Update `client/src/pages/checkout-page.tsx` to include the new payment method:

```typescript
import NewProviderPaymentForm from '@/components/payments/NewProviderPaymentForm';

// Inside the component:
const [paymentMethod, setPaymentMethod] = useState('stripe');

// In the render function:
<div className="mb-6">
  <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
  <div className="grid grid-cols-3 gap-4">
    <PaymentMethodOption
      id="stripe"
      name="Stripe"
      icon={<CreditCard />}
      selected={paymentMethod === 'stripe'}
      onSelect={() => setPaymentMethod('stripe')}
    />
    <PaymentMethodOption
      id="paypal"
      name="PayPal"
      icon={<Image />}
      selected={paymentMethod === 'paypal'}
      onSelect={() => setPaymentMethod('paypal')}
    />
    <PaymentMethodOption
      id="new-provider"
      name="New Provider"
      icon={<Wallet />}
      selected={paymentMethod === 'new-provider'}
      onSelect={() => setPaymentMethod('new-provider')}
    />
  </div>
</div>

{/* Display the appropriate payment form based on the selected method */}
{paymentMethod === 'stripe' && (
  <StripePaymentForm
    amount={totalAmount}
    currency="USD"
    onSuccess={handlePaymentSuccess}
    onError={handlePaymentError}
  />
)}
{paymentMethod === 'paypal' && (
  <PayPalPaymentForm
    amount={totalAmount}
    currency="USD"
    onSuccess={handlePaymentSuccess}
    onError={handlePaymentError}
  />
)}
{paymentMethod === 'new-provider' && (
  <NewProviderPaymentForm
    amount={totalAmount}
    currency="USD"
    onSuccess={handlePaymentSuccess}
    onError={handlePaymentError}
  />
)}
```

### Step 6: Add Payment Notifications

Add email notification support for successful payments by updating the payment webhook handler:

```typescript
import { sendPaymentConfirmationEmail } from '../utils/email-service';

// Inside the payment success webhook handler:
if (event.type === 'payment.succeeded') {
  const { orderId, customerEmail, amount, currency } = event.data;
  
  // Update order status in the database
  
  // Send confirmation email
  await sendPaymentConfirmationEmail({
    to: customerEmail,
    orderId,
    amount,
    currency,
    paymentMethod: 'New Provider',
    date: new Date().toISOString()
  });
}
```

### Step 7: Test the Integration

1. Use the payment provider's test credentials
2. Make a test purchase with test card/account details
3. Verify the payment is processed correctly
4. Check that webhooks are being received and processed
5. Confirm receipt of payment confirmation emails

### Step 8: Go Live

1. Replace test API credentials with production credentials
2. Update webhook URLs to production endpoints
3. Perform a real payment test with minimal amount
4. Monitor payment logs for any issues

## Region-Specific Payment Methods

When adding payment methods for specific regions, consider:

1. **Language Support** - Include translations for payment-related text
2. **Currency Handling** - Ensure proper formatting and conversion
3. **Compliance** - Follow local regulations for payment processing
4. **Mobile Support** - Ensure the payment method works well on mobile devices

## Troubleshooting Common Payment Issues

1. **API Key Issues** - Ensure keys are correctly set in environment variables
2. **Webhook Failures** - Check the webhook URL is correctly configured and accessible
3. **CORS Issues** - Ensure the payment provider's domains are properly allowed
4. **Currency Mismatches** - Verify the currency code matches what the provider expects
5. **SSL Requirements** - Most payment providers require HTTPS for all interactions
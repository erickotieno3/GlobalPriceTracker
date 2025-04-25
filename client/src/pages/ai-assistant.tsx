import React from 'react';
import { Helmet } from 'react-helmet';
import AIFeatures from '@/components/ai-features';

export default function AIAssistantPage() {
  return (
    <>
      <Helmet>
        <title>AI Shopping Assistant | Tesco Price Comparison</title>
        <meta name="description" content="Discover AI-powered shopping features including smart search, personalized recommendations, price trend insights, and product comparisons." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-4xl font-bold text-tesco-blue mb-4">AI Shopping Assistant</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Enhance your shopping experience with our AI-powered tools. Find the best products, 
              discover unbeatable deals, and make smarter purchasing decisions.
            </p>
          </header>
          
          <AIFeatures />
          
          <div className="mt-16 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">About Our AI Technology</h2>
            <p className="mb-4">
              Our AI Shopping Assistant uses advanced artificial intelligence to analyze vast amounts of 
              price data, product specifications, and user preferences to deliver personalized shopping experiences.
            </p>
            <p className="mb-4">
              The smart search feature understands natural language queries, allowing you to search for products 
              the way you actually think about them, not just by keywords.
            </p>
            <p>
              Price trend analysis helps you determine the best time to make a purchase, monitoring price 
              histories across multiple stores and predicting future price movements based on historical patterns.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
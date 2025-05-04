import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, AlertCircle, ReceiptText } from 'lucide-react';
import axios from 'axios';

interface Transaction {
  id: string;
  phoneNumber: string;
  type: 'TOP_UP' | 'AIRTIME_PURCHASE' | 'SERVICE_PAYMENT';
  amount: number;
  description: string;
  date: string;
  paybillNumber: string;
}

interface Receipt {
  receiptNumber: string;
  paybillNumber: string;
  date: string;
  phoneNumber: string;
  transactionType: 'TOP_UP' | 'AIRTIME_PURCHASE' | 'SERVICE_PAYMENT';
  amount: string;
  description: string;
  status: 'COMPLETED' | 'FAILED';
  reference: string;
}

export default function PaybillPortal() {
  const [activeTab, setActiveTab] = useState("top-up");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [targetNumber, setTargetNumber] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [reference, setReference] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paybillInfo, setPaybillInfo] = useState<{ paybillNumber: string, name: string, description: string } | null>(null);
  const { toast } = useToast();

  // Load paybill information on component mount
  useEffect(() => {
    fetchPaybillInfo();
  }, []);

  // Check balance and transaction history when phone number changes
  useEffect(() => {
    if (phoneNumber && phoneNumber.length >= 10) {
      fetchBalance();
      fetchTransactions();
    }
  }, [phoneNumber]);

  // Load receipt when transaction is selected
  useEffect(() => {
    if (selectedTransaction) {
      fetchReceipt(selectedTransaction);
    } else {
      setReceipt(null);
    }
  }, [selectedTransaction]);

  // Helper functions for API calls
  const fetchPaybillInfo = async () => {
    try {
      const response = await axios.get('/api/paybill/info');
      if (response.data.success) {
        setPaybillInfo(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch paybill info:', err);
    }
  };

  const fetchBalance = async () => {
    if (!phoneNumber) return;
    
    try {
      const response = await axios.get(`/api/paybill/balance?phoneNumber=${encodeURIComponent(phoneNumber)}`);
      if (response.data.success) {
        setBalance(response.data.balance);
      }
    } catch (err) {
      console.error('Failed to fetch balance:', err);
      setBalance(null);
    }
  };

  const fetchTransactions = async () => {
    if (!phoneNumber) return;
    
    try {
      const response = await axios.get(`/api/paybill/transactions?phoneNumber=${encodeURIComponent(phoneNumber)}`);
      if (response.data.success) {
        setTransactions(response.data.transactions);
      }
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      setTransactions([]);
    }
  };

  const fetchReceipt = async (transactionId: string) => {
    try {
      const response = await axios.get(`/api/paybill/receipt/${transactionId}`);
      if (response.data.success) {
        setReceipt(response.data.receipt);
      }
    } catch (err) {
      console.error('Failed to fetch receipt:', err);
      setReceipt(null);
    }
  };

  // Handle form submissions
  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !amount) {
      setError('Phone number and amount are required');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('/api/paybill/top-up', {
        phoneNumber,
        amount: parseFloat(amount)
      });

      if (response.data.success) {
        setBalance(response.data.balance);
        setSuccess(response.data.message);
        toast({
          title: "Success!",
          description: response.data.message,
        });
        fetchTransactions();
        setAmount("");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process top-up');
      toast({
        title: "Error",
        description: err.response?.data?.message || 'Failed to process top-up',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBuyAirtime = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !amount) {
      setError('Phone number and amount are required');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('/api/paybill/buy-airtime', {
        phoneNumber,
        amount: parseFloat(amount),
        targetNumber: targetNumber || phoneNumber
      });

      if (response.data.success) {
        setBalance(response.data.balance);
        setSuccess(response.data.message);
        toast({
          title: "Success!",
          description: response.data.message,
        });
        fetchTransactions();
        setAmount("");
        if (!targetNumber) setTargetNumber("");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to buy airtime');
      toast({
        title: "Error",
        description: err.response?.data?.message || 'Failed to buy airtime',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !amount || !serviceId) {
      setError('Phone number, service ID, and amount are required');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('/api/paybill/pay-service', {
        phoneNumber,
        serviceId,
        amount: parseFloat(amount),
        reference: reference || null
      });

      if (response.data.success) {
        setBalance(response.data.balance);
        setSuccess(response.data.message);
        toast({
          title: "Success!",
          description: response.data.message,
        });
        fetchTransactions();
        setAmount("");
        setServiceId("");
        setReference("");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process payment');
      toast({
        title: "Error",
        description: err.response?.data?.message || 'Failed to process payment',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <CardTitle className="text-2xl flex items-center">
            <span className="text-3xl font-bold mr-2">{paybillInfo?.paybillNumber || '787878'}</span> E-Top-Up Portal
          </CardTitle>
          <CardDescription className="text-blue-100">
            {paybillInfo?.description || 'Pay for services, buy airtime, and top up your account'}
          </CardDescription>
          <div className="mt-2 text-sm text-blue-100 bg-blue-700 bg-opacity-40 p-2 rounded flex items-center">
            <span className="font-bold mr-1">LOWEST RATES:</span> 
            We offer the most competitive rates in the market - lower than PesaPal and other providers!
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-4">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              placeholder="+254700000000"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1"
            />
          </div>
          
          {phoneNumber && balance !== null && (
            <div className="mb-4 p-3 bg-blue-50 rounded-md">
              <p className="font-semibold">Balance: <span className="text-blue-700">{balance.toFixed(2)}</span></p>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="top-up">Top Up</TabsTrigger>
              <TabsTrigger value="buy-airtime">Buy Airtime</TabsTrigger>
              <TabsTrigger value="pay-service">Pay Service</TabsTrigger>
            </TabsList>
            
            <TabsContent value="top-up">
              <form onSubmit={handleTopUp}>
                <div className="mb-4">
                  <Label htmlFor="topUpAmount">Amount</Label>
                  <Input
                    id="topUpAmount"
                    placeholder="Enter amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || !phoneNumber || !amount}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Top Up"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="buy-airtime">
              <form onSubmit={handleBuyAirtime}>
                <div className="mb-4">
                  <Label htmlFor="airtimeAmount">Amount</Label>
                  <Input
                    id="airtimeAmount"
                    placeholder="Enter amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="targetNumber">Target Number (Optional)</Label>
                  <Input
                    id="targetNumber"
                    placeholder="Leave empty to use your number"
                    value={targetNumber}
                    onChange={(e) => setTargetNumber(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || !phoneNumber || !amount}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Buy Airtime"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="pay-service">
              <form onSubmit={handlePayService}>
                <div className="mb-4">
                  <Label htmlFor="serviceId">Service ID</Label>
                  <Input
                    id="serviceId"
                    placeholder="Enter service ID"
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="serviceAmount">Amount</Label>
                  <Input
                    id="serviceAmount"
                    placeholder="Enter amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="reference">Reference (Optional)</Label>
                  <Input
                    id="reference"
                    placeholder="Enter reference"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || !phoneNumber || !amount || !serviceId}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Pay Service"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mt-4 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-700">Success</AlertTitle>
              <AlertDescription className="text-green-600">{success}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Our Competitive Advantage</CardTitle>
          <CardDescription>Why choose our 787878 E-Top-Up service?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border p-4 rounded-md bg-blue-50">
              <h3 className="text-lg font-semibold mb-2 text-blue-800">Industry-Leading Low Commission Rates</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left p-2 border-b">Service Type</th>
                      <th className="text-left p-2 border-b">Our Rate</th>
                      <th className="text-left p-2 border-b">PesaPal</th>
                      <th className="text-left p-2 border-b">PayPal</th>
                      <th className="text-left p-2 border-b">Your Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border-b">Account Top-Up</td>
                      <td className="p-2 border-b font-bold text-green-600">1.5%</td>
                      <td className="p-2 border-b">2.5-3.5%</td>
                      <td className="p-2 border-b">2.9%+</td>
                      <td className="p-2 border-b text-green-600">Up to 2%</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-b">Airtime Purchase</td>
                      <td className="p-2 border-b font-bold text-green-600">2.5%</td>
                      <td className="p-2 border-b">3-4%</td>
                      <td className="p-2 border-b">2.9%+</td>
                      <td className="p-2 border-b text-green-600">Up to 1.5%</td>
                    </tr>
                    <tr>
                      <td className="p-2">Service Payment</td>
                      <td className="p-2 font-bold text-green-600">2%</td>
                      <td className="p-2">1.5-2.5%</td>
                      <td className="p-2">2.9%+</td>
                      <td className="p-2 text-green-600">Up to 0.9%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm text-gray-600">
                * Rates based on current market research as of May 2025.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border p-4 rounded-md">
                <h4 className="font-semibold mb-2">Fast & Reliable</h4>
                <p className="text-sm text-gray-600">
                  All transactions are processed instantly with real-time confirmations and receipts.
                </p>
              </div>
              <div className="border p-4 rounded-md">
                <h4 className="font-semibold mb-2">Secure</h4>
                <p className="text-sm text-gray-600">
                  Your transactions are protected with bank-grade security measures and encryption.
                </p>
              </div>
              <div className="border p-4 rounded-md">
                <h4 className="font-semibold mb-2">24/7 Support</h4>
                <p className="text-sm text-gray-600">
                  Contact our customer support team any time for assistance with your transactions.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {phoneNumber && transactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Recent transactions for {phoneNumber}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    selectedTransaction === transaction.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedTransaction(transaction.id === selectedTransaction ? null : transaction.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{transaction.type.replace('_', ' ')}</p>
                      <p className="text-sm text-gray-500">{transaction.description}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${transaction.type === 'TOP_UP' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'TOP_UP' ? '+' : '-'}{transaction.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  
                  {selectedTransaction === transaction.id && receipt && (
                    <div className="mt-3 p-3 bg-gray-50 rounded border">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold flex items-center">
                          <ReceiptText className="h-4 w-4 mr-1" /> Receipt
                        </h4>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {receipt.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <p className="text-gray-500">Receipt Number:</p>
                        <p>{receipt.receiptNumber}</p>
                        
                        <p className="text-gray-500">Date:</p>
                        <p>{receipt.date}</p>
                        
                        <p className="text-gray-500">Amount:</p>
                        <p>{receipt.amount}</p>
                        
                        <p className="text-gray-500">Description:</p>
                        <p>{receipt.description}</p>
                        
                        <p className="text-gray-500">Paybill:</p>
                        <p>{receipt.paybillNumber}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
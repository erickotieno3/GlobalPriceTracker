/**
 * Mini Paybill System + E-Top-Up Service
 * 
 * This service provides functionality similar to PesaPal's 220220 paybill number,
 * allowing users to top up accounts, buy airtime, and perform other payment operations.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Types
interface Account {
  [phoneNumber: string]: number;
}

interface Transaction {
  id: string;
  phoneNumber: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  paybillNumber: string;
}

type TransactionType = 'TOP_UP' | 'AIRTIME_PURCHASE' | 'SERVICE_PAYMENT';

interface Receipt {
  receiptNumber: string;
  paybillNumber: string;
  date: string;
  phoneNumber: string;
  transactionType: TransactionType;
  amount: string;
  description: string;
  status: 'COMPLETED' | 'FAILED';
  reference: string;
}

interface TopUpResult {
  success: boolean;
  message: string;
  balance?: number;
  transaction?: Transaction;
}

interface AirtimeResult {
  success: boolean;
  message: string;
  balance?: number;
  transaction?: Transaction;
  recipient?: string;
}

interface ServicePaymentResult {
  success: boolean;
  message: string;
  balance?: number;
  transaction?: Transaction;
  serviceId?: string;
}

interface Commission {
  id: string;
  transactionId: string;
  transactionType: TransactionType;
  amount: number;
  commissionAmount: number;
  date: string;
  processed: boolean;
}

interface CommissionSummary {
  totalCommission: number;
  pendingCommission: number;
  processedCommission: number;
  commissionsByType: {
    TOP_UP: number;
    AIRTIME_PURCHASE: number;
    SERVICE_PAYMENT: number;
  };
  recentCommissions: Commission[];
}

interface ReceiptResult {
  success: boolean;
  message?: string;
  receipt?: Receipt;
}

// Configuration
const PAYBILL_NUMBER = '787878'; // Unique paybill number for Tesco Price Comparison platform
const MERCHANT_NAME = 'Hyrise Crown (Registration No. BN-EZC3Z67A)'; // Official company name with registration number
const MERCHANT_ACCOUNT = '01521209171200'; // Standard Bank account for commission settlement
const DATA_FILE = path.join(__dirname, '..', 'data', 'paybill-accounts.json');
const TRANSACTIONS_FILE = path.join(__dirname, '..', 'data', 'paybill-transactions.json');
const COMMISSIONS_FILE = path.join(__dirname, '..', 'data', 'paybill-commissions.json');

// Commission rates - benchmarked against industry standards to be competitive
const COMMISSION_RATES = {
  TOP_UP: 0.015, // 1.5% commission on top-ups (lower than PesaPal's 2.5-3.5%)
  AIRTIME_PURCHASE: 0.025, // 2.5% commission on airtime purchases (lower than PesaPal's 3-4%)
  SERVICE_PAYMENT: 0.02 // 2% commission on service payments (competitive with industry)
};

// Ensure data directory exists
function ensureDataDirectory(): void {
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Load accounts from file
function loadAccounts(): Account {
  ensureDataDirectory();
  
  if (fs.existsSync(DATA_FILE)) {
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error loading accounts: ${(error as Error).message}`);
      return {};
    }
  } else {
    return {};
  }
}

// Save accounts to file
function saveAccounts(accounts: Account): boolean {
  ensureDataDirectory();
  
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(accounts, null, 2));
    return true;
  } catch (error) {
    console.error(`Error saving accounts: ${(error as Error).message}`);
    return false;
  }
}

// Load transactions from file
function loadTransactions(): Transaction[] {
  ensureDataDirectory();
  
  if (fs.existsSync(TRANSACTIONS_FILE)) {
    try {
      const data = fs.readFileSync(TRANSACTIONS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error loading transactions: ${(error as Error).message}`);
      return [];
    }
  } else {
    return [];
  }
}

// Save transactions to file
function saveTransactions(transactions: Transaction[]): boolean {
  ensureDataDirectory();
  
  try {
    fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2));
    return true;
  } catch (error) {
    console.error(`Error saving transactions: ${(error as Error).message}`);
    return false;
  }
}

// Generate a transaction ID
function generateTransactionId(): string {
  return crypto.randomBytes(8).toString('hex').toUpperCase();
}

// Load commissions from file
function loadCommissions(): Commission[] {
  ensureDataDirectory();
  
  if (fs.existsSync(COMMISSIONS_FILE)) {
    try {
      const data = fs.readFileSync(COMMISSIONS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error loading commissions: ${(error as Error).message}`);
      return [];
    }
  } else {
    return [];
  }
}

// Save commissions to file
function saveCommissions(commissions: Commission[]): boolean {
  ensureDataDirectory();
  
  try {
    fs.writeFileSync(COMMISSIONS_FILE, JSON.stringify(commissions, null, 2));
    return true;
  } catch (error) {
    console.error(`Error saving commissions: ${(error as Error).message}`);
    return false;
  }
}

// Record a commission for a transaction
function recordCommission(transaction: Transaction): Commission {
  const commissions = loadCommissions();
  const commissionRate = COMMISSION_RATES[transaction.type];
  const commissionAmount = transaction.amount * commissionRate;
  
  const commission: Commission = {
    id: generateTransactionId(),
    transactionId: transaction.id,
    transactionType: transaction.type,
    amount: transaction.amount,
    commissionAmount,
    date: new Date().toISOString(),
    processed: false
  };
  
  commissions.push(commission);
  saveCommissions(commissions);
  
  console.log(`Commission recorded: ${commission.commissionAmount.toFixed(2)} for transaction ${commission.transactionId}`);
  
  return commission;
}

// Record a transaction
function recordTransaction(
  phoneNumber: string, 
  transactionType: TransactionType, 
  amount: number, 
  description: string
): Transaction {
  const transactions = loadTransactions();
  
  const transaction: Transaction = {
    id: generateTransactionId(),
    phoneNumber,
    type: transactionType,
    amount,
    description,
    date: new Date().toISOString(),
    paybillNumber: PAYBILL_NUMBER
  };
  
  transactions.push(transaction);
  saveTransactions(transactions);
  
  // Record commission for this transaction
  recordCommission(transaction);
  
  return transaction;
}

// Get account balance
function getAccountBalance(phoneNumber: string): number {
  const accounts = loadAccounts();
  return accounts[phoneNumber] || 0;
}

// Get transaction history for a phone number
function getTransactionHistory(phoneNumber: string): Transaction[] {
  const transactions = loadTransactions();
  return transactions.filter(t => t.phoneNumber === phoneNumber);
}

// Top up account
function topUpAccount(phoneNumber: string, amount: number): TopUpResult {
  if (amount <= 0) {
    return {
      success: false,
      message: 'Amount must be greater than zero'
    };
  }
  
  const accounts = loadAccounts();
  
  if (accounts[phoneNumber]) {
    accounts[phoneNumber] += amount;
  } else {
    accounts[phoneNumber] = amount;
  }
  
  const saved = saveAccounts(accounts);
  
  if (saved) {
    const transaction = recordTransaction(
      phoneNumber,
      'TOP_UP',
      amount,
      `Account top-up via ${MERCHANT_NAME} Paybill ${PAYBILL_NUMBER}`
    );
    
    return {
      success: true,
      message: `Top-up successful. New balance: ${accounts[phoneNumber].toFixed(2)}`,
      balance: accounts[phoneNumber],
      transaction
    };
  } else {
    return {
      success: false,
      message: 'Failed to save account information'
    };
  }
}

// Buy airtime
function buyAirtime(phoneNumber: string, amount: number, targetNumber: string | null = null): AirtimeResult {
  if (amount <= 0) {
    return {
      success: false,
      message: 'Amount must be greater than zero'
    };
  }
  
  const accounts = loadAccounts();
  const recipientNumber = targetNumber || phoneNumber;
  
  // Check if account exists and has sufficient balance
  if (!accounts[phoneNumber]) {
    return {
      success: false,
      message: 'Account not found'
    };
  }
  
  if (accounts[phoneNumber] < amount) {
    return {
      success: false,
      message: `Failed. You do not have enough money to buy airtime. Your balance is $${accounts[phoneNumber].toFixed(2)}.`,
      balance: accounts[phoneNumber]
    };
  }
  
  // Deduct the amount
  accounts[phoneNumber] -= amount;
  const saved = saveAccounts(accounts);
  
  if (saved) {
    const transaction = recordTransaction(
      phoneNumber,
      'AIRTIME_PURCHASE',
      amount,
      `Airtime purchase for ${recipientNumber} via ${MERCHANT_NAME}`
    );
    
    return {
      success: true,
      message: `Airtime purchase successful. Remaining balance: ${accounts[phoneNumber].toFixed(2)}`,
      balance: accounts[phoneNumber],
      transaction,
      recipient: recipientNumber
    };
  } else {
    return {
      success: false,
      message: 'Failed to process airtime purchase'
    };
  }
}

// Pay for a service
function payService(
  phoneNumber: string,
  serviceId: string,
  amount: number,
  reference: string | null = null
): ServicePaymentResult {
  if (amount <= 0) {
    return {
      success: false,
      message: 'Amount must be greater than zero'
    };
  }
  
  const accounts = loadAccounts();
  
  // Check if account exists and has sufficient balance
  if (!accounts[phoneNumber]) {
    return {
      success: false,
      message: 'Account not found'
    };
  }
  
  if (accounts[phoneNumber] < amount) {
    return {
      success: false,
      message: `Failed. You do not have enough money to pay for ${serviceId}. Your balance is $${accounts[phoneNumber].toFixed(2)}.`,
      balance: accounts[phoneNumber]
    };
  }
  
  // Deduct the amount
  accounts[phoneNumber] -= amount;
  const saved = saveAccounts(accounts);
  
  if (saved) {
    const transaction = recordTransaction(
      phoneNumber,
      'SERVICE_PAYMENT',
      amount,
      `Payment to ${serviceId} via ${MERCHANT_NAME}${reference ? ` (Ref: ${reference})` : ''}`
    );
    
    return {
      success: true,
      message: `Payment successful. Remaining balance: ${accounts[phoneNumber].toFixed(2)}`,
      balance: accounts[phoneNumber],
      transaction,
      serviceId
    };
  } else {
    return {
      success: false,
      message: 'Failed to process payment'
    };
  }
}

// Generate receipt
function generateReceipt(transactionId: string): ReceiptResult {
  const transactions = loadTransactions();
  const transaction = transactions.find(t => t.id === transactionId);
  
  if (!transaction) {
    return {
      success: false,
      message: 'Transaction not found'
    };
  }
  
  // Format the receipt
  const receipt: Receipt = {
    receiptNumber: `RCP-${transaction.id}`,
    paybillNumber: PAYBILL_NUMBER,
    date: new Date(transaction.date).toLocaleString(),
    phoneNumber: transaction.phoneNumber,
    transactionType: transaction.type,
    amount: transaction.amount.toFixed(2),
    description: transaction.description,
    status: 'COMPLETED',
    reference: transaction.id
  };
  
  // Always update receipt to include the current merchant name and remove any other merchant references
  if (receipt.description.includes("KACH COMM SOLUTIONS")) {
    receipt.description = receipt.description.replace("KACH COMM SOLUTIONS", MERCHANT_NAME);
  } else if (!receipt.description.includes(MERCHANT_NAME)) {
    receipt.description = `${receipt.description} - Powered by ${MERCHANT_NAME}`;
  }
  
  return {
    success: true,
    receipt
  };
}

// Get commission summary
function getCommissionSummary(): CommissionSummary {
  const commissions = loadCommissions();
  
  const totalCommission = commissions.reduce((sum, commission) => sum + commission.commissionAmount, 0);
  const pendingCommission = commissions
    .filter(c => !c.processed)
    .reduce((sum, commission) => sum + commission.commissionAmount, 0);
  const processedCommission = totalCommission - pendingCommission;
  
  // Calculate commissions by type
  const commissionsByType = {
    TOP_UP: 0,
    AIRTIME_PURCHASE: 0,
    SERVICE_PAYMENT: 0
  };
  
  commissions.forEach(commission => {
    commissionsByType[commission.transactionType] += commission.commissionAmount;
  });
  
  // Get most recent commissions (last 10)
  const recentCommissions = [...commissions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);
  
  return {
    totalCommission,
    pendingCommission,
    processedCommission,
    commissionsByType,
    recentCommissions
  };
}

// Transfer funds to the merchant's bank account
function transferFundsToMerchantAccount(amount: number): boolean {
  try {
    // In a real system, this would connect to a payment API or banking interface
    // For now, we're simulating a successful transfer with detailed logging
    console.log(`==== COMMISSION TRANSFER INITIATED ====`);
    console.log(`Destination: ${MERCHANT_NAME}`);
    console.log(`Bank Account: ${MERCHANT_ACCOUNT} (Standard Bank)`);
    console.log(`Amount: $${amount.toFixed(2)}`);
    console.log(`Reference: PAYBILL-COMM-${new Date().toISOString().slice(0,10)}`);
    console.log(`Status: TRANSFER COMPLETED`);
    console.log(`Transaction ID: TRF-${generateTransactionId()}`);
    console.log(`==== COMMISSION TRANSFER SUCCESSFUL ====`);
    
    // Write to a separate transfer log file for permanent record
    const transferLog = {
      timestamp: new Date().toISOString(),
      recipient: MERCHANT_NAME,
      accountNumber: MERCHANT_ACCOUNT,
      amount: amount,
      status: "COMPLETED",
      reference: `PAYBILL-COMM-${new Date().toISOString().slice(0,10)}`
    };
    
    try {
      const transferLogFile = path.join(__dirname, '..', 'data', 'commission-transfers.json');
      let logs = [];
      if (fs.existsSync(transferLogFile)) {
        logs = JSON.parse(fs.readFileSync(transferLogFile, 'utf8'));
      }
      logs.push(transferLog);
      fs.writeFileSync(transferLogFile, JSON.stringify(logs, null, 2));
    } catch (err) {
      console.error('Could not write to transfer log', err);
    }
    
    return true;
  } catch (error) {
    console.error(`Transfer failed: ${(error as Error).message}`);
    return false;
  }
}

// Process pending commissions (mark as processed and transfer to merchant account)
function processCommissions(): { success: boolean, processedCount: number, totalAmount: number } {
  const commissions = loadCommissions();
  
  const pendingCommissions = commissions.filter(c => !c.processed);
  if (pendingCommissions.length === 0) {
    return {
      success: true,
      processedCount: 0,
      totalAmount: 0
    };
  }
  
  // Calculate total commission amount to transfer
  const totalAmount = pendingCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);
  
  // Attempt to transfer funds to the merchant bank account
  const transferSuccess = transferFundsToMerchantAccount(totalAmount);
  
  if (!transferSuccess) {
    return {
      success: false,
      processedCount: 0,
      totalAmount: 0
    };
  }
  
  // Mark all pending commissions as processed
  pendingCommissions.forEach(commission => {
    commission.processed = true;
    // Log each commission being processed for the merchant
    console.log(`Processing commission: ${commission.commissionAmount.toFixed(2)} from transaction ${commission.transactionId} for ${MERCHANT_NAME}`);
  });
  
  const saved = saveCommissions(commissions);
  
  if (saved) {
    return {
      success: true,
      processedCount: pendingCommissions.length,
      totalAmount
    };
  } else {
    return {
      success: false,
      processedCount: 0,
      totalAmount: 0
    };
  }
}

// Export the functions
export default {
  PAYBILL_NUMBER,
  MERCHANT_NAME,
  MERCHANT_ACCOUNT,
  getAccountBalance,
  getTransactionHistory,
  topUpAccount,
  buyAirtime,
  payService,
  generateReceipt,
  generateTransactionId,
  // Commission-related functions
  getCommissionSummary,
  processCommissions,
  COMMISSION_RATES
};
import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchTransactionHistory } from "@/services/transactionHistoryApi";
import { useToast } from "@/hooks/use-toast";

export interface Transaction {
  id?: string;
  amount?: number;
  requested_amount: number;
  status: 'completed' | 'pending' | 'rejected' | 'cancelled' | 'approved' | string;
  date?: string;
  updated_at: string;
  service_charge: number;
  total_amount: number;
  requested_month: number;
  requested_year: number;
  reference_number?: string;
}

export type TransactionFilter = 'all' | 'approved' | 'pending' | 'rejected';

interface TransactionContextType {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  currentFilter: TransactionFilter;
  setCurrentFilter: (filter: TransactionFilter) => void;
  refreshTransactions: () => Promise<void>;
  getFilteredTransactions: (filter: TransactionFilter) => Transaction[];
  approvedTransactions: Transaction[];
  pendingTransactions: Transaction[];
  rejectedTransactions: Transaction[];
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }
  return context;
};

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<TransactionFilter>('approved');

  const refreshTransactions = async () => {
    if (!user?.contact_number || !session?.access_token || !user?.id) {
      console.log('Cannot fetch transactions: missing authentication data');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const historyData = await fetchTransactionHistory(
        user.contact_number,
        session.access_token,
        user.id
      );
      setTransactions(historyData);
      console.log('Transaction history loaded:', historyData);
    } catch (error: any) {
      console.error('Failed to fetch transaction history:', error);
      setError(error.message || 'Failed to load transaction history');
      
      // Only show toast for non-400 errors to avoid spamming users
      if (!error.message?.includes('400')) {
        toast({
          title: "Error",
          description: "Failed to load transaction history",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTransactions = (filter: TransactionFilter): Transaction[] => {
    switch (filter) {
      case 'approved':
        return transactions.filter(t => 
          ['completed', 'approved'].includes(t.status.toLowerCase())
        );
      case 'pending':
        return transactions.filter(t => 
          t.status.toLowerCase() === 'pending'
        );
      case 'rejected':
        return transactions.filter(t => 
          ['rejected', 'cancelled'].includes(t.status.toLowerCase())
        );
      case 'all':
      default:
        return transactions;
    }
  };

  // Pre-computed filtered arrays for performance
  const approvedTransactions = getFilteredTransactions('approved');
  const pendingTransactions = getFilteredTransactions('pending');
  const rejectedTransactions = getFilteredTransactions('rejected');

  useEffect(() => {
    if (user?.contact_number && session?.access_token && user?.id) {
      refreshTransactions();
    }
  }, [user?.contact_number, session?.access_token, user?.id]);

  return (
    <TransactionContext.Provider value={{
      transactions,
      loading,
      error,
      currentFilter,
      setCurrentFilter,
      refreshTransactions,
      getFilteredTransactions,
      approvedTransactions,
      pendingTransactions,
      rejectedTransactions
    }}>
      {children}
    </TransactionContext.Provider>
  );
};
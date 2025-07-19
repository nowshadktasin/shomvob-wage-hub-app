
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { fetchTransactionHistory } from "@/services/transactionHistoryApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HistoryTabContent from "@/components/history/HistoryTabContent";

interface Transaction {
  total_amount: number;
  requested_amount: number;
  service_charge: number;
  status: string;
  requested_month: number;
  requested_year: number;
  updated_at: string;
}

const History: React.FC = () => {
  const { t } = useTranslation();
  const { user, session } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTransactionHistory = async () => {
    if (!user?.contact_number || !session?.access_token || !user?.id) {
      return;
    }

    setLoading(true);
    try {
      const historyData = await fetchTransactionHistory(
        user.contact_number,
        session.access_token,
        user.id
      );
      setTransactions(historyData);
      console.log('Transaction history loaded:', historyData);
    } catch (error) {
      console.error('Failed to fetch transaction history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.contact_number && session?.access_token && user?.id) {
      loadTransactionHistory();
    }
  }, [user?.contact_number, session?.access_token, user?.id]);

  // Filter transactions by status
  const approvedTransactions = transactions.filter(t => 
    ['completed', 'approved'].includes(t.status.toLowerCase())
  );
  
  const pendingTransactions = transactions.filter(t => 
    t.status.toLowerCase() === 'pending'
  );
  
  const rejectedTransactions = transactions.filter(t => 
    ['rejected', 'cancelled'].includes(t.status.toLowerCase())
  );

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) {
      return `${t("common.currency")} 0`;
    }
    return `${t("common.currency")} ${amount.toLocaleString()}`;
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-6 font-siliguri">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t("history.title")}</h1>
      </div>

      <Tabs defaultValue="approved" className="w-full">
        <TabsList className="grid grid-cols-3 w-full mb-6">
          <TabsTrigger value="approved" className="text-sm">
            {t("history.approved")}
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-sm">
            {t("history.pending")}
          </TabsTrigger>
          <TabsTrigger value="rejected" className="text-sm">
            {t("history.rejected")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="approved">
          <HistoryTabContent
            transactions={approvedTransactions}
            loading={loading}
            emptyMessage="No approved transactions found"
            formatCurrency={formatCurrency}
          />
        </TabsContent>

        <TabsContent value="pending">
          <HistoryTabContent
            transactions={pendingTransactions}
            loading={loading}
            emptyMessage="No pending transactions found"
            formatCurrency={formatCurrency}
          />
        </TabsContent>

        <TabsContent value="rejected">
          <HistoryTabContent
            transactions={rejectedTransactions}
            loading={loading}
            emptyMessage="No rejected transactions found"
            formatCurrency={formatCurrency}
          />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default History;

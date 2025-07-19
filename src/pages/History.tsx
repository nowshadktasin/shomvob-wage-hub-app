import React from "react";
import { useTranslation } from "react-i18next";
import { useTransactions } from "@/contexts/TransactionContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HistoryTabContent from "@/components/history/HistoryTabContent";

const History: React.FC = () => {
  const { t } = useTranslation();
  const { 
    approvedTransactions, 
    pendingTransactions, 
    rejectedTransactions, 
    loading,
    currentFilter,
    setCurrentFilter
  } = useTransactions();

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) {
      return `${t("common.currency")} 0`;
    }
    return `${t("common.currency")} ${amount.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="container max-w-md mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">{t("history.title")}</h1>
        </div>

        <Tabs 
          defaultValue="approved" 
          className="w-full"
          value={currentFilter}
          onValueChange={(value) => setCurrentFilter(value as any)}
        >
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
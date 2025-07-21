
import React, { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Transaction } from "@/contexts/TransactionContext";
import TransactionCard from "./TransactionCard";
import AnimatedLoader from "@/components/common/AnimatedLoader";

interface HistoryTabContentProps {
  transactions: Transaction[];
  loading: boolean;
  emptyMessage: string;
  formatCurrency: (amount: number | undefined) => string;
}

const HistoryTabContent: React.FC<HistoryTabContentProps> = ({
  transactions,
  loading,
  emptyMessage,
  formatCurrency,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <AnimatedLoader size="large" text="Loading transactions..." />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          {emptyMessage}
        </CardContent>
      </Card>
    );
  }

  // Sort transactions by updated_at in descending order (latest first)
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  return (
    <div className="space-y-3">
      {sortedTransactions.map((transaction, index) => (
        <TransactionCard
          key={`${transaction.requested_month}-${transaction.requested_year}-${index}`}
          transaction={transaction}
          formatCurrency={formatCurrency}
        />
      ))}
    </div>
  );
};

// Optimize with React.memo for better performance
export default memo(HistoryTabContent);


import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Transaction {
  total_amount: number;
  requested_amount: number;
  service_charge: number;
  status: string;
  requested_month: number;
  requested_year: number;
  updated_at: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  formatCurrency: (amount: number | undefined) => string;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  formatCurrency,
}) => {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  
  // Sort transactions by updated_at in descending order (latest first)
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
  
  // Show only first 3 transactions unless "View More" is clicked
  const displayedTransactions = showAll ? sortedTransactions : sortedTransactions.slice(0, 3);
  const hasMoreTransactions = sortedTransactions.length > 3;

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "completed":
      case "approved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
            {status}
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            {status}
          </Badge>
        );
      case "rejected":
      case "cancelled":
        return (
          <Badge variant="default" className="bg-red-100 text-red-800 hover:bg-red-100">
            {status}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Format as dd-mm-yyyy (Bangladeshi format)
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{t("earnings.history")}</h2>
      {transactions.length === 0 ? (
        <Card>
          <CardContent className="p-4 text-center text-muted-foreground">
            No transaction history available
          </CardContent>
        </Card>
      ) : (
        <>
          {displayedTransactions.map((transaction, index) => (
            <Card key={`${transaction.requested_month}-${transaction.requested_year}-${index}`}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{formatCurrency(transaction.requested_amount)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(transaction.updated_at)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Service charge: {formatCurrency(transaction.service_charge)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {hasMoreTransactions && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAll(!showAll)}
                className="w-full"
              >
                {showAll ? "View Less" : "View More"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TransactionHistory;


import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  id: number;
  date: Date;
  amount: number;
  status: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date) => string;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  formatCurrency,
  formatDate,
}) => {
  const { t } = useTranslation();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
            {t(`earnings.status.${status}`)}
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            {t(`earnings.status.${status}`)}
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="default" className="bg-red-100 text-red-800 hover:bg-red-100">
            {t(`earnings.status.${status}`)}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {t(`earnings.status.${status}`)}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{t("earnings.history")}</h2>
      {transactions.map((transaction) => (
        <Card key={transaction.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{formatCurrency(transaction.amount)}</p>
                <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
              </div>
              <div className="flex items-center">
                {getStatusBadge(transaction.status)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TransactionHistory;

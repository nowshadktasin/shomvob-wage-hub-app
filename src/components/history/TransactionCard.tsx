
import React, { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/contexts/TransactionContext";

interface TransactionCardProps {
  transaction: Transaction;
  formatCurrency: (amount: number | undefined) => string;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  formatCurrency,
}) => {
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
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <p className="text-lg font-semibold text-foreground">
              {formatCurrency(transaction.requested_amount)}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDate(transaction.updated_at)}
            </p>
          </div>
          <div className="ml-4">
            {getStatusBadge(transaction.status)}
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Service charge:</span>
            <span>{formatCurrency(transaction.service_charge)}</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Total amount:</span>
            <span>{formatCurrency(transaction.total_amount)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Optimize with React.memo to prevent unnecessary re-renders
export default memo(TransactionCard);

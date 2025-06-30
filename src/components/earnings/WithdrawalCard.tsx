
import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface WithdrawalCardProps {
  withdrawAmount: number;
  minWages: number;
  availableToWithdraw: number;
  serviceChargePercentage: number;
  isSubmitting: boolean;
  isEnabled: boolean;
  onWithdrawAmountChange: (value: number) => void;
  onWithdraw: () => void;
  formatCurrency: (amount: number) => string;
}

const WithdrawalCard: React.FC<WithdrawalCardProps> = ({
  withdrawAmount,
  minWages,
  availableToWithdraw,
  serviceChargePercentage,
  isSubmitting,
  isEnabled,
  onWithdrawAmountChange,
  onWithdraw,
  formatCurrency,
}) => {
  const { t } = useTranslation();
  
  const serviceFee = (withdrawAmount * serviceChargePercentage) / 100;
  const totalAmount = withdrawAmount + serviceFee;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">{t("earnings.requestAmount")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="px-4 py-2 bg-gray-50 rounded-lg">
            <Slider
              value={[withdrawAmount]}
              min={minWages}
              max={availableToWithdraw}
              step={100}
              onValueChange={(value) => onWithdrawAmountChange(value[0])}
              className="mx-2"
              disabled={availableToWithdraw < minWages || isSubmitting}
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground px-2">
            <span>৳{minWages.toLocaleString()}</span>
            <span className="font-medium text-primary">৳{withdrawAmount.toLocaleString()}</span>
            <span>৳{availableToWithdraw.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="p-4 bg-muted rounded-md">
          <div className="flex justify-between mb-2">
            <span>{t("earnings.requestAmount")}</span>
            <span>{formatCurrency(withdrawAmount)}</span>
          </div>
          <div className="flex justify-between mb-2 text-muted-foreground">
            <span>{t("earnings.serviceFee")} ({serviceChargePercentage}%)</span>
            <span>+ {formatCurrency(serviceFee)}</span>
          </div>
          <div className="border-t my-2 pt-2 flex justify-between font-medium">
            <span>{t("earnings.totalAmount")}</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={onWithdraw}
          disabled={availableToWithdraw < minWages || withdrawAmount <= 0 || !isEnabled || isSubmitting}
        >
          {isSubmitting ? "Submitting..." : t("earnings.withdraw")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WithdrawalCard;

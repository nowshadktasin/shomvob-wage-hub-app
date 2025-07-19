
import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface EWARequestSectionProps {
  withdrawAmount: number;
  minWages: number;
  availableToWithdraw: number;
  calculateServiceFee: (amount: number) => number;
  isSubmitting: boolean;
  isEnabled: boolean;
  hasPendingRequest: boolean;
  onWithdrawAmountChange: (value: number) => void;
  onWithdraw: () => void;
  formatCurrency: (amount: number) => string;
}

const EWARequestSection: React.FC<EWARequestSectionProps> = ({
  withdrawAmount,
  minWages,
  availableToWithdraw,
  calculateServiceFee,
  isSubmitting,
  isEnabled,
  hasPendingRequest,
  onWithdrawAmountChange,
  onWithdraw,
  formatCurrency,
}) => {
  const { t } = useTranslation();
  
  const serviceFee = calculateServiceFee(withdrawAmount);
  const totalAmount = withdrawAmount + serviceFee;

  const getButtonText = () => {
    if (isSubmitting) return "Submitting...";
    return t("ewa.withdraw");
  };

  const isButtonDisabled = 
    availableToWithdraw < minWages || 
    withdrawAmount <= 0 || 
    !isEnabled || 
    isSubmitting;

  if (!isEnabled) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("ewa.requestAmount")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="px-4">
            <Slider
              value={[withdrawAmount]}
              min={minWages}
              max={availableToWithdraw}
              step={100}
              onValueChange={(value) => onWithdrawAmountChange(value[0])}
              className="mb-6"
              disabled={availableToWithdraw < minWages || isSubmitting}
            />
          </div>
          <div className="flex justify-between items-center text-sm px-2">
            <span>৳{minWages.toLocaleString()}</span>
            <div className="text-2xl font-bold text-primary">
              ৳{withdrawAmount.toLocaleString()}
            </div>
            <span>৳{availableToWithdraw.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-sm">{t("ewa.requestAmount")}</span>
            <span className="text-sm font-medium">{formatCurrency(withdrawAmount)}</span>
          </div>
          <div className="flex justify-between mb-2 text-sm text-muted-foreground">
            <span>{t("ewa.serviceFee")}</span>
            <span>+ {formatCurrency(serviceFee)}</span>
          </div>
          <div className="border-t my-2 pt-2 flex justify-between font-medium">
            <span>{t("ewa.totalAmount")}</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        {hasPendingRequest && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              You have a pending request. You can still submit a new request, but it may be subject to approval policies.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={onWithdraw}
          disabled={isButtonDisabled}
        >
          {getButtonText()}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EWARequestSection;

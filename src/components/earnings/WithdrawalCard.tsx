
import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import AnimatedLoader from "@/components/common/AnimatedLoader";

interface WithdrawalCardProps {
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

const WithdrawalCard: React.FC<WithdrawalCardProps> = ({
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

  const getButtonContent = () => {
    if (isSubmitting) {
      return (
        <div className="flex items-center gap-2">
          <AnimatedLoader size="small" />
          <span>Submitting...</span>
        </div>
      );
    }
    return t("earnings.withdraw");
  };

  const isButtonDisabled = 
    availableToWithdraw < minWages || 
    withdrawAmount <= 0 || 
    !isEnabled || 
    isSubmitting;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">{t("earnings.requestAmount")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="px-2">
            <Slider
              value={[withdrawAmount]}
              min={minWages}
              max={availableToWithdraw}
              step={100}
              onValueChange={(value) => onWithdrawAmountChange(value[0])}
              className="mb-6 h-6"
              disabled={availableToWithdraw < minWages || isSubmitting}
            />
          </div>
          <div className="flex justify-between items-center text-sm px-1">
            <span className="text-xs text-muted-foreground">৳{minWages.toLocaleString()}</span>
            <div className="text-2xl font-bold text-primary bg-primary/10 px-4 py-2 rounded-lg">
              ৳{withdrawAmount.toLocaleString()}
            </div>
            <span className="text-xs text-muted-foreground">৳{availableToWithdraw.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="p-4 bg-muted/50 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">{t("earnings.requestAmount")}</span>
            <span className="font-medium">{formatCurrency(withdrawAmount)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">{t("earnings.serviceFee")}</span>
            <span className="text-muted-foreground">+ {formatCurrency(serviceFee)}</span>
          </div>
          <div className="border-t pt-3 flex justify-between items-center">
            <span className="font-semibold">{t("earnings.totalAmount")}</span>
            <span className="font-bold text-lg text-primary">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        {hasPendingRequest && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              You have a pending request. Please wait for approval or contact support if you need assistance.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full h-12 text-base font-semibold" 
          onClick={onWithdraw}
          disabled={isButtonDisabled}
        >
          {getButtonContent()}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WithdrawalCard;

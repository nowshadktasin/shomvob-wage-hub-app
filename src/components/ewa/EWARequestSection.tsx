
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

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
  const [inputValue, setInputValue] = useState(withdrawAmount.toString());
  
  const serviceFee = calculateServiceFee(withdrawAmount);
  const totalAmount = withdrawAmount + serviceFee;

  // Update input value when withdrawAmount changes from slider
  useEffect(() => {
    setInputValue(withdrawAmount.toString());
  }, [withdrawAmount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue);
    if (!isNaN(numValue) && numValue >= minWages && numValue <= availableToWithdraw) {
      // Round to nearest 100
      const roundedValue = Math.round(numValue / 100) * 100;
      onWithdrawAmountChange(roundedValue);
      setInputValue(roundedValue.toString());
    } else {
      // Reset to current valid value if invalid input
      setInputValue(withdrawAmount.toString());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

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
            <div className="relative">
              <Input
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyPress={handleKeyPress}
                className="text-2xl font-bold text-primary bg-primary/10 border-none text-center w-32 h-12 px-2"
                placeholder="Amount"
                disabled={availableToWithdraw < minWages || isSubmitting}
              />
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-primary pointer-events-none">৳</span>
            </div>
            <span className="text-xs text-muted-foreground">৳{availableToWithdraw.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="p-4 bg-muted/50 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">{t("ewa.requestAmount")}</span>
            <span className="font-medium">{formatCurrency(withdrawAmount)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">{t("ewa.serviceFee")}</span>
            <span className="text-muted-foreground">+ {formatCurrency(serviceFee)}</span>
          </div>
          <div className="border-t pt-3 flex justify-between items-center">
            <span className="font-semibold">{t("ewa.totalAmount")}</span>
            <span className="font-bold text-lg text-primary">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        {hasPendingRequest && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              {t("ewa.pendingNotice")}
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
          {getButtonText()}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EWARequestSection;

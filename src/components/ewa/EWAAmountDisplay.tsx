
import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet } from "lucide-react";

interface EWAAmountDisplayProps {
  availableToWithdraw: number;
  formatCurrency: (amount: number) => string;
  isEnabled: boolean;
}

const EWAAmountDisplay: React.FC<EWAAmountDisplayProps> = ({
  availableToWithdraw,
  formatCurrency,
  isEnabled,
}) => {
  const { t } = useTranslation();

  if (!isEnabled) {
    return (
      <Card className="mb-6">
        <CardContent className="p-8 text-center">
          <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold mb-2">{t("ewa.disabled")}</h2>
          <p className="text-sm text-muted-foreground">{t("ewa.disabledMessage")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-primary/80 p-8 text-center text-primary-foreground">
        <div className="flex justify-center mb-4">
          <Wallet className="h-8 w-8" />
        </div>
        <h2 className="text-sm font-medium opacity-90 mb-2">{t("ewa.availableToWithdraw")}</h2>
        <p className="text-4xl font-bold mb-2">{formatCurrency(availableToWithdraw)}</p>
      </div>
    </Card>
  );
};

export default EWAAmountDisplay;

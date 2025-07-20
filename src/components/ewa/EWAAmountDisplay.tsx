
import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Wallet, Info } from "lucide-react";

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
    <TooltipProvider>
      <Card className="mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 p-8 text-center text-primary-foreground">
          <div className="flex justify-center mb-4">
            <Wallet className="h-8 w-8" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <h2 className="text-sm font-medium opacity-90">{t("ewa.availableToWithdraw")}</h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 opacity-70 cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs p-3 text-sm bg-background text-foreground border shadow-lg">
                <p>{t("earnings.tooltips.availableToWithdraw")}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-4xl font-bold mb-2">{formatCurrency(availableToWithdraw)}</p>
        </div>
      </Card>
    </TooltipProvider>
  );
};

export default EWAAmountDisplay;

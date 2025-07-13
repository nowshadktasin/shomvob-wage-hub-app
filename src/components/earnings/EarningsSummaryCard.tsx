
import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface EarningsSummaryCardProps {
  periodProgress: number;
  availableToWithdraw: number;
  totalEarned: number;
  advancePercentage: number;
  formatCurrency: (amount: number) => string;
}

const EarningsSummaryCard: React.FC<EarningsSummaryCardProps> = ({
  periodProgress,
  availableToWithdraw,
  totalEarned,
  advancePercentage,
  formatCurrency,
}) => {
  const { t } = useTranslation();

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{t("earnings.currentPeriod")}</CardTitle>
        <CardDescription>
          {periodProgress}% {t("earnings.complete")}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <Progress value={periodProgress} className="h-2" />
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <p className="text-sm text-muted-foreground h-8 flex items-center">{t("earnings.available")}</p>
            <p className="text-2xl font-semibold">{formatCurrency(availableToWithdraw)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground h-8 flex items-center whitespace-pre-line">{t("earnings.totalEarned")}</p>
            <p className="text-2xl font-semibold">{formatCurrency(totalEarned)}</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-muted-foreground">{t("earnings.advanceLimit")}</p>
          <div className="flex items-center gap-2">
            <Progress 
              value={advancePercentage} 
              max={100}
              className="h-2 bg-gray-200"
            />
            <span className="text-sm font-medium">{advancePercentage}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EarningsSummaryCard;


import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

interface EWADetailsSectionProps {
  earningsData: any;
  formatCurrency: (amount: number) => string;
}

const EWADetailsSection: React.FC<EWADetailsSectionProps> = ({
  earningsData,
  formatCurrency,
}) => {
  const { t } = useTranslation();

  if (!earningsData) {
    return null;
  }

  const totalEarned = earningsData.total_earnings_completed || 0;
  const availableToWithdraw = earningsData.claimable_wages || 0;
  const periodProgress = earningsData.earnings_completed_percentage || 0;
  const advancePercentage = earningsData.claimable_wages_percentage || 60;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{t("earnings.myEarnings")}</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary">
            {t("common.refresh")}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">{t("earnings.currentPeriod")}</span>
            <span className="text-sm font-medium">{periodProgress}% {t("earnings.complete")}</span>
          </div>
          <Progress value={periodProgress} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{t("ewa.availableToWithdraw")}</p>
            <p className="text-xl font-bold">{formatCurrency(availableToWithdraw)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">{t("earnings.totalEarned")}</p>
            <p className="text-xl font-bold">{formatCurrency(totalEarned)}</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">{t("earnings.advanceLimit")}</span>
            <span className="text-sm font-medium">{advancePercentage}%</span>
          </div>
          <Progress value={advancePercentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default EWADetailsSection;

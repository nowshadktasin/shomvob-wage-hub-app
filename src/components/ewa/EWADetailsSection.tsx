
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";

interface EWADetailsSectionProps {
  earningsData: any;
  formatCurrency: (amount: number) => string;
}

const EWADetailsSection: React.FC<EWADetailsSectionProps> = ({
  earningsData,
  formatCurrency,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  if (!earningsData) {
    return null;
  }

  const totalEarned = earningsData.total_earnings_completed || 0;
  const availableToWithdraw = earningsData.claimable_wages || 0;
  const periodProgress = earningsData.earnings_completed_percentage || 0;
  const advancePercentage = earningsData.claimable_wages_percentage || 60;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">{t("earnings.myEarnings")}</CardTitle>
              <Button variant="ghost" size="sm">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-end mb-4">
              <Button variant="ghost" size="sm" className="text-primary gap-2">
                <RefreshCw className="h-4 w-4" />
                {t("common.refresh")}
              </Button>
            </div>
            
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
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default EWADetailsSection;

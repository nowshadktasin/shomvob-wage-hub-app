
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
  const [isOpen, setIsOpen] = useState(false);

  if (!earningsData) {
    return null;
  }

  const totalEarned = earningsData.total_earnings_completed || 0;
  const periodProgress = earningsData.earnings_completed_percentage || 0;
  const advancePercentage = earningsData.claimable_wages_percentage || 60;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{t("ewa.details")}</CardTitle>
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
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">{t("earnings.currentPeriod")}</span>
                <span className="text-sm font-medium">{periodProgress}% {t("earnings.complete")}</span>
              </div>
              <Progress value={periodProgress} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("earnings.totalEarned")}</p>
                <p className="text-xl font-semibold">{formatCurrency(totalEarned)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("earnings.advanceLimit")}</p>
                <div className="flex items-center gap-2">
                  <Progress value={advancePercentage} max={100} className="h-2 bg-gray-200 flex-1" />
                  <span className="text-sm font-medium">{advancePercentage}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default EWADetailsSection;

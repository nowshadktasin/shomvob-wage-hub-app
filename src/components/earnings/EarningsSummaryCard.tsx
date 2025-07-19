import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, TrendingUp } from "lucide-react";
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
  formatCurrency
}) => {
  const { t } = useTranslation();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {t("earnings.currentPeriod")}
            </CardTitle>
            <CardDescription className="text-base mt-1">
              {periodProgress}% {t("earnings.complete")}
            </CardDescription>
          </div>
        </div>
        <Progress value={periodProgress} className="h-3 mt-4" />
      </CardHeader>
      
      <CardContent className="pb-4">
        {/* Main highlight - Available amount */}
        <div className="text-center p-6 bg-primary/5 rounded-lg mb-4">
          <p className="text-sm text-muted-foreground mb-1">{t("earnings.available")}</p>
          <p className="text-3xl font-bold text-primary">{formatCurrency(availableToWithdraw)}</p>
        </div>
        
        {/* Collapsible details section */}
        <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-between h-12 text-sm"
            >
              {t("earnings.viewDetails")}
              <ChevronDown className={`h-4 w-4 transition-transform ${isDetailsOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">{t("earnings.totalEarned")}</span>
                <span className="font-semibold">{formatCurrency(totalEarned)}</span>
              </div>
              
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">{t("earnings.advanceLimit")}</span>
                  <span className="text-sm font-medium">{advancePercentage}%</span>
                </div>
                <Progress value={advancePercentage} max={100} className="h-2" />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
export default EarningsSummaryCard;
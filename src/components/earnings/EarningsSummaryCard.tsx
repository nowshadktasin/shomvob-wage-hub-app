import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
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
  const {
    t
  } = useTranslation();
  return <TooltipProvider>
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">{t("earnings.currentPeriod")}</CardTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-0 bg-transparent border-none cursor-help">
                <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-sm">{t("earnings.tooltips.currentPeriod")}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <CardDescription className="text-base">
          {periodProgress}% {t("earnings.complete")}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <Progress value={periodProgress} className="h-2" />
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <div className="flex items-center gap-2 h-8">
              <p className="text-muted-foreground text-xs">{t("earnings.available")}</p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-0 bg-transparent border-none cursor-help">
                    <HelpCircle className="h-3 w-3 text-muted-foreground hover:text-foreground transition-colors" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-sm">{t("earnings.tooltips.availableToWithdraw")}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-2xl font-semibold">{formatCurrency(availableToWithdraw)}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 h-8">
              <p className="text-muted-foreground text-xs">{t("earnings.totalEarned")}</p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-0 bg-transparent border-none cursor-help">
                    <HelpCircle className="h-3 w-3 text-muted-foreground hover:text-foreground transition-colors" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-sm">{t("earnings.tooltips.totalEarned")}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-2xl font-semibold">{formatCurrency(totalEarned)}</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-muted-foreground text-xs">{t("earnings.advanceLimit")}</p>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-0 bg-transparent border-none cursor-help">
                  <HelpCircle className="h-3 w-3 text-muted-foreground hover:text-foreground transition-colors" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">{t("earnings.tooltips.advanceLimit")}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={advancePercentage} max={100} className="h-2 bg-gray-200" />
            <span className="text-sm font-medium">{advancePercentage}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </TooltipProvider>;
};
export default EarningsSummaryCard;

import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEarnings } from "@/contexts/EarningsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const Dashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { earningsData } = useEarnings();

  // Get available amount from API or fallback
  const availableToWithdraw = earningsData?.claimable_wages || 0;
  
  // Parse next salary date from API or create fallback
  const nextPayday = earningsData?.next_salary_date 
    ? new Date(earningsData.next_salary_date)
    : (() => {
        const date = new Date();
        date.setDate(date.getDate() + 15);
        return date;
      })();
  
  const formatCurrency = (amount: number) => {
    return `${t("common.currency")} ${amount.toLocaleString()}`;
  };

  const formatDate = (date: Date) => {
    // Format as dd-mm-yyyy (Bangladeshi format)
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Get display name from full_name
  const getDisplayName = (fullName: string) => {
    const nameParts = fullName.split(' ');
    if (nameParts.length >= 2) {
      // For 2 or more names, show first two
      return `${nameParts[0]} ${nameParts[1]}`;
    }
    // For 1 name, show just the first name
    return nameParts[0];
  };

  const displayName = user?.full_name ? getDisplayName(user.full_name) : 'User';
  const isBangla = i18n.language === 'bn';

  return (
    <div className={cn("container max-w-md mx-auto px-4 py-6", isBangla && "font-siliguri")}>
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-1">{t("dashboard.welcome")}, {displayName}</h1>
        <p className={cn("text-muted-foreground", isBangla ? "font-sans" : "")}>
          {formatDate(new Date())}
        </p>
      </header>

      <Card className="mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
          <h2 className="font-medium">{t("earnings.available")}</h2>
          <p className="text-3xl font-bold mt-1">{formatCurrency(availableToWithdraw)}</p>
          <div className="flex justify-between items-center mt-4">
            <div>
              <p className="text-xs opacity-80">{t("earnings.nextSalary")}</p>
              <p className={cn("font-medium", isBangla ? "font-sans" : "")}>
                {formatDate(nextPayday)}
              </p>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              className="text-primary"
              onClick={() => navigate("/earnings")}
            >
              {t("dashboard.viewEarnings")}
            </Button>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{t("dashboard.quickActions")}</h2>
        
        <Card>
          <CardContent className="p-0">
            <Button
              variant="ghost"
              className="flex items-center justify-between w-full p-4 h-auto"
              onClick={() => navigate("/earnings")}
            >
              <div className="flex items-center">
                <Wallet className="h-5 w-5 mr-3 text-primary" />
                <span>{t("dashboard.viewEarnings")}</span>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

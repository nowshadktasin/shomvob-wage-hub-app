import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, ArrowRight } from "lucide-react";

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock data for the dashboard
  const nextPayday = new Date();
  nextPayday.setDate(nextPayday.getDate() + 15);
  
  // Calculate available to withdraw based on earnings logic
  const monthlySalary = user?.monthlySalary || 50000;
  const advancePercentage = user?.availableAdvancePercentage || 60;
  
  // Calculate period progress for consistency with Earnings page
  const today = new Date();
  const dayOfMonth = today.getDate();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const periodProgress = Math.round((dayOfMonth / daysInMonth) * 100);
  
  // Calculate total earned so far this month
  const totalEarned = monthlySalary * (periodProgress / 100);
  
  // Available to withdraw should be the advancePercentage of what has been earned
  const availableToWithdraw = (totalEarned * advancePercentage) / 100;
  
  const formatCurrency = (amount: number) => {
    return `${t("common.currency")} ${amount.toLocaleString()}`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('bn-BD').format(date);
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-1">{t("dashboard.welcome")}, {user?.name.split(' ')[0]}</h1>
        <p className="text-muted-foreground">{formatDate(new Date())}</p>
      </header>

      <Card className="mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
          <h2 className="font-medium">{t("earnings.available")}</h2>
          <p className="text-3xl font-bold mt-1">{formatCurrency(availableToWithdraw)}</p>
          <div className="flex justify-between items-center mt-4">
            <div>
              <p className="text-xs opacity-80">{t("earnings.nextSalary")}</p>
              <p className="font-medium">{formatDate(nextPayday)}</p>
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

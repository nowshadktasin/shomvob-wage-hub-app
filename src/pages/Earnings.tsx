
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";

// Mock transaction data
const transactions = [
  { id: 1, date: new Date(2025, 4, 5), amount: 5000, status: "completed" },
  { id: 2, date: new Date(2025, 3, 20), amount: 7000, status: "completed" },
  { id: 3, date: new Date(2025, 3, 5), amount: 3000, status: "completed" },
];

const Earnings: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [withdrawAmount, setWithdrawAmount] = useState<number>(5000);
  
  // Calculate the maximum available withdrawal based on 60% of the monthly salary
  const monthlySalary = user?.monthlySalary || 50000;
  const advancePercentage = user?.availableAdvancePercentage || 60;
  const maxAdvanceAmount = (monthlySalary * advancePercentage) / 100;
  
  // Progress through the current month
  const today = new Date();
  const dayOfMonth = today.getDate();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const periodProgress = Math.round((dayOfMonth / daysInMonth) * 100);
  
  // Calculate total earned so far this month
  const totalEarned = monthlySalary * (periodProgress / 100);
  
  // Available to withdraw should be the advancePercentage of what has been earned
  const availableToWithdraw = (totalEarned * advancePercentage) / 100;
  
  // Set initial withdraw amount when component mounts or when availableToWithdraw changes
  useEffect(() => {
    // Default to 5000 or the maximum available if less than 5000
    setWithdrawAmount(Math.min(5000, availableToWithdraw));
  }, [availableToWithdraw]);
  
  // Calculate service fee (2% of withdrawal amount)
  const serviceFee = withdrawAmount * 0.02;
  const totalAmount = withdrawAmount + serviceFee; // Changed from subtraction to addition
  
  const handleWithdraw = () => {
    toast.success(t("earnings.withdrawSuccessTitle"), {
      description: t("earnings.withdrawSuccessDescription", { amount: withdrawAmount }),
    });
  };

  const formatCurrency = (amount: number) => {
    return `${t("common.currency")} ${amount.toLocaleString()}`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(t("locale", { defaultValue: "bn-BD" })).format(date);
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-6 font-siliguri">
      <h1 className="text-2xl font-bold mb-6">{t("earnings.title")}</h1>
      
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
              <p className="text-sm text-muted-foreground">{t("earnings.available")}</p>
              <p className="text-2xl font-semibold">{formatCurrency(availableToWithdraw)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("earnings.totalEarned")}</p>
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
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">{t("earnings.requestAmount")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Slider
              value={[withdrawAmount]}
              min={1000}
              max={availableToWithdraw}
              step={500}
              onValueChange={(value) => setWithdrawAmount(value[0])}
              className="mb-6"
              disabled={availableToWithdraw < 1000}
            />
            <div className="flex justify-between text-sm">
              <span>৳1,000</span>
              <span>৳{availableToWithdraw.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="p-4 bg-muted rounded-md">
            <div className="flex justify-between mb-2">
              <span>{t("earnings.requestAmount")}</span>
              <span>{formatCurrency(withdrawAmount)}</span>
            </div>
            <div className="flex justify-between mb-2 text-muted-foreground">
              <span>{t("earnings.serviceFee")}</span>
              <span>+ {formatCurrency(serviceFee)}</span>
            </div>
            <div className="border-t my-2 pt-2 flex justify-between font-medium">
              <span>{t("earnings.totalAmount")}</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleWithdraw}
            disabled={availableToWithdraw < 1000 || withdrawAmount <= 0}
          >
            {t("earnings.withdraw")}
          </Button>
        </CardFooter>
      </Card>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{t("earnings.history")}</h2>
        {transactions.map((transaction) => (
          <Card key={transaction.id}>
            <CardContent className="p-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{formatCurrency(transaction.amount)}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {t(`earnings.status.${transaction.status}`)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Earnings;

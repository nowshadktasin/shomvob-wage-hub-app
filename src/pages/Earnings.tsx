
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { useEarnings } from "@/contexts/EarningsContext";
import { useAuth } from "@/contexts/AuthContext";
import { submitEwaRequest } from "@/services/ewaApi";

// Mock transaction data with different statuses
const transactions = [
  { id: 1, date: new Date(2025, 4, 5), amount: 5000, status: "completed" },
  { id: 2, date: new Date(2025, 3, 20), amount: 7000, status: "pending" },
  { id: 3, date: new Date(2025, 3, 5), amount: 3000, status: "rejected" },
];

const Earnings: React.FC = () => {
  const { t } = useTranslation();
  const { user, session } = useAuth();
  const { earningsData, loading, refreshEarnings } = useEarnings();
  const [withdrawAmount, setWithdrawAmount] = useState<number>(1000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get values from API or fallback to defaults
  const totalEarned = earningsData?.total_earnings_completed || 0;
  const availableToWithdraw = earningsData?.claimable_wages || 0;
  const periodProgress = earningsData?.earnings_completed_percentage || 0;
  const minWages = earningsData?.min_wages || 1000;
  const serviceChargePercentage = earningsData?.service_charge_percentage || 2;
  const advancePercentage = earningsData?.claimable_wages_percentage || 60;
  
  // Set initial withdraw amount when component mounts or when availableToWithdraw changes
  useEffect(() => {
    // Default to minimum wage or the maximum available if less than minimum
    setWithdrawAmount(Math.min(minWages, availableToWithdraw));
  }, [availableToWithdraw, minWages]);
  
  // Calculate service fee based on API percentage
  const serviceFee = (withdrawAmount * serviceChargePercentage) / 100;
  const totalAmount = withdrawAmount + serviceFee;
  
  const handleWithdraw = async () => {
    if (!user?.contact_number || !session?.access_token) {
      toast.error("Authentication Error", {
        description: "Please log in again to make a withdrawal request.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await submitEwaRequest(
        user.contact_number,
        session.access_token,
        withdrawAmount
      );

      toast.success(t("earnings.withdrawSuccessTitle"), {
        description: `Request submitted for ${formatCurrency(response.requested_amount)}. Status: ${response.status}`,
      });

      // Refresh earnings data after successful request
      await refreshEarnings();
    } catch (error) {
      console.error('Withdrawal request failed:', error);
      toast.error("Request Failed", {
        description: "Failed to submit withdrawal request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `${t("common.currency")} ${amount.toLocaleString()}`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(t("locale", { defaultValue: "bn-BD" })).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
            {t(`earnings.status.${status}`)}
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            {t(`earnings.status.${status}`)}
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="default" className="bg-red-100 text-red-800 hover:bg-red-100">
            {t(`earnings.status.${status}`)}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {t(`earnings.status.${status}`)}
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="container max-w-md mx-auto px-4 py-6 font-siliguri">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">Loading earnings data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-6 font-siliguri">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("earnings.title")}</h1>
        <Button variant="outline" size="sm" onClick={refreshEarnings} disabled={loading}>
          Refresh
        </Button>
      </div>
      
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
              min={minWages}
              max={availableToWithdraw}
              step={500}
              onValueChange={(value) => setWithdrawAmount(value[0])}
              className="mb-6"
              disabled={availableToWithdraw < minWages || isSubmitting}
            />
            <div className="flex justify-between text-sm">
              <span>৳{minWages.toLocaleString()}</span>
              <span>৳{availableToWithdraw.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="p-4 bg-muted rounded-md">
            <div className="flex justify-between mb-2">
              <span>{t("earnings.requestAmount")}</span>
              <span>{formatCurrency(withdrawAmount)}</span>
            </div>
            <div className="flex justify-between mb-2 text-muted-foreground">
              <span>{t("earnings.serviceFee")} ({serviceChargePercentage}%)</span>
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
            disabled={availableToWithdraw < minWages || withdrawAmount <= 0 || !earningsData?.is_enabled || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : t("earnings.withdraw")}
          </Button>
        </CardFooter>
      </Card>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{t("earnings.history")}</h2>
        {transactions.map((transaction) => (
          <Card key={transaction.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{formatCurrency(transaction.amount)}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
                </div>
                <div className="flex items-center">
                  {getStatusBadge(transaction.status)}
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

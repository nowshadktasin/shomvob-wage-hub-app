
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "@/components/ui/sonner";
import { useEarnings } from "@/contexts/EarningsContext";
import { useAuth } from "@/contexts/AuthContext";
import { submitEwaRequest } from "@/services/ewaApi";
import EarningsHeader from "@/components/earnings/EarningsHeader";
import EarningsSummaryCard from "@/components/earnings/EarningsSummaryCard";
import WithdrawalCard from "@/components/earnings/WithdrawalCard";
import TransactionHistory from "@/components/earnings/TransactionHistory";

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
  
  const totalEarned = earningsData?.total_earnings_completed || 0;
  const availableToWithdraw = earningsData?.claimable_wages || 0;
  const periodProgress = earningsData?.earnings_completed_percentage || 0;
  const minWages = earningsData?.min_wages || 1000;
  const serviceChargePercentage = earningsData?.service_charge_percentage || 2;
  const advancePercentage = earningsData?.claimable_wages_percentage || 60;
  
  useEffect(() => {
    setWithdrawAmount(Math.min(minWages, availableToWithdraw));
  }, [availableToWithdraw, minWages]);
  
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
      <EarningsHeader onRefresh={refreshEarnings} loading={loading} />
      
      <EarningsSummaryCard
        periodProgress={periodProgress}
        availableToWithdraw={availableToWithdraw}
        totalEarned={totalEarned}
        advancePercentage={advancePercentage}
        formatCurrency={formatCurrency}
      />
      
      <WithdrawalCard
        withdrawAmount={withdrawAmount}
        minWages={minWages}
        availableToWithdraw={availableToWithdraw}
        serviceChargePercentage={serviceChargePercentage}
        isSubmitting={isSubmitting}
        isEnabled={earningsData?.is_enabled || false}
        onWithdrawAmountChange={setWithdrawAmount}
        onWithdraw={handleWithdraw}
        formatCurrency={formatCurrency}
      />
      
      <TransactionHistory
        transactions={transactions}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />
    </div>
  );
};

export default Earnings;

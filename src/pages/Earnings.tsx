
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "@/components/ui/sonner";
import { useEarnings } from "@/contexts/EarningsContext";
import { useAuth } from "@/contexts/AuthContext";
import { submitEwaRequest } from "@/services/ewaApi";
import EarningsHeader from "@/components/earnings/EarningsHeader";
import EarningsSummaryCard from "@/components/earnings/EarningsSummaryCard";
import WithdrawalCard from "@/components/earnings/WithdrawalCard";
import { fetchOrganizationEwaSettings, OrganizationEwaSettings } from "@/services/organizationEwaApi";
import AnimatedLoader from "@/components/common/AnimatedLoader";

const Earnings: React.FC = () => {
  const { t } = useTranslation();
  const { user, session } = useAuth();
  const { earningsData, loading, refreshEarnings } = useEarnings();
  const [withdrawAmount, setWithdrawAmount] = useState<number>(1000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [organizationEwaSettings, setOrganizationEwaSettings] = useState<OrganizationEwaSettings | null>(null);
  
  const totalEarned = earningsData?.total_earnings_completed || 0;
  const availableToWithdraw = earningsData?.claimable_wages || 0;
  const periodProgress = earningsData?.earnings_completed_percentage || 0;
  const minWages = earningsData?.min_wages || 1000;
  const advancePercentage = earningsData?.claimable_wages_percentage || 60;
  
  // Calculate service fee based on slabs instead of percentage
  const calculateServiceFee = (amount: number): number => {
    if (!organizationEwaSettings?.slabs || organizationEwaSettings.slabs.length === 0) {
      return 0;
    }
    
    // Find the appropriate slab for the amount
    const applicableSlab = organizationEwaSettings.slabs.find(slab => 
      amount >= slab.minAmount && amount <= slab.maxAmount
    );
    
    return applicableSlab ? applicableSlab.fees : 0;
  };
  
  useEffect(() => {
    if (availableToWithdraw > 0 && minWages > 0) {
      // Set initial amount to be visually inward from minimum (25% between min and max)
      const range = availableToWithdraw - minWages;
      const defaultAmount = Math.max(minWages, minWages + Math.min(range * 0.25, 1000));
      setWithdrawAmount(Math.round(defaultAmount / 100) * 100); // Round to nearest 100
    } else {
      setWithdrawAmount(minWages);
    }
  }, [availableToWithdraw, minWages]);

  const loadOrganizationEwaSettings = async () => {
    if (!user?.contact_number || !session?.access_token) {
      return;
    }

    try {
      const settings = await fetchOrganizationEwaSettings(
        user.contact_number,
        session.access_token
      );
      setOrganizationEwaSettings(settings);
      console.log('Organization EWA settings loaded:', settings);
    } catch (error) {
      console.error('Failed to fetch organization EWA settings:', error);
    }
  };

  useEffect(() => {
    if (user?.contact_number && session?.access_token) {
      loadOrganizationEwaSettings();
    }
  }, [user?.contact_number, session?.access_token]);
  
  const handleWithdraw = async () => {
    if (!user?.contact_number || !session?.access_token || !user?.id) {
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
        withdrawAmount,
        user.id
      );

      toast.success(t("earnings.withdrawSuccessTitle"), {
        description: `Request submitted for ${formatCurrency(response.requested_amount)}. Status: ${response.status}`,
      });

      await refreshEarnings();
      
    } catch (error: any) {
      console.error('Withdrawal request failed:', error);
      
      // The error messages are now properly formatted from the API service
      toast.error("Request Failed", {
        description: error.message || "Failed to submit withdrawal request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = async () => {
    await refreshEarnings();
  };

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) {
      return `${t("common.currency")} 0`;
    }
    return `${t("common.currency")} ${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="container max-w-md mx-auto px-4 py-6 font-siliguri">
        <div className="flex items-center justify-center min-h-64">
          <AnimatedLoader size="large" text="Loading earnings data..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-6 font-siliguri">
      <div className="container max-w-md mx-auto px-4 py-6">
        <EarningsHeader onRefresh={handleRefresh} loading={loading} />
      
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
          calculateServiceFee={calculateServiceFee}
          isSubmitting={isSubmitting}
          isEnabled={earningsData?.is_enabled || false}
          hasPendingRequest={false}
          onWithdrawAmountChange={setWithdrawAmount}
          onWithdraw={handleWithdraw}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  );
};

export default Earnings;

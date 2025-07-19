
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "@/components/ui/sonner";
import { useEarnings } from "@/contexts/EarningsContext";
import { useAuth } from "@/contexts/AuthContext";
import { submitEwaRequest } from "@/services/ewaApi";
import { fetchTransactionHistory } from "@/services/transactionHistoryApi";
import { fetchOrganizationEwaSettings, OrganizationEwaSettings } from "@/services/organizationEwaApi";
import EWAAmountDisplay from "@/components/ewa/EWAAmountDisplay";
import EWARequestSection from "@/components/ewa/EWARequestSection";
import EWADetailsSection from "@/components/ewa/EWADetailsSection";
import { cn } from "@/lib/utils";

const EWA: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, session } = useAuth();
  const { earningsData, loading, refreshEarnings } = useEarnings();
  const [withdrawAmount, setWithdrawAmount] = useState<number>(1000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [organizationEwaSettings, setOrganizationEwaSettings] = useState<OrganizationEwaSettings | null>(null);
  
  const isBangla = i18n.language === 'bn';
  const availableToWithdraw = earningsData?.claimable_wages || 0;
  const minWages = earningsData?.min_wages || 1000;
  
  // Calculate service fee based on slabs
  const calculateServiceFee = (amount: number): number => {
    if (!organizationEwaSettings?.slabs || organizationEwaSettings.slabs.length === 0) {
      return 0;
    }
    
    const applicableSlab = organizationEwaSettings.slabs.find(slab => 
      amount >= slab.minAmount && amount <= slab.maxAmount
    );
    
    return applicableSlab ? applicableSlab.fees : 0;
  };
  
  // Check if there are any pending requests
  const hasPendingRequest = transactions.some(transaction => 
    transaction.status.toLowerCase() === 'pending'
  );
  
  useEffect(() => {
    if (availableToWithdraw > 0 && minWages > 0) {
      const range = availableToWithdraw - minWages;
      const defaultAmount = Math.max(minWages, minWages + Math.min(range * 0.25, 1000));
      setWithdrawAmount(Math.round(defaultAmount / 100) * 100);
    } else {
      setWithdrawAmount(minWages);
    }
  }, [availableToWithdraw, minWages]);

  const loadTransactionHistory = async () => {
    if (!user?.contact_number || !session?.access_token || !user?.id) {
      return;
    }

    try {
      const historyData = await fetchTransactionHistory(
        user.contact_number,
        session.access_token,
        user.id
      );
      setTransactions(historyData);
    } catch (error) {
      console.error('Failed to fetch transaction history:', error);
    }
  };

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
    } catch (error) {
      console.error('Failed to fetch organization EWA settings:', error);
    }
  };

  useEffect(() => {
    if (user?.contact_number && session?.access_token && user?.id) {
      loadTransactionHistory();
      loadOrganizationEwaSettings();
    }
  }, [user?.contact_number, session?.access_token, user?.id]);
  
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
      
      setTimeout(async () => {
        await loadTransactionHistory();
      }, 2000);
      
    } catch (error: any) {
      console.error('Withdrawal request failed:', error);
      
      toast.error("Request Failed", {
        description: error.message || "Failed to submit withdrawal request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) {
      return `${t("common.currency")} 0`;
    }
    return `${t("common.currency")} ${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className={cn("container max-w-md mx-auto px-4 py-6", isBangla && "font-siliguri")}>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("container max-w-md mx-auto px-4 py-6 space-y-6", isBangla && "font-siliguri")}>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">{t("ewa.title")}</h1>
        <p className="text-muted-foreground">{t("ewa.pageTitle")}</p>
      </div>
      
      <EWAAmountDisplay
        availableToWithdraw={availableToWithdraw}
        formatCurrency={formatCurrency}
        isEnabled={earningsData?.is_enabled || false}
      />
      
      <EWARequestSection
        withdrawAmount={withdrawAmount}
        minWages={minWages}
        availableToWithdraw={availableToWithdraw}
        calculateServiceFee={calculateServiceFee}
        isSubmitting={isSubmitting}
        isEnabled={earningsData?.is_enabled || false}
        hasPendingRequest={hasPendingRequest}
        onWithdrawAmountChange={setWithdrawAmount}
        onWithdraw={handleWithdraw}
        formatCurrency={formatCurrency}
      />
      
      <EWADetailsSection
        earningsData={earningsData}
        formatCurrency={formatCurrency}
      />
    </div>
  );
};

export default EWA;

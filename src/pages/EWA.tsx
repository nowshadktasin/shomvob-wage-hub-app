import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "@/components/ui/sonner";
import { useEarnings } from "@/contexts/EarningsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTransactions } from "@/contexts/TransactionContext";
import { submitEwaRequest } from "@/services/ewaApi";
import { fetchTransactionHistory } from "@/services/transactionHistoryApi";
import { fetchOrganizationEwaSettings, OrganizationEwaSettings } from "@/services/organizationEwaApi";
import EWAAmountDisplay from "@/components/ewa/EWAAmountDisplay";
import EWARequestSection from "@/components/ewa/EWARequestSection";
import EWADetailsSection from "@/components/ewa/EWADetailsSection";
import DisabledState from "@/components/common/DisabledState";
import SkeletonLoader from "@/components/common/SkeletonLoader";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
const EWA: React.FC = () => {
  const {
    t,
    i18n
  } = useTranslation();
  const {
    user,
    session
  } = useAuth();
  const {
    earningsData,
    loading,
    refreshEarnings
  } = useEarnings();
  const {
    refreshTransactions,
    pendingTransactions
  } = useTransactions();
  const [withdrawAmount, setWithdrawAmount] = useState<number>(1000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [organizationEwaSettings, setOrganizationEwaSettings] = useState<OrganizationEwaSettings | null>(null);
  const [organizationLoading, setOrganizationLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const isBangla = i18n.language === 'bn';
  const availableToWithdraw = earningsData?.claimable_wages || 0;
  const minWages = earningsData?.min_wages || 1000;

  // Calculate service fee based on slabs
  const calculateServiceFee = (amount: number): number => {
    if (!organizationEwaSettings?.slabs || organizationEwaSettings.slabs.length === 0) {
      return 0;
    }
    const applicableSlab = organizationEwaSettings.slabs.find(slab => amount >= slab.minAmount && amount <= slab.maxAmount);
    return applicableSlab ? applicableSlab.fees : 0;
  };

  // Check if there are any pending requests from the global context
  const hasPendingRequest = pendingTransactions.length > 0;
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
      const historyData = await fetchTransactionHistory(user.contact_number, session.access_token, user.id);
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
      const settings = await fetchOrganizationEwaSettings(user.contact_number, session.access_token);
      setOrganizationEwaSettings(settings);
      setOrganizationLoading(false);
    } catch (error) {
      console.error('Failed to fetch organization EWA settings:', error);
      setOrganizationLoading(false);
    }
  };
  useEffect(() => {
    if (user?.contact_number && session?.access_token && user?.id) {
      loadTransactionHistory();
      loadOrganizationEwaSettings();
    }
  }, [user?.contact_number, session?.access_token, user?.id]);

  // Handle initial load completion
  useEffect(() => {
    if (!loading && !organizationLoading && initialLoad) {
      setInitialLoad(false);
    }
  }, [loading, organizationLoading, initialLoad]);
  const handleWithdrawClick = () => {
    setShowConfirmDialog(true);
  };
  const handleWithdraw = async () => {
    if (!user?.contact_number || !session?.access_token || !user?.id) {
      toast.error("Authentication Error", {
        description: "Please log in again to make a withdrawal request."
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await submitEwaRequest(user.contact_number, session.access_token, withdrawAmount, user.id);

      // Check if the request failed due to limit exceeded
      if (response.status === 'WITHDRAW_LIMIT_EXCEEDED') {
        toast.error(t("ewa.limitExceeded.title"), {
          description: t("ewa.limitExceeded.description")
        });
      } else {
        toast.success(t("earnings.requestSuccessTitle"), {
          description: `Request submitted for ${formatCurrency(response.requested_amount)}. Status: ${response.status}`
        });
      }
      await refreshEarnings();

      // Immediately refresh transaction contexts to show pending status
      await Promise.all([loadTransactionHistory(), refreshTransactions()]);
    } catch (error: any) {
      console.error('Withdrawal request failed:', error);
      toast.error("Request Failed", {
        description: error.message || "Failed to submit withdrawal request. Please try again."
      });
    } finally {
      setIsSubmitting(false);
      setShowConfirmDialog(false);
    }
  };
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) {
      return `${t("common.currency")} 0`;
    }
    return `${t("common.currency")} ${amount.toLocaleString()}`;
  };
  // Progressive loading approach - show page structure immediately

  // Handle disabled EWA access
  if (earningsData && !earningsData.is_enabled) {
    return <div className={cn("min-h-screen bg-background pb-6", isBangla && "font-siliguri")}>
        <div className="container max-w-md mx-auto px-4 py-6 space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">{t("ewa.title")}</h1>
            <p className="text-muted-foreground">{t("ewa.pageTitle")}</p>
          </div>
          
          <DisabledState title={t("ewa.disabled.title")} message={t("ewa.disabled.message")} reason={earningsData.failed_reason || t("ewa.disabled.defaultReason")} actionLabel={t("ewa.disabled.contactHR")} onAction={() => {
          // Could navigate to help or contact page
          window.location.href = '/help';
        }} />
        </div>
      </div>;
  }
  return <ErrorBoundary onRetry={refreshEarnings}>
      <div className={cn("min-h-screen bg-background pb-6", isBangla && "font-siliguri")}>
        <div className="container max-w-md mx-auto px-4 py-6 space-y-6">
          {/* Header - Always visible */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">{t("ewa.title")}</h1>
          </div>
          
          {/* Amount Display Section - Show immediately with default values */}
          <EWAAmountDisplay 
            availableToWithdraw={availableToWithdraw} 
            formatCurrency={formatCurrency} 
            isEnabled={earningsData?.is_enabled || false} 
          />
          
          {/* Request Section - Only show skeleton if both are loading */}
          {(loading && !earningsData) || (organizationLoading && !organizationEwaSettings) ? (
            <SkeletonLoader type="earnings" count={1} />
          ) : (
            <EWARequestSection 
              withdrawAmount={withdrawAmount} 
              minWages={minWages} 
              availableToWithdraw={availableToWithdraw} 
              calculateServiceFee={calculateServiceFee} 
              isSubmitting={isSubmitting} 
              isEnabled={earningsData?.is_enabled || false} 
              hasPendingRequest={hasPendingRequest} 
              onWithdrawAmountChange={setWithdrawAmount} 
              onWithdraw={handleWithdrawClick} 
              formatCurrency={formatCurrency} 
            />
          )}
          
          {/* Details Section - Show immediately if earnings data exists */}
          {loading && !earningsData ? (
            <SkeletonLoader type="earnings" count={1} />
          ) : (
            <EWADetailsSection 
              earningsData={earningsData} 
              formatCurrency={formatCurrency} 
            />
          )}
          
          <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <AlertDialogContent className="max-w-sm mx-auto">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("ewa.confirmation.title")}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-base">
                  {t("ewa.confirmation.description").replace('{{amount}}', '')}{' '}
                  <span className="font-bold">{formatCurrency(withdrawAmount)}</span>?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col sm:flex-col space-y-2 sm:space-y-2 sm:space-x-0">
                <AlertDialogAction onClick={handleWithdraw} disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Processing..." : t("ewa.confirmation.confirm")}
                </AlertDialogAction>
                <AlertDialogCancel className="w-full mt-2">
                  {t("ewa.confirmation.cancel")}
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </ErrorBoundary>;
};
export default EWA;
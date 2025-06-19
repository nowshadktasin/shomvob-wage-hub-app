
import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchEarnedWages } from "@/services/earningsApi";
import { useToast } from "@/hooks/use-toast";

interface EarningsData {
  is_enabled: boolean;
  total_earnings_completed: number;
  earnings_completed_percentage: number;
  min_wages: number;
  service_charge_percentage: number;
  claimable_wages: number;
  claimable_wages_percentage: number;
  next_salary_date: string;
  failed_reason: string | null;
}

interface EarningsContextType {
  earningsData: EarningsData | null;
  loading: boolean;
  refreshEarnings: () => Promise<void>;
}

const EarningsContext = createContext<EarningsContextType | undefined>(undefined);

export const useEarnings = () => {
  const context = useContext(EarningsContext);
  if (!context) {
    throw new Error("useEarnings must be used within an EarningsProvider");
  }
  return context;
};

export const EarningsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshEarnings = async () => {
    if (!user?.contact_number || !session?.access_token || !user?.id) {
      console.log('Cannot fetch earnings: missing authentication data or user ID');
      return;
    }

    setLoading(true);
    try {
      const data = await fetchEarnedWages(user.contact_number, session.access_token, user.id);
      setEarningsData(data);
      console.log('Earnings data loaded:', data);
    } catch (error) {
      console.error('Failed to fetch earnings data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch earnings data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.contact_number && session?.access_token && user?.id) {
      refreshEarnings();
    }
  }, [user?.contact_number, session?.access_token, user?.id]);

  return (
    <EarningsContext.Provider value={{ earningsData, loading, refreshEarnings }}>
      {children}
    </EarningsContext.Provider>
  );
};

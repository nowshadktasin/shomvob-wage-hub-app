
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface EarningsHeaderProps {
  onRefresh: () => void;
  loading: boolean;
}

const EarningsHeader: React.FC<EarningsHeaderProps> = ({ onRefresh, loading }) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">{t("earnings.title")}</h1>
      <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
        Refresh
      </Button>
    </div>
  );
};

export default EarningsHeader;


import React from "react";
import { useTranslation } from "react-i18next";

const Accounts: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">{t("accounts.title")}</h1>
      
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Account management is currently not available.
        </p>
      </div>
    </div>
  );
};

export default Accounts;


import React from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserData } from "@/types/auth";

interface ProfessionalInformationProps {
  user: UserData | null;
}

const ProfessionalInformation: React.FC<ProfessionalInformationProps> = ({ user }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="companyName">{t("workplace.company")}</Label>
        <Input
          id="companyName"
          value={user?.company_name || ""}
          placeholder={t("workplace.company")}
          disabled
          className="bg-gray-50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="department">{t("workplace.department")}</Label>
        <Input
          id="department"
          value={user?.department || ""}
          placeholder={t("workplace.department")}
          disabled
          className="bg-gray-50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="designation">{t("workplace.position")}</Label>
        <Input
          id="designation"
          value={user?.designation || ""}
          placeholder={t("workplace.position")}
          disabled
          className="bg-gray-50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="grossSalary">{t("workplace.monthlySalary")}</Label>
        <Input
          id="grossSalary"
          value={user?.gross_salary || ""}
          placeholder={t("workplace.monthlySalary")}
          disabled
          className="bg-gray-50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="joiningDate">{t("workplace.joinDate")}</Label>
        <Input
          id="joiningDate"
          type="date"
          value={user?.joining_date || ""}
          disabled
          className="bg-gray-50"
        />
      </div>
    </div>
  );
};

export default ProfessionalInformation;

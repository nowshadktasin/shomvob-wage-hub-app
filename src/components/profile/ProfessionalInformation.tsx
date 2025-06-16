
import React from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserData } from "@/contexts/AuthContext";

interface ProfessionalInformationProps {
  user: UserData | null;
}

const ProfessionalInformation: React.FC<ProfessionalInformationProps> = ({ user }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="company">{t("workplace.company")}</Label>
        <Input
          id="company"
          value="Shomvob Ltd."
          placeholder={t("workplace.company")}
          disabled
          className="bg-gray-50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="position">{t("workplace.position")}</Label>
        <Input
          id="position"
          value={user?.position || ""}
          placeholder={t("workplace.position")}
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
        <Label htmlFor="joinDate">{t("workplace.joinDate")}</Label>
        <Input
          id="joinDate"
          type="date"
          value={user?.joinDate || ""}
          disabled
          className="bg-gray-50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="monthlySalary">{t("workplace.monthlySalary")}</Label>
        <Input
          id="monthlySalary"
          value="50000"
          placeholder={t("workplace.monthlySalary")}
          disabled
          className="bg-gray-50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="experience">{t("profile.experience")}</Label>
        <Select value="2" disabled>
          <SelectTrigger className="bg-gray-50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">0-1 {t("profile.years")}</SelectItem>
            <SelectItem value="1">1-2 {t("profile.years")}</SelectItem>
            <SelectItem value="2">2-5 {t("profile.years")}</SelectItem>
            <SelectItem value="5">5+ {t("profile.years")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ProfessionalInformation;

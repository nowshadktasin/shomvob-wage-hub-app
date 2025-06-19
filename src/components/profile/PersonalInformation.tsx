
import React from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserData } from "@/types/auth";

interface PersonalInformationProps {
  user: UserData | null;
}

const PersonalInformation: React.FC<PersonalInformationProps> = ({ user }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">{t("profile.fullName")}</Label>
        <Input
          id="fullName"
          value={user?.full_name || ""}
          placeholder={t("profile.fullName")}
          disabled
          className="bg-gray-50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">{t("profile.email")}</Label>
        <Input
          id="email"
          type="email"
          value={user?.email || ""}
          placeholder={t("profile.email")}
          disabled
          className="bg-gray-50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="contactNumber">{t("profile.phone")}</Label>
        <Input
          id="contactNumber"
          value={user?.contact_number || ""}
          placeholder={t("profile.phone")}
          disabled
          className="bg-gray-50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="gender">{t("profile.gender")}</Label>
        <Select value={user?.gender?.toLowerCase() || "male"} disabled>
          <SelectTrigger className="bg-gray-50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">{t("profile.male")}</SelectItem>
            <SelectItem value="female">{t("profile.female")}</SelectItem>
            <SelectItem value="other">{t("profile.other")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="presentAddress">{t("profile.address.present")}</Label>
        <Input
          id="presentAddress"
          value={user?.present_address || ""}
          placeholder={t("profile.address.present")}
          disabled
          className="bg-gray-50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="permanentAddress">{t("profile.address.permanent")}</Label>
        <Input
          id="permanentAddress"
          value={user?.permanent_address || ""}
          placeholder={t("profile.address.permanent")}
          disabled
          className="bg-gray-50"
        />
      </div>
    </div>
  );
};

export default PersonalInformation;


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
        <Label htmlFor="name">{t("profile.fullName")}</Label>
        <Input
          id="name"
          value={user?.name || ""}
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
        <Label htmlFor="phone">Contact Number</Label>
        <Input
          id="phone"
          value={user?.phone || ""}
          placeholder="Contact Number"
          disabled
          className="bg-gray-50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Select value="male" disabled>
          <SelectTrigger className="bg-gray-50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="presentAddress">Present Address</Label>
        <Input
          id="presentAddress"
          value=""
          placeholder="Present Address"
          disabled
          className="bg-gray-50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="permanentAddress">Permanent Address</Label>
        <Input
          id="permanentAddress"
          value=""
          placeholder="Permanent Address"
          disabled
          className="bg-gray-50"
        />
      </div>
    </div>
  );
};

export default PersonalInformation;

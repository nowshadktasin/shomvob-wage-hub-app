
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
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={user?.full_name || ""}
          placeholder="Full Name"
          disabled
          className="bg-gray-50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={user?.email || ""}
          placeholder="Email"
          disabled
          className="bg-gray-50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="contactNumber">Contact Number</Label>
        <Input
          id="contactNumber"
          value={user?.contact_number || ""}
          placeholder="Contact Number"
          disabled
          className="bg-gray-50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Select value={user?.gender?.toLowerCase() || "male"} disabled>
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
          value={user?.present_address || ""}
          placeholder="Present Address"
          disabled
          className="bg-gray-50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="permanentAddress">Permanent Address</Label>
        <Input
          id="permanentAddress"
          value={user?.permanent_address || ""}
          placeholder="Permanent Address"
          disabled
          className="bg-gray-50"
        />
      </div>
    </div>
  );
};

export default PersonalInformation;

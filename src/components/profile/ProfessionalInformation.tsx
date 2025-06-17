
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
        <Label htmlFor="company">Company Name</Label>
        <Input
          id="company"
          value="Emission Softwares"
          placeholder="Company Name"
          disabled
          className="bg-gray-50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Input
          id="department"
          value={user?.department || ""}
          placeholder="Department"
          disabled
          className="bg-gray-50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="designation">Designation</Label>
        <Input
          id="designation"
          value={user?.position || ""}
          placeholder="Designation"
          disabled
          className="bg-gray-50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="grossSalary">Gross Salary</Label>
        <Input
          id="grossSalary"
          value={user?.monthlySalary || ""}
          placeholder="Gross Salary"
          disabled
          className="bg-gray-50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="joinDate">Joining Date</Label>
        <Input
          id="joinDate"
          type="date"
          value={user?.joinDate || ""}
          disabled
          className="bg-gray-50"
        />
      </div>
    </div>
  );
};

export default ProfessionalInformation;

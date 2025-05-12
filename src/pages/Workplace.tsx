
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "lucide-react";

const Workplace: React.FC = () => {
  const { t } = useTranslation();
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  
  const [workInfo, setWorkInfo] = useState({
    company: "Shomvob Ltd.",
    position: user?.position || "Software Engineer",
    department: user?.department || "Engineering",
    joinDate: user?.joinDate || "2022-01-15",
    monthlySalary: "50000",
    schedule: "Monday - Friday, 9:00 AM - 5:00 PM",
    nextSalaryDate: "2025-06-01"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkInfo({
      ...workInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    updateUserProfile({
      position: workInfo.position,
      department: workInfo.department,
      joinDate: workInfo.joinDate,
    });
    toast({
      title: t("workplace.updateSuccess"),
      description: t("workplace.infoUpdated"),
    });
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("bn-BD").format(new Date(dateString));
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">{t("workplace.title")}</h1>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{t("workplace.employmentDetails")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company">{t("workplace.company")}</Label>
            <Input
              id="company"
              name="company"
              value={workInfo.company}
              onChange={handleInputChange}
              disabled
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="position">{t("workplace.position")}</Label>
            <Input
              id="position"
              name="position"
              value={workInfo.position}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">{t("workplace.department")}</Label>
            <Input
              id="department"
              name="department"
              value={workInfo.department}
              onChange={handleInputChange}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{t("workplace.dates")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="joinDate">{t("workplace.joinDate")}</Label>
            <Input
              id="joinDate"
              name="joinDate"
              type="date"
              value={workInfo.joinDate}
              onChange={handleInputChange}
            />
            <p className="text-sm text-muted-foreground">{formatDate(workInfo.joinDate)}</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nextSalaryDate">{t("earnings.nextSalary")}</Label>
            <div className="relative">
              <Input
                id="nextSalaryDate"
                name="nextSalaryDate"
                type="date"
                value={workInfo.nextSalaryDate}
                onChange={handleInputChange}
                disabled
              />
              <Calendar className="absolute top-3 right-3 h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">{formatDate(workInfo.nextSalaryDate)}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{t("workplace.compensation")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="monthlySalary">{t("workplace.monthlySalary")}</Label>
            <Input
              id="monthlySalary"
              name="monthlySalary"
              value={workInfo.monthlySalary}
              onChange={handleInputChange}
              disabled
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="schedule">{t("workplace.workSchedule")}</Label>
            <Input
              id="schedule"
              name="schedule"
              value={workInfo.schedule}
              onChange={handleInputChange}
              disabled
            />
          </div>
        </CardContent>
      </Card>
      
      <Button className="w-full" onClick={handleSave}>
        {t("common.save")}
      </Button>
    </div>
  );
};

export default Workplace;

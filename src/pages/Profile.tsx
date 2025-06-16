
import React from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">{t("profile.title")}</h1>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{t("profile.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar section */}
          <div className="flex flex-col items-center justify-center">
            <Avatar className="h-24 w-24 mb-2">
              <AvatarImage src={user?.avatar} alt={user?.name || ""} />
              <AvatarFallback className="text-xl">{getInitials(user?.name || "")}</AvatarFallback>
            </Avatar>
          </div>
          
          <div className="space-y-4">
            {/* Personal Information */}
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
              <Label htmlFor="phone">{t("profile.phone")}</Label>
              <Input
                id="phone"
                value="01712345678"
                placeholder={t("profile.phone")}
                disabled
                className="bg-gray-50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender">{t("profile.gender")}</Label>
              <Select value="male" disabled>
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
            
            {/* Professional Information */}
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
            
            {/* Information note */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 text-center">
                Profile information is managed by your employer and cannot be edited directly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;

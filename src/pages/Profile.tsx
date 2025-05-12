
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "01712345678",
    gender: "male",
    presentAddress: "",
    permanentAddress: "",
  });

  const [professionalInfo, setProfessionalInfo] = useState({
    company: "Shomvob Ltd.",
    position: user?.position || "",
    department: user?.department || "",
    joinDate: user?.joinDate || "",
    monthlySalary: "50000",
    experience: "2",
  });

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalInfo({
      ...personalInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfessionalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfessionalInfo({
      ...professionalInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenderChange = (value: string) => {
    setPersonalInfo({
      ...personalInfo,
      gender: value,
    });
  };

  const handleExperienceChange = (value: string) => {
    setProfessionalInfo({
      ...professionalInfo,
      experience: value,
    });
  };

  const handleUpdatePersonalInfo = () => {
    updateUserProfile({
      name: personalInfo.name,
      email: personalInfo.email,
    });
    toast({
      title: t("profile.updateSuccess"),
      description: t("profile.personalInfoUpdated"),
    });
  };

  const handleUpdateProfessionalInfo = () => {
    updateUserProfile({
      position: professionalInfo.position,
      department: professionalInfo.department,
      joinDate: professionalInfo.joinDate,
    });
    toast({
      title: t("profile.updateSuccess"),
      description: t("profile.professionalInfoUpdated"),
    });
  };

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
      
      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal">{t("profile.personalInfo")}</TabsTrigger>
          <TabsTrigger value="professional">{t("profile.professionalInfo")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t("profile.personalInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar upload */}
              <div className="flex flex-col items-center justify-center">
                <Avatar className="h-24 w-24 mb-2">
                  <AvatarImage src={user?.avatar} alt={personalInfo.name} />
                  <AvatarFallback className="text-xl">{getInitials(personalInfo.name)}</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  {t("profile.uploadPhoto")}
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("profile.fullName")}</Label>
                  <Input
                    id="name"
                    name="name"
                    value={personalInfo.name}
                    onChange={handlePersonalInfoChange}
                    placeholder={t("profile.fullName")}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">{t("profile.email")}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={personalInfo.email}
                    onChange={handlePersonalInfoChange}
                    placeholder={t("profile.email")}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("profile.phone")}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={personalInfo.phone}
                    onChange={handlePersonalInfoChange}
                    placeholder={t("profile.phone")}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">{t("profile.gender")}</Label>
                  <Select
                    value={personalInfo.gender}
                    onValueChange={handleGenderChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("profile.selectGender")} />
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
                    name="presentAddress"
                    value={personalInfo.presentAddress}
                    onChange={handlePersonalInfoChange}
                    placeholder={t("profile.address.present")}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="permanentAddress">{t("profile.address.permanent")}</Label>
                  <Input
                    id="permanentAddress"
                    name="permanentAddress"
                    value={personalInfo.permanentAddress}
                    onChange={handlePersonalInfoChange}
                    placeholder={t("profile.address.permanent")}
                  />
                </div>
                
                <Button className="w-full" onClick={handleUpdatePersonalInfo}>
                  {t("profile.updateProfile")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="professional" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t("profile.professionalInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company">{t("workplace.company")}</Label>
                  <Input
                    id="company"
                    name="company"
                    value={professionalInfo.company}
                    onChange={handleProfessionalInfoChange}
                    placeholder={t("workplace.company")}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">{t("workplace.position")}</Label>
                  <Input
                    id="position"
                    name="position"
                    value={professionalInfo.position}
                    onChange={handleProfessionalInfoChange}
                    placeholder={t("workplace.position")}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">{t("workplace.department")}</Label>
                  <Input
                    id="department"
                    name="department"
                    value={professionalInfo.department}
                    onChange={handleProfessionalInfoChange}
                    placeholder={t("workplace.department")}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="joinDate">{t("workplace.joinDate")}</Label>
                  <Input
                    id="joinDate"
                    name="joinDate"
                    type="date"
                    value={professionalInfo.joinDate}
                    onChange={handleProfessionalInfoChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="monthlySalary">{t("workplace.monthlySalary")}</Label>
                  <Input
                    id="monthlySalary"
                    name="monthlySalary"
                    value={professionalInfo.monthlySalary}
                    onChange={handleProfessionalInfoChange}
                    placeholder={t("workplace.monthlySalary")}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience">{t("profile.experience")}</Label>
                  <Select
                    value={professionalInfo.experience}
                    onValueChange={handleExperienceChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("profile.selectExperience")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0-1 {t("profile.years")}</SelectItem>
                      <SelectItem value="1">1-2 {t("profile.years")}</SelectItem>
                      <SelectItem value="2">2-5 {t("profile.years")}</SelectItem>
                      <SelectItem value="5">5+ {t("profile.years")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="w-full" onClick={handleUpdateProfessionalInfo}>
                  {t("common.save")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;

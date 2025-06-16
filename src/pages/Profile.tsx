
import React from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import PersonalInformation from "@/components/profile/PersonalInformation";
import ProfessionalInformation from "@/components/profile/ProfessionalInformation";
import ProfileInfoNotice from "@/components/profile/ProfileInfoNotice";

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">{t("profile.title")}</h1>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{t("profile.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ProfileAvatar user={user} />
          
          <div className="space-y-4">
            <PersonalInformation user={user} />
            <ProfessionalInformation user={user} />
            <ProfileInfoNotice />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;

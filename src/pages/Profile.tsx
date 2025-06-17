
import React from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileData } from "@/hooks/useProfileData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import PersonalInformation from "@/components/profile/PersonalInformation";
import ProfessionalInformation from "@/components/profile/ProfessionalInformation";
import ProfileInfoNotice from "@/components/profile/ProfileInfoNotice";

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { refreshProfile, isRefreshing } = useProfileData();

  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("profile.title")}</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshProfile}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      
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

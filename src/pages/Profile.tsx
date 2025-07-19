
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileData } from "@/hooks/useProfileData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import PersonalInformation from "@/components/profile/PersonalInformation";
import ProfessionalInformation from "@/components/profile/ProfessionalInformation";

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { refreshProfile, isRefreshing } = useProfileData();
  const [activeTab, setActiveTab] = useState<'personal' | 'professional'>('personal');

  return (
    <div className="min-h-screen bg-background pb-6">
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
        
        <div className="space-y-6">
          {/* Tab Buttons */}
          <div className="flex gap-3">
            <Button
              variant={activeTab === 'personal' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setActiveTab('personal')}
            >
              {t("profile.personalInfo")}
            </Button>
            <Button
              variant={activeTab === 'professional' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setActiveTab('professional')}
            >
              {t("profile.professionalInfo")}
            </Button>
          </div>

          {/* Content Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                {activeTab === 'personal' ? t("profile.personalInfo") : t("profile.professionalInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeTab === 'personal' ? (
                <PersonalInformation user={user} />
              ) : (
                <ProfessionalInformation user={user} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;

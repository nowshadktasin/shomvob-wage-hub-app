
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Mail, Phone, HelpCircle, DollarSign, Building } from "lucide-react";
import { fetchOrganizationEwaSettings, OrganizationEwaSettings } from "@/services/organizationEwaApi";
import OrganizationFeeStructure from "@/components/help/OrganizationFeeStructure";
import ContactSupport from "@/components/help/ContactSupport";
import FAQSection from "@/components/help/FAQSection";
import SkeletonLoader from "@/components/common/SkeletonLoader";

const Help: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, session } = useAuth();

  const [organizationEWAData, setOrganizationEWAData] = useState<OrganizationEwaSettings | null>(null);
  const [ewaDataLoading, setEwaDataLoading] = useState(false);
  const [ewaDataError, setEwaDataError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrganizationEwaSettings = async () => {
      if (!user?.contact_number || !session?.access_token) {
        return;
      }

      setEwaDataLoading(true);
      setEwaDataError(null);

      try {
        const data = await fetchOrganizationEwaSettings(
          user.contact_number,
          session.access_token
        );
        setOrganizationEWAData(data);
        console.log('Organization EWA settings loaded in Help:', data);
      } catch (error: any) {
        console.error('Failed to fetch organization EWA settings in Help:', error);
        setEwaDataError(error.message || 'Failed to load organization EWA settings');
      } finally {
        setEwaDataLoading(false);
      }
    };

    loadOrganizationEwaSettings();
  }, [user?.contact_number, session?.access_token]);

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="container max-w-md mx-auto px-4 py-6">
        {/* Header - Always visible */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{t("help.title")}</h1>
        </div>

        <div className="space-y-6">
          {/* Organization Fee Structure Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                {t("help.organizationFee.title")}
              </CardTitle>
              <CardDescription>
                {t("help.organizationFee.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {ewaDataLoading ? (
                <div className="flex items-center justify-center py-8">
                  <SkeletonLoader type="settings" useAnimatedLoader={true} loadingText={t("common.loading")} />
                </div>
              ) : (
                <OrganizationFeeStructure 
                  data={organizationEWAData}
                  loading={ewaDataLoading}
                  error={ewaDataError}
                />
              )}
            </CardContent>
          </Card>

          {/* Contact Support Section - Always visible */}
          <ContactSupport />

          {/* FAQ Section - Always visible */}
          <FAQSection />

          {/* App Info Section - Always visible */}
          <Card>
            <CardHeader>
              <CardTitle>{t("help.app.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("help.app.version")}</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("help.app.lastUpdated")}</span>
                <span>2025-07-15</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Help;

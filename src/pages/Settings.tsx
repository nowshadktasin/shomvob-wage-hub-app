
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    toast({
      description: t("settings.languageChanged"),
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    toast({
      description: notificationsEnabled 
        ? t("settings.notificationsDisabled") 
        : t("settings.notificationsEnabled"),
    });
  };

  const toggleBiometric = () => {
    setBiometricEnabled(!biometricEnabled);
    toast({
      description: biometricEnabled 
        ? t("settings.biometricDisabled") 
        : t("settings.biometricEnabled"),
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, this would toggle the dark mode
    document.documentElement.classList.toggle("dark");
    toast({
      description: darkMode 
        ? t("settings.lightModeEnabled") 
        : t("settings.darkModeEnabled"),
    });
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">{t("settings.title")}</h1>
      
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{t("settings.preferences")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">{t("settings.language")}</Label>
              <Select
                value={i18n.language}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("settings.selectLanguage")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bn">{t("settings.bangla")}</SelectItem>
                  <SelectItem value="en">{t("settings.english")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">{t("settings.notifications")}</Label>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={toggleNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode">{t("settings.darkMode")}</Label>
              <Switch
                id="darkMode"
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{t("settings.security")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="biometric">{t("settings.biometricLogin")}</Label>
              <Switch
                id="biometric"
                checked={biometricEnabled}
                onCheckedChange={toggleBiometric}
              />
            </div>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/change-password")}
            >
              {t("settings.changePassword")}
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{t("settings.about")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/help")}
            >
              {t("settings.helpSupport")}
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/terms")}
            >
              {t("settings.termsConditions")}
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/privacy")}
            >
              {t("settings.privacyPolicy")}
            </Button>
          </CardContent>
        </Card>
        
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleLogout}
        >
          {t("auth.logout")}
        </Button>
      </div>
    </div>
  );
};

export default Settings;

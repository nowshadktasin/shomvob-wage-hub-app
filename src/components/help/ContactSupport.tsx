
import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";

const ContactSupport: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("help.contact.title")}</CardTitle>
        <CardDescription>
          {t("help.contact.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <Button
            variant="outline"
            className="flex items-center gap-3 h-auto p-4 justify-start min-h-[60px]"
            onClick={() => window.open("mailto:info@shomvob.com")}
          >
            <Mail className="h-5 w-5 text-blue-500" />
            <div className="text-left">
              <div className="font-medium">{t("help.contact.email")}</div>
              <div className="text-sm text-muted-foreground">info@shomvob.com</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-3 h-auto p-4 justify-start min-h-[60px]"
            onClick={() => window.open("tel:+8809638885588")}
          >
            <Phone className="h-5 w-5 text-green-500" />
            <div className="text-left">
              <div className="font-medium">{t("help.contact.phone")}</div>
              <div className="text-sm text-muted-foreground">+880 9638-885588</div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactSupport;

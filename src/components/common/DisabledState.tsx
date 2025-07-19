import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, HelpCircle, Phone, Mail } from "lucide-react";

interface DisabledStateProps {
  title: string;
  message: string;
  reason?: string;
  showContactSupport?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

const DisabledState: React.FC<DisabledStateProps> = ({
  title,
  message,
  reason,
  showContactSupport = true,
  actionLabel,
  onAction
}) => {
  const { t } = useTranslation();

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-orange-100">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        <CardTitle className="text-lg text-orange-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-orange-700 text-sm leading-relaxed">
          {message}
        </p>
        
        {reason && (
          <div className="p-3 bg-orange-100 rounded-lg text-left">
            <div className="flex items-start gap-2">
              <HelpCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-orange-800 mb-1">
                  {t("common.reason")}:
                </p>
                <p className="text-xs text-orange-700">
                  {reason}
                </p>
              </div>
            </div>
          </div>
        )}

        {actionLabel && onAction && (
          <Button 
            onClick={onAction}
            className="w-full"
            variant="outline"
          >
            {actionLabel}
          </Button>
        )}

        {showContactSupport && (
          <div className="border-t border-orange-200 pt-4 mt-4">
            <p className="text-xs text-orange-600 mb-3">
              {t("help.contact.needHelp")}
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-xs h-9"
                onClick={() => window.location.href = 'tel:+8801700000000'}
              >
                <Phone className="h-3 w-3 mr-1" />
                {t("help.contact.phone")}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-xs h-9"
                onClick={() => window.location.href = 'mailto:support@shomvob.com'}
              >
                <Mail className="h-3 w-3 mr-1" />
                {t("help.contact.email")}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DisabledState;
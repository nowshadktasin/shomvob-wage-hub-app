
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Mail, Phone, HelpCircle } from "lucide-react";

const Help: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const faqs = [
    {
      question: t("help.faq.withdrawalQuestion"),
      answer: t("help.faq.withdrawalAnswer")
    },
    {
      question: t("help.faq.limitsQuestion"),
      answer: t("help.faq.limitsAnswer")
    },
    {
      question: t("help.faq.feesQuestion"),
      answer: t("help.faq.feesAnswer")
    },
    {
      question: t("help.faq.accountQuestion"),
      answer: t("help.faq.accountAnswer")
    }
  ];

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6">
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
        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              {t("help.faq.title")}
            </CardTitle>
            <CardDescription>
              {t("help.faq.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Support Section */}
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
                className="flex items-center gap-3 h-auto p-4 justify-start"
              >
                <Mail className="h-5 w-5 text-blue-500" />
                <div className="text-left">
                  <div className="font-medium">{t("help.contact.email")}</div>
                  <div className="text-sm text-muted-foreground">info@shomvob.com</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="flex items-center gap-3 h-auto p-4 justify-start"
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

        {/* App Info Section */}
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
              <span>2024-01-15</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Help;

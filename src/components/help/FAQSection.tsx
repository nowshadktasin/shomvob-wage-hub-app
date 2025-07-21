
import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const FAQSection: React.FC = () => {
  const { t } = useTranslation();

  const faqs = [
    {
      question: t("help.faq.questions.withdrawal.question"),
      answer: t("help.faq.questions.withdrawal.answer")
    },
    {
      question: t("help.faq.questions.payday.question"),
      answer: t("help.faq.questions.payday.answer")
    },
    {
      question: t("help.faq.questions.serviceFee.question"),
      answer: t("help.faq.questions.serviceFee.answer")
    },
    {
      question: t("help.faq.questions.policy.question"),
      answer: t("help.faq.questions.policy.answer")
    },
    {
      question: t("help.faq.questions.rejection.question"),
      answer: t("help.faq.questions.rejection.answer")
    }
  ];

  return (
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
  );
};

export default FAQSection;

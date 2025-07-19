
import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const FAQSection: React.FC = () => {
  const { t } = useTranslation();

  const faqs = [
    {
      question: "How much of my salary can I withdraw using Shomvob EWA?",
      answer: "You can withdraw a percentage of your earned but unpaid wages, based on your organization's policy. For example, if you've earned 20,000 BDT so far this month and your withdrawal limit is 50%, you can request up to 10,000 BDT through Shomvob EWA."
    },
    {
      question: "Will using Shomvob EWA affect my regular payday salary?",
      answer: "Yes, but only by the amount you've already withdrawn. On payday, your salary will be adjusted to subtract the amount you accessed early through EWA. The remaining balance will be paid as usual."
    },
    {
      question: "Is there a service charge for using Shomvob EWA?",
      answer: "Yes, a small service fee is applied to each withdrawal request. You can view the exact fee structure in the Organization Fee Structure section above."
    },
    {
      question: "How do I know my organization's EWA policy?",
      answer: "You can view your organization's complete EWA policy including fee structure, withdrawal limits, and requirements in the Organization Fee Structure section on this page."
    },
    {
      question: "What happens if my EWA request is rejected?",
      answer: "If your request is rejected, you'll receive a notification with the reason. Common reasons include exceeding withdrawal limits, insufficient earned wages, or not meeting minimum experience requirements."
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

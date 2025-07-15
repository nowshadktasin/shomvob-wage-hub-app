import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Slab {
  fees: number;
  maxAmount: number;
  minAmount: number;
}

interface OrganizationEWAData {
  slabs: Slab[];
  claimable_percentage: string;
  maximum_wage_limit: number;
  min_experience: number;
  ewa_enabled: boolean;
  withdraw_limit: number;
}

interface OrganizationEWAInfoProps {
  data: OrganizationEWAData;
}

const OrganizationEWAInfo: React.FC<OrganizationEWAInfoProps> = ({ data }) => {
  const { t } = useTranslation();

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ${t("common.currency")}`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{t("organizationEwa.title")}</CardTitle>
        <CardDescription>
          {t("organizationEwa.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Fee Structure */}
        <div>
          <h4 className="font-semibold text-lg mb-4">{t("organizationEwa.feeStructure")}</h4>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-medium text-muted-foreground">{t("organizationEwa.minimumAmount")}</TableHead>
                  <TableHead className="font-medium text-muted-foreground">{t("organizationEwa.maximumAmount")}</TableHead>
                  <TableHead className="font-medium text-muted-foreground">{t("organizationEwa.chargedFee")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.slabs.map((slab, index) => (
                  <TableRow key={index} className="border-b last:border-b-0">
                    <TableCell className="text-foreground">{formatCurrency(slab.minAmount)}</TableCell>
                    <TableCell className="text-foreground">{formatCurrency(slab.maxAmount)}</TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {formatCurrency(slab.fees)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Organization Requirements */}
        <div>
          <h4 className="font-semibold text-lg mb-4">{t("organizationEwa.organizationRequirements")}</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">{t("organizationEwa.claimablePercentage")}:</span>
              <span className="font-semibold text-green-600">{data.claimable_percentage}%</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">{t("organizationEwa.maximumWageLimit")}:</span>
              <span className="font-semibold">{formatCurrency(data.maximum_wage_limit)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">{t("organizationEwa.minimumExperience")}:</span>
              <span className="font-semibold">{data.min_experience} {t("organizationEwa.days")}</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">{t("organizationEwa.ewaStatus")}:</span>
              <Badge variant={data.ewa_enabled ? "default" : "destructive"} className={data.ewa_enabled ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}>
                {data.ewa_enabled ? t("organizationEwa.enabled") : t("organizationEwa.disabled")}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">{t("organizationEwa.monthlyWithdrawLimit")}:</span>
              <span className="font-semibold">{data.withdraw_limit} {t("organizationEwa.times")}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizationEWAInfo;
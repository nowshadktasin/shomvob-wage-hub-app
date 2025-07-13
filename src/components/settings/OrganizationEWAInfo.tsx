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
        {/* Fee Slabs */}
        <div>
          <h4 className="font-medium mb-3">{t("organizationEwa.feeStructure")}</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("organizationEwa.minimumAmount")}</TableHead>
                <TableHead>{t("organizationEwa.maximumAmount")}</TableHead>
                <TableHead>{t("organizationEwa.chargedFee")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.slabs.map((slab, index) => (
                <TableRow key={index}>
                  <TableCell>{formatCurrency(slab.minAmount)}</TableCell>
                  <TableCell>{formatCurrency(slab.maxAmount)}</TableCell>
                  <TableCell className="font-medium text-primary">
                    {formatCurrency(slab.fees)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Organization Requirements */}
        <div>
          <h4 className="font-medium mb-3">{t("organizationEwa.organizationRequirements")}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t("organizationEwa.claimablePercentage")}:</span>
                <Badge variant="secondary">{data.claimable_percentage}%</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t("organizationEwa.maximumWageLimit")}:</span>
                <span className="font-medium">{formatCurrency(data.maximum_wage_limit)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t("organizationEwa.minimumExperience")}:</span>
                <span className="font-medium">{data.min_experience} {t("organizationEwa.days")}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t("organizationEwa.ewaStatus")}:</span>
                <Badge variant={data.ewa_enabled ? "default" : "destructive"}>
                  {data.ewa_enabled ? t("organizationEwa.enabled") : t("organizationEwa.disabled")}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t("organizationEwa.monthlyWithdrawLimit")}:</span>
                <span className="font-medium">{data.withdraw_limit} {t("organizationEwa.times")}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizationEWAInfo;
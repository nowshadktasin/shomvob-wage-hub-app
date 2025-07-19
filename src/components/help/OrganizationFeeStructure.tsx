
import React from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrganizationEwaSettings } from "@/services/organizationEwaApi";

interface OrganizationFeeStructureProps {
  data: OrganizationEwaSettings | null;
  loading: boolean;
  error: string | null;
}

const OrganizationFeeStructure: React.FC<OrganizationFeeStructureProps> = ({ 
  data, 
  loading, 
  error 
}) => {
  const { t } = useTranslation();

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ${t("common.currency")}`;
  };

  if (loading) {
    return (
      <div className="text-center text-muted-foreground py-6">
        {t("common.loading")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive py-6">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-muted-foreground py-6">
        No organization EWA data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Fee Structure Table */}
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
              {data.slabs && data.slabs.length > 0 ? (
                data.slabs.map((slab, index) => (
                  <TableRow key={index} className="border-b last:border-b-0">
                    <TableCell className="text-foreground">{formatCurrency(slab.minAmount)}</TableCell>
                    <TableCell className="text-foreground">{formatCurrency(slab.maxAmount)}</TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {formatCurrency(slab.fees)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                    {t("organizationEwa.noFeeSlabs")}
                  </TableCell>
                </TableRow>
              )}
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
    </div>
  );
};

export default OrganizationFeeStructure;

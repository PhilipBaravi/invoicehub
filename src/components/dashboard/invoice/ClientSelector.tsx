import { FC } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientVendor, BusinessInfo } from "./invoice-types";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { StyledCard, cardVariants, fadeInVariants } from "@/lib/utils/styling";

interface ClientSelectorProps {
  selectedClient: ClientVendor | null;
  handleClientSelect: (clientName: string) => void;
  clients: ClientVendor[];
  businessInformation: BusinessInfo | null;
}

interface InfoCardProps {
  title: string;
  data: Array<{
    label: string;
    value: string;
    isLink?: boolean;
    isEmail?: boolean;
  }>;
}

const ClientSelector: FC<ClientSelectorProps> = ({
  selectedClient,
  handleClientSelect,
  clients,
  businessInformation,
}) => {
  const { t } = useTranslation("invoices");

  return (
    <StyledCard
      className="space-y-6 p-6 rounded-lg border border-stone-200 dark:border-stone-700 shadow-sm"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="space-y-2">
        <Label htmlFor="client" className="text-lg font-semibold">
          {t("invoice.clientSelector.billed")}
        </Label>
        <Select
          value={selectedClient?.name}
          onValueChange={(value) => handleClientSelect(value)}
        >
          <SelectTrigger
            id="client"
            className="w-full shadow-sm border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-stone-200 dark:focus:ring-stone-700"
          >
            <SelectValue placeholder={t("invoice.clientSelector.select")} />
          </SelectTrigger>
          <SelectContent className="border-stone-200 dark:border-stone-700 shadow-md">
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.name}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={fadeInVariants}>
          {selectedClient ? (
            <InfoCard
              title={selectedClient.name}
              data={[
                {
                  label: t("invoice.clientSelector.phone"),
                  value: selectedClient.phone,
                },
                {
                  label: t("invoice.clientSelector.website"),
                  value: selectedClient.website,
                  isLink: true,
                },
                {
                  label: t("invoice.clientSelector.email"),
                  value: selectedClient.email,
                  isEmail: true,
                },
                {
                  label: t("invoice.clientSelector.country"),
                  value: selectedClient.address.country,
                },
                {
                  label: t("invoice.clientSelector.city"),
                  value: selectedClient.address.city,
                },
                {
                  label: t("invoice.clientSelector.address"),
                  value: selectedClient.address.addressLine1,
                },
              ]}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-700 rounded-lg p-6">
              {t("invoice.clientSelector.noClientSelected")}
            </div>
          )}
        </motion.div>

        <motion.div variants={fadeInVariants}>
          {businessInformation && (
            <InfoCard
              title={businessInformation.title}
              data={[
                { label: t("invoice.phone"), value: businessInformation.phone },
                {
                  label: t("invoice.website"),
                  value: businessInformation.website,
                  isLink: true,
                },
                {
                  label: t("invoice.email"),
                  value: businessInformation.email,
                  isEmail: true,
                },
                {
                  label: t("invoice.country"),
                  value: businessInformation.address.country,
                },
                {
                  label: t("invoice.city"),
                  value: businessInformation.address.city,
                },
                {
                  label: t("invoice.address"),
                  value: businessInformation.address.addressLine1,
                },
              ]}
            />
          )}
        </motion.div>
      </div>
    </StyledCard>
  );
};

const InfoCard: FC<InfoCardProps> = ({ title, data }) => (
  <Card className="h-full rounded-lg border border-stone-200 dark:border-stone-700 shadow-sm overflow-hidden">
    <CardHeader>
      <CardTitle className="text-xl font-semibold text-stone-800 dark:text-stone-200">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {data.map(({ label, value, isLink, isEmail }, index) => (
          <p key={index} className="text-sm flex justify-between">
            <span className="font-medium text-stone-600 dark:text-stone-400">
              {label}
            </span>
            {isLink ? (
              <a
                href={value}
                className="text-blue-600 dark:text-blue-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {value}
              </a>
            ) : isEmail ? (
              <a
                href={`mailto:${value}`}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {value}
              </a>
            ) : (
              <span className="text-stone-800 dark:text-stone-200">
                {value}
              </span>
            )}
          </p>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default ClientSelector;

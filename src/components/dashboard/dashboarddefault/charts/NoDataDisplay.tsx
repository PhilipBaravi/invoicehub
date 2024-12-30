import React from "react";
import { PieChartIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/utils/constants";
import { useKeycloak } from "@react-keycloak/web";

export const NoDataDisplay: React.FC = () => {
  const [newUserMessage, setNewUserMessage] = useState(false);
  const { keycloak } = useKeycloak();

  const checkNewUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}invoices/list`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      if (data.length === 0) {
        setNewUserMessage(true);
      } else {
        setNewUserMessage(false);
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(`Error: ${e.message}`);
      }
    }
  };

  useEffect(() => {
    checkNewUser();
  }, [newUserMessage]);
  const { t } = useTranslation("dashboardDefault");
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-muted/10 rounded-lg border border-dashed border-muted">
      <PieChartIcon className="w-16 h-16 mb-4 text-muted-foreground/50" />
      <p className="text-lg font-medium text-muted-foreground">{t("noData")}</p>
      <p className="mt-2 text-sm text-muted-foreground/75">
        {!newUserMessage
          ? "Start generating invoices to get data"
          : t("selectOtherOption")}
      </p>
    </div>
  );
};

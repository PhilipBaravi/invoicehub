import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";

const PrivacyPolicy: FC = () => {
  const [activeTab, setActiveTab] = useState("terms");
  const { t } = useTranslation("terms");

  return (
    <div className="container mx-auto p-4 md:p-8 w-full">
      <h1 className="text-3xl font-bold mb-6 text-center">{t("title")}</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="terms">{t("terms.title")}</TabsTrigger>
          <TabsTrigger value="privacy">{t("privacy.title")}</TabsTrigger>
        </TabsList>
        <TabsContent value="terms">
          <ScrollArea className="h-[70vh] w-full rounded-md border p-4">
            <h2 className="text-2xl font-semibold mb-4">{t("terms.title")}</h2>
            <p className="mb-4">{t("terms.lastUpdated")}</p>
            <h3 className="text-xl font-semibold mb-2">{t("terms.overview")}</h3>
            <p className="mb-4">{t("terms.overviewText")}</p>
            <h3 className="text-xl font-semibold mb-2">{t("terms.subscription")}</h3>
            <p className="mb-4">{t("terms.subscriptionText")}</p>
            <ul className="list-disc pl-6 mb-4">
              <li>{t("terms.basicPlan")}</li>
              <li>{t("terms.monthlyPlan")}</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">{t("terms.billing")}</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>{t("terms.billingText1")}</li>
              <li>{t("terms.billingText2")}</li>
              <li>{t("terms.billingText3")}</li>
              <li>{t("terms.billingText4")}</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">{t("terms.usage")}</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>{t("terms.usageText1")}</li>
              <li>{t("terms.usageText2")}</li>
              <li>{t("terms.usageText3")}</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">{t("terms.ownership")}</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>{t("terms.ownershipText1")}</li>
              <li>{t("terms.ownershipText2")}</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">{t("terms.termination")}</h3>
            <p className="mb-4">{t("terms.terminationText")}</p>
            <h3 className="text-xl font-semibold mb-2">{t("terms.limitation")}</h3>
            <p className="mb-4">{t("terms.limitationText")}</p>
            <h3 className="text-xl font-semibold mb-2">{t("terms.modifications")}</h3>
            <p className="mb-4">{t("terms.modificationsText")}</p>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="privacy">
          <ScrollArea className="h-[70vh] w-full rounded-md border p-4">
            <h2 className="text-2xl font-semibold mb-4">{t("privacy.title")}</h2>
            <p className="mb-4">{t("privacy.lastUpdated")}</p>
            <h3 className="text-xl font-semibold mb-2">{t("privacy.introduction")}</h3>
            <p className="mb-4">{t("privacy.introductionText")}</p>
            <h3 className="text-xl font-semibold mb-2">{t("privacy.data")}</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>{t("privacy.dataText1")}</li>
              <li>{t("privacy.dataText2")}</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">{t("privacy.dataUsage")}</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>{t("privacy.dataUsageText1")}</li>
              <li>{t("privacy.dataUsageText2")}</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">{t("privacy.sharing")}</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>{t("privacy.sharingText1")}</li>
              <li>{t("privacy.sharingText2")}</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">{t("privacy.security")}</h3>
            <p className="mb-4">{t("privacy.securityText")}</p>
            <h3 className="text-xl font-semibold mb-2">{t("privacy.rights")}</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>{t("privacy.rightsText1")}</li>
              <li>{t("privacy.rightsText2")}</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">{t("privacy.retention")}</h3>
            <p className="mb-4">{t("privacy.retentionText")}</p>
            <h3 className="text-xl font-semibold mb-2">{t("privacy.privacy")}</h3>
            <p className="mb-4">{t("privacy.privacyText")}</p>
          </ScrollArea>
        </TabsContent>
      </Tabs>
      <div className="mt-6 flex justify-center">
        <Link to="/login">
          <Button onClick={() => console.log(t("back"))}>
            {t("back")}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

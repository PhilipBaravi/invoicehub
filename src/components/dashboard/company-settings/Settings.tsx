import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Building2, CreditCard, User, UserPen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const Settings: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation("settings");

  const settingsNavItems = [
    { title: t("settings.user"), to: "", icon: UserPen },
    { title: t("settings.company"), to: "company-settings", icon: Building2 },
    { title: t("settings.profile"), to: "profile-subscription", icon: User },
    { title: t("settings.payment"), to: "payment-methods", icon: CreditCard },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-2 md:p-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold">{t("menu.settings")}</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
        <Card className="h-fit md:sticky md:top-8">
          <CardContent className="p-4">
            <nav className="flex flex-col space-y-1">
              {settingsNavItems.map((item) => {
                const isActive = location.pathname === `/settings/${item.to}`;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </CardContent>
        </Card>
        <Outlet />
      </div>
    </div>
  );
};

export default Settings;

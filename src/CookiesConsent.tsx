"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, ChevronRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils/utils";
import { useTranslation } from "react-i18next";

interface CookieConsentProps {
  className?: string;
}

export function CookieConsent({ className }: CookieConsentProps) {
  const [showConsent, setShowConsent] = React.useState(false);
  const [showDetails, setShowDetails] = React.useState(false);
  const { t } = useTranslation();
  const windowWidth = window.innerWidth;

  React.useEffect(() => {
    const hasConsent = localStorage.getItem("cookieConsent");
    if (!hasConsent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowConsent(false);
    setShowDetails(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "false");
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <>
      <AnimatePresence>
        {!showDetails && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              `fixed  bottom-0 md:bottom-4 right-0 md:right-4 w-[${windowWidth}]  md:w-[400px] bg-stone-50 dark:bg-stone-900 rounded-lg shadow-lg p-6 border border-stone-200 dark:border-stone-800`,
              className
            )}
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-stone-100 dark:bg-stone-800 rounded-full">
                <Cookie className="w-6 h-6 text-stone-600 dark:text-stone-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2 text-stone-900 dark:text-stone-100">
                  {t("cookies.title")}
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
                  {t("cookies.titleMsg")}
                </p>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleAccept}
                    className="w-full bg-stone-900 hover:bg-stone-800 dark:bg-stone-700 dark:hover:bg-stone-600 text-white"
                  >
                    {t("cookies.accept")}
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleDecline}
                      className="flex-1 border-stone-300 dark:border-stone-600 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      {t("cookies.decline")}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowDetails(true)}
                      className="flex-1 border-stone-300 dark:border-stone-600 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      {t("cookies.more")}{" "}
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              {/* <button
                onClick={handleDecline}
                className="text-stone-400 hover:text-stone-500 dark:hover:text-stone-300"
              >
                <X className="w-5 h-5" />
              </button> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-[500px] bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {t("cookies.about.title")}
            </DialogTitle>
            <DialogDescription className="text-stone-600 dark:text-stone-400">
              {t("cookies.about.learnMore")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">
                {t("cookies.about.authentication")}
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                {t("cookies.about.authenticationMsg")}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">
                {t("cookies.about.personalization")}
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                {t("cookies.about.personalizationMsg")}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">{t("cookies.about.improvements")}</h4>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                {t("cookies.about.improvementsMsg")}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleAccept}
              className="bg-stone-900 hover:bg-stone-800 dark:bg-stone-700 dark:hover:bg-stone-600 text-white"
            >
              {t("cookies.accept")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

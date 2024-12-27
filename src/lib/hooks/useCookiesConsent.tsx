import { useState, useEffect } from "react";

export function useCookieConsent() {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const storedConsent = localStorage.getItem("cookieConsent");
    setHasConsent(storedConsent === "true");
  }, []);

  const setConsent = (value: boolean) => {
    localStorage.setItem("cookieConsent", value.toString());
    setHasConsent(value);
  };

  return {
    hasConsent,
    setConsent,
  };
}

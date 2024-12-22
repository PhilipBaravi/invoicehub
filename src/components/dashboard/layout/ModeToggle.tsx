"use client";

import { Switch } from "@/components/ui/switch";
import { useTheme } from "./ThemeProvider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="theme-mode"
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
      />
    </div>
  );
}

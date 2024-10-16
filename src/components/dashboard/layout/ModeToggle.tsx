import { Moon, Sun, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "./ThemeProvider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {/* Display different icons based on the current theme */}
          {theme === "light" && <Sun className="h-5 w-5" />}
          {theme === "dark" && <Moon className="h-5 w-5" />}
          {["indigo", "sky", "teal", "orange"].includes(theme) && (
            <Palette className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        {/* Color Themes */}
        <DropdownMenuItem onClick={() => setTheme("indigo")}>
          Indigo
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("sky")}>
          Sky
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("teal")}>
          Teal
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("orange")}>
          Orange
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

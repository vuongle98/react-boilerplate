import { useTheme } from "@/app/providers/ThemeProvider";
import { Monitor, Moon, Sun } from "lucide-react";
import * as React from "react";
import { Button } from "./button";
import { ThemeSettings } from "./theme-settings";

interface ThemeToggleProps {
  size?: "sm" | "md" | "lg";
  variant?: "secondary" | "ghost" | "primary" | "danger" | "success";
  showLabel?: boolean;
  showSettings?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  size = "sm",
  variant = "ghost",
  showLabel = false,
  showSettings = true,
}) => {
  const { theme, toggleTheme, isDarkMode } = useTheme();

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      case "system":
        return <Monitor className="h-4 w-4" />;
      default:
        return isDarkMode ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        );
    }
  };

  const getLabel = () => {
    switch (theme) {
      case "light":
        return "Switch to dark mode";
      case "dark":
        return "Switch to system mode";
      case "system":
        return "Switch to light mode";
      default:
        return "Toggle theme";
    }
  };

  // If showSettings is true, render the settings modal trigger
  if (showSettings) {
    return (
      <ThemeSettings
        trigger={
          <Button
            variant={variant}
            size={size}
            iconLeft={getIcon()}
            title="Theme Settings"
            className="gap-2"
          >
            {showLabel && <span className="hidden sm:inline">Theme</span>}
          </Button>
        }
      />
    );
  }

  // Otherwise, render the simple toggle button
  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      iconLeft={getIcon()}
      title={getLabel()}
      className="gap-2"
    >
      {showLabel && <span className="hidden sm:inline">{getLabel()}</span>}
    </Button>
  );
};

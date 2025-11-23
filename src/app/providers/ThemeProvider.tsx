import React, { createContext, useContext, useEffect } from "react";
import { useSettingsStore } from "@/shared/stores/settings-store";

// Theme mode controls light/dark/system
export type ThemeMode = "light" | "dark" | "system";

// Accent controls the color scheme and special styles (e.g., glass)
export type AccentName =
  | "default"
  | "blue"
  | "green"
  | "purple"
  | "pink"
  | "orange"
  | "glass-blue"
  | "glass-purple";

export interface AccentConfig {
  name: AccentName;
  class: string | null; // null means no extra class
  label: string;
  icon: string;
}

export const availableAccents: AccentConfig[] = [
  { name: "default", class: null, label: "Default", icon: "🎨" },
  { name: "blue", class: "blue", label: "Blue", icon: "🔵" },
  { name: "green", class: "green", label: "Green", icon: "🌿" },
  { name: "purple", class: "purple", label: "Purple", icon: "🔮" },
  { name: "pink", class: "pink", label: "Pink", icon: "🌸" },
  { name: "orange", class: "orange", label: "Orange", icon: "🍊" },
  // Liquid glass accents
  { name: "glass-blue", class: "glass-blue", label: "Glass Blue", icon: "🧊" },
  {
    name: "glass-purple",
    class: "glass-purple",
    label: "Glass Purple",
    icon: "🫧",
  },
];

// Available theme modes for toggling
const availableThemes: { name: ThemeMode }[] = [
  { name: "light" },
  { name: "dark" },
  { name: "system" },
];

interface ThemeContextType {
  // Mode
  theme: ThemeMode; // kept for backward compatibility (mode)
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
  // Accent
  accent: AccentName;
  accentConfig: AccentConfig;
  availableAccents: AccentConfig[];
  setAccent: (accent: AccentName) => void;
  // Compact mode
  isCompact: boolean;
  setCompact: (compact: boolean) => void;
  toggleCompact: () => void;
  // Glass effect
  glassEffect: boolean;
  setGlassEffect: (glass: boolean) => void;
  toggleGlassEffect: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
  defaultAccent?: AccentName;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = "system",
  defaultAccent = "default",
}) => {
  const settings = useSettingsStore();

  const accentConfig =
    availableAccents.find((a) => a.name === settings.accent) || availableAccents[0];

  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDarkMode = settings.theme === "system" ? prefersDark : settings.theme === "dark";

  const applyTheme = React.useCallback(
    (newMode: ThemeMode, newAccent: AccentName, newCompact: boolean, newGlassEffect: boolean) => {
      if (typeof document === "undefined") return;

      const root = document.documentElement;

      // Get fresh prefersDark value
      const currentPrefersDark = typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

      // Remove previous classes
      ["light", "dark", "compact", "normal-mode", "glass-effect"].forEach((cls) => root.classList.remove(cls));
      availableAccents.forEach(
        (a) => a.class && root.classList.remove(a.class)
      );

      // Add mode class
      const modeClass =
        newMode === "system" ? (currentPrefersDark ? "dark" : "light") : newMode;
      root.classList.add(modeClass);

      // Add accent class (if any)
      const accentConf = availableAccents.find((a) => a.name === newAccent);
      if (accentConf && accentConf.class) {
        root.classList.add(accentConf.class);
      }

      // Add spacing mode class
      if (newCompact) {
        root.classList.add("compact");
      } else {
        root.classList.add("normal-mode");
      }

      // Add glass effect class
      if (newGlassEffect) {
        root.classList.add("glass-effect");
      }

      root.setAttribute("data-theme", modeClass);
    },
    []
  );

  // Apply theme on mount and when settings change
  useEffect(() => {
    applyTheme(settings.theme, settings.accent, settings.isCompact, settings.glassEffect);
  }, [settings.theme, settings.accent, settings.isCompact, settings.glassEffect, applyTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (settings.theme !== "system") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyTheme("system", settings.accent, settings.isCompact, settings.glassEffect);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [settings.theme, settings.accent, settings.isCompact, settings.glassEffect, applyTheme]);

  const toggleTheme = () => {
    const themes: ThemeMode[] = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(settings.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    settings.setTheme(themes[nextIndex]);
  };

  const toggleCompact = () => {
    settings.setCompact(!settings.isCompact);
  };

  const toggleGlassEffect = () => {
    settings.setGlassEffect(!settings.glassEffect);
  };

  const value: ThemeContextType = {
    theme: settings.theme,
    setTheme: settings.setTheme,
    toggleTheme,
    isDarkMode,
    accent: settings.accent,
    accentConfig,
    availableAccents,
    setAccent: settings.setAccent,
    isCompact: settings.isCompact,
    setCompact: settings.setCompact,
    toggleCompact,
    glassEffect: settings.glassEffect,
    setGlassEffect: settings.setGlassEffect,
    toggleGlassEffect,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

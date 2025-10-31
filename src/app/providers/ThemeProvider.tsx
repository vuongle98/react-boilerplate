import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

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
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return defaultTheme;
    const savedMode =
      (localStorage.getItem("utilz-theme-mode") as ThemeMode | null) ||
      (localStorage.getItem("utilz-theme") as ThemeMode | null) || // backward compat
      defaultTheme;
    return savedMode;
  });

  const [accent, setAccentState] = useState<AccentName>(() => {
    if (typeof window === "undefined") return defaultAccent;
    const savedAccent = localStorage.getItem(
      "utilz-theme-accent"
    ) as AccentName | null;
    // Migrate older single-theme values (e.g., 'blue')
    const legacy = localStorage.getItem("utilz-theme") as string | null;
    const legacyAccent =
      legacy && ["blue", "green", "purple", "pink", "orange"].includes(legacy)
        ? (legacy as AccentName)
        : null;
    return savedAccent || legacyAccent || defaultAccent;
  });

  const accentConfig =
    availableAccents.find((a) => a.name === accent) || availableAccents[0];
  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDarkMode = theme === "system" ? prefersDark : theme === "dark";

  const applyTheme = useCallback(
    (newMode: ThemeMode, newAccent: AccentName) => {
      if (typeof document === "undefined") return;

      const root = document.documentElement;

      // Remove previous classes
      ["light", "dark"].forEach((cls) => root.classList.remove(cls));
      availableAccents.forEach(
        (a) => a.class && root.classList.remove(a.class)
      );

      // Add mode class
      const modeClass =
        newMode === "system" ? (prefersDark ? "dark" : "light") : newMode;
      root.classList.add(modeClass);

      // Add accent class (if any)
      const accentConf = availableAccents.find((a) => a.name === newAccent);
      if (accentConf && accentConf.class) {
        root.classList.add(accentConf.class);
      }

      root.setAttribute("data-theme", modeClass);

      // Persist
      localStorage.setItem("utilz-theme-mode", newMode);
      localStorage.setItem("utilz-theme-accent", newAccent);
    },
    [prefersDark]
  );

  // Apply theme on mount and when theme changes
  useEffect(() => {
    applyTheme(theme, accent);
  }, [theme, accent, applyTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== "system") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyTheme("system", accent);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, accent, applyTheme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const setAccent = (newAccent: AccentName) => {
    setAccentState(newAccent);
  };

  const toggleTheme = () => {
    setThemeState((prev) => {
      const currentIndex = availableThemes.findIndex((t) => t.name === prev);
      const nextIndex = (currentIndex + 1) % availableThemes.length;
      return availableThemes[nextIndex].name as ThemeMode;
    });
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme,
    isDarkMode,
    accent,
    accentConfig,
    availableAccents,
    setAccent,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};


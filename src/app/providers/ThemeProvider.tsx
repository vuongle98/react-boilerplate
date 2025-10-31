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

  const [isCompact, setCompactState] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const savedCompact = localStorage.getItem("utilz-theme-compact");
    return savedCompact === "true";
  });

  const [glassEffect, setGlassEffectState] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const savedGlass = localStorage.getItem("utilz-theme-glass");
    return savedGlass === "true";
  });

  const accentConfig =
    availableAccents.find((a) => a.name === accent) || availableAccents[0];
  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDarkMode = theme === "system" ? prefersDark : theme === "dark";

  const applyTheme = useCallback(
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

      // Persist to localStorage
      try {
        localStorage.setItem("utilz-theme-mode", newMode);
        localStorage.setItem("utilz-theme-accent", newAccent);
        localStorage.setItem("utilz-theme-compact", newCompact.toString());
        localStorage.setItem("utilz-theme-glass", newGlassEffect.toString());
      } catch (error) {
        console.warn("Failed to save theme to localStorage:", error);
      }
    },
    []
  );

  // Apply theme on mount and when theme changes
  useEffect(() => {
    applyTheme(theme, accent, isCompact, glassEffect);
  }, [theme, accent, isCompact, glassEffect, applyTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== "system") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyTheme("system", accent, isCompact, glassEffect);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, accent, isCompact, glassEffect, applyTheme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const setAccent = (newAccent: AccentName) => {
    setAccentState(newAccent);
  };

  const setCompact = (compact: boolean) => {
    setCompactState(compact);
  };

  const setGlassEffect = (glass: boolean) => {
    setGlassEffectState(glass);
  };

  const toggleCompact = () => {
    setCompact(!isCompact);
  };

  const toggleGlassEffect = () => {
    setGlassEffect(!glassEffect);
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
    isCompact,
    setCompact,
    toggleCompact,
    glassEffect,
    setGlassEffect,
    toggleGlassEffect,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};


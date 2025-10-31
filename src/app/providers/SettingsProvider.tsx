import { AccentName, ThemeMode, useTheme } from "./ThemeProvider";
import useSettingsInitializer from "@/shared/hooks/useSettingsInitializer";
import { useUserSettings } from "@/shared/hooks/useUserSettings";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";

// Storage key for instant boot
const LS_SETTINGS_KEY = "app-settings";

// Settings types
export type PaginationStyle = "page" | "infinite";

// Define DisplayMode type to match the one in display.ts
export type DisplayMode = "grid" | "list" | "table" | "kanban";
export type ModuleDisplayModes = Record<string, DisplayMode>;

export interface DashboardConfig {
  components: string[]; // component ids visible on dashboard
}

export interface PaginationConfig {
  style: PaginationStyle;
  pageSize: number;
}

export interface NotificationConfig {
  enabled: boolean;
  email?: boolean;
  push?: boolean;
  sound?: boolean;
}

export interface ThemeConfig {
  mode: ThemeMode;
  accent: AccentName;
}

export interface Settings {
  // UI/Appearance settings
  theme: {
    mode: ThemeMode;
    accent: AccentName;
  };

  // Display settings
  display: {
    compactMode: boolean;
    animations: boolean;
    defaultExpandFilter: boolean;
    displayModes: ModuleDisplayModes;
  };

  // Navigation settings
  navigation: {
    sidebarItems: string[];
  };

  // Pagination settings
  pagination: {
    style: PaginationStyle;
    pageSize: number;
  };

  // Notification settings
  notifications: {
    enabled: boolean;
    email: boolean;
    push: boolean;
    sound: boolean;
  };

  // Dashboard settings
  dashboard: {
    components: string[];
  };

  // General settings
  general: {
    language: string; // e.g. en, vi
  };
}

// Default system settings (fallback if API not loaded yet)
export const defaultSystemSettings: Settings = {
  theme: {
    mode: "light",
    accent: "blue",
  },
  display: {
    compactMode: false,
    animations: true,
    defaultExpandFilter: true,
    displayModes: {
      notes: "table",
      tasks: "table",
      blogs: "list",
      notebooks: "grid",
    },
  },
  navigation: {
    sidebarItems: [
      "dashboard",
      "notes",
      "tasks",
      "blogs",
      "notebooks",
      "tags",
      "settings",
    ],
  },
  pagination: {
    style: "page",
    pageSize: 10,
  },
  notifications: {
    enabled: true,
    email: true,
    push: true,
    sound: true,
  },
  dashboard: {
    components: ["quick-stats", "recent-notes", "recent-tasks"],
  },
  general: {
    language: "en",
  },
};

// Deep merge where user overrides replace system defaults when value is not null/undefined.
function mergeSettings<T extends Record<string, unknown> | Settings>(
  systemObj: T,
  userObj?: Partial<T> | null
): T {
  if (!userObj) return { ...systemObj } as T;
  const result: unknown = Array.isArray(systemObj)
    ? [...(systemObj as unknown[])]
    : { ...systemObj };
  Object.keys(userObj).forEach((key) => {
    const uVal: unknown = (userObj as Record<string, unknown>)[key];
    const sVal: unknown = (systemObj as Record<string, unknown>)[key];
    if (uVal === null || uVal === undefined) {
      // keep system default
      (result as Record<string, unknown>)[key] = sVal;
      return;
    }
    if (Array.isArray(uVal)) {
      (result as Record<string, unknown>)[key] = [...uVal];
    } else if (
      typeof uVal === "object" &&
      uVal !== null &&
      typeof sVal === "object" &&
      sVal !== null &&
      !Array.isArray(sVal)
    ) {
      (result as Record<string, unknown>)[key] = mergeSettings(
        sVal as Record<string, unknown>,
        uVal as Record<string, unknown>
      );
    } else {
      (result as Record<string, unknown>)[key] = uVal;
    }
  });
  return result as T;
}

// Extract overrides: values in current that differ from base
function diffOverrides<T extends Record<string, unknown>>(
  base: T,
  current: T
): Partial<T> {
  const result: unknown = Array.isArray(base) ? [] : {};
  Object.keys(current).forEach((key) => {
    const bVal: unknown = (base as Record<string, unknown>)[key];
    const cVal: unknown = (current as Record<string, unknown>)[key];
    if (
      typeof cVal === "object" &&
      cVal !== null &&
      typeof bVal === "object" &&
      bVal !== null &&
      !Array.isArray(cVal) &&
      !Array.isArray(bVal)
    ) {
      const child = diffOverrides(
        bVal as Record<string, unknown>,
        cVal as Record<string, unknown>
      );
      if (Object.keys(child).length > 0)
        (result as Record<string, unknown>)[key] = child;
    } else if (JSON.stringify(cVal) !== JSON.stringify(bVal)) {
      (result as Record<string, unknown>)[key] = cVal;
    }
  });
  return result as Partial<T>;
}

// Context
type SettingsUpdate = { path: string; value: unknown } | Settings;

interface SettingsContextValue {
  settings: Settings;
  systemDefaults: Settings;
  userOverrides: Partial<Settings> | null;
  loading: boolean;
  error: string | null;
  updateSetting: (update: SettingsUpdate, group?: string) => Promise<void>;
  resetToSystem: () => Promise<void>;
  refresh: () => Promise<void>;
  clearSystemCache: () => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined
);

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme: currentTheme, accent: currentAccent } = useTheme();
  const { isAuthenticated } = useAuth();

  // Initialize system settings
  const {
    systemSettings: systemDefaults,
    loading: systemLoading,
    error: systemError,
    refresh: refreshSystemSettings,
  } = useSettingsInitializer();

  // Initialize user settings
  const {
    userSettings: userOverrides,
    loading: userLoading,
    error: userError,
    updateUserSettings,
    refreshUserSettings,
    clearCache,
  } = useUserSettings();

  const [settings, setSettings] = useState<Settings>(defaultSystemSettings);
  const [initialized, setInitialized] = useState(false);
  const fetchingRef = useRef(false);

  const persist = useCallback((merged: Settings) => {
    localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(merged));
  }, []);

  const applyUI = useCallback(
    (merged: Settings) => {
      // Theme is now managed by ThemeProvider only
      // SettingsProvider reads theme state but doesn't set it
      // Future: i18n, layout changes can be reacted to by consumers via context
    },
    []
  );

  const computeAndApply = useCallback(
    (sys: Settings, usr: Partial<Settings>) => {
      const merged = mergeSettings(sys, usr || undefined);
      // userOverrides is managed by useUserSettings hook
      setSettings(merged);
      persist(merged);
      applyUI(merged);
    },
    [applyUI, persist]
  );

  // Initialize or refresh settings when system or user settings change
  useEffect(() => {
    if (systemDefaults) {
      computeAndApply(systemDefaults, userOverrides || null);
      if (!initialized) {
        setInitialized(true);
      }
    }
  }, [systemDefaults, userOverrides, computeAndApply, initialized]);

  const refresh = useCallback(async () => {
    try {
      // Refresh both system and user settings in parallel
      await Promise.all([refreshSystemSettings(), refreshUserSettings()]);
    } catch (e: unknown) {
      console.error("Failed to refresh settings:", e);
      // Fallback: ensure current local state still applies UI
      applyUI(settings);
    }
  }, [applyUI, settings, refreshSystemSettings, refreshUserSettings]);

  // Track if we've loaded settings for the current session
  const hasLoadedSettings = useRef(false);

  // Fetch settings when authentication state changes
  useEffect(() => {
    if (isAuthenticated && !hasLoadedSettings.current) {
      hasLoadedSettings.current = true;
      refresh();
    } else if (!isAuthenticated) {
      // Reset the flag when user logs out
      hasLoadedSettings.current = false;
      // Apply default settings when not authenticated
      computeAndApply(defaultSystemSettings, null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Update a setting or group of settings
  const updateSetting = useCallback(
    async (update: SettingsUpdate, group?: string) => {
      let updatePayload: Partial<Settings> = {};

      // Handle different update formats
      if (typeof update === "object" && update !== null) {
        if ("path" in update) {
          // Handle { path: string, value: any } format
          const segments = update.path?.split(".");
          let currentLevel: Partial<Settings> = updatePayload;

          // Build the nested update object
          for (let i = 0; i < segments.length; i++) {
            const key = segments[i];
            if (i === segments.length - 1) {
              currentLevel[key] = update.value;
            } else {
              currentLevel[key] = {};
              currentLevel = currentLevel[key] as Settings;
            }
          }
        } else {
          // Handle direct object updates { key: value }
          updatePayload = { ...update };
        }
      } else {
        throw new Error(
          "Invalid update format. Must be an object with path/value or key/value pairs."
        );
      }

      // If a group is specified, wrap the payload in a group object
      const payloadToSend = group ? { [group]: updatePayload } : updatePayload;

      // Update local state immediately for instant feedback
      const newSettings = mergeSettings(systemDefaults, {
        ...userOverrides,
        ...(group
          ? {
              [group]: {
                ...((userOverrides?.[group as keyof Settings] as Record<
                  string,
                  unknown
                >) || {}),
                ...updatePayload,
              },
            }
          : updatePayload),
      });

      setSettings(newSettings);
      persist(newSettings);
      applyUI(newSettings);

      // Sync with backend
      try {
        await updateUserSettings(payloadToSend);
      } catch (error: unknown) {
        console.error("Failed to update settings:", error);
        // Revert to previous settings on error
        await refresh();
        throw error; // Re-throw to allow error handling in the component
      }
    },
    [
      applyUI,
      persist,
      systemDefaults,
      userOverrides,
      updateUserSettings,
      refresh,
    ]
  );

  const resetToSystem = useCallback(async () => {
    computeAndApply(systemDefaults, null);
    // Send an empty object to clear all user settings
    await updateUserSettings({});
  }, [systemDefaults, updateUserSettings, computeAndApply]);

  const clearSystemCache = useCallback(async () => {
    clearCache();
  }, [clearCache]);

  const value = useMemo(
    () => ({
      settings,
      systemDefaults,
      userOverrides,
      loading: !initialized || systemLoading || userLoading,
      error: systemError || userError,
      updateSetting,
      resetToSystem,
      refresh,
      clearSystemCache,
    }),
    [
      settings,
      systemDefaults,
      userOverrides,
      initialized,
      systemLoading,
      userLoading,
      systemError,
      userError,
      updateSetting,
      resetToSystem,
      refresh,
      clearSystemCache,
    ]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};


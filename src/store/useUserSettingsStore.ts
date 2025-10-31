import LoggingService from "@/shared/services/LoggingService";
import { UserSettings, userService } from "@/shared/services/UserService";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserSettingsState {
  settings: UserSettings;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  setFilterExpanded: (expanded: boolean) => Promise<void>;
  setColumnVisibility: (
    tableId: string,
    columnId: string,
    visible: boolean
  ) => Promise<void>;
  setLoggingEnabled: (enabled: boolean) => Promise<void>;
  setTheme: (theme: "light" | "dark" | "system") => Promise<void>;
  saveSettings: () => Promise<boolean>;
}

const DEFAULT_SETTINGS: UserSettings = {
  filters: {
    expanded: false,
  },
  tables: {
    columnVisibility: {},
  },
  loggingEnabled: true,
  theme: "system",
};

const useUserSettingsStore = create<UserSettingsState>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      isLoading: false,
      error: null,

      initialize: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await userService.getUserSettings();
          if (response) {
            set({ settings: response });
          } else {
            set({ error: "Failed to load settings" });
          }
        } catch (error) {
          console.error("Error initializing settings:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to load settings",
          });
        } finally {
          set({ isLoading: false });
        }
      },

      setFilterExpanded: async (expanded) => {
        const { settings, saveSettings } = get();
        const newSettings = {
          ...settings,
          filters: {
            ...settings.filters,
            expanded,
          },
        };
        set({ settings: newSettings });
        LoggingService.logUserAction(
          "settings",
          "update_filter_expanded",
          `Filter expanded set to: ${expanded}`
        );
        await saveSettings();
      },

      setColumnVisibility: async (tableId, columnId, visible) => {
        const { settings, saveSettings } = get();
        const currentTableSettings =
          settings.tables.columnVisibility[tableId] || {};

        const newSettings = {
          ...settings,
          tables: {
            ...settings.tables,
            columnVisibility: {
              ...settings.tables.columnVisibility,
              [tableId]: {
                ...currentTableSettings,
                [columnId]: visible,
              },
            },
          },
        };

        set({ settings: newSettings });

        LoggingService.logUserAction(
          "settings",
          "update_column_visibility",
          `Column visibility updated: ${tableId}.${columnId} = ${visible}`
        );

        await saveSettings();
      },

      setLoggingEnabled: async (enabled) => {
        const { settings, saveSettings } = get();
        const newSettings = {
          ...settings,
          loggingEnabled: enabled,
        };

        set({ settings: newSettings });

        // Apply the setting immediately to the logging service
        LoggingService.setActivityTracking(enabled);

        // Log the action itself if logging is still enabled
        if (enabled) {
          LoggingService.logUserAction(
            "settings",
            "update_logging_enabled",
            `Logging enabled: ${enabled}`
          );
        }

        await saveSettings();
      },

      setTheme: async (theme) => {
        const { settings, saveSettings } = get();
        const newSettings = {
          ...settings,
          theme,
        };

        set({ settings: newSettings });

        LoggingService.logUserAction(
          "settings",
          "update_theme",
          `Theme changed to: ${theme}`
        );

        await saveSettings();
      },

      saveSettings: async () => {
        const { settings } = get();
        try {
          set({ isLoading: true, error: null });
          const response = await userService.updateUserSettings(settings);
          if (!response) {
            throw new Error("Failed to save settings");
          }
          return true;
        } catch (error) {
          console.error("Error saving settings:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to save settings",
          });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "user-settings-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        settings: state.settings,
      }),
    }
  )
);

export default useUserSettingsStore;

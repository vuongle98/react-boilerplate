import { Settings, defaultSystemSettings } from "@/app/providers/SettingsProvider";
import SettingsService from "@/shared/services/SettingsService";
import { useState } from "react";

const useSettingsInitializer = () => {
  const [systemSettings, setSystemSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializeSettings = async () => {
    setLoading(true);
    setError(null);

    try {
      // Try to fetch system settings first
      const response = await SettingsService.getSystemSettings();

      if (response) {
        // Merge with defaults to ensure all required fields are present
        const mergedSettings: Settings = {
          ...defaultSystemSettings,
          ...response,
          theme: {
            ...defaultSystemSettings.theme,
            ...(response.theme || {}),
          },
          dashboard: {
            ...defaultSystemSettings.dashboard,
            ...(response.dashboard || {}),
          },
          pagination: {
            ...defaultSystemSettings.pagination,
            ...(response.pagination || {}),
          },
          notifications: {
            ...defaultSystemSettings.notifications,
            ...(response.notifications || {}),
          },
          display: {
            ...defaultSystemSettings.display,
            ...(response.display || {}),
            displayModes: {
              ...defaultSystemSettings.display.displayModes,
              ...(response.display?.displayModes || {}),
            },
          },
        };

        setSystemSettings(mergedSettings);
      } else {
        setSystemSettings(defaultSystemSettings);
      }
    } catch (err) {
      console.warn("Failed to initialize system settings, using defaults", err);
      setError("Failed to load system settings");
      setSystemSettings(defaultSystemSettings);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   initializeSettings();
  // }, []);

  return {
    systemSettings,
    loading,
    error,
    refresh: initializeSettings,
  };
};

export default useSettingsInitializer;

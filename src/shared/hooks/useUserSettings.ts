import { Settings } from "@/app/providers/SettingsProvider";
import SettingsService from "@/shared/services/SettingsService";
import { useCallback, useEffect, useRef, useState } from "react";

type UseUserSettingsReturn = {
  userSettings: Partial<Settings> | null;
  loading: boolean;
  error: string | null;
  updateUserSettings: (
    updates: Partial<Settings>
  ) => Promise<Partial<Settings>>;
  refreshUserSettings: () => Promise<void>;
  clearCache: () => Promise<void>;
};

export const useUserSettings = (): UseUserSettingsReturn => {
  const [userSettings, setUserSettings] = useState<Partial<Settings> | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef(false);

  const fetchUserSettings = useCallback(async () => {
    if (fetchingRef.current) return;

    fetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await SettingsService.getUserSettings();
      setUserSettings(response || null);
    } catch (err) {
      console.warn("Failed to fetch user settings:", err);
      setError("Failed to load user settings");
      setUserSettings(null);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchUserSettings();
  }, [fetchUserSettings]);

  const updateUserSettings = useCallback(
    async (updates: Partial<Settings>) => {
      try {
        setLoading(true);
        setError(null);

        // Optimistic update
        setUserSettings((prev) => ({
          ...prev,
          ...updates,
        }));

        // Send update to server using the service
        const updatedSettings = await SettingsService.updateUserSettings(
          updates
        );
        return updatedSettings || updates; // Fallback to the updates if response is null
      } catch (err) {
        console.error("Failed to update user settings:", err);
        setError("Failed to update settings");
        // Re-fetch to ensure we're in sync
        await fetchUserSettings();
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchUserSettings]
  );

  const clearCache = useCallback(async () => {
    if (fetchingRef.current) return;

    fetchingRef.current = true;
    setLoading(true);

    await SettingsService.clearCache();

    setLoading(false);

    fetchingRef.current = false;
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchUserSettings();
  }, [fetchUserSettings]);

  return {
    userSettings,
    loading,
    error,
    updateUserSettings,
    refreshUserSettings: fetchUserSettings,
    clearCache,
  };
};

export default useUserSettings;

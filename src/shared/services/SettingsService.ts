import { Settings } from "@/app/providers/SettingsProvider";
import BaseApiService from "./BaseApiService";

class SettingsService {
  // Get user settings
  static async getUserSettings(): Promise<Partial<Settings> | null> {
    try {
      return await BaseApiService.get<Partial<Settings>>(
        "/api/core/user/settings"
      );
    } catch (error) {
      console.error("Failed to fetch user settings:", error);
      return null;
    }
  }

  // Update user settings
  static async updateUserSettings(
    updates: Partial<Settings>
  ): Promise<Partial<Settings> | null> {
    try {
      return await BaseApiService.put<Partial<Settings>>(
        "/api/core/user/settings",
        updates
      );
    } catch (error) {
      console.error("Failed to update user settings:", error);
      throw error; // Re-throw to allow error handling in the hook
    }
  }

  // Get system settings
  static async getSystemSettings(): Promise<Partial<Settings> | null> {
    try {
      return await BaseApiService.get<Partial<Settings>>(
        "/api/core/system/settings"
      );
    } catch (error) {
      console.error("Failed to fetch system settings:", error);
      return null;
    }
  }

  // Get system settings
  static async clearCache(): Promise<null> {
    try {
      return await BaseApiService.get<Partial<null>>("/api/core/caching/clear");
    } catch (error) {
      console.error("Failed to fetch system settings:", error);
      return null;
    }
  }

  // Reset user settings to system defaults
  static async resetToSystemDefaults(): Promise<boolean> {
    try {
      await BaseApiService.put("/api/core/user/settings/reset", {});
      return true;
    } catch (error) {
      console.error("Failed to reset settings to system defaults:", error);
      return false;
    }
  }
}

export default SettingsService;

import { KeycloakUser, User } from "@/shared/types";
import { UserProfile } from "@/shared/types";
import BaseApiService from "./BaseApiService";
import keycloakService from "@/features/auth/services/KeycloakService";

export interface UserSettings {
  filters: {
    expanded: boolean;
  };
  tables: {
    columnVisibility: Record<string, Record<string, boolean>>;
  };
  loggingEnabled: boolean;
  theme: "light" | "dark" | "system";
}

export class UserService {
  private static _instance: UserService | null = null;
  private currentUser: User | null = null;
  private userProfile: UserProfile | null = null;
  private userSettings: UserSettings | null = null;
  private static readonly BASE_URL = "/api/core/user";

  private constructor() {}

  /**
   * Get the singleton instance of UserService
   */
  public static getInstance(): UserService {
    if (!this._instance) {
      this._instance = new UserService();
    }
    return this._instance;
  }

  private mapKeycloakToUser(keycloakUser: KeycloakUser): User {
    return {
      id: keycloakUser.sub,
      name: keycloakUser.name || keycloakUser.preferred_username || "User",
      email: keycloakUser.email || "",
      avatar:
        keycloakUser.avatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${keycloakUser.sub}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async getUserProfile(): Promise<UserProfile> {
    try {
      if (this.userProfile) {
        return this.userProfile;
      }

      const profile = await BaseApiService.get<UserProfile>(
        `${UserService.BASE_URL}/profile`
      );

      this.userProfile = profile;
      return profile;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      throw error;
    }
  }

  async updateUserProfile(
    profileData: Partial<UserProfile>
  ): Promise<UserProfile> {
    try {
      const updatedProfile = await BaseApiService.put<UserProfile>(
        `${UserService.BASE_URL}/profile`,
        profileData
      );

      this.userProfile = {
        ...(this.userProfile || {}),
        ...updatedProfile,
      } as UserProfile;
      return this.userProfile;
    } catch (error) {
      console.error("Failed to update user profile:", error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      // If we already have the user, return it
      if (this.currentUser) {
        return this.currentUser;
      }

      // Get user info from Keycloak
      const keycloakUser: KeycloakUser = keycloakService.getUserInfo();
      if (!keycloakUser) {
        throw new Error("No authenticated user found");
      }

      // Map Keycloak user to our User type
      const user = this.mapKeycloakToUser(keycloakUser);
      this.currentUser = user;

      return user;
    } catch (error) {
      console.error("Error fetching current user:", error);

      // In development, return a mock user if Keycloak fails
      if (process.env.NODE_ENV === "development") {
        console.warn("Using mock user data");
        const mockUser: User = {
          id: "dev-user-1",
          name: "Dev User",
          email: "dev@example.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dev",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        this.currentUser = mockUser;
        return mockUser;
      }

      return null;
    }
  }

  async updateProfile(updates: Partial<User>): Promise<User | null> {
    try {
      // In a real app, you would update the user profile in your backend
      // For now, we'll just update the local user object
      if (this.currentUser) {
        this.currentUser = { ...this.currentUser, ...updates };
        return this.currentUser;
      }

      throw new Error("No user is currently logged in");
    } catch (error) {
      console.error("Failed to update profile:", error);
      return null;
    }
  }

  async logout(): Promise<null> {
    try {
      await keycloakService.logout();
      this.currentUser = null;
      this.userSettings = null;
      return null;
    } catch (error) {
      console.error("Logout failed:", error);
      return null;
    }
  }

  /**
   * Fetch user settings from the server
   */
  async fetchUserSettings(): Promise<UserSettings | null> {
    try {
      const response = await BaseApiService.get<UserSettings>(
        `${UserService.BASE_URL}/settings`
      );

      if (response) {
        this.userSettings = response;
        return response;
      }

      throw new Error("Failed to fetch user settings");
    } catch (error) {
      console.error("Error fetching user settings:", error);
      return null;
    }
  }

  /**
   * Update user settings on the server
   */
  async updateUserSettings(
    updates: Partial<UserSettings>
  ): Promise<UserSettings | null> {
    try {
      if (!this.userSettings) {
        throw new Error("No user settings loaded");
      }

      const updatedSettings = { ...this.userSettings, ...updates };
      const response = await BaseApiService.put<UserSettings>(
        `${UserService.BASE_URL}/settings`,
        updatedSettings
      );

      if (response) {
        this.userSettings = response;
        return response;
      }

      throw new Error("Failed to update user settings");
    } catch (error) {
      console.error("Error updating user settings:", error);
      return null;
    }
  }

  /**
   * Get the current user's settings
   * Will fetch from server if not already loaded
   */
  async getUserSettings(): Promise<UserSettings | null> {
    if (this.userSettings) {
      return this.userSettings;
    }
    return this.fetchUserSettings();
  }
}

export const userService = UserService.getInstance();

import Keycloak from "keycloak-js";
import LoggingService from "@/shared/services/LoggingService";
import { KeycloakUser } from "@/features/auth/types";

class KeycloakService {
  private keycloak: Keycloak | null = null;
  private initialized = false;
  private initializationFailed = false;
  private tokenRefreshInterval: NodeJS.Timeout | null = null;

  /**
   * Set up automatic token refresh
   */
  private setupTokenRefresh() {
    if (!this.keycloak?.token) return;

    // Clear any existing interval
    if (this.tokenRefreshInterval) {
      clearInterval(this.tokenRefreshInterval);
    }

    // Refresh token before it expires (5 minutes before expiration)
    this.tokenRefreshInterval = setInterval(async () => {
      try {
        const refreshed = await this.keycloak?.updateToken(300); // 5 minutes in seconds
        if (refreshed) {
          console.log("Token refreshed successfully");
        }
      } catch (error) {
        console.error("Failed to refresh token:", error);
        // On refresh failure, clear the interval and let the next request handle re-authentication
        if (this.tokenRefreshInterval) {
          clearInterval(this.tokenRefreshInterval);
          this.tokenRefreshInterval = null;
        }
      }
    }, 60000); // Check every minute
  }

  /**
   * Clean up resources
   */
  public cleanup() {
    if (this.tokenRefreshInterval) {
      clearInterval(this.tokenRefreshInterval);
      this.tokenRefreshInterval = null;
    }
  }

  /**
   * Initialize Keycloak
   */
  async init(config: {
    url: string;
    realm: string;
    clientId: string;
  }): Promise<boolean> {
    try {
      console.log("Initializing Keycloak with config:", config);

      this.keycloak = new Keycloak({
        url: config.url,
        realm: config.realm,
        clientId: config.clientId,
      });

      // Try to authenticate silently first
      try {
        const authenticated = await this.keycloak.init({
          onLoad: "check-sso",
          silentCheckSsoRedirectUri:
            window.location.origin + "/silent-check-sso.html",
          checkLoginIframe: false,
          pkceMethod: "S256",
          enableLogging: true,
        });

        this.initialized = true;
        this.initializationFailed = false;

        // If not authenticated, redirect to login
        if (!authenticated) {
          console.log("Not authenticated, redirecting to login...");
          await this.keycloak.login();
          return false; // Will redirect before this returns
        }

        // If we have a token, update it before it expires
        if (this.keycloak.token) {
          this.setupTokenRefresh();
        }

        return true;
      } catch (error) {
        console.error("Keycloak initialization error:", error);
        this.initializationFailed = true;
        throw error;
      }

      LoggingService.info(
        "keycloak",
        "init_success",
        "Keycloak initialized successfully"
      );

      return true;
    } catch (error) {
      this.initializationFailed = true;
      LoggingService.error(
        "keycloak",
        "init_failed",
        "Failed to initialize Keycloak",
        error
      );
      console.error("Keycloak initialization failed:", error);
      console.warn(
        "Running in development mode without Keycloak authentication"
      );
      return false;
    }
  }

  /**
   * Check if initialization failed
   */
  hasInitializationFailed(): boolean {
    return this.initializationFailed;
  }

  /**
   * Login to Keycloak
   */
  async login(): Promise<void> {
    if (!this.keycloak) {
      if (this.initializationFailed) {
        console.warn("Keycloak not available - using development mode");
        return;
      }
      throw new Error("Keycloak not initialized");
    }

    try {
      console.log("Starting Keycloak login...");
      await this.keycloak.login();

      LoggingService.info(
        "keycloak",
        "login_success",
        "User logged in successfully"
      );
    } catch (error) {
      LoggingService.error("keycloak", "login_failed", "Login failed", error);
      throw error;
    }
  }

  /**
   * Logout from Keycloak
   */
  async logout(): Promise<void> {
    if (!this.keycloak) {
      if (this.initializationFailed) {
        console.warn("Keycloak not available - using development mode");
        return;
      }
      throw new Error("Keycloak not initialized");
    }

    try {
      console.log("Starting Keycloak logout...");
      await this.keycloak.logout();
      LoggingService.info(
        "keycloak",
        "logout_success",
        "User logged out successfully"
      );
    } catch (error) {
      LoggingService.error("keycloak", "logout_failed", "Logout failed", error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (this.initializationFailed || !this.keycloak) {
      return false;
    }

    const authenticated = !!(
      this.keycloak.authenticated &&
      this.keycloak.token &&
      !this.keycloak.isTokenExpired()
    );
    return authenticated;
  }

  /**
   * Get user token
   */
  getToken(): string | undefined {
    if (this.initializationFailed) {
      return undefined;
    }
    return this.keycloak?.token;
  }

  /**
   * Get user info - combines tokenParsed and profile data
   */
  getUserInfo(): KeycloakUser {
    if (
      this.initializationFailed ||
      !this.keycloak ||
      !this.isAuthenticated()
    ) {
      return null;
    }

    const tokenParsed = this.keycloak.tokenParsed;
    const profile = this.keycloak.profile;

    if (!tokenParsed) return null;

    return {
      ...tokenParsed,
      ...profile,
      sub: tokenParsed.sub,
      preferred_username: tokenParsed.preferred_username || profile?.username,
      email: tokenParsed.email || profile?.email,
      name:
        tokenParsed.name ||
        (profile?.firstName && profile?.lastName
          ? `${profile.firstName} ${profile.lastName}`
          : undefined),
      given_name: tokenParsed.given_name || profile?.firstName,
      family_name: tokenParsed.family_name || profile?.lastName,
      realm_access: tokenParsed.realm_access,
    };
  }

  /**
   * Refresh token if it's about to expire
   */
  async refreshToken(): Promise<boolean> {
    if (!this.keycloak || this.initializationFailed) {
      return false;
    }

    try {
      const refreshed = await this.keycloak.updateToken(30); // refresh if token expires in 30s

      if (refreshed) {
        LoggingService.info(
          "keycloak",
          "token_refreshed",
          "Token refreshed successfully"
        );
      }

      return true;
    } catch (error) {
      LoggingService.error(
        "keycloak",
        "token_refresh_failed",
        "Token refresh failed",
        error
      );
      return false;
    }
  }

  /**
   * Get Keycloak instance
   */
  getKeycloak(): Keycloak | null {
    return this.keycloak;
  }

  /**
   * Check if user has role
   */
  hasRole(role: string): boolean {
    if (this.initializationFailed) {
      return false;
    }
    return this.keycloak?.hasRealmRole(role) ?? false;
  }

  /**
   * Check if user has resource role
   */
  hasResourceRole(resource: string, role: string): boolean {
    if (this.initializationFailed) {
      return false;
    }
    return this.keycloak?.hasResourceRole(role, resource) ?? false;
  }
}

const keycloakService = new KeycloakService();
export default keycloakService;


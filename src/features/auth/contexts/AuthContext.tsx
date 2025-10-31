import { useKeycloak } from "@/features/auth/contexts/KeycloakContext";
import ServiceRegistry from "@/shared/services/ServiceRegistry";
import { User } from "@/features/auth/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  updateUserProfile: (data: Partial<User>) => void;
  resetPassword: (username: string) => Promise<boolean>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const keycloak = useKeycloak();

  // Handle authentication state changes
  useEffect(() => {
    const initAuth = async () => {
      // Wait for Keycloak to finish loading
      if (keycloak.isLoading) {
        console.log("AuthContext: Keycloak still loading, waiting...");
        return;
      }

      setIsLoading(true);

      try {
        // If initialization failed, handle as unauthenticated
        if (keycloak.initializationFailed) {
          console.error("AuthContext: Keycloak initialization failed");
          setUser(null);
          ServiceRegistry.updateCurrentUser(null);
          return;
        }

        // If not authenticated, try to authenticate
        if (!keycloak.isAuthenticated) {
          console.log("AuthContext: Not authenticated, attempting to login...");
          try {
            await keycloak.login();
            // The login will cause a redirect, so we don't need to do anything else here
            return;
          } catch (error) {
            console.error("AuthContext: Login failed:", error);
            setUser(null);
            ServiceRegistry.updateCurrentUser(null);
            return;
          }
        }

        // If we have user info, update the user state
        if (keycloak.userInfo) {
          // Convert Keycloak user info to our User type
          const userData: User = {
            id:
              keycloak.userInfo.sub ||
              keycloak.userInfo.preferred_username ||
              "unknown",
            username:
              keycloak.userInfo.preferred_username ||
              keycloak.userInfo.name ||
              "user",
            email: keycloak.userInfo.email || "",
            roles: keycloak.userInfo.realm_access?.roles || [],
            name: keycloak.userInfo.name,
            firstName: keycloak.userInfo.given_name,
            lastName: keycloak.userInfo.family_name,
          };

          setUser(userData);
          ServiceRegistry.updateCurrentUser(userData);
        }
      } catch (error) {
        console.error("AuthContext: Auth initialization error:", error);
        setUser(null);
        ServiceRegistry.updateCurrentUser(null);
      } finally {
        // Only set loading to false when we have a definitive state
        if (
          !keycloak.isAuthenticated ||
          keycloak.userInfo ||
          keycloak.initializationFailed
        ) {
          setIsLoading(false);
        }
      }
    };

    initAuth();
  }, [
    keycloak.isLoading,
    keycloak.isAuthenticated,
    keycloak.userInfo,
    keycloak.initializationFailed,
  ]);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      // This will be handled by Keycloak's redirect flow
      await keycloak.login();
      // The login function will cause a redirect, so we don't need to do anything else here
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear local state first
      setUser(null);
      ServiceRegistry.updateCurrentUser(null);

      // Then call Keycloak logout which will redirect to login page
      await keycloak.logout();

      // The logout will cause a redirect, so code after this won't execute
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
      // Even if logout fails, clear local state
      setUser(null);
      ServiceRegistry.updateCurrentUser(null);
    }
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      ServiceRegistry.updateCurrentUser(updatedUser);
    }
  };

  const updateUserProfile = (data: Partial<User>) => {
    updateUser(data);
  };

  const resetPassword = async (username: string): Promise<boolean> => {
    try {
      // Keycloak handles password reset through its own flow
      toast.info("Password reset", {
        description:
          "Please use the Keycloak admin console to reset your password",
      });
      return true;
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Failed to reset password");
      return false;
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    try {
      // Keycloak handles password changes through its own flow
      toast.info("Change password", {
        description:
          "Please use the Keycloak account console to change your password",
      });
      return true;
    } catch (error) {
      console.error("Change password error:", error);
      toast.error("Failed to change password");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: keycloak.isAuthenticated,
        isLoading: isLoading || keycloak.isLoading,
        login,
        logout,
        updateUser,
        updateUserProfile,
        resetPassword,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}


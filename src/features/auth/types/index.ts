import { KeycloakRoles } from "keycloak-js";

export interface KeycloakUser {
  sub: string;
  name?: string;
  preferred_username?: string;
  email?: string;
  avatar?: string;
  given_name?: string;
  family_name?: string;
  realm_access?: KeycloakRoles;
  // Add other fields if needed
}

export interface UserProfile {
  id: number;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
}

export interface User {
  id: string | number;
  email?: string;
  roles?: string[];
  joinDate?: string;
  lastLogin?: string;
  isActive?: boolean;
  avatar?: string;
  username?: string;
  profile?: UserProfile;
  locked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  roleIds?: number[];
}


# Project Structure

This document describes the restructured folder organization of the React boilerplate project, following modern best practices and feature-based architecture.

## 📁 Directory Structure

```
src/
├── app/                          # Application setup & configuration
│   ├── providers/                # Context providers (Theme, Auth, Settings)
│   │   ├── ThemeProvider.tsx     # Theme management (light/dark/system)
│   │   ├── SettingsProvider.tsx  # User & system settings
│   │   └── index.tsx             # Centralized provider wrapper
│   ├── router/                   # Route configuration
│   │   └── index.tsx             # App routing setup
│   └── config/                   # App-wide configuration
│       ├── queryClient.ts        # React Query configuration
│       └── keycloak.ts           # Keycloak authentication config
│
├── features/                     # Feature modules (co-located)
│   └── auth/                     # Authentication feature
│       ├── components/           # Auth-specific components
│       │   ├── ProtectedRoute.tsx
│       │   └── index.ts
│       ├── contexts/             # Auth contexts
│       │   ├── AuthContext.tsx
│       │   ├── KeycloakContext.tsx
│       │   └── index.ts
│       ├── hooks/                # Auth hooks (currently empty)
│       ├── services/             # Auth services
│       │   ├── AuthService.ts
│       │   ├── KeycloakService.ts
│       │   └── index.ts
│       └── types/                # Auth TypeScript types
│           └── index.ts
│
├── shared/                       # Shared/reusable code
│   ├── components/               # Shared business components
│   │   ├── data-display/         # Data display components
│   │   │   ├── ActionButtons.tsx
│   │   │   ├── FileUploader.tsx
│   │   │   ├── InfiniteScrollContainer.tsx
│   │   │   └── index.ts
│   │   ├── empty-states/         # Empty state components
│   │   │   ├── EmptyStateIcon.tsx
│   │   │   └── index.ts
│   │   ├── filters/              # Filter components
│   │   │   ├── filters/          # Sub-filter components
│   │   │   │   ├── FilterBadges.tsx
│   │   │   │   ├── FilterControls.tsx
│   │   │   │   ├── FilterOptions.tsx
│   │   │   │   ├── FiltersContent.tsx
│   │   │   │   ├── MobileFilters.tsx
│   │   │   │   ├── SearchInput.tsx
│   │   │   │   ├── useFilterState.ts
│   │   │   │   ├── useFilterVisibility.ts
│   │   │   │   └── index.ts
│   │   │   ├── DataFilter.tsx
│   │   │   ├── FilterBadge.tsx
│   │   │   ├── FilterDate.tsx
│   │   │   ├── FilterSearch.tsx
│   │   │   ├── FilterSearchableSelect.tsx
│   │   │   ├── FilterSelect.tsx
│   │   │   └── index.ts
│   │   ├── layout/               # Layout components
│   │   │   ├── AppInitializer.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   └── index.ts
│   │   ├── loading/              # Loading components
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── index.ts
│   │   ├── navigation/           # Navigation components
│   │   │   ├── ActionsMenu.tsx
│   │   │   ├── Breadcrumbs.tsx
│   │   │   ├── NotFound.tsx
│   │   │   └── index.ts
│   │   ├── pagination/           # Pagination components
│   │   │   └── PaginationControls.tsx
│   │   └── searchable-select/    # Searchable select components
│   │       ├── CategorySelect.tsx
│   │       └── TagSelect.tsx
│   ├── hooks/                    # Shared custom hooks
│   │   ├── use-api-data.ts
│   │   ├── use-api-query.ts
│   │   ├── use-debounce.ts
│   │   ├── use-detail-view.ts
│   │   ├── use-local-storage.ts
│   │   ├── use-media-query.ts
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   ├── useInfiniteScroll.ts
│   │   ├── useSettingsInitializer.ts
│   │   ├── useUser.ts
│   │   ├── useUserProfile.ts
│   │   └── useUserSettings.ts
│   ├── lib/                      # Utils, helpers, axios setup
│   │   ├── axios.ts
│   │   ├── note-format.ts
│   │   └── utils.ts
│   ├── services/                 # Shared API services
│   │   ├── ActivityTracking.ts
│   │   ├── BaseApiService.ts
│   │   ├── LoggingService.ts
│   │   ├── ServiceRegistry.ts
│   │   ├── SettingsService.ts
│   │   ├── TokenService.ts
│   │   └── UserService.ts
│   ├── types/                    # Shared TypeScript types
│   │   ├── common.ts
│   │   ├── logging.ts
│   │   └── index.ts
│   └── ui/                       # shadcn/ui components
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── ... (all shadcn/ui components)
│       └── use-toast.ts
│
├── layouts/                      # Layout wrappers
│   ├── AuthenticatedLayout.tsx   # Layout for authenticated pages
│   └── PublicLayout.tsx          # Layout for public pages
│
├── pages/                        # Page components
│   └── Home.tsx
│
├── store/                        # Zustand state management
│   └── useUserSettingsStore.ts
│
├── styles/                       # Global styles & themes
│   └── themes.css
│
└── utils/                        # Utility functions
    └── initAppServices.ts
```

## 🎯 Key Principles

### 1. **Feature-Based Architecture**
- Related code is co-located in feature modules
- Each feature has its own components, hooks, services, and types
- Easier to maintain and scale

### 2. **Clear Separation of Concerns**
- `app/` - Application setup and configuration
- `features/` - Feature-specific code (e.g., auth)
- `shared/` - Reusable code across features
- `pages/` - Page-level components
- `layouts/` - Layout wrappers

### 3. **Component Organization**
Shared components are organized by purpose:
- `data-display/` - Components for displaying data
- `filters/` - Filtering and search components
- `layout/` - Layout and structure components
- `loading/` - Loading states
- `navigation/` - Navigation elements
- `empty-states/` - Empty state displays

## 📦 Import Patterns

### Absolute Imports
All imports use the `@/` alias for consistency:

```typescript
// App setup
import { AppProviders } from "@/app/providers";
import { AppRouter } from "@/app/router";

// Feature imports
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { ProtectedRoute } from "@/features/auth/components";

// Shared imports
import { Button } from "@/shared/ui/button";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { LoggingService } from "@/shared/services/LoggingService";

// Types
import { User } from "@/features/auth/types";
import { ApiResponse } from "@/shared/types";
```

## 🔄 Migration from Old Structure

### Old Structure → New Structure

```
OLD                                  NEW
────────────────────────────────────────────────────────────
components/ui/                    →  shared/ui/
components/common/                →  shared/components/{category}/
components/shared/                →  shared/components/{category}/
components/layout/                →  shared/components/layout/
components/auth/                  →  features/auth/components/

contexts/AuthContext.tsx          →  features/auth/contexts/AuthContext.tsx
contexts/KeycloakContext.tsx      →  features/auth/contexts/KeycloakContext.tsx
contexts/ThemeContext.tsx         →  app/providers/ThemeProvider.tsx
contexts/SettingsContext.tsx      →  app/providers/SettingsProvider.tsx

services/AuthService.ts           →  features/auth/services/AuthService.ts
services/KeycloakService.ts       →  features/auth/services/KeycloakService.ts
services/*                        →  shared/services/

hooks/*                           →  shared/hooks/
lib/*                             →  shared/lib/
types/auth.ts                     →  features/auth/types/
types/*                           →  shared/types/
```

## 🚀 Benefits of This Structure

1. **Scalability**: Easy to add new features without cluttering the codebase
2. **Maintainability**: Related code is co-located, making it easier to find and modify
3. **Reusability**: Clear separation between shared and feature-specific code
4. **Developer Experience**: Intuitive structure that follows React community best practices
5. **Testing**: Easier to test features in isolation
6. **Code Splitting**: Natural boundaries for code splitting and lazy loading

## 📝 Adding New Features

To add a new feature (e.g., `blog`):

```
src/features/blog/
├── components/
│   ├── BlogList.tsx
│   ├── BlogDetail.tsx
│   └── index.ts
├── contexts/
│   └── BlogContext.tsx
├── hooks/
│   └── useBlog.ts
├── services/
│   └── BlogService.ts
└── types/
    └── index.ts
```

Then update `app/router/index.tsx` to include blog routes.

## 🔧 Configuration Files

- `tsconfig.json` - TypeScript configuration with path aliases
- `vite.config.ts` - Vite build configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `components.json` - shadcn/ui configuration

## 📚 Additional Resources

- [React Best Practices](https://react.dev/)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Bulletproof React](https://github.com/alan2207/bulletproof-react)


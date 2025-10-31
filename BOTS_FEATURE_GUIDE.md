# Bots Feature - Complete CRUD Example Guide

This document explains the comprehensive Bots feature implementation, showcasing best practices for building scalable React applications.

## 📚 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Cache Management](#cache-management)
- [Usage Examples](#usage-examples)
- [API Integration](#api-integration)

## Overview

The Bots feature is a complete CRUD (Create, Read, Update, Delete) implementation that demonstrates:

- ✅ **Data Table** with sorting and display
- ✅ **Pagination** with customizable page sizes
- ✅ **Advanced Filters** including searchable multi-select
- ✅ **Smart Caching** with automatic invalidation
- ✅ **Form Validation** using Zod
- ✅ **Toast Notifications** for user feedback
- ✅ **Loading States** and optimistic updates
- ✅ **Type Safety** throughout

## Architecture

### Directory Structure

```
src/features/bots/
├── components/           # UI Components
│   ├── BotForm.tsx      # Create/Edit form dialog
│   ├── BotFilters.tsx   # Filter controls
│   ├── BotTable.tsx     # Data table with actions
│   └── index.ts         # Exports
├── hooks/               # Custom hooks
│   └── useBots.ts       # Data fetching & mutations
├── types/               # TypeScript types
│   └── index.ts         # Bot models and enums
└── README.md           # Feature documentation
```

### Data Flow

```
┌─────────────┐
│  BotsPage   │ ← Main page component
└──────┬──────┘
       │
       ├──→ useBots() ← Fetches paginated data
       │     └──→ useApiQuery() ← Handles caching, filters, pagination
       │
       ├──→ useBotMutations() ← CRUD operations
       │     ├──→ useCreateMutation() ← POST with cache invalidation
       │     ├──→ useUpdateMutation() ← PUT with cache invalidation
       │     └──→ useDeleteMutation() ← DELETE with cache invalidation
       │
       ├──→ BotFilters ← Filter controls
       ├──→ BotTable ← Data display
       └──→ BotForm ← Create/Edit dialog
```

## Features

### 1. Smart Caching

The implementation uses React Query for intelligent caching:

```typescript
// Automatically cached for 5 minutes
const { data, isLoading } = useBots({
  status: BotStatus.ACTIVE
});

// Cache is automatically invalidated after mutations
const { create, update, delete } = useBotMutations();
```

**Cache Invalidation Strategies:**

- **After POST**: Invalidates list queries to show new item
- **After PUT**: Invalidates both list and specific item queries
- **After DELETE**: Removes item from cache and invalidates lists

### 2. Advanced Filtering

```typescript
interface BotFilters {
  search?: string;           // Text search
  status?: BotStatus;        // Enum filter
  type?: BotType;            // Enum filter
  isActive?: boolean;        // Boolean filter
  tags?: string[];           // Multi-select filter
  sortBy?: string;           // Sort field
  sortOrder?: "asc" | "desc"; // Sort direction
}
```

**Features:**
- Debounced search (300ms delay)
- Persistent filters in localStorage
- URL-friendly filter state
- Clear all filters with one click

### 3. Pagination

```typescript
// Customizable pagination
const {
  page,              // Current page (0-indexed)
  pageSize,          // Items per page
  setPage,           // Change page
  setPageSize,       // Change page size
  totalItems,        // Total number of items
  totalPages,        // Total number of pages
  hasNextPage,       // Boolean
  hasPreviousPage,   // Boolean
} = useBots();
```

**Features:**
- Page size selector (5, 10, 20, 50)
- Smart ellipsis in pagination controls
- Automatic reset to page 1 when filters change
- Results count display

### 4. Form Validation

Using Zod for runtime validation:

```typescript
const botFormSchema = z.object({
  name: z.string()
    .min(3, "Name must be at least 3 characters")
    .max(100),
  description: z.string().optional(),
  status: z.nativeEnum(BotStatus),
  type: z.nativeEnum(BotType),
});
```

### 5. Optimistic UI Updates

```typescript
// Mutation with automatic toast notifications
const { create } = useBotMutations();

await create.mutateAsync({
  name: "New Bot",
  type: BotType.CHAT,
  status: BotStatus.PENDING,
});
// ✅ Success toast shown automatically
// ✅ List refreshed automatically
```

## Cache Management

### Automatic Cache Invalidation

```typescript
// After creating a bot
await createMutation.mutateAsync(data);
// Automatically invalidates: ["bots"]

// After updating a bot
await updateMutation.mutateAsync({ id: 1, ...data });
// Automatically invalidates: ["bots"] and ["bots", "1"]

// After deleting a bot
await deleteMutation.mutateAsync(1);
// Automatically invalidates: ["bots"]
// Removes from cache: ["bots", "1"]
```

### Manual Cache Control

```typescript
import { useCacheInvalidation } from "@/shared/hooks/use-api-mutations";

const { invalidateQueries, removeQueries, clearAllCache } = useCacheInvalidation();

// Invalidate specific queries (refetch on next use)
invalidateQueries([["bots"], ["bots", "1"]]);

// Remove specific queries (delete from cache)
removeQueries([["bots"]]);

// Clear all cache
clearAllCache();
```

### Cache Configuration

```typescript
// In useBots hook
useApiQuery({
  endpoint: "/api/v1/bots",
  queryKey: ["bots"],
  useCache: true,
  staleTime: 30000,    // Consider data stale after 30s
  cacheTime: 300000,   // Keep in cache for 5 minutes
});
```

## Usage Examples

### Basic Usage

```typescript
import { BotsPage } from "@/pages/BotsPage";

// In your router
<Route path="/bots" element={<BotsPage />} />
```

### Custom Filters

```typescript
function MyBotsPage() {
  const { data, filters, setFilters } = useBots({
    status: BotStatus.ACTIVE,
    type: BotType.CHAT,
  });

  // Update filters
  const handleFilterChange = () => {
    setFilters({
      ...filters,
      search: "customer service",
      tags: ["support", "automation"],
    });
  };

  return (
    <div>
      {data.map(bot => (
        <div key={bot.id}>{bot.name}</div>
      ))}
    </div>
  );
}
```

### Custom Mutations

```typescript
import { useBotMutations } from "@/features/bots/hooks/useBots";

function MyComponent() {
  const { create, update, delete: deleteMutation } = useBotMutations();

  const handleCreate = async () => {
    try {
      const newBot = await create.mutateAsync({
        name: "Support Bot",
        type: BotType.CHAT,
        status: BotStatus.PENDING,
        description: "Handles customer support",
      });
      console.log("Created:", newBot);
    } catch (error) {
      console.error("Failed to create:", error);
    }
  };

  const handleUpdate = async (id: number) => {
    await update.mutateAsync({
      id,
      status: BotStatus.ACTIVE,
      isActive: true,
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div>
      <button onClick={handleCreate}>Create Bot</button>
    </div>
  );
}
```

### With Loading States

```typescript
function BotsList() {
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    refresh,
  } = useBots();

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage error={error} />;

  return (
    <div>
      <button onClick={refresh}>Refresh</button>
      {data.map(bot => (
        <BotCard key={bot.id} bot={bot} />
      ))}
    </div>
  );
}
```

## API Integration

### Expected API Endpoints

```typescript
// List bots (paginated)
GET /api/v1/bots
Query params: page, size, search, status, type, isActive, tags, sortBy, sortOrder
Response: {
  content: Bot[],
  totalElements: number,
  totalPages: number,
  number: number,
  size: number
}

// Create bot
POST /api/v1/bots
Body: CreateBotDto
Response: Bot

// Get single bot
GET /api/v1/bots/{id}
Response: Bot

// Update bot
PUT /api/v1/bots/{id}
Body: UpdateBotDto
Response: Bot

// Delete bot
DELETE /api/v1/bots/{id}
Response: 204 No Content
```

### Mock Data Setup

For development without backend:

```typescript
const mockBot: Bot = {
  id: 1,
  name: "Customer Support Bot",
  description: "Handles customer inquiries",
  status: BotStatus.ACTIVE,
  type: BotType.CHAT,
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  tags: ["support", "customer-service"],
};

const mockResponse: PaginatedData<Bot> = {
  content: [mockBot],
  totalElements: 1,
  totalPages: 1,
  number: 0,
  size: 10,
};

// Use in hook
const { data } = useBots({
  mockData: mockResponse,
});
```

## Best Practices

### 1. Type Safety

Always use TypeScript types for better IDE support:

```typescript
import { Bot, BotStatus, CreateBotDto } from "@/features/bots/types";
```

### 2. Error Handling

```typescript
const { create } = useBotMutations();

try {
  await create.mutateAsync(data);
} catch (error) {
  // Error toast is shown automatically
  // Additional error handling here
  console.error(error);
}
```

### 3. Loading States

```typescript
const { isLoading } = useBots();
const { create, isLoading: isMutating } = useBotMutations();

const isProcessing = isLoading || isMutating;
```

### 4. Optimistic Updates

For better UX, update UI before server confirmation:

```typescript
const { update } = useBotMutations();

// UI updates immediately, then syncs with server
await update.mutateAsync({ id: 1, isActive: true });
```

## Performance Tips

1. **Use pagination** - Don't load all data at once
2. **Debounce search** - Already implemented (300ms)
3. **Cache wisely** - Balance between freshness and performance
4. **Lazy load** - Consider code splitting for large features

## Troubleshooting

### Cache not updating after mutation

```typescript
// Ensure queryKey matches in both places
const QUERY_KEY = ["bots"];

// In fetch hook
useApiQuery({ queryKey: QUERY_KEY, ... });

// In mutation hook
useCrudMutations(endpoint, QUERY_KEY);
```

### Filters not persisting

```typescript
// Enable persistence
useBots({
  persistFilters: true,
  persistKey: "my-custom-key",
});
```

### Pagination resetting unexpectedly

This is expected behavior when filters change. To prevent:

```typescript
// Manually control page
const { page, setPage } = useBots();

// Keep page when changing specific filters
setFilters({ ...filters, search: value });
// Don't call setPage(0)
```

## Related Documentation

- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Overall project structure
- [API Hooks Documentation](./src/shared/hooks/README.md) - Detailed hook API
- [React Query Docs](https://tanstack.com/query/latest) - Official React Query documentation

---

**Need help?** Check the inline comments in the code or create an issue in the repository.


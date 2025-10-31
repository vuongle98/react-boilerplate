# Caching Strategy Guide

## 📚 Overview

This project uses **React Query** for intelligent data caching and state management. The caching system automatically handles:

- ✅ Cache invalidation after mutations
- ✅ Background refetching
- ✅ Optimistic updates
- ✅ Stale-while-revalidate pattern
- ✅ Request deduplication

## 🎯 Core Concepts

### 1. Query Keys

Query keys uniquely identify cached data:

```typescript
// Simple key
["bots"]

// With parameters
["bots", { page: 0, pageSize: 10 }]

// Hierarchical
["bots", "1"]           // Single bot
["bots", "1", "logs"]   // Bot's logs
```

### 2. Cache Lifecycle

```
┌─────────────┐
│   Fresh     │ ← Data just fetched
└──────┬──────┘
       │ (staleTime: 30s)
       ▼
┌─────────────┐
│   Stale     │ ← Will refetch on next use
└──────┬──────┘
       │ (cacheTime: 5min)
       ▼
┌─────────────┐
│  Garbage    │ ← Removed from memory
└─────────────┘
```

## 🔧 Configuration

### Global Settings

Located in `src/app/config/queryClient.ts`:

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Don't refetch on window focus
      retry: 1,                     // Retry failed requests once
      staleTime: 30000,             // 30 seconds
    },
  },
});
```

### Per-Query Settings

```typescript
useApiQuery({
  endpoint: "/api/v1/bots",
  queryKey: ["bots"],
  
  // Cache settings
  useCache: true,        // Enable caching
  staleTime: 30000,      // Consider stale after 30s
  cacheTime: 300000,     // Keep in cache for 5 minutes
  
  // Refetch settings
  refetchOnWindowFocus: false,
  refetchInterval: 60000, // Auto-refetch every minute
});
```

## 🔄 Cache Invalidation

### Automatic Invalidation

Mutations automatically invalidate related queries:

```typescript
// After POST /api/v1/bots
invalidates → ["bots"]

// After PUT /api/v1/bots/1
invalidates → ["bots"], ["bots", "1"]

// After DELETE /api/v1/bots/1
invalidates → ["bots"]
removes → ["bots", "1"]
```

### Implementation

```typescript
// In use-api-mutations.ts
export function useCreateMutation({
  endpoint,
  invalidateQueries = [["bots"]], // ← Specify what to invalidate
}) {
  return useMutation({
    mutationFn: async (data) => {
      return await api.post(endpoint, data);
    },
    onSuccess: () => {
      // Automatically invalidates specified queries
      invalidateQueries.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });
    },
  });
}
```

### Manual Invalidation

```typescript
import { useCacheInvalidation } from "@/shared/hooks/use-api-mutations";

function MyComponent() {
  const { invalidateQueries, removeQueries, clearAllCache } = useCacheInvalidation();
  
  // Invalidate specific queries
  const handleRefresh = () => {
    invalidateQueries([["bots"], ["users"]]);
  };
  
  // Remove from cache
  const handleClear = () => {
    removeQueries([["bots"]]);
  };
  
  // Clear everything
  const handleClearAll = () => {
    clearAllCache();
  };
}
```

## 📊 Usage Patterns

### Pattern 1: List + Detail

```typescript
// List query
const { data: bots } = useApiQuery({
  queryKey: ["bots"],
  endpoint: "/api/v1/bots",
});

// Detail query
const { data: bot } = useApiQuery({
  queryKey: ["bots", id],
  endpoint: `/api/v1/bots/${id}`,
});

// When updating bot:
const { update } = useBotMutations();
await update.mutateAsync({ id, ...data });
// ✅ Both ["bots"] and ["bots", id] are invalidated
```

### Pattern 2: Related Resources

```typescript
// Parent resource
const { data: bot } = useApiQuery({
  queryKey: ["bots", botId],
  endpoint: `/api/v1/bots/${botId}`,
});

// Related resources
const { data: logs } = useApiQuery({
  queryKey: ["bots", botId, "logs"],
  endpoint: `/api/v1/bots/${botId}/logs`,
});

// When updating bot, invalidate all related:
onSuccess: () => {
  queryClient.invalidateQueries({ 
    queryKey: ["bots", botId] // Invalidates all queries starting with this key
  });
}
```

### Pattern 3: Optimistic Updates

```typescript
const { update } = useMutation({
  mutationFn: updateBot,
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ["bots"] });
    
    // Snapshot previous value
    const previousBots = queryClient.getQueryData(["bots"]);
    
    // Optimistically update cache
    queryClient.setQueryData(["bots"], (old) => {
      return old.map(bot => 
        bot.id === newData.id ? { ...bot, ...newData } : bot
      );
    });
    
    return { previousBots };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(["bots"], context.previousBots);
  },
  onSettled: () => {
    // Always refetch after error or success
    queryClient.invalidateQueries({ queryKey: ["bots"] });
  },
});
```

## 🎨 Best Practices

### 1. Hierarchical Query Keys

```typescript
// ✅ Good - Clear hierarchy
["bots"]
["bots", "1"]
["bots", "1", "logs"]

// ❌ Bad - Flat structure
["bots"]
["bot-1"]
["bot-1-logs"]
```

### 2. Consistent Invalidation

```typescript
// ✅ Good - Invalidate all related
invalidateQueries([
  ["bots"],           // List
  ["bots", id],       // Specific item
  ["bots", id, "logs"], // Related data
]);

// ❌ Bad - Missing related queries
invalidateQueries([["bots"]]);
// ["bots", id] is not invalidated!
```

### 3. Stale Time vs Cache Time

```typescript
// For frequently changing data
staleTime: 10000,    // 10 seconds
cacheTime: 60000,    // 1 minute

// For rarely changing data
staleTime: 300000,   // 5 minutes
cacheTime: 3600000,  // 1 hour

// For real-time data
staleTime: 0,        // Always stale
cacheTime: 0,        // Don't cache
```

### 4. Batch Invalidations

```typescript
// ❌ Bad - Multiple invalidations
queryClient.invalidateQueries({ queryKey: ["bots"] });
queryClient.invalidateQueries({ queryKey: ["users"] });
queryClient.invalidateQueries({ queryKey: ["logs"] });

// ✅ Good - Single batch
const { invalidateQueries } = useCacheInvalidation();
invalidateQueries([["bots"], ["users"], ["logs"]]);
```

## 🔍 Debugging Cache

### DevTools

```typescript
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### Manual Inspection

```typescript
// Get all cached queries
const cache = queryClient.getQueryCache();
console.log("All queries:", cache.getAll());

// Get specific query data
const bots = queryClient.getQueryData(["bots"]);
console.log("Bots:", bots);

// Check query state
const state = queryClient.getQueryState(["bots"]);
console.log("State:", state);
```

### Logging

```typescript
// In BaseApiService.ts
if (useCache) {
  LoggingService.info("cache", "hit", `Using cached data for ${url}`);
} else {
  LoggingService.info("cache", "miss", `Fetching fresh data for ${url}`);
}
```

## 📈 Performance Tips

### 1. Prefetching

```typescript
// Prefetch data before user navigates
const queryClient = useQueryClient();

const handleMouseEnter = () => {
  queryClient.prefetchQuery({
    queryKey: ["bots", id],
    queryFn: () => fetchBot(id),
  });
};
```

### 2. Background Refetching

```typescript
// Keep data fresh in background
useApiQuery({
  queryKey: ["bots"],
  endpoint: "/api/v1/bots",
  refetchInterval: 30000, // Refetch every 30s
  refetchIntervalInBackground: true,
});
```

### 3. Selective Invalidation

```typescript
// ✅ Good - Only invalidate what changed
queryClient.invalidateQueries({ 
  queryKey: ["bots"],
  exact: true, // Only this exact key
});

// ❌ Bad - Invalidates everything
queryClient.invalidateQueries({ 
  predicate: () => true 
});
```

### 4. Placeholder Data

```typescript
useApiQuery({
  queryKey: ["bots", id],
  endpoint: `/api/v1/bots/${id}`,
  placeholderData: () => {
    // Use list data as placeholder
    return queryClient
      .getQueryData(["bots"])
      ?.find(bot => bot.id === id);
  },
});
```

## 🚨 Common Pitfalls

### 1. Not Invalidating After Mutations

```typescript
// ❌ Bad
const createBot = async (data) => {
  await api.post("/api/v1/bots", data);
  // Cache not updated!
};

// ✅ Good
const { create } = useBotMutations();
await create.mutateAsync(data);
// Cache automatically invalidated
```

### 2. Over-invalidating

```typescript
// ❌ Bad - Invalidates too much
queryClient.invalidateQueries(); // Everything!

// ✅ Good - Specific invalidation
queryClient.invalidateQueries({ queryKey: ["bots"] });
```

### 3. Race Conditions

```typescript
// ❌ Bad - Can cause race conditions
const handleUpdate = async () => {
  await updateBot(data);
  await refetch(); // Might use stale data
};

// ✅ Good - Automatic invalidation
const { update } = useBotMutations();
await update.mutateAsync(data); // Handles invalidation
```

## 📚 Related Files

- `src/shared/hooks/use-api-mutations.ts` - Mutation hooks with cache invalidation
- `src/shared/hooks/use-api-query.ts` - Query hook with caching
- `src/shared/hooks/use-api-data.ts` - Non-paginated data fetching
- `src/app/config/queryClient.ts` - Global cache configuration

## 🔗 External Resources

- [React Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [Caching Examples](https://tanstack.com/query/latest/docs/react/guides/caching)
- [Mutations Guide](https://tanstack.com/query/latest/docs/react/guides/mutations)


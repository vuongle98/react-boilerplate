# Quick Start Guide - Bots Feature Example

## 🚀 Get Started in 3 Steps

### Step 1: Start the Server

```bash
npm run dev
```

### Step 2: Navigate to Bots

Open your browser and go to:
```
http://localhost:8081/bots
```

### Step 3: Explore Features

Try these actions to see cache invalidation in action:

1. **Create a Bot** 
   - Click "Create Bot" button
   - Fill in the form
   - Click "Create"
   - ✨ Watch the list refresh automatically

2. **Filter Bots**
   - Use the search bar
   - Select a status filter
   - Choose tags (multi-select)
   - 🔍 Results update in real-time

3. **Edit a Bot**
   - Click the "..." menu on any bot
   - Select "Edit"
   - Make changes
   - ✨ Cache invalidates automatically

4. **Delete a Bot**
   - Click the "..." menu
   - Select "Delete"
   - Confirm deletion
   - ✨ List updates instantly

5. **Test Cache**
   - Click "Force Refresh" to bypass cache
   - Click "Clear Cache" to reset everything
   - 💾 See cache management in action

## 📊 Architecture Overview

```
User Action
    │
    ▼
┌─────────────┐
│  BotsPage   │ ← Main Page Component
└──────┬──────┘
       │
       ├──→ useBots()              ← Fetch Data
       │     └─→ useApiQuery()     ← Handles Caching
       │           └─→ React Query Cache
       │
       ├──→ useBotMutations()      ← CRUD Operations
       │     ├─→ create            ← POST + invalidate cache
       │     ├─→ update            ← PUT + invalidate cache
       │     └─→ delete            ← DELETE + invalidate cache
       │
       ├──→ BotFilters             ← Filter Controls
       ├──→ BotTable               ← Data Display
       └──→ BotForm                ← Create/Edit Dialog
```

## 🎯 Key Files to Examine

### 1. Page Component
📄 `src/pages/BotsPage.tsx` - Main orchestration

### 2. Custom Hooks
📄 `src/features/bots/hooks/useBots.ts` - Data fetching
📄 `src/shared/hooks/use-api-mutations.ts` - Mutations with cache invalidation

### 3. Components
📄 `src/features/bots/components/BotTable.tsx` - Data table
📄 `src/features/bots/components/BotFilters.tsx` - Filters
📄 `src/features/bots/components/BotForm.tsx` - Form

### 4. Types
📄 `src/features/bots/types/index.ts` - TypeScript definitions

## 💡 Code Examples

### Fetching Data with Cache

```typescript
import { useBots } from "@/features/bots/hooks/useBots";

function MyComponent() {
  const { 
    data,              // Bot[]
    isLoading,         // boolean
    page,              // Current page
    setPage,           // Change page
    filters,           // Current filters
    setFilters,        // Update filters
    refresh,           // Invalidate cache & refetch
  } = useBots();

  return (
    <div>
      {data.map(bot => (
        <div key={bot.id}>{bot.name}</div>
      ))}
    </div>
  );
}
```

### Creating with Auto Cache Invalidation

```typescript
import { useBotMutations } from "@/features/bots/hooks/useBots";

function CreateButton() {
  const { create, isLoading } = useBotMutations();

  const handleCreate = async () => {
    await create.mutateAsync({
      name: "My Bot",
      type: BotType.CHAT,
      status: BotStatus.PENDING,
    });
    // ✅ Cache automatically invalidated
    // ✅ Success toast shown
    // ✅ List refreshed
  };

  return (
    <button onClick={handleCreate} disabled={isLoading}>
      Create Bot
    </button>
  );
}
```

### Filtering with Persistence

```typescript
function FilteredList() {
  const { 
    data, 
    filters, 
    setFilters,
    resetFilters 
  } = useBots({
    // Initial filters
    status: BotStatus.ACTIVE,
  });

  return (
    <div>
      <input
        value={filters.search || ""}
        onChange={(e) => setFilters({ 
          ...filters, 
          search: e.target.value 
        })}
      />
      <button onClick={resetFilters}>Clear</button>
      {/* Data automatically filtered */}
      {data.map(bot => <BotCard key={bot.id} bot={bot} />)}
    </div>
  );
}
```

## 🎨 UI Features

### Status Badges
- 🟢 **ACTIVE** - Green
- 🔴 **INACTIVE** - Gray
- 🟡 **PENDING** - Yellow
- ⚫ **ERROR** - Red

### Type Badges
- 💬 **CHAT** - Blue
- ⚙️ **WORKFLOW** - Purple
- 🔗 **INTEGRATION** - Orange
- 🎨 **CUSTOM** - Pink

### Interactive Elements
- ✏️ Edit button (pencil icon)
- 🗑️ Delete button (trash icon)
- 🔄 Refresh button (with loading animation)
- 🗑️ Clear cache button

## 📱 Responsive Design

The Bots page is fully responsive:

- **Mobile** (< 768px): Stacked layout, simplified filters
- **Tablet** (768px - 1024px): 2-column grid
- **Desktop** (> 1024px): Full 4-column filter grid

## ⚡ Performance Features

### 1. Debounced Search
Search input waits 300ms before querying:
```typescript
// User types: "customer service"
// API calls: Only 1 request after typing stops
```

### 2. Smart Pagination
Only loads current page:
```typescript
// Page 1: Loads bots 1-10
// Page 2: Loads bots 11-20
// Previous pages stay in cache
```

### 3. Background Refetching
Data stays fresh automatically:
```typescript
// Every 30 seconds (if stale)
// When window regains focus
// After mutations
```

### 4. Request Deduplication
Multiple components requesting same data = 1 API call:
```typescript
// Component A: useBots()
// Component B: useBots()  
// Result: Only 1 API request
```

## 🔍 Debugging

### Check Cache in DevTools

```typescript
// In browser console
window.__REACT_QUERY_DEVTOOLS__ = true;
```

### Log Cache State

```typescript
import { useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();
console.log("All cached data:", queryClient.getQueryCache().getAll());
```

### Monitor Network

Open browser DevTools → Network tab:
- Watch for duplicate requests (should be minimal)
- Check cache headers
- Monitor response times

## 📚 Next Steps

1. **Read Full Guides**
   - [BOTS_FEATURE_GUIDE.md](./BOTS_FEATURE_GUIDE.md) - Complete feature guide
   - [CACHING_GUIDE.md](./CACHING_GUIDE.md) - Cache strategy deep dive
   - [ENHANCEMENTS_SUMMARY.md](./ENHANCEMENTS_SUMMARY.md) - All new features

2. **Customize**
   - Modify `src/features/bots/types/index.ts` for your data model
   - Update API endpoints in `useBots.ts`
   - Adjust cache timings in hook configuration

3. **Extend**
   - Add export functionality
   - Implement bulk operations
   - Add advanced sorting
   - Create detail views

## 🆘 Common Issues

### "Cannot find module" errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Cache not updating
```typescript
// Ensure query keys match
const QUERY_KEY = ["bots"]; // ← Same in both places
useApiQuery({ queryKey: QUERY_KEY });
useCrudMutations(endpoint, QUERY_KEY);
```

### Filters not persisting
```typescript
// Check persistence is enabled
useBots({
  persistFilters: true,  // ← Must be true
  persistKey: "bots-filters",
});
```

## 🎓 Learn More

- **React Query**: https://tanstack.com/query/latest
- **shadcn/ui**: https://ui.shadcn.com/
- **Zod**: https://zod.dev/
- **React Hook Form**: https://react-hook-form.com/

---

**Happy coding!** 🎉

For questions or issues, check the documentation or create an issue in the repository.


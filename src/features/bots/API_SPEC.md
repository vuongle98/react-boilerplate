# Bots API Specification

This document describes the API integration for the Bots feature, matching the backend Java model.

## 📋 Data Model

### Bot Entity

```typescript
interface Bot {
  id: number;
  botUsername: string;      // Telegram bot username
  botName: string;          // Display name
  status: BotStatus;        // Current status
  webhookUrl?: string;      // Optional webhook endpoint
  isActive: boolean;        // Active/inactive flag
  description?: string;     // Optional description
  createdAt: string;        // ISO datetime
  updatedAt: string;        // ISO datetime
  createdBy?: string;       // Creator username
  updatedBy?: string;       // Last updater username
}
```

### Bot Status Enum

```typescript
enum BotStatus {
  ACTIVE = "ACTIVE",           // Bot is running
  INACTIVE = "INACTIVE",       // Bot is stopped
  ERROR = "ERROR",             // Bot has errors
  MAINTENANCE = "MAINTENANCE", // Under maintenance
  SUSPENDED = "SUSPENDED",     // Temporarily suspended
}
```

## 🔌 API Endpoints

### 1. List Bots (Paginated)

```http
GET /api/v1/bots
```

**Query Parameters:**
```typescript
{
  username?: string;      // Filter by bot username
  name?: string;          // Filter by bot name
  status?: BotStatus;     // Filter by status
  active?: boolean;       // Filter by active state
  page?: number;          // Page number (0-indexed)
  size?: number;          // Page size
  sortBy?: string;        // Sort field
  sortOrder?: "asc" | "desc"; // Sort direction
}
```

**Response:**
```json
{
  "content": [
    {
      "id": 1,
      "botUsername": "my_awesome_bot",
      "botName": "My Awesome Bot",
      "status": "ACTIVE",
      "webhookUrl": "https://example.com/webhook",
      "isActive": true,
      "description": "Customer support bot",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "createdBy": "admin",
      "updatedBy": "admin"
    }
  ],
  "totalElements": 100,
  "totalPages": 10,
  "number": 0,
  "size": 10
}
```

### 2. Create Bot

```http
POST /api/v1/bots
```

**Request Body:**
```json
{
  "botToken": "1234567890:ABCdefGHIjklMNOpqrsTUVwxyz",
  "botUsername": "my_awesome_bot",
  "botName": "My Awesome Bot",
  "webhookUrl": "https://example.com/webhook",
  "isActive": true,
  "description": "Customer support bot"
}
```

**Response:** Bot entity (201 Created)

### 3. Get Single Bot

```http
GET /api/v1/bots/{id}
```

**Response:** Bot entity (200 OK)

### 4. Update Bot

```http
PUT /api/v1/bots/{id}
```

**Request Body:**
```json
{
  "botToken": "1234567890:ABCdefGHIjklMNOpqrsTUVwxyz",  // Optional
  "botUsername": "my_awesome_bot",
  "botName": "My Awesome Bot",
  "webhookUrl": "https://example.com/webhook",
  "isActive": true,
  "description": "Updated description"
}
```

**Note:** All fields are optional in update. Only send fields that need to be updated.

**Response:** Bot entity (200 OK)

### 5. Delete Bot

```http
DELETE /api/v1/bots/{id}
```

**Response:** 204 No Content

## 🔐 Security Notes

### Bot Token Handling

⚠️ **Important:** The bot token is sensitive data!

- **On Create:** Token is required and sent to backend
- **On Update:** Token field is optional (empty string means keep existing)
- **On Display:** Token is NEVER returned from the backend
- **In Forms:** Token input uses `type="password"` for security

### Example Token Handling in Update

```typescript
// Frontend form
const updateData = {
  id: bot.id,
  botUsername: "updated_username",
  botName: "Updated Name",
  // botToken is empty or undefined = keep existing token
  // botToken: "new-token" = update token
};
```

## 📊 Frontend Integration

### Using the Hooks

```typescript
import { useBots, useBotMutations } from "@/features/bots/hooks/useBots";

function BotsManagement() {
  // Fetch bots with filters
  const { 
    data, 
    isLoading, 
    filters, 
    setFilters,
    page,
    setPage,
  } = useBots({
    status: BotStatus.ACTIVE,
    active: true,
  });

  // CRUD mutations
  const { create, update, delete: deleteMutation } = useBotMutations();

  // Create new bot
  const handleCreate = async () => {
    await create.mutateAsync({
      botToken: "1234567890:ABCdefGHIjklMNOpqrsTUVwxyz",
      botUsername: "my_bot",
      botName: "My Bot",
      webhookUrl: "https://example.com/webhook",
      isActive: true,
      description: "Test bot",
    });
  };

  // Update bot
  const handleUpdate = async (id: number) => {
    await update.mutateAsync({
      id,
      botName: "Updated Name",
      isActive: false,
    });
  };

  // Delete bot
  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };
}
```

### Filter Examples

```typescript
// Search by username
setFilters({ username: "support_bot" });

// Search by name
setFilters({ name: "Customer" });

// Filter by status
setFilters({ status: BotStatus.ACTIVE });

// Filter by active state
setFilters({ active: true });

// Combined filters
setFilters({
  username: "bot",
  status: BotStatus.ACTIVE,
  active: true,
});

// Sort
setFilters({
  sortBy: "createdAt",
  sortOrder: "desc",
});
```

## 🎨 UI Components

### BotForm Component

Shows different validation for create vs update:

**Create Mode:**
- All fields required except description, webhookUrl
- Bot token is required
- isActive defaults to `true`

**Edit Mode:**
- botToken field shows placeholder "Leave empty to keep existing token"
- Pre-fills all existing data except token
- All updates are optional

### BotTable Component

Displays:
- Bot name and username
- Webhook URL (truncated if long)
- Status badge (color-coded)
- Active/Inactive badge
- Created time (relative)
- Actions menu (Edit, Delete)

### BotFilters Component

Provides:
- Username search input
- Name search input
- Status dropdown (All, Active, Inactive, Error, Maintenance, Suspended)
- Active status dropdown (All, Active Only, Inactive Only)
- Refresh button
- Clear filters button

## 🔄 Cache Invalidation

All mutations automatically invalidate related caches:

```typescript
// After CREATE
invalidates: ["bots"]

// After UPDATE
invalidates: ["bots"], ["bots", botId]

// After DELETE
invalidates: ["bots"]
removes: ["bots", botId]
```

## 📝 Validation Rules

### Create Bot

```typescript
{
  botToken: {
    required: true,
    minLength: 1,
    message: "Bot token is required"
  },
  botUsername: {
    required: true,
    minLength: 3,
    maxLength: 100,
    message: "Username must be 3-100 characters"
  },
  botName: {
    required: true,
    minLength: 3,
    maxLength: 100,
    message: "Name must be 3-100 characters"
  },
  webhookUrl: {
    required: false,
    type: "url",
    message: "Must be a valid URL"
  },
  description: {
    required: false
  },
  isActive: {
    required: false,
    default: true
  }
}
```

### Update Bot

All fields optional, same validation rules apply when provided.

## 🧪 Testing

### Mock Data

```typescript
const mockBot: Bot = {
  id: 1,
  botUsername: "test_bot",
  botName: "Test Bot",
  status: BotStatus.ACTIVE,
  webhookUrl: "https://example.com/webhook",
  isActive: true,
  description: "Test bot for development",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: "admin",
  updatedBy: "admin",
};
```

### API Mocking

The hooks support mock data for development:

```typescript
useBots({
  mockData: {
    content: [mockBot],
    totalElements: 1,
    totalPages: 1,
    number: 0,
    size: 10,
  },
});
```

## 🚨 Error Handling

### Common Errors

```typescript
// 400 Bad Request - Validation error
{
  "error": "Validation failed",
  "message": "Bot token is required"
}

// 404 Not Found - Bot doesn't exist
{
  "error": "Not found",
  "message": "Bot with id 123 not found"
}

// 409 Conflict - Duplicate username
{
  "error": "Conflict",
  "message": "Bot with username 'my_bot' already exists"
}

// 500 Internal Server Error
{
  "error": "Server error",
  "message": "Failed to create bot"
}
```

All errors are automatically handled by the mutation hooks and shown as toast notifications.

## 📚 Related Files

- Types: `src/features/bots/types/index.ts`
- Hooks: `src/features/bots/hooks/useBots.ts`
- Components:
  - `src/features/bots/components/BotForm.tsx`
  - `src/features/bots/components/BotTable.tsx`
  - `src/features/bots/components/BotFilters.tsx`
- Page: `src/pages/BotsPage.tsx`

---

**Last Updated:** 2024-10-30
**API Version:** v1


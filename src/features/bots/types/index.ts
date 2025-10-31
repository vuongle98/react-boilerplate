export interface Bot {
  id: number;
  botUsername: string;
  botName: string;
  status: BotStatus;
  webhookUrl?: string;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export enum BotStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ERROR = "ERROR",
  MAINTENANCE = "MAINTENANCE",
  SUSPENDED = "SUSPENDED",
}

export interface CreateBotDto {
  botToken: string;
  botUsername: string;
  botName: string;
  webhookUrl?: string;
  isActive?: boolean;
  description?: string;
}

export interface UpdateBotDto {
  id: number;
  botToken?: string;
  botUsername?: string;
  botName?: string;
  webhookUrl?: string;
  isActive?: boolean;
  description?: string;
}

export interface BotFilters {
  username?: string;
  name?: string;
  status?: BotStatus;
  active?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Status options for filters
export const BOT_STATUS_OPTIONS = [
  { value: BotStatus.ACTIVE, label: "Active" },
  { value: BotStatus.INACTIVE, label: "Inactive" },
  { value: BotStatus.ERROR, label: "Error" },
  { value: BotStatus.MAINTENANCE, label: "Maintenance" },
  { value: BotStatus.SUSPENDED, label: "Suspended" },
];


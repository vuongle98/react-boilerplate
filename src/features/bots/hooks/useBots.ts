import { useApiQuery } from "@/shared/hooks/use-api-query";
import { useCrudMutations } from "@/shared/hooks/use-api-mutations";
import { Bot, BotFilters, CreateBotDto, UpdateBotDto } from "../types";

const BOTS_ENDPOINT = "/api/v1/bots";
const BOTS_QUERY_KEY = ["bots"];

/**
 * Hook for fetching paginated bots with filters
 */
export function useBots(initialFilters: BotFilters = {}) {
  return useApiQuery<Bot>({
    endpoint: BOTS_ENDPOINT,
    queryKey: BOTS_QUERY_KEY,
    initialFilters,
    persistFilters: true,
    persistKey: "bots-filters",
    isPaginated: true,
    useCache: true,
    staleTime: 30000, // 30 seconds
    cacheTime: 300000, // 5 minutes
  });
}

/**
 * Hook for bot CRUD mutations
 */
export function useBotMutations() {
  return useCrudMutations<Bot, CreateBotDto, UpdateBotDto>(
    BOTS_ENDPOINT,
    BOTS_QUERY_KEY
  );
}

/**
 * Hook for fetching a single bot by ID
 */
export function useBot(id: number | string, enabled = true) {
  return useApiQuery<Bot>({
    endpoint: `${BOTS_ENDPOINT}/${id}`,
    queryKey: [...BOTS_QUERY_KEY, id.toString()],
    isPaginated: false,
    useCache: true,
  });
}


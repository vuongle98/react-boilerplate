import { PaginatedData, PaginationOptions } from "@/types/common";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import LoggingService from "./LoggingService";
import TokenService from "./TokenService";

interface CacheEntry {
  data: any;
  timestamp: number;
  url: string; // Base URL without query params
}

class BaseApiService {
  private static instance: AxiosInstance;
  private static apiCache = new Map<string, CacheEntry>();
  private static urlToCacheKeys = new Map<string, Set<string>>(); // Maps base URLs to their cache keys
  private static cacheTTL = 60000; // 1 minute cache TTL by default

  /**
   * Initialize the API service
   */
  private static initialize(): void {
    if (!this.instance) {
      this.instance = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL || "",
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
        paramsSerializer: (params) => {
          const searchParams = new URLSearchParams();

          const processParam = (key: string, value: any) => {
            if (Array.isArray(value)) {
              value.forEach((v) => processParam(key, v));
            } else if (value !== null && typeof value === "object") {
              // Skip objects that aren't arrays
              return;
            } else if (value !== undefined && value !== null) {
              searchParams.append(key, String(value));
            }
          };

          Object.entries(params || {}).forEach(([key, value]) => {
            processParam(key, value);
          });

          return searchParams.toString();
        },
      });

      // Request interceptor to add auth token
      this.instance.interceptors.request.use(
        (config) => {
          const token = TokenService.getToken();

          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          } else {
            config.headers.Authorization = "";
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );

      // Response interceptor for error handling
      this.instance.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;

          // Handle token refresh for 401 errors
          if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
              await TokenService.refreshToken();
              const token = TokenService.getToken();
              this.instance.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${token}`;
              return this.instance(originalRequest);
            } catch (refreshError) {
              LoggingService.error(
                "api",
                "token_refresh_failed",
                "Token refresh failed",
                refreshError
              );
              return Promise.reject(refreshError);
            }
          }

          return Promise.reject(error);
        }
      );
    }
  }

  /**
   * Generate cache key based on queryKey, url and params
   */
  private static generateCacheKey(
    url: string,
    params?: Record<string, unknown>,
    queryKey?: string | string[],
    includeParams: boolean = true
  ): string {
    const baseUrl = url.split("?")[0];
    const parts: string[] = [];

    if (queryKey) {
      parts.push(JSON.stringify(queryKey));
    }

    parts.push(baseUrl);

    if (includeParams && params) {
      parts.push(JSON.stringify(params));
    }

    return parts.join(":");
  }

  /**
   * Check if cache is valid
   */
  private static isCacheValid(cacheKey: string): boolean {
    const cachedItem = this.apiCache.get(cacheKey);
    if (!cachedItem) return false;

    const now = Date.now();
    return now - cachedItem.timestamp < this.cacheTTL;
  }

  /**
   * Set cache TTL in milliseconds
   */
  public static setCacheTTL(ttl: number): void {
    this.cacheTTL = ttl;
  }

  /**
   * Clear cache for specific URL or all cache
   * @param url URL to clear cache for (can be partial or exact)
   * @param exactMatch If true, only clears exact URL matches
   */
  public static clearCache(url?: string, exactMatch: boolean = false): void {
    if (url) {
      const baseUrl = this.generateCacheKey(url, undefined, undefined, false);

      if (exactMatch) {
        // Clear exact URL match
        this.apiCache.delete(baseUrl);
      } else {
        // Clear all cache entries for this base URL
        const cacheKeys = this.urlToCacheKeys.get(baseUrl) || new Set<string>();
        cacheKeys.forEach((key) => this.apiCache.delete(key));
        this.urlToCacheKeys.delete(baseUrl);

        // Also clear any entries that start with the URL (backward compatibility)
        for (const key of this.apiCache.keys()) {
          if (key.startsWith(baseUrl)) {
            this.apiCache.delete(key);
          }
        }
      }
    } else {
      // Clear everything
      this.apiCache.clear();
      this.urlToCacheKeys.clear();
    }
  }

  /**
   * Register a cache entry with its base URL
   */
  private static registerCacheEntry(url: string, cacheKey: string): void {
    const baseUrl = this.generateCacheKey(url, undefined, undefined, false);
    if (!this.urlToCacheKeys.has(baseUrl)) {
      this.urlToCacheKeys.set(baseUrl, new Set());
    }
    this.urlToCacheKeys.get(baseUrl)?.add(cacheKey);
  }

  /**
   * Invalidate related caches for a resource URL
   */
  private static invalidateRelatedCaches(url: string): void {
    // Clear exact URL
    const exactUrl = this.generateCacheKey(url, undefined, undefined, false);
    this.clearCache(exactUrl, true);

    // For RESTful endpoints, also clear the collection cache
    // e.g., for /api/notes/123, clear /api/notes
    const urlParts = exactUrl.split("/");
    if (urlParts.length > 2) {
      const collectionUrl = urlParts.slice(0, -1).join("/");
      this.clearCache(collectionUrl);
    }
  }

  /**
   * Make a GET request
   */

  public static async get<T>(
    url: string,
    params?: Record<string, unknown>,
    headers?: Record<string, string>,
    responseType: AxiosRequestConfig["responseType"] = "json",
    useCache: boolean = true,
    forceRefresh: boolean = false,
    queryKey?: string | string[]
  ): Promise<T> {
    this.initialize();
    LoggingService.info("api", "get", `GET ${url}`);

    try {
      const cacheKey = this.generateCacheKey(url, params, queryKey);

      // Check cache first if caching is enabled
      if (useCache && !forceRefresh && responseType === "json") {
        const cachedItem = this.apiCache.get(cacheKey);
        if (cachedItem && this.isCacheValid(cacheKey)) {
          LoggingService.info("api", "cache_hit", `Cache hit for ${url}`);
          return cachedItem.data;
        }
      }

      const response = await this.instance.get<T>(url, {
        params,
        headers,
        responseType,
      });

      if (responseType === "blob") {
        return response.data as unknown as T;
      }

      // Store in cache if it's a JSON response
      if (useCache && responseType === "json") {
        const cacheEntry: CacheEntry = {
          data: response.data,
          timestamp: Date.now(),
          url: this.generateCacheKey(url, undefined, undefined, false),
        };
        this.apiCache.set(cacheKey, cacheEntry);
        this.registerCacheEntry(url, cacheKey);
      }

      return response.data;
    } catch (error) {
      LoggingService.error("api", "get_failed", `GET ${url} failed`, error);
      throw error;
    }
  }

  /**
   * Make a POST request
   */
  public static async post<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    this.initialize();
    LoggingService.info("api", "post", `POST ${url}`);

    try {
      const response = await this.instance.post<T>(url, data, config);

      // Invalidate related caches
      this.invalidateRelatedCaches(url);

      return response.data;
    } catch (error) {
      LoggingService.error("api", "post_failed", `POST ${url} failed`, error);
      throw error;
    }
  }

  /**
   * Make a PUT request
   */
  public static async put<T, D = unknown>(
    url: string,
    data?: D,
    headers?: Record<string, string>
  ): Promise<T> {
    this.initialize();
    LoggingService.info("api", "put", `PUT ${url}`);

    try {
      const response = await this.instance.put<T>(url, data, {
        headers,
      });

      // Invalidate related caches
      this.invalidateRelatedCaches(url);

      return response.data;
    } catch (error) {
      LoggingService.error("api", "put_failed", `PUT ${url} failed`, error);
      throw error;
    }
  }

  /**
   * Make a PATCH request
   */
  public static async patch<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    this.initialize();
    LoggingService.info("api", "patch", `PATCH ${url}`);

    try {
      const response = await this.instance.patch<T>(url, data, config);

      // Invalidate related caches
      this.invalidateRelatedCaches(url);

      return response.data;
    } catch (error) {
      LoggingService.error("api", "patch_failed", `PATCH ${url} failed`, error);
      throw error;
    }
  }

  /**
   * Make a DELETE request
   */
  public static async delete<T>(
    url: string,
    headers?: Record<string, string>
  ): Promise<T> {
    this.initialize();
    LoggingService.info("api", "delete", `DELETE ${url}`);

    try {
      const response = await this.instance.delete<T>(url, {
        headers,
      });

      // Invalidate related caches
      this.invalidateRelatedCaches(url);

      return response.data;
    } catch (error) {
      LoggingService.error(
        "api",
        "delete_failed",
        `DELETE ${url} failed`,
        error
      );
      throw error;
    }
  }

  /**
   * Get paginated data
   */
  public static async getPaginated<T>(
    url: string,
    options?: PaginationOptions,
    headers?: Record<string, string>,
    useCache: boolean = true,
    forceRefresh: boolean = false,
    queryKey?: string | string[]
  ): Promise<PaginatedData<T>> {
    const params = {
      page: options?.page || 0,
      size: options?.size || 10,
      sort: options?.sort || "id,desc",
      ...options,
    };

    return await this.get<PaginatedData<T>>(
      url,
      params,
      headers,
      "json",
      useCache,
      forceRefresh,
      queryKey
    );
  }

  /**
   * Log user actions
   */
  static logUserAction(
    module: string,
    action: string,
    description: string | Record<string, unknown>,
    metadata?: Record<string, unknown>
  ) {
    return LoggingService.logUserAction(module, action, description, metadata);
  }
}

export default BaseApiService;

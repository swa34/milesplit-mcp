/**
 * MileSplit API client with in-memory TTL cache.
 */

import pino from "pino";
import type { HalResponse, HalListResponse } from "./types.js";

const log = pino({ name: "milesplit:api" });

const BASE_URL = "https://www.milesplit.com/api/v1";
const USER_AGENT = "MileSplit-MCP/1.0";
const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// ─── Error class ───

export class MileSplitApiError extends Error {
  constructor(
    public statusCode: number,
    public statusText: string,
    public url: string,
  ) {
    super(`MileSplit API error: ${statusCode} ${statusText} for ${url}`);
    this.name = "MileSplitApiError";
  }
}

// ─── Cache ───

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string): T | undefined {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return undefined;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T, ttlMs: number = DEFAULT_CACHE_TTL_MS): void {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

// Periodically prune expired entries (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cache) {
    if (now > entry.expiresAt) cache.delete(key);
  }
}, 300_000).unref();

// ─── Fetch wrapper ───

export async function get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const cacheKey = url.toString();
  const cached = getCached<T>(cacheKey);
  if (cached) {
    log.debug({ url: cacheKey }, "Cache hit");
    return cached;
  }

  log.info({ url: cacheKey }, "Fetching");

  const response = await fetch(url.toString(), {
    headers: {
      "User-Agent": USER_AGENT,
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    throw new MileSplitApiError(response.status, response.statusText, cacheKey);
  }

  const data = (await response.json()) as T;
  setCache(cacheKey, data);

  return data;
}

// ─── Convenience typed getters ───

export async function getOne<T>(path: string, params?: Record<string, string | number | undefined>): Promise<HalResponse<T>> {
  return get<HalResponse<T>>(path, params);
}

export async function getList<T>(path: string, params?: Record<string, string | number | undefined>): Promise<HalListResponse<T>> {
  return get<HalListResponse<T>>(path, params);
}

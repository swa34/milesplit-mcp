/**
 * HAL response wrapper types for the MileSplit API.
 */

export interface HalLink {
  href: string;
  templated?: boolean;
}

export interface HalLinks {
  self?: HalLink;
  up?: HalLink;
  list?: HalLink;
  [key: string]: HalLink | undefined;
}

export interface HalMeta {
  status_code: number;
  fresh?: boolean;
  ttl?: number;
  [key: string]: unknown;
}

export interface HalResponse<T> {
  _meta: HalMeta;
  _links: HalLinks;
  _embedded?: Record<string, unknown>;
  data: T;
}

export interface HalListResponse<T> {
  _meta: HalMeta;
  _links: HalLinks;
  _embedded?: Record<string, unknown>;
  data: T[];
  filters?: unknown[];
}

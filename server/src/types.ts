/**
 * MileSplit MCP Server — shared types for all tools.
 *
 * IMPORTANT: All MileSplit API IDs are strings, not integers.
 * Nested endpoints (/meets/{id}/results, /teams/{id}/athletes) are aliases
 * that return the parent resource — do NOT use them for child data.
 */

// ─── Athlete ───

export interface Athlete {
  id: string;
  firstName: string;
  lastName: string;
  slug: string;
  gender: string;
  gradYear: string;
  nickname: string | null;
  birthYear: string | null;
  honors: string | null;
  specialty: string | null;
  city: string;
  state: string;
  country: string;
  schoolId: string;
  collegeId: string;
  photoUrl: string;
  siteSubdomain?: string;
  usatf?: string | null;
  tfrrsId?: string | null;
  profilePhotoUrl?: string;
  [key: string]: unknown;
}

export interface PerformanceRecord {
  id: string;
  meetId: string;
  units: string;
  meetName: string;
  eventCode: string;
  round: string; // "f" = final, "p" = prelim
  season: string;
  mark: string;
  [key: string]: unknown;
}

// ─── Team ───

export interface Team {
  id: string;
  name: string;
  abbreviation?: string;
  slug?: string;
  city: string;
  state: string;
  county?: string;
  country?: string;
  type?: string;
  primaryColor?: string;
  secondaryColor?: string;
  homepage?: string;
  phone?: string;
  address?: string;
  zip?: string;
  profilePhotoUrl?: string;
  [key: string]: unknown;
}

// ─── Meet ───

export interface Meet {
  id: string;
  name: string;
  dateStart: string;
  dateEnd: string;
  season: string;
  seasonYear: string;
  venueCity: string;
  venueState: string;
  venueCountry: string;
  registrationActive: string | null;
  [key: string]: unknown;
}

// ─── Event Types ───

export interface EventType {
  id: string;
  code: string;
  name: string;
  shortName: string;
  [key: string]: unknown;
}

// ─── Venue ───

export interface Venue {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  [key: string]: unknown;
}

// ─── Tool Response ───

export interface ToolContent {
  type: "text";
  text: string;
}

export interface ToolResponse {
  [key: string]: unknown;
  content: ToolContent[];
}

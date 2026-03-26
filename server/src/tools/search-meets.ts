/**
 * search_meets — Search for track & field meets.
 *
 * Working params: state, season, seasonYear, limit, offset.
 * The q (search) param does NOT work server-side.
 */

import { z } from "zod";
import { getList } from "../api/client.js";
import type { Meet, ToolResponse } from "../types.js";

export const definition = {
  name: "search_meets",
  description:
    "Search for track & field meets on MileSplit. Filter by state, season (Indoor/Outdoor), and year. Returns meets with dates, locations, and registration status.",
  inputSchema: {
    state: z.string().optional().describe("Two-letter US state code to filter by (e.g. 'TX', 'GA')"),
    season: z.enum(["Indoor", "Outdoor"]).optional().describe("Season filter: 'Indoor' or 'Outdoor'"),
    seasonYear: z.number().optional().describe("Competition year to filter by (e.g. 2026)"),
    limit: z.number().optional().default(25).describe("Max results to return (default 25)"),
    offset: z.number().optional().describe("Number of results to skip for pagination"),
  },
  annotations: {
    readOnlyHint: true,
    openWorldHint: true,
    destructiveHint: false,
  },
};

export async function handler(args: {
  state?: string;
  season?: string;
  seasonYear?: number;
  limit?: number;
  offset?: number;
}): Promise<ToolResponse> {
  try {
    const params: Record<string, string | number | undefined> = {
      state: args.state,
      season: args.season,
      seasonYear: args.seasonYear,
      limit: args.limit ?? 25,
      offset: args.offset,
    };

    const response = await getList<Meet>("/meets", params);

    const meets = (response.data ?? []).map((m) => ({
      id: m.id,
      name: m.name,
      dateStart: m.dateStart,
      dateEnd: m.dateEnd,
      season: m.season,
      seasonYear: m.seasonYear,
      venueCity: m.venueCity,
      venueState: m.venueState,
      venueCountry: m.venueCountry,
      registrationActive: m.registrationActive,
    }));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ count: meets.length, meets }, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error searching meets: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
}

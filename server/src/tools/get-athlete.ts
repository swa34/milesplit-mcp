/**
 * get_athlete — Get detailed athlete profile, stats, and progression.
 *
 * /athletes/{id}/stats is the richest data source — returns all performance
 * records with meetId, eventCode, mark, round, season.
 * /athletes/{id}/performances?view=bests returns abbreviated data (missing
 * mark/eventCode) — use stats instead.
 */

import { z } from "zod";
import { getOne, get } from "../api/client.js";
import type { Athlete, PerformanceRecord, ToolResponse } from "../types.js";
import type { HalResponse } from "../api/types.js";

export const definition = {
  name: "get_athlete",
  description:
    "Get a detailed athlete profile from MileSplit by athlete ID. Optionally include performance stats (all events, marks, meet names) and/or historical progression.",
  inputSchema: {
    athleteId: z.string().describe("MileSplit athlete ID (string)"),
    include: z
      .array(z.enum(["stats", "progression"]))
      .optional()
      .default([])
      .describe("Additional data to include: 'stats' (performance records), 'progression' (historical)"),
  },
  annotations: {
    readOnlyHint: true,
    openWorldHint: true,
    destructiveHint: false,
  },
};

export async function handler(args: {
  athleteId: string;
  include?: string[];
}): Promise<ToolResponse> {
  try {
    const { athleteId, include = [] } = args;

    // Fetch base profile
    const profileRes = await getOne<Athlete>(`/athletes/${athleteId}`);
    const result: Record<string, unknown> = { profile: profileRes.data };

    // Fetch optional sub-resources in parallel
    const fetches: Promise<void>[] = [];

    if (include.includes("stats")) {
      fetches.push(
        get<HalResponse<PerformanceRecord[]>>(`/athletes/${athleteId}/stats`).then((res) => {
          result.stats = res.data ?? [];
        }).catch(() => {
          result.stats = [];
        }),
      );
    }

    if (include.includes("progression")) {
      fetches.push(
        get<HalResponse<PerformanceRecord[]>>(`/athletes/${athleteId}/progression`).then((res) => {
          result.progression = res.data ?? [];
        }).catch(() => {
          result.progression = [];
        }),
      );
    }

    await Promise.all(fetches);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error fetching athlete: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
}

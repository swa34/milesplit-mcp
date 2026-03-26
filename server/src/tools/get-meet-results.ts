/**
 * get_meet — Get meet details by meet ID.
 *
 * NOTE: /meets/{id}/results is an alias that returns the parent meet, NOT
 * actual results. Performance data is athlete-centric — use get_athlete
 * with include: ["stats"] to get an athlete's results across meets.
 */

import { z } from "zod";
import { getOne } from "../api/client.js";
import type { Meet, ToolResponse } from "../types.js";

export const definition = {
  name: "get_meet",
  description:
    "Get details for a specific track & field meet on MileSplit by meet ID. Returns meet name, dates, venue, season, and registration status. Note: individual performance results are available via get_athlete with include stats, not via meets.",
  inputSchema: {
    meetId: z.string().describe("MileSplit meet ID (string)"),
  },
  annotations: {
    readOnlyHint: true,
    openWorldHint: true,
    destructiveHint: false,
  },
};

export async function handler(args: {
  meetId: string;
}): Promise<ToolResponse> {
  try {
    const meetRes = await getOne<Meet>(`/meets/${args.meetId}`);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ meet: meetRes.data }, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error fetching meet: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
}

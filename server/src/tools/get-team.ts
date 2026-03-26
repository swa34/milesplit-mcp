/**
 * get_team — Get team profile by team ID.
 *
 * NOTE: /teams/{id}/athletes and /teams/{id}/results are aliases that return
 * the parent team resource, NOT child data. So this tool only fetches the
 * team profile itself.
 */

import { z } from "zod";
import { getOne } from "../api/client.js";
import type { Team, ToolResponse } from "../types.js";

export const definition = {
  name: "get_team",
  description:
    "Get a team/school profile from MileSplit by team ID. Returns team name, location, colors, contact info, and logo.",
  inputSchema: {
    teamId: z.string().describe("MileSplit team ID (string)"),
  },
  annotations: {
    readOnlyHint: true,
    openWorldHint: true,
    destructiveHint: false,
  },
};

export async function handler(args: {
  teamId: string;
}): Promise<ToolResponse> {
  try {
    const teamRes = await getOne<Team>(`/teams/${args.teamId}`);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ team: teamRes.data }, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error fetching team: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
}

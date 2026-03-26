/**
 * search_athletes — Search for athletes by name, state, grad year, gender.
 */

import { z } from "zod";
import { getList } from "../api/client.js";
import type { Athlete, ToolResponse } from "../types.js";

export const definition = {
  name: "search_athletes",
  description:
    "Search for track & field athletes on MileSplit by name. Optionally filter by state, graduation year, and gender. Returns a list of matching athlete profiles.",
  inputSchema: {
    query: z.string().describe("Athlete name to search for (searches by first name)"),
  },
  annotations: {
    readOnlyHint: true,
    openWorldHint: true,
    destructiveHint: false,
  },
};

export async function handler(args: {
  query: string;
}): Promise<ToolResponse> {
  try {
    const params: Record<string, string | number | undefined> = {
      q: args.query,
    };

    const response = await getList<Athlete>("/athletes", params);

    // API returns ~100 results; only q param filters server-side
    const athletes = (response.data ?? []).map((a) => ({
      id: a.id,
      firstName: a.firstName,
      lastName: a.lastName,
      gender: a.gender,
      gradYear: a.gradYear,
      city: a.city,
      state: a.state,
      schoolId: a.schoolId,
    }));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ count: athletes.length, athletes }, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error searching athletes: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
}

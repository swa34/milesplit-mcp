/**
 * get_events — List all track & field event types.
 *
 * Returns all 396 event types from MileSplit (e.g., 100m, 200m, Shot Put,
 * 4x400 Relay, etc.) with their codes and short names.
 *
 * NOTE: This replaces get_rankings — the /rankings endpoint returns
 * data: null for all parameter combinations (likely auth-gated or deprecated).
 */

import { z } from "zod";
import { getList } from "../api/client.js";
import type { EventType, ToolResponse } from "../types.js";

export const definition = {
  name: "get_events",
  description:
    "List all track & field event types available on MileSplit. Returns event names, codes, and short names. Useful for discovering valid event names to use in other queries.",
  inputSchema: {},
  annotations: {
    readOnlyHint: true,
    openWorldHint: true,
    destructiveHint: false,
  },
};

export async function handler(_args: Record<string, never>): Promise<ToolResponse> {
  try {
    const response = await getList<EventType>("/events");

    const events = (response.data ?? []).map((e) => ({
      id: e.id,
      code: e.code,
      name: e.name,
      shortName: e.shortName,
    }));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ count: events.length, events }, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error fetching events: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
}

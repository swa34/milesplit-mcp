/**
 * MileSplit MCP Server — dual transport (stdio + HTTP) for multi-platform support.
 *
 * - stdio: Claude Desktop, Claude Code
 * - HTTP: ChatGPT, web clients, custom integrations
 */

import "dotenv/config";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFileSync, existsSync, statSync, createReadStream } from "node:fs";
import { resolve, extname } from "node:path";
import { randomUUID } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import pino from "pino";

// ─── Tool imports ───

import {
  definition as searchAthletesDef,
  handler as searchAthletesHandler,
} from "./tools/search-athletes.js";
import {
  definition as getAthleteDef,
  handler as getAthleteHandler,
} from "./tools/get-athlete.js";
import {
  definition as searchMeetsDef,
  handler as searchMeetsHandler,
} from "./tools/search-meets.js";
import {
  definition as getMeetDef,
  handler as getMeetHandler,
} from "./tools/get-meet-results.js";
import {
  definition as getTeamDef,
  handler as getTeamHandler,
} from "./tools/get-team.js";
import {
  definition as getEventsDef,
  handler as getEventsHandler,
} from "./tools/get-rankings.js";

// ─── Constants ───

const PORT = Number(process.env.PORT ?? 3001);
const MCP_MODE = process.env.MCP_MODE ?? "http";
const MCP_PATH = "/mcp";

const log = pino({
  name: "milesplit:server",
  // Suppress logs in stdio mode to avoid polluting the transport
  level: MCP_MODE === "stdio" ? "silent" : "info",
});

// ─── Rate limiter (in-memory, per-IP, sliding window) ───

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 60;

const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  let timestamps = rateLimitMap.get(ip);
  if (!timestamps) {
    timestamps = [];
    rateLimitMap.set(ip, timestamps);
  }

  // Prune expired
  const filtered = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  rateLimitMap.set(ip, filtered);

  if (filtered.length >= RATE_LIMIT_MAX) return true;
  filtered.push(now);
  return false;
}

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of rateLimitMap) {
    const filtered = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (filtered.length === 0) rateLimitMap.delete(ip);
    else rateLimitMap.set(ip, filtered);
  }
}, 300_000).unref();

// ─── Server factory ───

function registerTools(server: McpServer): void {
  server.tool(
    searchAthletesDef.name,
    searchAthletesDef.description,
    searchAthletesDef.inputSchema,
    searchAthletesHandler,
  );

  server.tool(
    getAthleteDef.name,
    getAthleteDef.description,
    getAthleteDef.inputSchema,
    getAthleteHandler,
  );

  server.tool(
    searchMeetsDef.name,
    searchMeetsDef.description,
    searchMeetsDef.inputSchema,
    searchMeetsHandler,
  );

  server.tool(
    getMeetDef.name,
    getMeetDef.description,
    getMeetDef.inputSchema,
    getMeetHandler,
  );

  server.tool(
    getTeamDef.name,
    getTeamDef.description,
    getTeamDef.inputSchema,
    getTeamHandler,
  );

  server.tool(
    getEventsDef.name,
    getEventsDef.description,
    getEventsDef.inputSchema,
    getEventsHandler,
  );
}

function createMileSplitServer(): McpServer {
  const server = new McpServer({
    name: "milesplit",
    version: "1.0.0",
  });
  registerTools(server);
  return server;
}

// ─── Stdio mode ───

async function startStdio(): Promise<void> {
  const server = createMileSplitServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Server runs until stdin closes
}

// ─── HTTP mode ───

function startHttp(): void {
  const httpServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    if (!req.url) {
      res.writeHead(400).end("Missing URL");
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);

    // CORS preflight
    if (req.method === "OPTIONS" && url.pathname === MCP_PATH) {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "content-type, mcp-session-id",
        "Access-Control-Expose-Headers": "Mcp-Session-Id",
      });
      res.end();
      return;
    }

    // Trace ID
    const traceId = randomUUID().slice(0, 8);
    res.setHeader("X-Trace-Id", traceId);
    const startMs = Date.now();

    // Health check
    if (req.method === "GET" && url.pathname === "/health") {
      res.writeHead(200, { "content-type": "application/json" }).end(
        JSON.stringify({
          status: "ok",
          server: "milesplit-mcp",
          version: "1.0.0",
          tools: 6,
        }),
      );
      return;
    }

    // Rate limiting
    const clientIp =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ??
      req.socket.remoteAddress ??
      "unknown";

    // MCP endpoint
    const MCP_METHODS = new Set(["POST", "GET", "DELETE"]);
    if (url.pathname === MCP_PATH && req.method && MCP_METHODS.has(req.method)) {
      if (isRateLimited(clientIp)) {
        log.warn({ traceId, clientIp }, "Rate limited");
        res.writeHead(429, { "Retry-After": "60" }).end("Too many requests");
        return;
      }

      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id, X-Trace-Id");

      const server = createMileSplitServer();
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined, // stateless mode
        enableJsonResponse: true,
      });

      res.on("close", () => {
        const durationMs = Date.now() - startMs;
        log.info({ traceId, method: req.method, durationMs }, "Request completed");
        transport.close();
        server.close();
      });

      try {
        await server.connect(transport);
        await transport.handleRequest(req, res);
      } catch (error) {
        const durationMs = Date.now() - startMs;
        log.error({ traceId, error, durationMs }, "Error handling MCP request");
        if (!res.headersSent) {
          res.writeHead(500).end(JSON.stringify({ error: "Internal server error" }));
        }
      }
      return;
    }

    // ─── Static website serving (website/dist/) ───
    if (req.method === "GET") {
      const WEBSITE_DIR = resolve(import.meta.dirname, "../../website/dist");
      const MIME_TYPES: Record<string, string> = {
        ".html": "text/html; charset=utf-8",
        ".js": "application/javascript; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".json": "application/json",
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".ico": "image/x-icon",
        ".woff2": "font/woff2",
        ".woff": "font/woff",
      };

      const safePath = url.pathname;
      const filePath = resolve(WEBSITE_DIR, safePath === "/" ? "index.html" : safePath.slice(1));

      if (
        filePath.startsWith(WEBSITE_DIR) &&
        existsSync(filePath) &&
        statSync(filePath).isFile()
      ) {
        const ext = extname(filePath);
        const contentType = MIME_TYPES[ext] ?? "application/octet-stream";
        const stream = createReadStream(filePath);
        res.writeHead(200, {
          "Content-Type": contentType,
          "Cache-Control":
            ext === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
        });
        stream.pipe(res);
        return;
      }

      // SPA fallback
      const indexPath = resolve(WEBSITE_DIR, "index.html");
      if (existsSync(indexPath)) {
        const body = readFileSync(indexPath);
        res.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-cache",
        });
        res.end(body);
        return;
      }
    }

    // 404
    res.writeHead(404).end("Not Found");
  });

  httpServer.listen(PORT, () => {
    log.info(`MileSplit MCP server listening on http://localhost:${PORT}${MCP_PATH}`);
    console.log(`MileSplit MCP server listening on http://localhost:${PORT}${MCP_PATH}`);
  });
}

// ─── Entrypoint ───

if (MCP_MODE === "stdio") {
  startStdio().catch((err) => {
    console.error("Fatal error in stdio mode:", err);
    process.exit(1);
  });
} else {
  startHttp();
}

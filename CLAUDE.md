# MileSplit MCP — Track & Field Data for Every AI Assistant

## What this project is

An MCP server that makes MileSplit track & field data (athletes, meets, results, rankings, teams) available to any AI assistant via the Model Context Protocol. Works with Claude Desktop (stdio), ChatGPT (HTTP), Gemini, and any MCP-compatible client.

## Author

Scott Allen — scottwallen3434@gmail.com — github.com/swa34

## Stack

- **MCP Server**: Node.js + TypeScript, `@modelcontextprotocol/sdk` (standard MCP, no ext-apps)
- **Transport**: Dual — StdioServerTransport (Claude Desktop) + StreamableHTTPServerTransport (ChatGPT/web)
- **Data Source**: MileSplit public API v1 (live proxy, no RAG)
- **Schema Validation**: Zod
- **Logging**: pino
- **Website**: React 19 + Vite 8 + Tailwind v4 + shadcn/ui + motion + react-router v7
- **Testing**: vitest + @testing-library/react
- **Deployment**: Docker + Railway

## Project structure

Two workspaces:
- `server/` — MCP server with 6 tools
- `website/` — Marketing/docs site (built dist served by server)

## MCP Tools

1. **search_athletes** — Find athletes by name (only `q` param filters server-side)
2. **get_athlete** — Full profile with stats and progression
3. **search_meets** — Find meets by state, season, year (with pagination)
4. **get_meet** — Meet details (name, dates, venue, season)
5. **get_team** — Team/school profile (name, location, colors, contact)
6. **get_events** — List all 396 track & field event types

### API Limitations (discovered)
- **All IDs are strings**, not integers
- Nested endpoints (`/meets/{id}/results`, `/teams/{id}/athletes`) return the PARENT, not child data
- `/rankings` returns `data: null` — likely auth-gated or deprecated
- Performance results are athlete-centric only (via `/athletes/{id}/stats`)
- Meet entries require auth (401)

## Architecture decisions

- **Standard MCP only** — No `@modelcontextprotocol/ext-apps`. All tools return standard MCP content (text/JSON). This ensures compatibility with every AI platform, not just ChatGPT.
- **Live API proxy** — Unlike DocScope which indexes docs into Pinecone, MileSplit data is live. Tools call the MileSplit API in real-time. No embeddings, no vector DB.
- **In-memory TTL cache** — Simple Map-based cache with 5-minute TTL for repeated queries. No Redis needed.
- **Dual transport** — `MCP_MODE=stdio` for Claude Desktop, `MCP_MODE=http` (default) for web clients. Same McpServer factory, different transport.
- **Stateless HTTP** — Each HTTP request creates a fresh McpServer + transport (no session state). Same pattern as OpenRes.
- **node:http only** — No Express. Lightweight HTTP server with manual routing for /mcp, /health, and static files.
- **Tool annotations** — Every tool has `readOnlyHint: true, openWorldHint: true, destructiveHint: false`. All tools are read-only API proxies.

## Key patterns (from OpenRes, adapted)

1. **Tool files**: Each tool exports `definition` (inputSchema + description + annotations) and `handler` function
2. **Content centralization**: All website text in `website/src/lib/content.ts`
3. **Section wrapper**: `<Section title="" subtitle="" variant="">` for consistent page layout
4. **Lazy routes**: `lazy: () => import("./pages/foo")` with `export function Component()`
5. **SEO hook**: `useSeo({ title, description })` per page
6. **Animations**: motion/react for page transitions and staggered card entrances

## Key commands

```bash
# Server
cd server && npm install
cd server && npm run dev          # tsx watch mode
cd server && npm run build        # tsc compile
cd server && npm test             # vitest

# Website
cd website && npm install
cd website && npm run dev          # vite dev server
cd website && npm run build        # production build
cd website && npm test             # vitest

# Docker
docker build -t milesplit-mcp .
docker run -p 3000:3000 milesplit-mcp

# Claude Desktop (stdio mode)
MCP_MODE=stdio node server/dist/index.js
```

## Do NOT

- Use `@modelcontextprotocol/ext-apps` — this is multi-platform, not ChatGPT-only
- Add RAG, embeddings, or vector DB — this is a live API proxy
- Use Express — stick with node:http
- Hardcode text in components — all content lives in lib/content.ts
- Skip tool annotations — MCP SDK requires them
- Cache indefinitely — MileSplit data changes; use short TTLs (5 min)
- Store API keys or auth — MileSplit API is public, no auth needed

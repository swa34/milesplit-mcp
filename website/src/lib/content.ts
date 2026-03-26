// ─── Site Metadata ───

export const SITE = {
  title: "MileSplit MCP",
  tagline: "Track & field data for every AI assistant",
  description:
    "Search athletes, rankings, meet results, and team rosters from MileSplit — accessible from any MCP-compatible AI assistant. Built with dual stdio/HTTP transport.",
  author: "Scott Allen",
  repo: "https://github.com/swa34/milesplit-mcp",
  mcpUrl: "https://milesplit-mcp-production.up.railway.app/mcp",
  mcpUrlLocal: "http://localhost:3001/mcp",
  docsSetupUrl: "/docs#setup",
} as const;

// ─── Navigation ───

export const NAV_LINKS = [
  { label: "Features", href: "/features" },
  { label: "Architecture", href: "/architecture" },
  { label: "Demo", href: "/demo" },
  { label: "Docs", href: "/docs" },
] as const;

// ─── Hero Section ───

export const HERO = {
  headline: "Track & field data for every AI",
  subheadline:
    "MileSplit MCP gives AI assistants access to athlete profiles, rankings, meet results, and team rosters — through the open Model Context Protocol.",
  cta: { label: "Get Started", href: "/docs" },
  secondaryCta: { label: "View on GitHub", href: "https://github.com/swa34/milesplit-mcp" },
} as const;

// ─── Tool Cards (landing page + features page) ───

export const TOOL_CARDS = [
  {
    name: "search_athletes",
    title: "Athlete Search",
    shortDescription:
      "Find athletes by name with optional state and graduation year filters. Returns profile links, school, and location.",
    longDescription:
      "Full-text search across MileSplit's athlete database. Filter by state abbreviation and graduation year to narrow results. Returns athlete name, profile URL, school, city/state, and grad year. Ideal for finding specific runners, jumpers, or throwers.",
    example: `search_athletes({ query: "Sydney McLaughlin", state: "NJ" })`,
  },
  {
    name: "get_athlete_details",
    title: "Athlete Profile",
    shortDescription:
      "Pull detailed athlete profiles including personal records, event history, and team affiliation.",
    longDescription:
      "Given an athlete URL from search results, retrieves the full profile: personal records across all events, season bests, school and team info, graduation year, and links to individual meet results. The go-to tool for deep athlete research.",
    example: `get_athlete_details({ athlete_url: "https://www.milesplit.com/athletes/12345" })`,
  },
  {
    name: "get_rankings",
    title: "Event Rankings",
    shortDescription:
      "National and state-level rankings by event, gender, season, and graduation year.",
    longDescription:
      "Access MileSplit's ranking lists for any track & field event. Filter by gender, indoor/outdoor season, state, and grad year. Returns ranked lists with athlete names, marks/times, schools, and meet dates. Supports all standard running, jumping, and throwing events.",
    example: `get_rankings({ event: "400m Hurdles", gender: "female", season: "Outdoor" })`,
  },
  {
    name: "get_meet_results",
    title: "Meet Results",
    shortDescription:
      "Full meet results with event breakdowns, placements, marks, and wind readings.",
    longDescription:
      "Retrieve complete results from any MileSplit-covered meet. Returns event-by-event breakdowns including placements, athlete names, times/marks, wind readings, and school affiliations. Covers dual meets to national championships.",
    example: `get_meet_results({ meet_url: "https://www.milesplit.com/meets/54321" })`,
  },
  {
    name: "search_meets",
    title: "Meet Search",
    shortDescription:
      "Find upcoming and past meets by name, state, and date range.",
    longDescription:
      "Search MileSplit's meet database by keyword, state, and date range. Returns meet names, dates, locations, and links to full results. Useful for finding specific competitions or browsing what's coming up in a region.",
    example: `search_meets({ query: "State Championships", state: "GA", season: "Outdoor" })`,
  },
  {
    name: "get_team_roster",
    title: "Team Roster",
    shortDescription:
      "Get full team rosters with athlete names, events, and graduation years.",
    longDescription:
      "Retrieve the complete roster for any high school or club team on MileSplit. Returns athlete names, primary events, graduation years, and profile links. Great for scouting teams or building meet previews.",
    example: `get_team_roster({ team_url: "https://www.milesplit.com/teams/67890" })`,
  },
] as const;

// ─── Feature Highlights (landing page grid) ───

export const FEATURE_HIGHLIGHTS = [
  {
    title: "Multi-Platform Support",
    description:
      "Works with Claude Desktop, ChatGPT, Gemini, Cursor, Windsurf, and any MCP-compatible client. One server, every AI assistant.",
  },
  {
    title: "Live Data Access",
    description:
      "Real-time athlete profiles, rankings, and meet results pulled directly from MileSplit. Always current, never stale.",
  },
  {
    title: "6 Specialized Tools",
    description:
      "Purpose-built MCP tools for athlete search, profiles, rankings, meet results, meet search, and team rosters.",
  },
  {
    title: "Smart Caching",
    description:
      "Intelligent response caching reduces redundant requests and speeds up repeated queries. Configurable TTL per tool.",
  },
  {
    title: "Open Protocol",
    description:
      "Built on the Model Context Protocol standard. Stdio transport for local use, HTTP+SSE for remote deployment. No vendor lock-in.",
  },
  {
    title: "Easy Setup",
    description:
      "One JSON config block for Claude Desktop. One URL for ChatGPT. npm install for local development. Up and running in under a minute.",
  },
] as const;

// ─── Platform Cards ───

export const PLATFORM_CARDS = [
  {
    name: "Claude Desktop",
    description: "Native MCP support via stdio transport. Add the server config to claude_desktop_config.json.",
    setupType: "stdio" as const,
    icon: "bot",
  },
  {
    name: "ChatGPT",
    description: "Connect via HTTP+SSE remote MCP endpoint. Paste the URL in ChatGPT's MCP tools panel.",
    setupType: "http" as const,
    icon: "message-circle",
  },
  {
    name: "Gemini",
    description: "Google's AI assistant supports MCP via HTTP transport. Add the remote endpoint URL.",
    setupType: "http" as const,
    icon: "sparkles",
  },
  {
    name: "Cursor",
    description: "AI-powered IDE with built-in MCP support. Configure in Cursor settings.",
    setupType: "stdio" as const,
    icon: "code",
  },
  {
    name: "Windsurf",
    description: "Codeium's IDE supports MCP servers natively. Add to your workspace config.",
    setupType: "stdio" as const,
    icon: "wind",
  },
  {
    name: "Any MCP Client",
    description: "Any client implementing the Model Context Protocol can connect via stdio or HTTP+SSE.",
    setupType: "http" as const,
    icon: "plug",
  },
] as const;

// ─── Architecture Flow ───

export const ARCHITECTURE_STEPS = [
  { label: "User prompt", description: "User asks their AI assistant a track & field question" },
  { label: "AI routes to MCP", description: "The assistant identifies the right MileSplit MCP tool to call" },
  { label: "MCP server processes", description: "Request validated, cache checked, then routed to the appropriate tool" },
  { label: "MileSplit API call", description: "Server fetches live data from MileSplit's web platform" },
  { label: "Data extraction", description: "HTML parsed and structured into clean JSON responses" },
  { label: "Response returned", description: "Structured data flows back through MCP to the AI assistant" },
] as const;

// ─── Terminal Demo Script ───

export const DEMO_LINES = [
  { type: "input" as const, text: '> search_athletes({ query: "Sydney McLaughlin", state: "NJ" })' },
  { type: "output" as const, text: "" },
  { type: "output" as const, text: "Found 3 athletes (latency: 280ms)" },
  { type: "output" as const, text: "" },
  { type: "output" as const, text: "1. Sydney McLaughlin-Levrone    Union Catholic HS, NJ    2018" },
  { type: "output" as const, text: '   Events: 400m Hurdles, 400m, 4x400m Relay' },
  { type: "output" as const, text: "" },
  { type: "input" as const, text: '> get_rankings({ event: "100m", gender: "male", season: "Outdoor", state: "TX" })' },
  { type: "output" as const, text: "" },
  { type: "output" as const, text: "Texas Outdoor 100m Rankings — Boys" },
  { type: "output" as const, text: "" },
  { type: "output" as const, text: "1. 10.12   James Carter      DeSoto HS           2025" },
  { type: "output" as const, text: "2. 10.18   Marcus Johnson     Cedar Hill HS        2024" },
  { type: "output" as const, text: "3. 10.21   Devon Williams     Allen HS             2025" },
] as const;

// ─── SEO Meta per Page ───

export const PAGE_META: Record<string, { title: string; description: string }> = {
  home: {
    title: "MileSplit MCP — Track & Field Data for Every AI Assistant",
    description:
      "Search athletes, rankings, meet results, and team rosters from MileSplit via the Model Context Protocol. Works with Claude, ChatGPT, Gemini, and more.",
  },
  features: {
    title: "Features — MileSplit MCP",
    description:
      "Six MCP tools for track & field data: athlete search, profiles, event rankings, meet results, meet search, and team rosters.",
  },
  architecture: {
    title: "Architecture — MileSplit MCP",
    description:
      "How MileSplit MCP works: dual stdio/HTTP transport, data extraction pipeline, smart caching, and structured JSON responses.",
  },
  demo: {
    title: "Demo — MileSplit MCP",
    description:
      "See MileSplit MCP in action: search athletes, pull rankings, and browse meet results from an AI assistant.",
  },
  docs: {
    title: "Docs — MileSplit MCP",
    description:
      "Getting started guide for MileSplit MCP: Claude Desktop setup, ChatGPT URL, and direct API access via curl.",
  },
};

// ─── 404 Page ───

export const NOT_FOUND = {
  headline: "404 — Off Course!",
  message: "You've wandered off the track. This page doesn't exist — but the finish line is back at home.",
  cta: { label: "Back to the track", href: "/" },
} as const;

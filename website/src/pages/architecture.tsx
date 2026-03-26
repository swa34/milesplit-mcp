import { motion } from "motion/react";
import Section from "@/components/layout/section";
import CodeBlock from "@/components/code-block";
import { PAGE_META } from "@/lib/content";
import { useSeo } from "@/hooks/use-seo";

const PIPELINE_STEPS = [
  {
    label: "User asks their AI assistant",
    description: "A user prompts Claude, ChatGPT, Gemini, or any MCP-compatible assistant with a track & field question.",
    details:
      "Example: 'Who are the top 100m runners in Texas this outdoor season?' The assistant recognizes this needs live data and routes to the MileSplit MCP server.",
  },
  {
    label: "MCP protocol routing",
    description: "The assistant calls the appropriate MileSplit MCP tool via stdio or HTTP+SSE transport.",
    details:
      "Claude Desktop connects via stdio (local subprocess). ChatGPT and remote clients use HTTP+SSE. Both transports expose the same 6 tools with identical schemas.",
  },
  {
    label: "Request validation & caching",
    description: "Tool inputs validated with Zod schemas. Cache checked for recent identical queries.",
    details:
      "Each tool has strict input validation. The cache layer stores recent responses with configurable TTL per tool, reducing redundant requests to MileSplit.",
  },
  {
    label: "MileSplit data extraction",
    description: "Server fetches live pages from MileSplit and extracts structured data from HTML.",
    details:
      "The extraction layer handles pagination, dynamic content loading, and HTML parsing to pull clean structured data from MileSplit's web platform.",
  },
  {
    label: "JSON response construction",
    description: "Raw data transformed into clean, structured JSON matching the tool's output schema.",
    details:
      "Each tool returns well-typed JSON with consistent field names, proper null handling, and appropriate nesting. Athletes include names, schools, marks, and profile links.",
  },
  {
    label: "Data delivered to AI",
    description: "Structured response flows back through MCP to the AI assistant for natural language presentation.",
    details:
      "The assistant receives structured data and presents it conversationally. Rankings become formatted tables, athlete profiles become summaries, meet results become event breakdowns.",
  },
];

function FlowStep({
  number,
  label,
  description,
  details,
  isLast,
}: {
  number: number;
  label: string;
  description: string;
  details: string;
  isLast: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl"
    >
      <div className="flex items-start gap-4 py-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
          {number}
        </div>
        <div>
          <h4 className="text-base font-semibold text-text">{label}</h4>
          <p className="text-sm text-text-secondary mb-2">{description}</p>
          <p className="text-xs text-text-muted leading-relaxed">{details}</p>
        </div>
      </div>
      {!isLast && <div className="ml-4 w-px h-6 bg-border" />}
    </motion.div>
  );
}

export function Component() {
  useSeo(PAGE_META.architecture);

  return (
    <>
      <Section
        title="Architecture"
        subtitle="How a user question becomes structured track & field data."
      >
        <div className="flex flex-col items-center gap-0">
          {PIPELINE_STEPS.map((step, i) => (
            <FlowStep
              key={step.label}
              number={i + 1}
              label={step.label}
              description={step.description}
              details={step.details}
              isLast={i === PIPELINE_STEPS.length - 1}
            />
          ))}
        </div>
      </Section>

      {/* Dual Transport */}
      <Section
        title="Dual Transport"
        subtitle="One server, two connection modes."
        variant="alt"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="p-6 rounded-xl border border-border bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-text mb-2">Stdio Transport</h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-3">
              For local use with Claude Desktop, Cursor, and Windsurf. The MCP client spawns the server
              as a subprocess and communicates via stdin/stdout. Zero network overhead, instant startup.
            </p>
            <CodeBlock label="claude_desktop_config.json">{`{
  "mcpServers": {
    "milesplit": {
      "command": "node",
      "args": ["path/to/server/dist/index.js"]
    }
  }
}`}</CodeBlock>
          </div>
          <div className="p-6 rounded-xl border border-border bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-text mb-2">HTTP+SSE Transport</h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-3">
              For remote use with ChatGPT, Gemini, and cloud-hosted clients. The server exposes an
              HTTP endpoint with Server-Sent Events for streaming responses. Deploy once, connect from anywhere.
            </p>
            <CodeBlock label="Local">{`http://localhost:3001/mcp`}</CodeBlock>
            <CodeBlock label="Deployed" className="mt-3">{`https://milesplit-mcp.up.railway.app/mcp`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* Caching */}
      <Section title="Smart Caching">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm text-text-secondary leading-relaxed mb-6 text-center">
            The server caches responses to reduce redundant requests and improve latency.
            Each tool has a configurable TTL. Identical queries within the TTL window return
            cached results instantly.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-border bg-white dark:bg-gray-900 text-center">
              <div className="text-2xl font-bold text-primary mb-1">~280ms</div>
              <div className="text-xs text-text-muted">Cache miss (live fetch)</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-white dark:bg-gray-900 text-center">
              <div className="text-2xl font-bold text-green mb-1">~5ms</div>
              <div className="text-xs text-text-muted">Cache hit</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-white dark:bg-gray-900 text-center">
              <div className="text-2xl font-bold text-secondary-gold mb-1">6 tools</div>
              <div className="text-xs text-text-muted">Independent cache TTLs</div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

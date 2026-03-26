import { useState } from "react";
import Section from "@/components/layout/section";
import CodeBlock from "@/components/code-block";
import { SITE, PAGE_META, TOOL_CARDS } from "@/lib/content";
import { useSeo } from "@/hooks/use-seo";
import { cn } from "@/lib/utils";

type Tab = "claude" | "chatgpt" | "generic";

const TABS: { id: Tab; label: string }[] = [
  { id: "claude", label: "Claude Desktop" },
  { id: "chatgpt", label: "ChatGPT" },
  { id: "generic", label: "curl / HTTP" },
];

export function Component() {
  useSeo(PAGE_META.docs);
  const [activeTab, setActiveTab] = useState<Tab>("claude");

  return (
    <>
      <Section
        title="Getting Started"
        subtitle="Connect MileSplit MCP to your AI assistant or query the endpoint directly."
      >
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Tab bar */}
          <div id="setup" className="flex gap-1 p-1 bg-bg-secondary dark:bg-gray-800 rounded-lg">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  activeTab === tab.id
                    ? "bg-white dark:bg-gray-900 text-text shadow-sm"
                    : "text-text-secondary hover:text-text"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Claude Desktop setup */}
          {activeTab === "claude" && (
            <div>
              <h3 className="text-lg font-semibold text-text mb-3">Claude Desktop (stdio)</h3>
              <p className="text-sm text-text-secondary mb-4">
                Add this to your <code className="font-mono text-xs bg-bg-secondary dark:bg-gray-800 px-1.5 py-0.5 rounded">claude_desktop_config.json</code>:
              </p>
              <CodeBlock label="claude_desktop_config.json">{`{
  "mcpServers": {
    "milesplit": {
      "command": "node",
      "args": [
        "/path/to/milesplit-mcp/server/dist/index.js"
      ]
    }
  }
}`}</CodeBlock>
              <p className="text-xs text-text-muted mt-3">
                Replace <code className="font-mono">/path/to/</code> with the actual path to your cloned repo.
                Restart Claude Desktop after saving.
              </p>
            </div>
          )}

          {/* ChatGPT setup */}
          {activeTab === "chatgpt" && (
            <div>
              <h3 className="text-lg font-semibold text-text mb-3">ChatGPT (HTTP+SSE)</h3>
              <ol className="space-y-3 text-sm text-text-secondary">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">1</span>
                  <span>Enable <strong>Developer Mode</strong> in ChatGPT Settings</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">2</span>
                  <span>Click the MCP tools icon and add a new server</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">3</span>
                  <span>
                    Enter: <code className="font-mono text-xs bg-bg-secondary dark:bg-gray-800 px-1.5 py-0.5 rounded">{SITE.mcpUrl}</code>
                  </span>
                </li>
              </ol>
              <p className="text-xs text-text-muted mt-4">
                That's it — ChatGPT will automatically discover all 6 MileSplit tools.
              </p>
            </div>
          )}

          {/* Generic / curl setup */}
          {activeTab === "generic" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-text mb-3">Direct API Access</h3>
                <p className="text-sm text-text-secondary mb-4">
                  The MCP endpoint accepts standard JSON-RPC 2.0 requests over HTTP.
                </p>

                <h4 className="text-sm font-medium text-text mb-2">List available tools</h4>
                <CodeBlock label="curl — local">{`curl -X POST ${SITE.mcpUrlLocal} \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json, text/event-stream" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list"
  }'`}</CodeBlock>
                <CodeBlock label="curl — deployed" className="mt-3">{`curl -X POST ${SITE.mcpUrl} \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json, text/event-stream" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list"
  }'`}</CodeBlock>
              </div>

              <div>
                <h4 className="text-sm font-medium text-text mb-2">Search athletes</h4>
                <CodeBlock label="curl — local">{`curl -X POST ${SITE.mcpUrlLocal} \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json, text/event-stream" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "search_athletes",
      "arguments": {
        "query": "Sydney McLaughlin",
        "state": "NJ"
      }
    }
  }'`}</CodeBlock>
                <CodeBlock label="curl — deployed" className="mt-3">{`curl -X POST ${SITE.mcpUrl} \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json, text/event-stream" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "search_athletes",
      "arguments": {
        "query": "Sydney McLaughlin",
        "state": "NJ"
      }
    }
  }'`}</CodeBlock>
              </div>
            </div>
          )}

          {/* Available tools table */}
          <div>
            <h3 className="text-lg font-semibold text-text mb-3">Available Tools</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-2 pr-4 font-medium text-text-muted">Tool</th>
                    <th className="pb-2 font-medium text-text-muted">Description</th>
                  </tr>
                </thead>
                <tbody className="text-text-secondary">
                  {TOOL_CARDS.map((tool, i) => (
                    <tr key={tool.name} className={i < TOOL_CARDS.length - 1 ? "border-b border-border/50" : ""}>
                      <td className="py-2 pr-4"><code className="font-mono text-xs">{tool.name}</code></td>
                      <td className="py-2">{tool.shortDescription}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Source code */}
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-text-muted">
              Full source code and local setup instructions:{" "}
              <a
                href={SITE.repo}
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/swa34/milesplit-mcp
              </a>
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

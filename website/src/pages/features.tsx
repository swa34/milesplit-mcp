import { motion } from "motion/react";
import { TOOL_CARDS, PAGE_META } from "@/lib/content";
import Section from "@/components/layout/section";
import CodeBlock from "@/components/code-block";
import { useSeo } from "@/hooks/use-seo";

function ToolSection({
  tool,
  index,
}: {
  tool: (typeof TOOL_CARDS)[number];
  index: number;
}) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
    >
      {/* Text content */}
      <div className={!isEven ? "lg:order-2" : ""}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center text-primary font-mono text-sm font-bold">
            {index + 1}
          </div>
          <div>
            <h3 className="text-xl font-bold text-text">{tool.title}</h3>
            <code className="text-xs font-mono text-text-muted">{tool.name}</code>
          </div>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed mb-4">
          {tool.longDescription}
        </p>
      </div>

      {/* Code example */}
      <div className={!isEven ? "lg:order-1" : ""}>
        <CodeBlock label="MCP Tool Call">{tool.example}</CodeBlock>
      </div>
    </motion.div>
  );
}

export function Component() {
  useSeo(PAGE_META.features);

  return (
    <>
      <Section
        title="MCP Tools"
        subtitle="Six tools that give AI assistants complete access to MileSplit's track & field data."
      >
        <div className="flex flex-col gap-16">
          {TOOL_CARDS.map((tool, i) => (
            <ToolSection key={tool.name} tool={tool} index={i} />
          ))}
        </div>
      </Section>

      {/* How tools connect */}
      <Section
        title="How Tools Work Together"
        subtitle="A typical workflow chains search, profile lookup, and rankings."
        variant="alt"
      >
        <div className="max-w-2xl mx-auto">
          <CodeBlock label="Typical Workflow">{`// 1. Search for an athlete
search_athletes({ query: "Sydney McLaughlin", state: "NJ" })
// Returns athlete profiles with URLs

// 2. Get detailed profile
get_athlete_details({ athlete_url: "https://..." })
// Returns PRs, event history, school info

// 3. Check rankings
get_rankings({
  event: "400m Hurdles",
  gender: "female",
  season: "Outdoor"
})
// Returns national/state ranking lists

// 4. Find upcoming meets
search_meets({ query: "State Championships", state: "NJ" })
// Returns meet info with result links`}</CodeBlock>
        </div>
      </Section>
    </>
  );
}

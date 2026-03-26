import Section from "@/components/layout/section";
import TerminalDemo from "@/components/hero/terminal-demo";
import { PAGE_META } from "@/lib/content";
import { useSeo } from "@/hooks/use-seo";

export function Component() {
  useSeo(PAGE_META.demo);

  return (
    <Section
      title="Live Demo"
      subtitle="Watch MileSplit MCP tools in action — searching athletes and pulling rankings in real time."
    >
      <TerminalDemo />
      <p className="text-center text-sm text-text-muted mt-8 max-w-md mx-auto">
        This is a simulated demo showing actual tool call syntax and response formats.
        Connect to the real server to query live data.
      </p>
    </Section>
  );
}

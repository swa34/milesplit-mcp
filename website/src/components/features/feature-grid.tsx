import { FEATURE_HIGHLIGHTS } from "@/lib/content";
import FeatureCard from "./feature-card";
import Section from "@/components/layout/section";

export default function FeatureGrid() {
  return (
    <Section
      title="Built for Track & Field"
      subtitle="Six MCP tools that give AI assistants complete access to MileSplit's track & field data."
      variant="alt"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURE_HIGHLIGHTS.map((feature, i) => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            description={feature.description}
            index={i}
          />
        ))}
      </div>
    </Section>
  );
}

import { Link } from "react-router";
import Hero from "@/components/hero/hero";
import FeatureGrid from "@/components/features/feature-grid";
import ArchitectureDiagram from "@/components/architecture/architecture-diagram";
import PlatformGrid from "@/components/platforms/platform-grid";
import Section from "@/components/layout/section";
import { SITE, PAGE_META } from "@/lib/content";
import { useSeo } from "@/hooks/use-seo";

export function Component() {
  useSeo(PAGE_META.home);

  return (
    <>
      <Hero />
      <FeatureGrid />

      <Section
        title="How It Works"
        subtitle="From user prompt to structured track & field data in milliseconds."
      >
        <ArchitectureDiagram />
      </Section>

      <PlatformGrid />

      {/* Final CTA */}
      <Section variant="alt">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
            Ready to hit the track?
          </h2>
          <p className="text-lg text-text-secondary mb-8 max-w-xl mx-auto">
            Connect MileSplit MCP to your AI assistant and start querying track & field data in seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={SITE.docsSetupUrl}
              className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-white bg-primary rounded-lg hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
            <a
              href={SITE.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-text border border-border rounded-lg hover:bg-bg-secondary transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}

import { motion } from "motion/react";
import {
  Bot,
  MessageCircle,
  Sparkles,
  Code,
  Wind,
  Plug,
} from "lucide-react";
import { PLATFORM_CARDS } from "@/lib/content";
import Section from "@/components/layout/section";

const ICON_MAP: Record<string, typeof Bot> = {
  bot: Bot,
  "message-circle": MessageCircle,
  sparkles: Sparkles,
  code: Code,
  wind: Wind,
  plug: Plug,
};

export default function PlatformGrid() {
  return (
    <Section
      title="Works Everywhere"
      subtitle="One MCP server, every AI platform. Connect via stdio for local use or HTTP+SSE for remote access."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PLATFORM_CARDS.map((platform, i) => {
          const Icon = ICON_MAP[platform.icon] ?? Plug;
          return (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-6 rounded-xl border border-border bg-white dark:bg-gray-900 hover:shadow-lg hover:border-primary/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center text-primary">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-text">{platform.name}</h3>
                  <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-bg-tertiary text-text-muted">
                    {platform.setupType}
                  </span>
                </div>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {platform.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}

import { motion } from "motion/react";
import { ARCHITECTURE_STEPS } from "@/lib/content";

export default function ArchitectureDiagram() {
  return (
    <div className="flex flex-col items-center gap-0">
      {ARCHITECTURE_STEPS.map((step, i) => (
        <motion.div
          key={step.label}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          className="w-full max-w-lg"
        >
          <div className="flex items-start gap-4 py-4">
            {/* Step number */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
              {i + 1}
            </div>
            <div>
              <h4 className="text-base font-semibold text-text">{step.label}</h4>
              <p className="text-sm text-text-secondary">{step.description}</p>
            </div>
          </div>
          {/* Connector line */}
          {i < ARCHITECTURE_STEPS.length - 1 && (
            <div className="ml-4 w-px h-6 bg-border" />
          )}
        </motion.div>
      ))}
    </div>
  );
}

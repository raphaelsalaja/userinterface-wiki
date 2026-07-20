import fs from "node:fs";
import path from "node:path";
import { type GeneratedFile, Generator } from "../../lib/generator-base";

const RULES_DIR = path.join(process.cwd(), "skills", "rules");
const SKILLS_DIR = path.join(process.cwd(), "skills");

interface SectionDefinition {
  name: string;
  impact: string;
  prefixes: string[];
}

interface TopicDefinition {
  id: string;
  title: string;
  description: string;
  sections: SectionDefinition[];
}

/**
 * Per-topic skills assembled from the same `skills/rules/` source as the
 * unified skill. Rules stay single-sourced; these are focused views.
 * Section prefixes mirror `skills/rules/_sections.md`.
 */
const TOPICS: TopicDefinition[] = [
  {
    id: "animation",
    title: "Animation",
    description:
      "Web animation best practices: Disney's principles, timing functions, exit animations, morphing icons, and container animation. Use when writing or reviewing motion code (CSS transitions, Motion/Framer Motion).",
    sections: [
      {
        name: "Animation Principles",
        impact: "CRITICAL",
        prefixes: ["timing", "physics", "staging"],
      },
      {
        name: "Timing Functions",
        impact: "HIGH",
        prefixes: ["spring", "easing", "duration", "none"],
      },
      {
        name: "Exit Animations",
        impact: "HIGH",
        prefixes: ["exit", "presence", "mode", "nested"],
      },
      {
        name: "Morphing Icons",
        impact: "LOW",
        prefixes: ["morphing"],
      },
      {
        name: "Container Animation",
        impact: "MEDIUM",
        prefixes: ["container"],
      },
    ],
  },
  {
    id: "sound",
    title: "Sound",
    description:
      "UI audio best practices: when sound is appropriate, accessibility requirements, and Web Audio API synthesis patterns. Use when adding audio feedback or procedural sound to interfaces.",
    sections: [
      {
        name: "Audio Feedback",
        impact: "MEDIUM",
        prefixes: ["a11y", "appropriate", "impl", "weight"],
      },
      {
        name: "Sound Synthesis",
        impact: "MEDIUM",
        prefixes: ["context", "envelope", "design", "param"],
      },
    ],
  },
  {
    id: "typography",
    title: "Typography",
    description:
      "CSS typography best practices: OpenType features, numeric variants, variable fonts, text wrapping, and rendering controls. Use when styling text or reviewing font-related CSS.",
    sections: [
      {
        name: "Typography",
        impact: "MEDIUM",
        prefixes: ["type"],
      },
    ],
  },
  {
    id: "ux",
    title: "UX",
    description:
      "Psychology-backed UX rules: Laws of UX (Fitts, Hick, Miller, Doherty, Postel) and predictive prefetching. Use when designing interactions, reviewing flows, or optimizing perceived performance.",
    sections: [
      {
        name: "Laws of UX",
        impact: "HIGH",
        prefixes: ["ux"],
      },
      {
        name: "Predictive Prefetching",
        impact: "MEDIUM",
        prefixes: ["prefetch"],
      },
    ],
  },
];

interface Rule {
  id: string;
  title: string;
  body: string;
}

function parseRule(filePath: string): Rule {
  const raw = fs.readFileSync(filePath, "utf-8");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  const frontmatter = match?.[1] ?? "";
  const body = match ? raw.slice(match[0].length).trim() : raw.trim();

  const title =
    frontmatter.match(/^title:\s*(.+)$/m)?.[1]?.trim() ??
    path.basename(filePath, ".md");

  return { id: path.basename(filePath, ".md"), title, body };
}

/** One-line summary: first prose paragraph after the rule heading. */
function summarize(rule: Rule): string {
  const withoutHeading = rule.body.replace(/^##\s.+$/m, "").trim();
  const firstParagraph = withoutHeading.split(/\n\n/)[0] ?? "";
  return firstParagraph.replace(/\s+/g, " ").trim();
}

export class SkillsGenerator extends Generator {
  constructor() {
    super({ name: "skills", label: "Per-Topic Skills" });
  }

  protected async generate(): Promise<GeneratedFile[]> {
    const ruleFiles = fs
      .readdirSync(RULES_DIR)
      .filter((file) => file.endsWith(".md") && !file.startsWith("_"))
      .sort();

    const rules = ruleFiles.map((file) =>
      parseRule(path.join(RULES_DIR, file)),
    );

    const byPrefix = (prefixes: string[]) =>
      rules.filter((rule) =>
        prefixes.some((prefix) => rule.id.startsWith(`${prefix}-`)),
      );

    const files: GeneratedFile[] = [];

    for (const topic of TOPICS) {
      const dir = path.join(SKILLS_DIR, topic.id);
      fs.mkdirSync(dir, { recursive: true });

      const sections = topic.sections
        .map((section) => ({
          ...section,
          rules: byPrefix(section.prefixes),
        }))
        .filter((section) => section.rules.length > 0);

      const ruleCount = sections.reduce(
        (total, section) => total + section.rules.length,
        0,
      );

      const skillMd = [
        "---",
        `name: userinterface-wiki-${topic.id}`,
        `description: "${topic.description.replace(/"/g, '\\"')}"`,
        "license: MIT",
        "metadata:",
        "  author: raphael-salaja",
        "  source: https://github.com/raphaelsalaja/userinterface-wiki",
        "---",
        "",
        `# User Interface Wiki — ${topic.title}`,
        "",
        `${ruleCount} focused rules extracted from the unified userinterface-wiki skill. See AGENTS.md in this directory for every rule expanded with code examples.`,
        "",
        ...sections.flatMap((section) => [
          `## ${section.name} — ${section.impact}`,
          "",
          ...section.rules.map(
            (rule) => `- \`${rule.id}\` — ${summarize(rule)}`,
          ),
          "",
        ]),
      ].join("\n");

      const agentsMd = [
        `# User Interface Wiki — ${topic.title}`,
        "",
        "> Generated from `skills/rules/` — do not edit by hand.",
        `> ${ruleCount} rules. Part of [userinterface-wiki](https://github.com/raphaelsalaja/userinterface-wiki).`,
        "",
        ...sections.flatMap((section) => [
          `## ${section.name}`,
          "",
          `**Impact:** ${section.impact}`,
          "",
          ...section.rules.map(
            (rule) => `${rule.body.replace(/^##\s/gm, "### ")}\n`,
          ),
        ]),
      ].join("\n");

      const skillPath = path.join(dir, "SKILL.md");
      const agentsPath = path.join(dir, "AGENTS.md");
      fs.writeFileSync(skillPath, `${skillMd.trimEnd()}\n`);
      fs.writeFileSync(agentsPath, `${agentsMd.trimEnd()}\n`);

      files.push(
        {
          name: `${topic.id}/SKILL.md`,
          path: skillPath,
          size: fs.statSync(skillPath).size,
        },
        {
          name: `${topic.id}/AGENTS.md`,
          path: agentsPath,
          size: fs.statSync(agentsPath).size,
        },
      );
    }

    return files;
  }
}

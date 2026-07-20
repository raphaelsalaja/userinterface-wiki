/**
 * The Vault — curated external resources surfaced at /vault.
 * Topics mirror the section taxonomy in `lib/sections.ts`.
 */

export type VaultType = "video" | "article" | "talk" | "book" | "tool";

export type VaultTopic = "motion" | "sound" | "craft" | "experience";

export interface VaultResource {
  title: string;
  url: string;
  /** Who made it / where it lives, e.g. "Josh W. Comeau". */
  source: string;
  type: VaultType;
  topics: VaultTopic[];
  /** One sentence on why it's worth the reader's time. */
  note: string;
}

export const VAULT_RESOURCES: VaultResource[] = [
  {
    title: "The Illusion of Life: Disney Animation",
    url: "https://en.wikipedia.org/wiki/The_Illusion_of_Life",
    source: "Frank Thomas & Ollie Johnston",
    type: "book",
    topics: ["motion"],
    note: "The origin of the 12 principles — still the best mental model for why motion feels alive.",
  },
  {
    title: "Animate with Springs",
    url: "https://developer.apple.com/videos/play/wwdc2023/10158",
    source: "Apple WWDC23",
    type: "talk",
    topics: ["motion"],
    note: "Apple's definitive explanation of spring parameters and why springs beat durations for gestures.",
  },
  {
    title: "The Beauty of Bézier Curves",
    url: "https://www.youtube.com/watch?v=aVwxzDHniEw",
    source: "Freya Holmér",
    type: "video",
    topics: ["motion"],
    note: "The math behind every easing curve you've ever used, explained visually.",
  },
  {
    title: "Motion Documentation",
    url: "https://motion.dev",
    source: "Motion",
    type: "tool",
    topics: ["motion"],
    note: "The animation library this wiki's demos are built on — springs, layout animation, AnimatePresence.",
  },
  {
    title: "Designing Beautiful Shadows in CSS",
    url: "https://www.joshwcomeau.com/css/designing-shadows/",
    source: "Josh W. Comeau",
    type: "article",
    topics: ["craft"],
    note: "Layered shadows, consistent light sources, and color-matched shadows, interactively explained.",
  },
  {
    title: "Concentric Border Radius",
    url: "https://jakub.kr/work/concentric-border-radius",
    source: "Jakub Krehel",
    type: "article",
    topics: ["craft"],
    note: "Why nested rounded corners look wrong with equal radii, and the one calc that fixes them.",
  },
  {
    title: "Inter Typeface",
    url: "https://rsms.me/inter/",
    source: "Rasmus Andersson",
    type: "tool",
    topics: ["craft"],
    note: "The variable font this site is set in, with a showcase of the OpenType features worth enabling.",
  },
  {
    title: "Laws of UX",
    url: "https://lawsofux.com/",
    source: "Jon Yablonski",
    type: "article",
    topics: ["experience"],
    note: "Every psychological principle behind interfaces that feel right, each on one beautiful page.",
  },
  {
    title: "Web Audio API Documentation",
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API",
    source: "MDN",
    type: "article",
    topics: ["sound"],
    note: "The reference for procedural UI sound — oscillators, gain envelopes, and filters.",
  },
  {
    title: "Emil Kowalski's Blog",
    url: "https://emilkowal.ski/",
    source: "Emil Kowalski",
    type: "article",
    topics: ["motion", "craft"],
    note: "Essays on animation timing, easings, and interaction details from the author of Sonner and Vaul.",
  },
  {
    title: "Making Software",
    url: "https://www.makingsoftware.com/",
    source: "Dan Hollick",
    type: "book",
    topics: ["craft", "experience"],
    note: "A visual reference manual explaining how the software you use every day actually works.",
  },
  {
    title: "Animations.dev",
    url: "https://animations.dev/",
    source: "Emil Kowalski",
    type: "video",
    topics: ["motion"],
    note: "A learn-by-building course on web animation — the model for this wiki's exercises.",
  },
  {
    title: "ForesightJS",
    url: "https://foresightjs.com",
    source: "ForesightJS",
    type: "tool",
    topics: ["experience"],
    note: "Cursor-trajectory prediction for prefetching, as covered in Predictive Prefetching.",
  },
  {
    title: "View Transitions API",
    url: "https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API",
    source: "MDN",
    type: "article",
    topics: ["motion", "craft"],
    note: "Native page and element transitions without an animation library.",
  },
];

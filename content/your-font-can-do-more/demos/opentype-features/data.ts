export interface Feature {
  tag: string;
  name: string;
  sample: string;
}

export interface FeatureGroup {
  id: string;
  label: string;
  sample: string;
  features: Feature[];
}

export const GROUPS: FeatureGroup[] = [
  {
    id: "ligatures",
    label: "Ligatures",
    sample: "3*9 12:34 -> --> ==> ff fi ft fjord",
    features: [
      { tag: "calt", name: "Contextual Alternates", sample: "3*9 12:34 -> --> ==>" },
      { tag: "dlig", name: "Discretionary Ligatures", sample: "Difficult affine fjord ff fi ft" },
    ],
  },
  {
    id: "numbers",
    label: "Numbers",
    sample: "0123456789  1/3 5/12  1,234,567,890",
    features: [
      { tag: "tnum", name: "Tabular Nums", sample: "0.45  0.91  1.00  9.44" },
      { tag: "frac", name: "Fractions", sample: "1/3 5/12 0123/456789" },
      { tag: "zero", name: "Slashed Zero", sample: "O0 l1I 0123456789" },
      { tag: "ss01", name: "Alternate Digits", sample: "1234567890" },
      { tag: "cv01", name: "Alt 1", sample: "1 11 111 1,111" },
      { tag: "cv02", name: "Open 4", sample: "4 44 444 4,444" },
      { tag: "cv03", name: "Open 6", sample: "6 66 666 6,666" },
      { tag: "cv04", name: "Open 9", sample: "9 99 999 9,999" },
      { tag: "cv09", name: "Flat-top 3", sample: "3 33 333 3,333" },
    ],
  },
  {
    id: "letters",
    label: "Letters",
    sample: "Illegal llama Illinois Glyph anatomy Efficient Stuttgart",
    features: [
      { tag: "ss02", name: "Disambiguation", sample: "WP0ACO9XSI1012O9 Illegal" },
      { tag: "cv05", name: "Tail l", sample: "Illegal llama Illusion" },
      { tag: "cv08", name: "Serif I", sample: "Illinois ILLICIT Identity" },
      { tag: "cv10", name: "Spur G", sample: "Guillable Glyph Graphic" },
      { tag: "cv11", name: "Single-story a", sample: "anatomy alpha character" },
      { tag: "cv12", name: "Compact f", sample: "Efficient after affine" },
      { tag: "cv13", name: "Compact t", sample: "Stuttgart attraction at" },
    ],
  },
  {
    id: "punctuation",
    label: "Punctuation",
    sample: "(Hello) [World] {9000} 'quoted' \"smol\" A@B .!?",
    features: [
      { tag: "case", name: "Case Alternates", sample: "(Hello) [World] {9000} A@B" },
      { tag: "ss03", name: "Round Quotes", sample: "I'm not, uhm \"smol\"" },
      { tag: "ss07", name: "Square Punct.", sample: "Hello, Mästare.!?" },
      { tag: "ss08", name: "Square Quotes", sample: "I'm not, uhm \"smol\"" },
    ],
  },
  {
    id: "position",
    label: "Position",
    sample: "H2O CO2 x2 1st 2nd 3rd 4th ABC123",
    features: [
      { tag: "sups", name: "Superscript", sample: "ABC123abc (+)=[−]" },
      { tag: "subs", name: "Subscript", sample: "H2O SF6 H2SO4" },
      { tag: "ordn", name: "Ordinals", sample: "1st 2nd 3rd 4th" },
    ],
  },
];

export const ALL_FEATURES = GROUPS.flatMap((g) => g.features);

export const DEFAULT_ON = new Set(["calt"]);

export function buildSettings(enabled: Set<string>, features: Feature[]) {
  return features.map((f) => `"${f.tag}" ${enabled.has(f.tag) ? 1 : 0}`).join(", ");
}

export function buildAllSettings(enabled: Set<string>) {
  return ALL_FEATURES.map((f) => `"${f.tag}" ${enabled.has(f.tag) ? 1 : 0}`).join(", ");
}

export function settingsOutput(enabled: Set<string>) {
  const active = ALL_FEATURES.filter((f) => enabled.has(f.tag));
  if (active.length === 0) return "font-feature-settings: normal;";
  return `font-feature-settings: ${active.map((f) => `"${f.tag}"`).join(", ")};`;
}

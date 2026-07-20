import type { IconProps } from "@/icons/types";

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

type Fill =
  | "var(--blue-9)"
  | "var(--blue-6)"
  | "var(--amber-9)"
  | "var(--gray-8)"
  | "var(--gray-6)";

type Rect = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rx: number;
  fill: string;
};

const Y_POSITIONS = [
  7, 11.25, 15.5, 19.75, 24, 28.25, 32.5, 36.75, 41,
] as const;
const TOKEN_HEIGHT = 2;
const TOKEN_RX = 1;
const GUTTER_X = 5;

function pick<T>(rng: () => number, arr: readonly T[]) {
  return arr[Math.floor(rng() * arr.length)];
}

function maybe(rng: () => number, p: number) {
  return rng() < p;
}

function generateRects(seedStr: string) {
  const rng = mulberry32(hashSeed(seedStr));
  const rects: Rect[] = [];

  // Palette: mostly gray, some blue/amber
  const fills: Fill[] = [
    "var(--gray-8)",
    "var(--gray-8)",
    "var(--gray-8)",
    "var(--blue-9)",
    "var(--amber-9)",
    "var(--blue-6)",
  ];

  // "Code-like" token shapes (x positions and widths based on your original)
  const shapes = [
    // keyword + ident + literal
    () => [
      { x: 9, w: 4 },
      { x: 15, w: 6 },
      { x: 23, w: 3 },
      { x: 28, w: 6 },
    ],
    // keyword + ident
    () => [
      { x: 9, w: 4 },
      { x: 15, w: 6 },
    ],
    // indented tokens (mid-column)
    () => [
      { x: 15, w: 8 },
      { x: 25, w: 10 },
    ],
    // single long token
    () => [{ x: 15, w: 12 }],
    // 3 tokens staggered
    () => [
      { x: 9, w: 4 },
      { x: 15, w: 6 },
      { x: 23, w: 2 },
    ],
    // function call style
    () => [
      { x: 9, w: 4 },
      { x: 15, w: 6 },
      { x: 23, w: 2 },
      { x: 27, w: 2 },
      { x: 31, w: 4 },
    ],
    // short indent line
    () => [
      { x: 15, w: 6 },
      { x: 23, w: 9 },
    ],
  ] as const;

  for (const y of Y_POSITIONS) {
    // Gutter dots: keep style but allow skipping some
    if (maybe(rng, 0.85)) {
      rects.push({
        id: `gutter-${y}`,
        x: GUTTER_X,
        y,
        w: 2,
        h: 2,
        rx: 1,
        fill: "var(--gray-6)",
      });
    }

    // Don't fill every line: leave some sparse like your original
    if (!maybe(rng, 0.65)) continue;

    const shape = pick(rng, shapes)();

    for (const t of shape) {
      // Color discipline: bias first token to blue, literals to amber
      let fill: Fill = pick(rng, fills);

      if (t.x === 9 && maybe(rng, 0.55)) fill = "var(--blue-9)";
      if (t.w >= 9 && maybe(rng, 0.45)) fill = "var(--amber-9)";
      if (t.w <= 3 && maybe(rng, 0.5)) fill = "var(--blue-9)";

      rects.push({
        id: `token-${y}-${t.x}`,
        x: t.x,
        y,
        w: t.w,
        h: TOKEN_HEIGHT,
        rx: TOKEN_RX,
        fill,
      });
    }
  }

  return rects;
}

interface CodePreviewIconProps extends IconProps {
  seed?: string;
}

export const CodePreview = ({
  size = 40,
  seed = "code-1",
  ...props
}: CodePreviewIconProps) => {
  const rects = generateRects(seed);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={Number(size) * 1.25}
      viewBox="0 0 40 50"
      fill="none"
      {...props}
    >
      <title>Code Preview</title>
      <rect width="38" height="48" x="1" y="1" fill="var(--gray-2)" rx="2" />
      <rect
        width="39"
        height="49"
        x=".5"
        y=".5"
        stroke="var(--gray-a4)"
        rx="2.5"
      />
      {rects.map((r) => (
        <rect
          key={r.id}
          x={r.x}
          y={r.y}
          width={r.w}
          height={r.h}
          rx={r.rx}
          fill={r.fill}
        />
      ))}
    </svg>
  );
};

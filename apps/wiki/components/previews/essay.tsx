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

function rBetween(rng: () => number, a: number, b: number) {
  return a + (b - a) * rng();
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

const Y_POSITIONS = [7, 15.5, 19.75, 28.25, 32.5, 36.75] as const;

interface EssayPreviewIconProps extends IconProps {
  seed?: string;
}

export const EssayPreview = ({
  size = 40,
  seed = "essay-1",
  ...props
}: EssayPreviewIconProps) => {
  const rng = mulberry32(hashSeed(seed));

  const x = 7;
  const h = 2;
  const rx = 1;

  // Width constraints (tuned to your original)
  // Title line: shorter
  const titleW = Math.round(rBetween(rng, 8, 13));

  // Body cluster 1
  const w1 = Math.round(rBetween(rng, 16, 24));
  const w2 = clamp(Math.round(w1 * rBetween(rng, 0.55, 0.85)), 10, 22);

  // Body cluster 2
  const w3 = Math.round(rBetween(rng, 13, 20));
  const w4 = clamp(Math.round(w3 * rBetween(rng, 0.65, 0.95)), 9, 20);
  const w5 = Math.round(rBetween(rng, 7, 12));

  const widths = [titleW, w1, w2, w3, w4, w5];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={Number(size) * 1.25}
      viewBox="0 0 40 50"
      fill="none"
      {...props}
    >
      <title>Essay Preview</title>
      <rect width="38" height="48" x="1" y="1" fill="var(--gray-2)" rx="2" />
      <rect
        width="39"
        height="49"
        x=".5"
        y=".5"
        stroke="var(--gray-a4)"
        rx="2.5"
      />
      {Y_POSITIONS.map((yy, i) => (
        <rect
          key={`line-${yy}`}
          width={widths[i]}
          height={h}
          x={x}
          y={yy}
          fill="var(--gray-6)"
          rx={rx}
        />
      ))}
    </svg>
  );
};

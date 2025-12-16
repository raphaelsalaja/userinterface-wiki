import ColorHash from "color-hash";

/**
 * Generates two complementary hex colors from a string (e.g., title or slug).
 * Uses different hue offsets to create visually distinct but harmonious colors.
 */
export function getGradientColors(value: string): [string, string] {
  const primary = new ColorHash({
    saturation: 0.55,
    lightness: 0.55,
  }).hex(value);

  const secondary = new ColorHash({
    saturation: 0.5,
    lightness: 0.65,
    hue: { min: 180, max: 360 },
  }).hex(`${value}-secondary`);

  return [primary, secondary];
}

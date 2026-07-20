/**
 * Sponsors — data-driven and manual to start (no GitHub API sync).
 * Surfaced at /sponsors and as a compact strip on the home page.
 */

export type SponsorTier = "gold" | "silver" | "supporter";

export interface Sponsor {
  name: string;
  url: string;
  /** Path under /public, e.g. "/sponsors/acme.svg". Optional for supporters. */
  logo?: string;
  tier: SponsorTier;
}

export const SPONSOR_CTA_URL = "https://buymeacoffee.com/raphaelsalaja";

export const TIER_LABELS: Record<SponsorTier, string> = {
  gold: "Gold",
  silver: "Silver",
  supporter: "Supporters",
};

export const TIER_ORDER: SponsorTier[] = ["gold", "silver", "supporter"];

export const SPONSORS: Sponsor[] = [];

export function getSponsorsByTier(): {
  tier: SponsorTier;
  sponsors: Sponsor[];
}[] {
  return TIER_ORDER.map((tier) => ({
    tier,
    sponsors: SPONSORS.filter((sponsor) => sponsor.tier === tier),
  }));
}

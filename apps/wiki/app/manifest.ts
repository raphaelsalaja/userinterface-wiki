import type { MetadataRoute } from "next";
import { SITE_MANIFEST } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return SITE_MANIFEST;
}

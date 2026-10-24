import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { destinations } from "../src/data/destinations";
import { galleryAlbums, galleryPhotos } from "../src/data/gallery";
import { heroBadgeAvatars, heroMosaic } from "../src/data/hero-slides";
import { tours } from "../src/data/tours";
import { travelVideos } from "../src/data/videos";

const out = resolve("api/seed/content.json");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(
  out,
  JSON.stringify(
    {
      destinations,
      tours,
      videos: travelVideos,
      heroMosaic,
      heroBadgeAvatars: [...heroBadgeAvatars],
      galleryAlbums,
      galleryPhotos,
    },
    null,
    2,
  ),
);
console.log(out);

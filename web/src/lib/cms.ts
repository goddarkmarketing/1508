import { destinations as staticDestinations } from "@/data/destinations";
import {
  galleryAlbums as staticAlbums,
  galleryPhotos as staticPhotos,
  type GalleryAlbum,
  type GalleryPhoto,
} from "@/data/gallery";
import {
  heroBadgeAvatars,
  heroMosaic as staticHero,
  type HeroMosaicShot,
} from "@/data/hero-slides";
import { tours as staticTours } from "@/data/tours";
import { travelVideos as staticVideos, type TravelVideo } from "@/data/videos";
import type { Destination, TourPackage } from "@/types";

export type PublicContent = {
  destinations: Destination[];
  tours: TourPackage[];
  videos: TravelVideo[];
  heroMosaic: HeroMosaicShot[];
  heroBadgeAvatars: string[];
  galleryAlbums: GalleryAlbum[];
  galleryPhotos: GalleryPhoto[];
};

function staticContent(): PublicContent {
  return {
    destinations: staticDestinations,
    tours: staticTours,
    videos: staticVideos,
    heroMosaic: staticHero,
    heroBadgeAvatars: [...heroBadgeAvatars],
    galleryAlbums: staticAlbums,
    galleryPhotos: staticPhotos,
  };
}

function isContent(value: unknown): value is PublicContent {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<PublicContent>;
  return Array.isArray(data.destinations) && Array.isArray(data.tours);
}

export async function loadPublicContent(): Promise<PublicContent> {
  const base = process.env.CONTENT_API_URL?.replace(/\/$/, "");
  if (!base) return staticContent();
  try {
    const response = await fetch(`${base}/content/public`, {
      cache: process.env.NODE_ENV === "production" ? "force-cache" : "no-store",
    });
    if (!response.ok) return staticContent();
    const data: unknown = await response.json();
    if (!isContent(data)) return staticContent();
    return {
      destinations: data.destinations,
      tours: data.tours,
      videos: Array.isArray(data.videos) ? data.videos : staticVideos,
      heroMosaic:
        Array.isArray(data.heroMosaic) && data.heroMosaic.length >= 4
          ? data.heroMosaic
          : staticHero,
      heroBadgeAvatars: Array.isArray(data.heroBadgeAvatars)
        ? data.heroBadgeAvatars
        : [...heroBadgeAvatars],
      galleryAlbums: Array.isArray(data.galleryAlbums) ? data.galleryAlbums : staticAlbums,
      galleryPhotos: Array.isArray(data.galleryPhotos) ? data.galleryPhotos : staticPhotos,
    };
  } catch {
    return staticContent();
  }
}

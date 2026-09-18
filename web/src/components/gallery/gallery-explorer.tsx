"use client";

import { useMemo, useState } from "react";
import { SiteImage as Image } from "@/components/shared/site-image";
import {
  galleryAlbums,
  galleryMarkets,
  galleryPhotos,
  type GalleryMarket,
} from "@/data/gallery";
import { cn } from "@/lib/utils";

export function GalleryExplorer() {
  const [market, setMarket] = useState<GalleryMarket>("All");
  const [albumId, setAlbumId] = useState<string | null>(null);

  const albums = useMemo(
    () =>
      galleryAlbums.filter(
        (album) => market === "All" || album.market === market,
      ),
    [market],
  );

  const photos = useMemo(() => {
    const pool = galleryPhotos.filter(
      (photo) => market === "All" || photo.market === market,
    );
    if (!albumId) return pool;
    return pool.filter((photo) => photo.albumId === albumId);
  }, [market, albumId]);

  const activeAlbum = albumId
    ? galleryAlbums.find((album) => album.id === albumId)
    : null;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Market
          </p>
          <div className="flex flex-wrap gap-2">
            {galleryMarkets.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setMarket(item);
                  setAlbumId(null);
                }}
                className={cn(
                  "border px-3.5 py-1.5 text-sm font-medium transition",
                  market === item
                    ? "border-navy bg-navy text-white"
                    : "border-border bg-white text-navy hover:border-sky-300",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Album
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setAlbumId(null)}
              className={cn(
                "border px-3.5 py-1.5 text-sm font-medium transition",
                !albumId
                  ? "border-sky-600 bg-sky-600 text-white"
                  : "border-border bg-white text-navy hover:border-sky-300",
              )}
            >
              All albums
            </button>
            {albums.map((album) => (
              <button
                key={album.id}
                type="button"
                onClick={() => setAlbumId(album.id)}
                className={cn(
                  "border px-3.5 py-1.5 text-sm font-medium transition",
                  albumId === album.id
                    ? "border-sky-600 bg-sky-600 text-white"
                    : "border-border bg-white text-navy hover:border-sky-300",
                )}
              >
                {album.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-2 border-b border-border/70 pb-3">
        <div>
          <h2 className="text-lg font-semibold text-navy sm:text-xl">
            {activeAlbum ? activeAlbum.title : market === "All" ? "All photos" : `${market} photos`}
          </h2>
          {activeAlbum ? (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {activeAlbum.market} · {activeAlbum.dateLabel}
            </p>
          ) : (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {albums.length} album{albums.length === 1 ? "" : "s"} in this view
            </p>
          )}
        </div>
        <p className="text-sm font-medium text-navy/70">{photos.length} photos</p>
      </div>

      <div className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
        {photos.map((photo) => (
          <figure key={photo.src} className="mb-3 break-inside-avoid sm:mb-4">
            <div className="relative overflow-hidden bg-[#f3f6fa]">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                className="h-auto w-full object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
          </figure>
        ))}
      </div>

      {photos.length === 0 ? (
        <p className="text-sm text-muted-foreground">No photos in this filter.</p>
      ) : null}
    </div>
  );
}

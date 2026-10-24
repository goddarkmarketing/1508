"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import type { TravelVideo } from "@/data/videos";
import { cn } from "@/lib/utils";

function thumbnailUrl(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function VideoShowcase({ videos }: { videos: TravelVideo[] }) {
  const [activeId, setActiveId] = useState(videos[0]?.youtubeId ?? "");
  const [playing, setPlaying] = useState(false);

  const active = videos.find((v) => v.youtubeId === activeId) ?? videos[0];
  if (!active) return null;

  const select = (id: string) => {
    setActiveId(id);
    setPlaying(true);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-4 sm:space-y-5">
      <div>
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-navy shadow-sm">
          {playing ? (
            <iframe
              key={active.youtubeId}
              src={`https://www.youtube-nocookie.com/embed/${active.youtubeId}?autoplay=1&rel=0`}
              title={active.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 size-full"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group absolute inset-0 size-full"
              aria-label={`Play ${active.title}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnailUrl(active.youtubeId)}
                alt=""
                className="size-full object-cover transition duration-500 group-hover:scale-[1.02]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />
              <span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-white shadow-lg transition group-hover:scale-110 sm:size-20">
                <Play className="ml-1 size-7 fill-current sm:size-8" />
              </span>
              <span className="absolute bottom-4 left-4 text-left text-white sm:bottom-5 sm:left-5">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75">
                  {active.location}
                </span>
                <span className="mt-1 block text-lg font-semibold sm:text-xl">
                  {active.title}
                </span>
              </span>
            </button>
          )}
        </div>
      </div>

      <ul
        className={cn(
          "grid grid-cols-2 gap-3 sm:grid-cols-3",
          videos.length >= 5 && "lg:grid-cols-5",
        )}
      >
        {videos.map((video) => {
          const isActive = video.youtubeId === active.youtubeId;
          return (
            <li key={video.youtubeId}>
              <button
                type="button"
                onClick={() => select(video.youtubeId)}
                aria-pressed={isActive}
                className={cn(
                  "flex w-full flex-col gap-2 rounded-xl border bg-white p-2 text-left transition",
                  isActive
                    ? "border-primary/40 ring-2 ring-primary/15"
                    : "border-border hover:border-primary/30",
                )}
              >
                <span className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbnailUrl(video.youtubeId)}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-navy/20">
                    <Play className="size-5 fill-white text-white" />
                  </span>
                </span>
                <span className="min-w-0 px-1 pb-1">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                    {video.location}
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-sm font-semibold text-navy">
                    {video.title}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

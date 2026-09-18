"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import thailandMap from "@svg-maps/thailand";
import {
  ArrowRight,
  Compass,
  MapPin,
  Pause,
  Play,
  Sparkles,
  Sun,
} from "lucide-react";
import { SiteImage as Image } from "@/components/shared/site-image";
import { Button } from "@/components/ui/button";
import { computeMapFrame, getProvinceZone, mapZoneMeta, thailandMapPins, THAILAND_MAP_VIEWBOX, toMapFrameViewBox, toMapPercent, type MapFrame, type MapZone } from "@/data/thailand-map-pins";
import type { Destination } from "@/types";
import { withBasePath } from "@/lib/base-path";
import { cn } from "@/lib/utils";

type MapDestination = Destination & { tourCount: number };

const VIEWBOX = thailandMap.viewBox;
const AUTOPLAY_MS = 4500;

/** Shared map pin label card — fixed size, slight corner radius. */
const PIN_CARD_SIZE =
  "h-9 w-[7.5rem] overflow-hidden rounded-md border bg-white p-1 shadow-md max-sm:h-7 max-sm:w-[5.25rem] max-sm:gap-1 max-sm:p-0.5 max-sm:shadow-sm";
const PIN_IMAGE_SIZE =
  "size-7 shrink-0 rounded-sm object-cover max-sm:size-4";
const PIN_LABEL_SIZE =
  "truncate text-[10px] font-semibold leading-tight text-primary max-sm:text-[8px] max-sm:leading-none";

const travelTips = [
  "Best season: Nov – Feb for cool, dry weather",
  "Combine Bangkok + nearby provinces for FIT programs",
  "Muslim-friendly meal options available on request",
  "Private van transfers from BKK airport to all pins",
];

type MapPin = (typeof thailandMapPins)[number] & {
  destination: MapDestination;
};

const DESKTOP_FRAME: MapFrame = {
  minX: 0,
  minY: 0,
  width: THAILAND_MAP_VIEWBOX.width,
  height: THAILAND_MAP_VIEWBOX.height,
};

function MapPinMarker({
  pin,
  isActive,
  onSelect,
  frame,
  compact,
  showCard = true,
}: {
  pin: MapPin;
  isActive: boolean;
  onSelect: (slug: string) => void;
  frame: MapFrame;
  compact?: boolean;
  showCard?: boolean;
}) {
  const pinPos = toMapPercent(pin.x, pin.y, frame);
  const cardPos = toMapPercent(
    pin.x + pin.cardOffsetX,
    pin.y + pin.cardOffsetY,
    frame,
  );

  return (
    <>
      {showCard ? (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: pinPos.left, top: pinPos.top, zIndex: isActive ? 40 : 25 }}
          aria-hidden
        >
          {isActive ? (
            <span
              className={cn(
                "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-brand/30",
                compact ? "size-3" : "size-4",
              )}
            />
          ) : null}
          <span
            className={cn(
              "relative block rounded-full border-2 border-white bg-brand shadow-[0_2px_6px_rgba(193,39,45,0.5)]",
              compact ? "size-1.5" : "size-2.5",
            )}
          />
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => onSelect(pin.slug)}
        className={cn(
          "absolute -translate-x-1/2 -translate-y-1/2 transition-[z-index,opacity] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          isActive ? "z-[35] opacity-100" : "z-10 opacity-95 hover:z-30 hover:opacity-100",
        )}
        style={{ left: showCard ? cardPos.left : pinPos.left, top: showCard ? cardPos.top : pinPos.top }}
        aria-label={`${pin.destination.name}, ${pin.destination.tourCount} tours`}
        aria-pressed={isActive}
      >
        {showCard ? (
          <span
            className={cn(
              "flex items-center gap-1.5 backdrop-blur transition",
              PIN_CARD_SIZE,
              isActive
                ? "border-primary/40 ring-2 ring-brand/25 max-sm:ring-1"
                : "border-white/90",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={withBasePath(pin.destination.image)}
              alt=""
              className={PIN_IMAGE_SIZE}
            />
            <span className={cn(PIN_LABEL_SIZE, "min-w-0 flex-1 pr-1")}>
              {pin.destination.name}
            </span>
          </span>
        ) : (
          <span
            className={cn(
              "relative block rounded-full border-2 border-white bg-brand shadow-[0_2px_6px_rgba(193,39,45,0.5)]",
              isActive ? "size-2.5" : "size-2",
            )}
          />
        )}
      </button>
    </>
  );
}

export function ThailandTravelMap({
  destinations,
}: {
  destinations: MapDestination[];
}) {
  const destinationBySlug = useMemo(
    () => new Map(destinations.map((d) => [d.slug, d])),
    [destinations],
  );

  const pins = useMemo<MapPin[]>(
    () =>
      thailandMapPins.flatMap((pin) => {
        const destination = destinationBySlug.get(pin.slug);
        if (!destination) return [];
        return [{ ...pin, destination }];
      }),
    [destinationBySlug],
  );

  const [activeSlug, setActiveSlug] = useState<string>(pins[0]?.slug ?? "");
  const [autoplay, setAutoplay] = useState(true);
  // Always start false so SSR and first client render match; sync in useEffect.
  const [isMobile, setIsMobile] = useState(false);
  const [containerWidth, setContainerWidth] = useState(360);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const pauseUntilRef = useRef(0);

  const mapFrame = useMemo(() => {
    if (!isMobile) return DESKTOP_FRAME;
    return computeMapFrame(pins, containerWidth, true);
  }, [isMobile, pins, containerWidth]);

  const mapViewBox = toMapFrameViewBox(mapFrame);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const sync = () => setIsMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const node = mapContainerRef.current;
    if (!node) return;

    const updateWidth = () => {
      setContainerWidth(node.getBoundingClientRect().width || 360);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const activePin = pins.find((pin) => pin.slug === activeSlug) ?? pins[0];
  const activeDestination = activePin?.destination;

  const selectDestination = useCallback((slug: string) => {
    setActiveSlug(slug);
    pauseUntilRef.current = Date.now() + AUTOPLAY_MS * 2;
  }, []);

  useEffect(() => {
    if (!autoplay || pins.length < 2) return;

    const timer = window.setInterval(() => {
      if (Date.now() < pauseUntilRef.current) return;
      setActiveSlug((current) => {
        const index = pins.findIndex((pin) => pin.slug === current);
        const next = pins[(index + 1) % pins.length];
        return next?.slug ?? current;
      });
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [autoplay, pins]);

  if (!activeDestination || pins.length === 0) return null;

  return (
    <div
      className="relative overflow-visible"
      data-feedback-id="thailand-travel-map"
      data-feedback-label="Thailand travel map"
    >
      <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-8">
        <div className="relative w-full min-w-0 overflow-visible">
          <div
            ref={mapContainerRef}
            className="relative mx-auto w-full max-w-full overflow-visible sm:max-w-xl sm:px-6"
          >
          <div
            className="relative w-full overflow-visible"
            style={{ aspectRatio: `${mapFrame.width} / ${mapFrame.height}` }}
          >
            <svg
              viewBox={mapViewBox}
              className="absolute inset-0 h-full w-full drop-shadow-[0_12px_24px_rgba(0,51,102,0.12)]"
              role="img"
              aria-label="Interactive map of Thailand with destination pins"
            >
              <defs>
                <linearGradient id="land-active" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7dd3fc" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
                {(Object.keys(mapZoneMeta) as MapZone[]).map((zone) => (
                  <linearGradient
                    key={zone}
                    id={`land-${zone}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor={mapZoneMeta[zone].fill} />
                    <stop offset="100%" stopColor={mapZoneMeta[zone].hover} />
                  </linearGradient>
                ))}
              </defs>

              {thailandMap.locations.map((location) => {
                const isActiveProvince =
                  location.id === activePin?.provinceId;
                const zone = getProvinceZone(location.id);
                const zoneStyle = mapZoneMeta[zone];
                return (
                  <path
                    key={location.id}
                    id={location.id}
                    d={location.path}
                    className="transition-[fill,stroke,opacity] duration-500"
                    fill={
                      isActiveProvince
                        ? "url(#land-active)"
                        : `url(#land-${zone})`
                    }
                    stroke={isActiveProvince ? "#0369a1" : zoneStyle.stroke}
                    strokeWidth={isActiveProvince ? 1.6 : 0.75}
                    opacity={isActiveProvince ? 1 : 0.96}
                  />
                );
              })}
            </svg>

            <svg
              viewBox={mapViewBox}
              className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
              aria-hidden
            >
              {pins.map((pin) => (
                <line
                  key={`line-${pin.slug}`}
                  x1={pin.x}
                  y1={pin.y}
                  x2={pin.x + pin.cardOffsetX}
                  y2={pin.y + pin.cardOffsetY}
                  stroke="#c1272d"
                  strokeWidth={1.2}
                  strokeOpacity={pin.slug === activeSlug ? 0.55 : 0.28}
                  strokeDasharray={pin.slug === activeSlug ? undefined : "3 2"}
                />
              ))}
            </svg>

            <div className="absolute inset-0 overflow-visible">
              {pins.map((pin) => (
                <MapPinMarker
                  key={pin.slug}
                  pin={pin}
                  isActive={pin.slug === activeSlug}
                  onSelect={selectDestination}
                  frame={mapFrame}
                  compact={isMobile}
                />
              ))}
            </div>

            <div
              aria-hidden
              className="pointer-events-none absolute bottom-3 right-3 hidden rounded-full border border-white/70 bg-white/80 p-2 shadow-sm sm:flex"
            >
              <Compass className="size-5 text-sky-700" />
            </div>
          </div>
          </div>

          <p className="mt-3 text-center text-[10px] text-muted-foreground sm:text-left">
            Map data via{" "}
            <a
              href="https://github.com/VictorCazanave/svg-maps/tree/master/packages/thailand"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 hover:underline"
            >
              @svg-maps/thailand
            </a>{" "}
            (CC BY 4.0)
          </p>
        </div>

        <div className="flex flex-col justify-center gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3 max-sm:flex-col max-sm:items-center max-sm:text-center lg:text-left">
            <div>
              <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary lg:justify-start">
                <Sparkles className="size-3.5" />
                Interactive map
              </p>
              <h3 className="mt-1 text-2xl font-semibold text-navy sm:text-3xl">
                Thailand Travel Map
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                คลิกหมุดจังหวัดเพื่อดูโปรแกรมทัวร์ของเรา
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 lg:justify-end">
              <Sun className="size-5 text-amber-500" aria-hidden />
              <button
                type="button"
                onClick={() => setAutoplay((value) => !value)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-navy shadow-sm transition hover:bg-secondary"
                aria-pressed={autoplay}
              >
                {autoplay ? (
                  <>
                    <Pause className="size-3.5" />
                    Pause tour
                  </>
                ) : (
                  <>
                    <Play className="size-3.5" />
                    Auto explore
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-amber-200/80 bg-amber-50/95 p-4 text-xs shadow-sm">
            <p className="flex items-center gap-1.5 font-semibold text-amber-900">
              <Sun className="size-3.5" />
              Travel tips
            </p>
            <ul className="mt-3 space-y-2">
              {travelTips.map((tip) => (
                <li key={tip} className="flex gap-1.5 leading-relaxed text-amber-950/80">
                  <span className="text-brand">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-white/80 bg-white/90 p-4 shadow-lg backdrop-blur sm:p-5">
            <div className="flex gap-4">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-md border border-white shadow-md sm:size-24">
                <Image
                  src={activeDestination.image}
                  alt={activeDestination.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary sm:text-xs">
                  {activeDestination.region}
                </p>
                <h4 className="text-xl font-semibold text-navy sm:text-2xl">
                  {activeDestination.name}
                </h4>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {activeDestination.tagline}
                </p>
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-navy">
                  <MapPin className="size-3.5 text-brand" />
                  {activeDestination.tourCount} tour
                  {activeDestination.tourCount === 1 ? "" : "s"} available
                </p>
              </div>
            </div>

            <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
              {activeDestination.highlights.slice(0, 3).map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-brand">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild size="sm" className="bg-brand hover:bg-brand/90">
                <Link href={`/destinations/${activeDestination.slug}`}>
                  Explore destination
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href={`/tours?destination=${activeDestination.slug}`}>
                  View tours
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
            {pins.map((pin) => (
              <button
                key={pin.slug}
                type="button"
                onClick={() => selectDestination(pin.slug)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                  pin.slug === activeSlug
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-white/80 bg-white/70 text-navy hover:border-primary/30 hover:bg-white",
                )}
              >
                {pin.destination.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

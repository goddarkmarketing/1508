import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteImage as Image } from "@/components/shared/site-image";
import { Button } from "@/components/ui/button";
import { company } from "@/data/company";
import { destinations } from "@/data/destinations";
import { heroBadgeAvatars, heroMosaic } from "@/data/hero-slides";
import { withBasePath } from "@/lib/base-path";
import { cn } from "@/lib/utils";

const [shotTopLeft, shotBottomLeft, shotTopRight, shotBottomRight] = heroMosaic;

function MosaicShot({
  shot,
  priority,
  className,
}: {
  shot: (typeof heroMosaic)[number];
  priority?: boolean;
  className?: string;
}) {
  const scriptPos =
    shot.scriptPosition === "bl"
      ? "left-3 bottom-3"
      : shot.scriptPosition === "tr"
        ? "right-3 top-3 text-right"
        : shot.scriptPosition === "tl"
          ? "left-3 top-3"
          : "";

  return (
    <figure
      className={cn(
        "group relative m-0 min-h-0 overflow-visible rounded-[1.75rem] bg-slate-100",
        shot.wavy && "rounded-[1.75rem_1.75rem_1.75rem_2.75rem]",
        shot.aspect43 ? "aspect-[4/3] h-auto w-full" : "h-full",
        className,
      )}
    >
      <Image
        src={shot.src}
        alt={shot.alt}
        fill
        priority={priority}
        className={cn(
          "rounded-[inherit] object-cover transition-transform duration-700 ease-out group-hover:scale-105",
          shot.objectPosition,
        )}
        sizes="(max-width: 1024px) 45vw, 280px"
      />
      {shot.script ? (
        <p
          className={cn(
            "pointer-events-none absolute z-[2] max-w-[12ch] text-[clamp(0.95rem,1.4vw,1.2rem)] font-semibold leading-[1.1] text-white [font-family:var(--font-script),cursive] [text-shadow:0_2px_10px_rgba(0,0,0,0.35)]",
            scriptPos,
          )}
        >
          {shot.script}
          {shot.scriptPosition === "tr" ? (
            <span className="ml-0.5 inline-block align-middle text-[0.85em]" aria-hidden>
              ✺
            </span>
          ) : null}
        </p>
      ) : null}
    </figure>
  );
}

export function HomeHeroSlider() {
  const destinationCount = destinations.length;

  return (
    <section
      className="relative isolate w-full overflow-hidden bg-[linear-gradient(180deg,#f4f8fc_0%,#ffffff_55%,#ffffff_100%)]"
      data-feedback-id="home-hero"
      data-feedback-label="Hero banner"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(14,165,233,0.08),transparent_50%)]" />

      <div className="container-page relative grid items-center gap-8 py-10 sm:gap-10 sm:py-14 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:py-16">
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-700">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Destination Management · Thailand
          </p>
          <h1 className="mt-3 max-w-[16ch] text-4xl font-semibold tracking-tight text-navy sm:text-5xl lg:text-[3.35rem] lg:leading-[1.12]">
            <span className="text-brand">GGM</span> Thai Travel
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Flexible private & SIC programs, transfers, and ground services for
            agents across ASEAN, Europe, and China.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-brand hover:bg-brand/90">
              <Link href="#hero-quote">
                Request quote
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/tours">Browse tours</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            TAT License {company.tatLicense} · Founded {company.founded}
          </p>
        </div>

        <div className="grid min-h-[420px] grid-cols-[1.05fr_0.95fr] gap-3.5 overflow-visible sm:min-h-[520px] sm:gap-4 lg:min-h-[560px]">
          <div className="grid min-h-0 grid-rows-[auto_1fr] gap-3.5 sm:gap-4">
            <div className="relative">
              <MosaicShot shot={shotTopLeft} priority />
              <div className="absolute -left-1 bottom-2 z-[3] flex max-w-[7.5rem] flex-col gap-1 rounded-lg border border-navy/10 bg-white/95 px-2 py-1.5 shadow-md backdrop-blur-sm sm:bottom-3 sm:left-2 sm:max-w-[8rem] sm:px-2.5 sm:py-2 lg:left-[-2.75rem] lg:top-[18%] lg:bottom-auto lg:max-w-[8.25rem]">
                <p className="text-base font-extrabold leading-none text-navy sm:text-lg">
                  {destinationCount}+
                  <span className="mt-0.5 block text-[0.6rem] font-semibold leading-snug text-muted-foreground">
                    Destinations
                  </span>
                </p>
                <div className="hidden items-center lg:flex">
                  {heroBadgeAvatars.map((src, i) => (
                    <span
                      key={src}
                      className={cn(
                        "size-5 rounded-full border-2 border-white bg-cover bg-center shadow-[0_0_0_1px_rgba(15,23,42,0.06)]",
                        i > 0 && "-ml-1.5",
                      )}
                      style={{ backgroundImage: `url(${withBasePath(src)})` }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <MosaicShot shot={shotBottomLeft} />
          </div>

          <div className="grid min-h-0 grid-rows-[1fr_1.05fr] gap-3.5 pt-5 sm:gap-4 sm:pt-7">
            <MosaicShot shot={shotTopRight} />
            <MosaicShot shot={shotBottomRight} />
          </div>
        </div>
      </div>
    </section>
  );
}

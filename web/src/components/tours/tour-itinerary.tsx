import Image from "next/image";
import { Coffee, CircleDot, Soup, UtensilsCrossed } from "lucide-react";
import type { ItineraryDay } from "@/types";
import {
  mealLegend,
  mealStatusLabel,
  parseMealPlan,
  type MealStatus,
} from "@/lib/meals";
import { cn } from "@/lib/utils";

function MealChip({
  code,
  status,
}: {
  code: "B" | "L" | "D";
  status: MealStatus;
}) {
  const Icon = code === "B" ? Coffee : code === "L" ? Soup : UtensilsCrossed;

  return (
    <span
      title={`${code}: ${mealStatusLabel(status)}`}
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-1.5 py-1 text-[11px] font-semibold tracking-wide",
        status === "included" &&
          "border-sky-200 bg-sky-50 text-sky-700",
        status === "own" && "border-amber-200 bg-amber-50 text-amber-800",
        status === "none" && "border-border bg-muted/50 text-muted-foreground/45",
      )}
    >
      <Icon className="size-3" />
      {code}
    </span>
  );
}

function dayImage(
  day: ItineraryDay,
  index: number,
  fallbackImages: string[],
) {
  if (day.image) return day.image;
  if (!fallbackImages.length) return null;
  return fallbackImages[index % fallbackImages.length];
}

export function TourItinerary({
  days,
  placeImages = [],
}: {
  days: ItineraryDay[];
  /** Destination / package photos used when a day has no specific image */
  placeImages?: string[];
}) {
  const legend = mealLegend();

  return (
    <section className="overflow-hidden rounded-2xl border border-border/80 bg-white">
      <div className="flex flex-col gap-3 border-b bg-[#f7f9fc] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-navy">Day-by-day itinerary</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Schedule with place photos and meal markers for easy scanning.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {legend.map((item) => (
            <span key={item.code} className="inline-flex items-center gap-1.5">
              <MealChip code={item.code} status="included" />
              <span>{item.label}</span>
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5">
            <MealChip code="D" status="own" />
            <span>Own expense</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MealChip code="D" status="none" />
            <span>Not included</span>
          </span>
        </div>
      </div>

      {/* Mobile stacked day cards */}
      <div className="divide-y md:hidden">
        {days.map((day, index) => {
          const plan = parseMealPlan(day.meals);
          const image = dayImage(day, index, placeImages);

          return (
            <article key={day.day} className="space-y-3 p-4">
              <div className="flex items-start gap-3">
                {image ? (
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-border/70 bg-muted">
                    <Image
                      src={image}
                      alt={day.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-700">
                      Day {String(day.day).padStart(2, "0")}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      <MealChip code="B" status={plan.B} />
                      <MealChip code="L" status={plan.L} />
                      <MealChip code="D" status={plan.D} />
                    </div>
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-navy">{day.title}</p>
                </div>
              </div>
              <ul className="space-y-1.5">
                {day.activities.map((activity) => (
                  <li
                    key={activity}
                    className="flex gap-2 text-sm text-muted-foreground"
                  >
                    <CircleDot className="mt-0.5 size-3.5 shrink-0 text-sky-600" />
                    <span>{activity}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground">Meals: {day.meals}</p>
            </article>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b bg-navy text-left text-white">
              <th className="w-[88px] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em]">
                Day
              </th>
              <th className="w-[132px] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em]">
                Place
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em]">
                Program
              </th>
              <th className="w-[150px] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em]">
                Meals
              </th>
            </tr>
          </thead>
          <tbody>
            {days.map((day, index) => {
              const plan = parseMealPlan(day.meals);
              const image = dayImage(day, index, placeImages);

              return (
                <tr
                  key={day.day}
                  className={cn(
                    "align-top border-b border-border/70",
                    index % 2 === 1 && "bg-[#fafbfd]",
                  )}
                >
                  <td className="px-4 py-4">
                    <div className="inline-flex flex-col items-center rounded-xl bg-sky-50 px-2.5 py-2 text-sky-700">
                      <span className="text-[10px] font-semibold uppercase tracking-wider">
                        Day
                      </span>
                      <span className="text-lg font-bold leading-none">
                        {String(day.day).padStart(2, "0")}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {image ? (
                      <div className="relative size-[96px] overflow-hidden rounded-xl border border-border/70 bg-muted shadow-sm">
                        <Image
                          src={image}
                          alt={day.title}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex size-[96px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 text-xs text-muted-foreground">
                        No photo
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-navy">{day.title}</p>
                    <ul className="mt-3 space-y-2">
                      {day.activities.map((activity) => (
                        <li
                          key={activity}
                          className="flex gap-2 text-muted-foreground"
                        >
                          <CircleDot className="mt-0.5 size-3.5 shrink-0 text-sky-600" />
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Meal note: {day.meals}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      <MealChip code="B" status={plan.B} />
                      <MealChip code="L" status={plan.L} />
                      <MealChip code="D" status={plan.D} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

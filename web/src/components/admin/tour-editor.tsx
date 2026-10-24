"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ImageField } from "@/components/admin/image-field";
import { useAdminSession } from "@/components/admin/session";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminFetch } from "@/lib/admin-api";
import { canEditContent } from "@/lib/auth";
import type { Destination, ItineraryDay, TourCategory, TourPackage, TourType } from "@/types";

const categories: TourCategory[] = ["city", "beach", "culture", "nature", "muslim-friendly"];
const types: TourType[] = ["private", "sic", "join"];

function blankTour(): TourPackage {
  return {
    slug: "",
    code: "",
    title: "",
    destinationSlugs: [],
    duration: { days: 3, nights: 2 },
    type: "private",
    categories: ["city"],
    summary: "",
    highlights: [],
    image: "",
    status: "draft",
    featured: false,
    muslimFriendly: false,
    itinerary: [{ day: 1, title: "Day 1", meals: "Breakfast", activities: [""] }],
    includes: [],
    excludes: [],
  };
}

export function TourEditor() {
  const router = useRouter();
  const params = useSearchParams();
  const slug = params.get("slug") ?? "";
  const session = useAdminSession();
  const editable = canEditContent(session.role);
  const [tour, setTour] = useState<TourPackage>(blankTour);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(Boolean(slug));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [destinationData, tourData] = await Promise.all([
          adminFetch<{ destinations: Destination[] }>("/destinations"),
          adminFetch<{ tours: TourPackage[] }>("/tours"),
        ]);
        if (!active) return;
        setDestinations(destinationData.destinations);
        if (slug) {
          const found = tourData.tours.find((item) => item.slug === slug);
          if (!found) throw new Error("Tour not found");
          setTour(found);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not load the tour");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [slug]);

  function patch(partial: Partial<TourPackage>) {
    setTour((current) => ({ ...current, ...partial }));
  }

  function patchDay(index: number, partial: Partial<ItineraryDay>) {
    setTour((current) => ({
      ...current,
      itinerary: current.itinerary.map((day, dayIndex) =>
        dayIndex === index ? { ...day, ...partial } : day,
      ),
    }));
  }

  async function save() {
    setSaving(true);
    try {
      const payload = {
        ...tour,
        highlights: tour.highlights,
        includes: tour.includes,
        excludes: tour.excludes,
      };
      if (slug) {
        const data = await adminFetch<{ tour: TourPackage }>(`/tours/${slug}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setTour(data.tour);
        toast.success("Tour saved");
      } else {
        const data = await adminFetch<{ tour: TourPackage }>("/tours", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Tour created");
        router.replace(`/admin/tours/edit?slug=${data.tour.slug}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!slug || !window.confirm("Delete this tour?")) return;
    try {
      await adminFetch(`/tours/${slug}`, { method: "DELETE" });
      toast.success("Tour deleted");
      router.push("/admin/tours");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading tour...</p>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={slug ? tour.title || "Edit tour" : "New tour"}
        description="บันทึกลงฐานข้อมูลทันที หน้าเว็บในโหมด dev แสดงข้อมูลใหม่เลย ส่วนหน้าทัวร์ใหม่บนโฮสติ้งจะมีที่อยู่ของตัวเองหลัง build รอบถัดไป"
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/tours">Back</Link>
          </Button>
        }
      />

      <div className="grid gap-4 rounded-2xl border bg-card p-5 md:grid-cols-2">
        <Field label="Slug">
          <Input
            value={tour.slug}
            disabled={!editable || Boolean(slug)}
            onChange={(event) => patch({ slug: event.target.value })}
            placeholder="bangkok-3d2n"
          />
        </Field>
        <Field label="Code">
          <Input value={tour.code} disabled={!editable} onChange={(event) => patch({ code: event.target.value })} />
        </Field>
        <Field label="Title" className="md:col-span-2">
          <Input value={tour.title} disabled={!editable} onChange={(event) => patch({ title: event.target.value })} />
        </Field>
        <Field label="Days">
          <Input
            type="number"
            min={1}
            value={tour.duration.days}
            disabled={!editable}
            onChange={(event) =>
              patch({ duration: { ...tour.duration, days: Number(event.target.value) } })
            }
          />
        </Field>
        <Field label="Nights">
          <Input
            type="number"
            min={0}
            value={tour.duration.nights}
            disabled={!editable}
            onChange={(event) =>
              patch({ duration: { ...tour.duration, nights: Number(event.target.value) } })
            }
          />
        </Field>
        <Field label="Type">
          <select
            className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
            value={tour.type}
            disabled={!editable}
            onChange={(event) => patch({ type: event.target.value as TourType })}
          >
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select
            className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
            value={tour.status}
            disabled={!editable}
            onChange={(event) => patch({ status: event.target.value as TourPackage["status"] })}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </Field>
        <Field label="Summary" className="md:col-span-2">
          <Textarea
            value={tour.summary}
            disabled={!editable}
            onChange={(event) => patch({ summary: event.target.value })}
          />
        </Field>
        <div className="space-y-2 md:col-span-2">
          <Label>Destinations</Label>
          <div className="flex flex-wrap gap-3">
            {destinations.map((destination) => (
              <label key={destination.slug} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  disabled={!editable}
                  checked={tour.destinationSlugs.includes(destination.slug)}
                  onChange={(event) => {
                    const next = event.target.checked
                      ? [...tour.destinationSlugs, destination.slug]
                      : tour.destinationSlugs.filter((item) => item !== destination.slug);
                    patch({ destinationSlugs: next });
                  }}
                />
                {destination.name}
              </label>
            ))}
          </div>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Categories</Label>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <label key={category} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  disabled={!editable}
                  checked={tour.categories.includes(category)}
                  onChange={(event) => {
                    const next = event.target.checked
                      ? [...tour.categories, category]
                      : tour.categories.filter((item) => item !== category);
                    patch({ categories: next });
                  }}
                />
                {category}
              </label>
            ))}
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            disabled={!editable}
            checked={Boolean(tour.featured)}
            onChange={(event) => patch({ featured: event.target.checked })}
          />
          Featured on the homepage
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            disabled={!editable}
            checked={Boolean(tour.muslimFriendly)}
            onChange={(event) => patch({ muslimFriendly: event.target.checked })}
          />
          Muslim friendly
        </label>
        <div className="md:col-span-2">
          <ImageField
            label="Cover image"
            value={tour.image}
            disabled={!editable}
            onChange={(image) => patch({ image })}
          />
        </div>
        <Field label="Validity">
          <Input
            value={tour.validity ?? ""}
            disabled={!editable}
            onChange={(event) => patch({ validity: event.target.value })}
          />
        </Field>
        <ListField
          label="Highlights"
          value={tour.highlights}
          disabled={!editable}
          onChange={(highlights) => patch({ highlights })}
        />
        <ListField
          label="Includes"
          value={tour.includes}
          disabled={!editable}
          onChange={(includes) => patch({ includes })}
        />
        <ListField
          label="Excludes"
          value={tour.excludes}
          disabled={!editable}
          onChange={(excludes) => patch({ excludes })}
        />
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Itinerary</h2>
          {editable ? (
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                patch({
                  itinerary: [
                    ...tour.itinerary,
                    {
                      day: tour.itinerary.length + 1,
                      title: "",
                      meals: "Breakfast",
                      activities: [],
                    },
                  ],
                })
              }
            >
              Add day
            </Button>
          ) : null}
        </div>
        {tour.itinerary.map((day, index) => (
          <div key={day.day} className="grid gap-3 rounded-2xl border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Day {index + 1}</p>
              {editable && tour.itinerary.length > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    patch({ itinerary: tour.itinerary.filter((_, dayIndex) => dayIndex !== index) })
                  }
                >
                  Remove
                </Button>
              ) : null}
            </div>
            <Field label="Title">
              <Input
                value={day.title}
                disabled={!editable}
                onChange={(event) => patchDay(index, { title: event.target.value })}
              />
            </Field>
            <Field label="Meals">
              <Input
                value={day.meals}
                disabled={!editable}
                onChange={(event) => patchDay(index, { meals: event.target.value })}
              />
            </Field>
            <Field label="Activities (one per line)">
              <Textarea
                value={day.activities.join("\n")}
                disabled={!editable}
                onChange={(event) => patchDay(index, { activities: event.target.value.split(/\n/) })}
              />
            </Field>
          </div>
        ))}
      </section>

      {editable ? (
        <div className="flex flex-wrap gap-2">
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save tour"}
          </Button>
          {slug ? (
            <Button variant="outline" onClick={remove}>
              Delete
            </Button>
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Your role can view this tour but cannot edit it.</p>
      )}
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function ListField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}) {
  return (
    <Field label={`${label} (one per line)`} className="md:col-span-2">
      <Textarea
        value={value.join("\n")}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value.split(/\n/))}
      />
    </Field>
  );
}

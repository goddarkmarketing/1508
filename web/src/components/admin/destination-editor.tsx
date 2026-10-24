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
import type { Destination } from "@/types";

const regions: Destination["region"][] = ["Central", "North", "South", "East"];

function blankDestination(): Destination {
  return {
    slug: "",
    name: "",
    region: "Central",
    tagline: "",
    description: "",
    image: "",
    highlights: [],
  };
}

export function DestinationEditor() {
  const router = useRouter();
  const params = useSearchParams();
  const slug = params.get("slug") ?? "";
  const session = useAdminSession();
  const editable = canEditContent(session.role);
  const [destination, setDestination] = useState<Destination>(blankDestination);
  const [loading, setLoading] = useState(Boolean(slug));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    adminFetch<{ destinations: Destination[] }>("/destinations")
      .then((data) => {
        if (!active) return;
        const found = data.destinations.find((item) => item.slug === slug);
        if (!found) throw new Error("Destination not found");
        setDestination(found);
      })
      .catch((error: unknown) => {
        toast.error(error instanceof Error ? error.message : "Could not load the destination");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  function patch(partial: Partial<Destination>) {
    setDestination((current) => ({ ...current, ...partial }));
  }

  async function save() {
    setSaving(true);
    try {
      if (slug) {
        const data = await adminFetch<{ destination: Destination }>(`/destinations/${slug}`, {
          method: "PUT",
          body: JSON.stringify(destination),
        });
        setDestination(data.destination);
        toast.success("Destination saved");
      } else {
        const data = await adminFetch<{ destination: Destination }>("/destinations", {
          method: "POST",
          body: JSON.stringify(destination),
        });
        toast.success("Destination created");
        router.replace(`/admin/destinations/edit?slug=${data.destination.slug}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!slug || !window.confirm("Delete this destination?")) return;
    try {
      await adminFetch(`/destinations/${slug}`, { method: "DELETE" });
      toast.success("Destination deleted");
      router.push("/admin/destinations");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading destination...</p>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={slug ? destination.name || "Edit destination" : "New destination"}
        description="ใช้เป็นปลายทางของทัวร์ แผนที่ และเมนูบนเว็บ"
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/destinations">Back</Link>
          </Button>
        }
      />
      <div className="grid gap-4 rounded-2xl border bg-card p-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input
            value={destination.slug}
            disabled={!editable || Boolean(slug)}
            onChange={(event) => patch({ slug: event.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            value={destination.name}
            disabled={!editable}
            onChange={(event) => patch({ name: event.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Region</Label>
          <select
            className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
            value={destination.region}
            disabled={!editable}
            onChange={(event) => patch({ region: event.target.value as Destination["region"] })}
          >
            {regions.map((region) => (
              <option key={region}>{region}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Tagline</Label>
          <Input
            value={destination.tagline}
            disabled={!editable}
            onChange={(event) => patch({ tagline: event.target.value })}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Description</Label>
          <Textarea
            value={destination.description}
            disabled={!editable}
            onChange={(event) => patch({ description: event.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <ImageField
            label="Card image"
            value={destination.image}
            disabled={!editable}
            onChange={(image) => patch({ image })}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Highlights (one per line)</Label>
          <Textarea
            value={destination.highlights.join("\n")}
            disabled={!editable}
            onChange={(event) => patch({ highlights: event.target.value.split(/\n/) })}
          />
        </div>
      </div>
      {editable ? (
        <div className="flex gap-2">
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save destination"}
          </Button>
          {slug ? (
            <Button variant="outline" onClick={remove}>
              Delete
            </Button>
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Your role can view this destination but cannot edit it.</p>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ImageField, linesToList } from "@/components/admin/image-field";
import { useAdminSession } from "@/components/admin/session";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminFetch, uploadImage } from "@/lib/admin-api";
import { withBasePath } from "@/lib/base-path";
import { canEditContent } from "@/lib/auth";
import type { GalleryAlbum, GalleryPhoto } from "@/data/gallery";
import type { HeroMosaicShot } from "@/data/hero-slides";
import type { TravelVideo } from "@/data/videos";
import type { Destination } from "@/types";

type Tab = "videos" | "hero" | "gallery";

const emptyVideo: TravelVideo = {
  youtubeId: "",
  title: "",
  location: "",
  destination: "",
};

export function MediaManager() {
  const session = useAdminSession();
  const editable = canEditContent(session.role);
  const [tab, setTab] = useState<Tab>("videos");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [videos, setVideos] = useState<TravelVideo[]>([]);
  const [video, setVideo] = useState<TravelVideo>(emptyVideo);
  const [shots, setShots] = useState<HeroMosaicShot[]>([]);
  const [avatars, setAvatars] = useState<string[]>([]);
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [albumId, setAlbumId] = useState("");
  const [loading, setLoading] = useState(true);

  async function reload() {
    const [destinationData, videoData, hero, gallery] = await Promise.all([
      adminFetch<{ destinations: Destination[] }>("/destinations"),
      adminFetch<{ videos: TravelVideo[] }>("/videos"),
      adminFetch<{ shots: HeroMosaicShot[]; avatars: string[] }>("/hero"),
      adminFetch<{ albums: GalleryAlbum[]; photos: GalleryPhoto[] }>("/gallery"),
    ]);
    setDestinations(destinationData.destinations);
    setVideos(videoData.videos);
    setShots(hero.shots);
    setAvatars(hero.avatars);
    setAlbums(gallery.albums);
    setPhotos(gallery.photos);
    setAlbumId((current) => current || gallery.albums[0]?.id || "");
    setVideo((current) => ({
      ...current,
      destination: current.destination || destinationData.destinations[0]?.slug || "",
    }));
  }

  useEffect(() => {
    reload()
      .catch((error: unknown) => {
        toast.error(error instanceof Error ? error.message : "Could not load media");
      })
      .finally(() => setLoading(false));
  }, []);

  async function saveVideo() {
    try {
      if (video.id) {
        await adminFetch(`/videos/${video.id}`, { method: "PUT", body: JSON.stringify(video) });
      } else {
        await adminFetch("/videos", { method: "POST", body: JSON.stringify(video) });
      }
      setVideo({ ...emptyVideo, destination: destinations[0]?.slug ?? "" });
      await reload();
      toast.success("Video saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    }
  }

  async function removeVideo(id: number) {
    if (!window.confirm("Delete this video?")) return;
    try {
      await adminFetch(`/videos/${id}`, { method: "DELETE" });
      await reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  }

  async function saveHero() {
    try {
      await adminFetch("/hero", {
        method: "PUT",
        body: JSON.stringify({ shots, avatars: linesToList(avatars.join("\n")) }),
      });
      toast.success("Hero saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    }
  }

  async function addPhoto(file: File | undefined) {
    if (!file || !albumId) return;
    try {
      const src = await uploadImage(file);
      const album = albums.find((item) => item.id === albumId);
      await adminFetch("/gallery/photos", {
        method: "POST",
        body: JSON.stringify({ albumId, src, alt: album?.title ?? "Group photo" }),
      });
      await reload();
      toast.success("Photo added");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    }
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading media...</p>;

  const visiblePhotos = photos.filter((photo) => photo.albumId === albumId);

  return (
    <div>
      <PageHeader
        title="Media"
        description="วิดีโอ ภาพ hero และแกลเลอรีที่แสดงบนหน้าเว็บ"
      />
      <div className="mb-6 flex flex-wrap gap-2">
        {(["videos", "hero", "gallery"] as Tab[]).map((item) => (
          <Button
            key={item}
            type="button"
            variant={tab === item ? "default" : "outline"}
            onClick={() => setTab(item)}
          >
            {item}
          </Button>
        ))}
      </div>

      {tab === "videos" ? (
        <div className="space-y-6">
          <div className="grid gap-3 rounded-2xl border bg-card p-5 md:grid-cols-2">
            <Labeled label="YouTube link or id">
              <Input
                value={video.youtubeId}
                disabled={!editable}
                onChange={(event) => setVideo({ ...video, youtubeId: event.target.value })}
              />
            </Labeled>
            <Labeled label="Title">
              <Input
                value={video.title}
                disabled={!editable}
                onChange={(event) => setVideo({ ...video, title: event.target.value })}
              />
            </Labeled>
            <Labeled label="Location">
              <Input
                value={video.location}
                disabled={!editable}
                onChange={(event) => setVideo({ ...video, location: event.target.value })}
              />
            </Labeled>
            <Labeled label="Destination">
              <select
                className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
                value={video.destination}
                disabled={!editable}
                onChange={(event) => setVideo({ ...video, destination: event.target.value })}
              >
                {destinations.map((destination) => (
                  <option key={destination.slug} value={destination.slug}>
                    {destination.name}
                  </option>
                ))}
              </select>
            </Labeled>
            {editable ? (
              <div className="md:col-span-2">
                <Button type="button" onClick={saveVideo}>
                  {video.id ? "Update video" : "Add video"}
                </Button>
              </div>
            ) : null}
          </div>
          <div className="space-y-2">
            {videos.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3">
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.location} · {item.destination}
                  </p>
                </div>
                {editable ? (
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => setVideo(item)}>
                      Edit
                    </Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => item.id && removeVideo(item.id)}>
                      Delete
                    </Button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "hero" ? (
        <div className="space-y-4">
          {shots.map((shot, index) => (
            <div key={index} className="grid gap-3 rounded-2xl border bg-card p-5 md:grid-cols-2">
              <p className="font-medium md:col-span-2">Photo {index + 1}</p>
              <div className="md:col-span-2">
                <ImageField
                  label="Image"
                  value={shot.src}
                  disabled={!editable}
                  onChange={(src) =>
                    setShots((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, src } : item)))
                  }
                />
              </div>
              <Labeled label="Description">
                <Input
                  value={shot.alt}
                  disabled={!editable}
                  onChange={(event) =>
                    setShots((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, alt: event.target.value } : item,
                      ),
                    )
                  }
                />
              </Labeled>
              <Labeled label="Script text">
                <Input
                  value={shot.script ?? ""}
                  disabled={!editable}
                  onChange={(event) =>
                    setShots((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, script: event.target.value } : item,
                      ),
                    )
                  }
                />
              </Labeled>
            </div>
          ))}
          <Labeled label="Badge photos, one path per line">
            <textarea
              className="min-h-24 w-full rounded-lg border bg-background px-3 py-2 text-sm"
              value={avatars.join("\n")}
              disabled={!editable}
              onChange={(event) => setAvatars(event.target.value.split(/\n/))}
            />
          </Labeled>
          {editable ? (
            <Button type="button" onClick={saveHero}>
              Save hero
            </Button>
          ) : null}
        </div>
      ) : null}

      {tab === "gallery" ? (
        <div className="space-y-4">
          <AlbumForm destinationsReady={editable} onCreated={reload} />
          <Labeled label="Album">
            <select
              className="h-10 w-full max-w-md rounded-lg border bg-background px-3 text-sm"
              value={albumId}
              onChange={(event) => setAlbumId(event.target.value)}
            >
              {albums.map((album) => (
                <option key={album.id} value={album.id}>
                  {album.title} ({album.count})
                </option>
              ))}
            </select>
          </Labeled>
          {editable ? (
            <Labeled label="Add photo">
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  void addPhoto(file);
                }}
              />
            </Labeled>
          ) : null}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {visiblePhotos.map((photo) => (
              <figure key={photo.id ?? photo.src} className="overflow-hidden rounded-xl border bg-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={withBasePath(photo.src)} alt={photo.alt} className="aspect-[4/3] w-full object-cover" />
                {editable && photo.id ? (
                  <button
                    type="button"
                    className="w-full px-2 py-2 text-xs text-destructive"
                    onClick={async () => {
                      if (!window.confirm("Delete this photo?")) return;
                      try {
                        await adminFetch(`/gallery/photos/${photo.id}`, { method: "DELETE" });
                        await reload();
                      } catch (error) {
                        toast.error(error instanceof Error ? error.message : "Delete failed");
                      }
                    }}
                  >
                    Delete
                  </button>
                ) : null}
              </figure>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function AlbumForm({
  destinationsReady,
  onCreated,
}: {
  destinationsReady: boolean;
  onCreated: () => Promise<void>;
}) {
  const [album, setAlbum] = useState({
    id: "",
    code: "",
    title: "",
    dateLabel: "",
    market: "Thailand",
    cover: "",
  });
  if (!destinationsReady) return null;
  return (
    <form
      className="grid gap-3 rounded-2xl border bg-card p-5 md:grid-cols-2"
      onSubmit={async (event) => {
        event.preventDefault();
        try {
          await adminFetch("/gallery/albums", { method: "POST", body: JSON.stringify(album) });
          setAlbum({ id: "", code: "", title: "", dateLabel: "", market: "Thailand", cover: "" });
          await onCreated();
          toast.success("Album created");
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Could not create the album");
        }
      }}
    >
      <p className="font-medium md:col-span-2">New album</p>
      <Input placeholder="album-id" value={album.id} onChange={(event) => setAlbum({ ...album, id: event.target.value })} required />
      <Input placeholder="Code" value={album.code} onChange={(event) => setAlbum({ ...album, code: event.target.value })} required />
      <Input placeholder="Title" value={album.title} onChange={(event) => setAlbum({ ...album, title: event.target.value })} required />
      <Input placeholder="Date label" value={album.dateLabel} onChange={(event) => setAlbum({ ...album, dateLabel: event.target.value })} required />
      <select
        className="h-10 rounded-lg border bg-background px-3 text-sm"
        value={album.market}
        onChange={(event) => setAlbum({ ...album, market: event.target.value })}
      >
        {["Thailand", "Malaysia", "Singapore", "Indonesia"].map((market) => (
          <option key={market}>{market}</option>
        ))}
      </select>
      <div className="md:col-span-2">
        <ImageField label="Cover" value={album.cover} onChange={(cover) => setAlbum({ ...album, cover })} />
      </div>
      <Button type="submit">Create album</Button>
    </form>
  );
}

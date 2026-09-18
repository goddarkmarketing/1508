import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GalleryExplorer } from "@/components/gallery/gallery-explorer";
import { galleryAlbums, galleryPhotos } from "@/data/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Real group program photos from GGM Thai Travel — Thailand, Malaysia, Singapore, and Indonesia incentive & tour groups.",
};

export default function GalleryPage() {
  return (
    <>
      <section className="border-b bg-white">
        <div className="container-page py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
            Photo gallery
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-navy sm:text-5xl">
            Moments from our group programs
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Highlights from {galleryAlbums.length} recent group albums —{" "}
            {galleryPhotos.length} curated photos across Thailand, Malaysia,
            Singapore, and Indonesia. Filter by market or open an album.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-brand hover:bg-brand/90">
              <Link href="/inquire">
                Plan a similar group
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/tours">Browse tours</Link>
            </Button>
          </div>
        </div>
      </section>

      <section
        className="section-space bg-[#f7f9fc]"
        data-feedback-id="gallery-explorer"
        data-feedback-label="Group photo albums"
      >
        <div className="container-page">
          <GalleryExplorer />
        </div>
      </section>
    </>
  );
}

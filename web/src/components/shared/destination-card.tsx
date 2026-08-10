import Image from "next/image";
import Link from "next/link";
import type { Destination } from "@/types";

export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="group relative block overflow-hidden"
    >
      <div className="relative aspect-square">
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%]">
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent" />
          <div className="absolute inset-0 backdrop-blur-[6px] [mask-image:linear-gradient(to_top,black_35%,transparent_90%)] [-webkit-mask-image:linear-gradient(to_top,black_35%,transparent_90%)]" />
        </div>
        <div className="absolute inset-x-0 bottom-0 space-y-0.5 p-3 text-white sm:space-y-1 sm:p-5">
          <p className="text-[10px] uppercase tracking-[0.14em] text-white/70 sm:text-xs sm:tracking-[0.16em]">
            {destination.region}
          </p>
          <h3 className="text-base font-semibold sm:text-xl">{destination.name}</h3>
          <p className="line-clamp-2 hidden text-sm text-white/80 sm:block">
            {destination.tagline}
          </p>
        </div>
      </div>
    </Link>
  );
}

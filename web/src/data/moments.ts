export type MomentPhoto = {
  src: string;
  alt: string;
  label: string;
};

/** Real on-the-ground photos from GGM operations (Phuket incentive & group programs). */
export const momentPhotos: MomentPhoto[] = [
  {
    src: "/moments/group-dinner.webp",
    alt: "Travel group dining by the sea at dusk",
    label: "Seaside group dinner",
  },
  {
    src: "/moments/dining-pier-dusk.webp",
    alt: "Open-air pier restaurant at twilight",
    label: "Pier dining",
  },
  {
    src: "/moments/coach-ready.webp",
    alt: "Tour coaches ready for group departure",
    label: "Coach operations",
  },
  {
    src: "/moments/friends-pier.webp",
    alt: "Friends enjoying pier-side seafood",
    label: "Local seafood",
  },
  {
    src: "/moments/mice-checkin.webp",
    alt: "Incentive trip welcome desk in Phuket",
    label: "MICE welcome",
  },
  {
    src: "/moments/group-peace.webp",
    alt: "Happy travelers posing at waterfront dinner",
    label: "Happy travelers",
  },
  {
    src: "/moments/pier-lunch.webp",
    alt: "Daytime lunch on a wooden pier",
    label: "Day trip lunch",
  },
  {
    src: "/moments/group-seaside.webp",
    alt: "Group gathering at a seaside restaurant",
    label: "Group programs",
  },
];

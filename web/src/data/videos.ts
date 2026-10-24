export type TravelVideo = {
  id?: number;
  youtubeId: string;
  title: string;
  location: string;
  destination: string;
};

export const travelVideos: TravelVideo[] = [
  {
    youtubeId: "SvpIjxQur-o",
    title: "Chiang Mai highlights",
    location: "Chiang Mai",
    destination: "chiang-mai",
  },
  {
    youtubeId: "UZOfd_wLn6Y",
    title: "Doi Suthep Temple",
    location: "Chiang Mai",
    destination: "chiang-mai",
  },
  {
    youtubeId: "Alx2ze8-1js",
    title: "Maerim Elephant Home",
    location: "Chiang Mai",
    destination: "chiang-mai",
  },
  {
    youtubeId: "VYN9681Cny0",
    title: "Kantoke Dinner",
    location: "Chiang Mai",
    destination: "chiang-mai",
  },
  {
    youtubeId: "24Xq0kGV8Nc",
    title: "White Temple (Wat Rong Khun)",
    location: "Chiang Rai",
    destination: "chiang-rai",
  },
];

export function getVideosByDestination(slug: string) {
  return travelVideos.filter((video) => video.destination === slug);
}

import type { Destination } from "@/types";

export const destinations: Destination[] = [
  {
    slug: "bangkok",
    name: "Bangkok",
    region: "Central",
    tagline: "The City of Culture, Heritage & Riverside Charm",
    description:
      "Thailand’s vibrant capital — temples, riverside cruises, night markets, and shopping hubs in one seamless city experience.",
    image: "/destinations/bangkok-card.webp",
    highlights: [
      "Wat Arun & Chao Phraya",
      "Damnoen Saduak Floating Market",
      "Songwat Street Art",
      "Night markets & malls",
    ],
  },
  {
    slug: "pattaya",
    name: "Pattaya",
    region: "East",
    tagline: "Beaches, shows, and Coral Island escapes",
    description:
      "Coastal energy with floating markets, tropical gardens, and optional Coral Island speed-boat day trips.",
    image: "/destinations/pattaya-card.webp",
    highlights: [
      "Pattaya Floating Market",
      "Nong Nooch Tropical Garden",
      "Coral Island (Koh Larn)",
      "Water activities",
    ],
  },
  {
    slug: "rayong",
    name: "Rayong",
    region: "East",
    tagline: "Quiet beaches & seafood coast",
    description:
      "Mae Ramphueng Beach, Koh Samet gateway, fruit orchards, and relaxed eastern seaboard escapes.",
    image: "/destinations/rayong-card.webp",
    highlights: [
      "Mae Ramphueng Beach",
      "Koh Samet ferries",
      "Rayong fruit orchards",
      "Seafood dining",
    ],
  },
  {
    slug: "koh-chang",
    name: "Koh Chang",
    region: "East",
    tagline: "Island jungle, waterfalls & white sand",
    description:
      "Thailand’s second-largest island — rainforest treks, Khlong Plu waterfall, and beach resorts in Trat province.",
    image: "/destinations/koh-chang-card.webp",
    highlights: [
      "White Sand Beach",
      "Khlong Plu Waterfall",
      "Snorkelling & island hopping",
      "Mangrove kayaking",
    ],
  },
  {
    slug: "hua-hin",
    name: "Hua Hin",
    region: "Central",
    tagline: "Royal beach town with farms and vineyards",
    description:
      "A relaxed seaside escape combining floating markets, sheep farms, vineyards, and Hua Hin’s classic beachfront.",
    image: "/destinations/huahin-card.webp",
    highlights: [
      "Zucata Sheep Farm",
      "Monsoon Valley Vineyard",
      "Hua Hin Beach",
      "Wat Huay Mongkol",
    ],
  },
  {
    slug: "kanchanaburi",
    name: "Kanchanaburi",
    region: "Central",
    tagline: "River Kwai history and nature escapes",
    description:
      "Bridge over the River Kwai, skywalks, safari experiences, and floating-house evenings outside Bangkok.",
    image: "/destinations/kanchanaburi-cover.webp",
    highlights: [
      "River Kwai Bridge",
      "River Kwai Skywalk",
      "Safari Park",
      "Floating house dinner",
    ],
  },
  {
    slug: "ayutthaya",
    name: "Ayutthaya",
    region: "Central",
    tagline: "UNESCO ruins & riverside heritage",
    description:
      "Ancient temple complexes, Bang Pa-In Summer Palace, and easy day-trip circuits from Bangkok.",
    image: "/destinations/bangkok-hero.jpg",
    highlights: [
      "Ayutthaya Historical Park",
      "Wat Mahathat",
      "Bang Pa-In Palace",
      "Chao Phraya river cruise",
    ],
  },
  {
    slug: "khao-yai",
    name: "Khao Yai",
    region: "Central",
    tagline: "Wine country, farms, and cool mountain air",
    description:
      "PB Valley winery, flower farms, alpaca experiences, and scenic café stops near Bangkok.",
    image: "/destinations/khaoyai-cover.png",
    highlights: [
      "PB Valley Winery",
      "Sunflower fields",
      "K-Hmong Alpaca Farm",
      "Panora Camp & Café",
    ],
  },
  {
    slug: "khao-kho",
    name: "Khao Kho & Phu Thap Boek",
    region: "Central",
    tagline: "Sea of mist and highland viewpoints",
    description:
      "Early-morning mist viewpoints, Wat Phra That Pha Sorn Kaew, and cool-climate café stops in Phetchabun.",
    image: "/destinations/khaokho-cover.png",
    highlights: [
      "Phu Thap Boek sea of mist",
      "Wat Phra That Pha Sorn Kaew",
      "Highland cafés",
      "Cool-weather landscapes",
    ],
  },
  {
    slug: "chiang-mai",
    name: "Chiang Mai",
    region: "North",
    tagline: "Lanna temples, elephants, and highland culture",
    description:
      "Old city gates, Kantoke dinner, Doi Suthep, elephant experiences, and Doi Inthanon nature.",
    image: "/destinations/chiangmai-square.png",
    highlights: [
      "Tha Pae Gate & Old City",
      "Kantoke dinner",
      "Doi Suthep",
      "Elephant sanctuary",
    ],
  },
  {
    slug: "chiang-rai",
    name: "Chiang Rai",
    region: "North",
    tagline: "White Temple, Blue Temple & Golden Triangle",
    description:
      "Contemporary temples, Black House Museum, Karen village visits, and the Golden Triangle viewpoint.",
    image: "/destinations/chiangrai-cover.png",
    highlights: [
      "White Temple",
      "Blue Temple",
      "Black House Museum",
      "Golden Triangle",
    ],
  },
  {
    slug: "phrae",
    name: "Phrae",
    region: "North",
    tagline: "Teak towns, temples & Lanna heritage",
    description:
      "Historic teak mansions, Wat Phra That Cho Hae, and quiet northern streets ideal for culture-focused FIT programs.",
    image: "/destinations/khaokho-cover.png",
    highlights: [
      "Khum Chao Luang",
      "Wat Phra That Cho Hae",
      "Vongburi House",
      "Wat Phra Non",
    ],
  },
  {
    slug: "mae-hong-son",
    name: "Mae Hong Son",
    region: "North",
    tagline: "Misty valleys, hill tribes & border charm",
    description:
      "Jong Kham Lake, Wat Phra That Doi Kong Mu, Pai loops, and Shan-Burmese culture in Thailand’s northwest.",
    image: "/destinations/chiangmai-square.png",
    highlights: [
      "Jong Kham Lake",
      "Wat Phra That Doi Kong Mu",
      "Pai & Soppong loops",
      "Hill tribe villages",
    ],
  },
  {
    slug: "phuket",
    name: "Phuket",
    region: "South",
    tagline: "Andaman beaches, Phi Phi & James Bond Island",
    description:
      "Thailand’s largest island — Old Town heritage, island-hopping by speed boat, and Phang Nga Bay canoeing.",
    image: "/destinations/phuket-square.webp",
    highlights: [
      "Phuket Old Town",
      "Phi Phi & Maya Bay",
      "James Bond Island",
      "Chalong Temple",
    ],
  },
  {
    slug: "krabi",
    name: "Krabi",
    region: "South",
    tagline: "Limestone cliffs, 4 islands & jungle pools",
    description:
      "4 Island Tour, Emerald Pool, hot springs, and Tiger Cave Temple in one of Thailand’s most scenic provinces.",
    image: "/destinations/krabi-cover.png",
    highlights: [
      "4 Island Tour",
      "Emerald Pool",
      "Hot Spring jungle bath",
      "Tiger Cave Temple",
    ],
  },
  {
    slug: "hatyai",
    name: "Hat Yai",
    region: "South",
    tagline: "Shopping hub and gateway to the deep south",
    description:
      "Floating markets, Songkhla Old Town day trips, night markets, and easy connections to Betong and Phatthalung.",
    image: "/destinations/hatyai-square.png",
    highlights: [
      "Khlong Hae Floating Market",
      "Greenway Night Market",
      "Songkhla Old Town",
      "Samila Beach",
    ],
  },
  {
    slug: "betong",
    name: "Betong",
    region: "South",
    tagline: "Cool weather, skywalk & sea of mist",
    description:
      "Aiyerweng Skywalk sunrises, historic tunnels, flower gardens, and the 3-Culture Arch Gate.",
    image: "/destinations/betong-cover.png",
    highlights: [
      "Aiyerweng Skywalk",
      "Betong Mongkhonrit Tunnel",
      "Piyamit Tunnel Museum",
      "3-Culture Arch Gate",
    ],
  },
];

export function getDestination(slug: string) {
  return destinations.find((d) => d.slug === slug);
}

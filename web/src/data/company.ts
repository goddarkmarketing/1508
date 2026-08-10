export const company = {
  name: "GGM Thai Travel Co., Ltd.",
  nameTh: "บริษัท จีจีเอ็ม ไทย แทรเวล จำกัด",
  shortName: "GGM Thai Travel",
  tagline: "All customer is our family",
  description:
    "A Destination Management Company for Thailand offering flexible private and SIC tour programs, transfers, and ground services for travel agents and groups across ASEAN, Europe, and China.",
  founded: 2022,
  tatLicense: "14/03695",
  logo: "/brand/logo.png",
  logoFull: "/brand/logo-full.png",
  qr: "/brand/qr.jpg",
  emails: {
    general: "ggm.thaitravel@gmail.com",
    manager: "ggm.managerthaitravel@gmail.com",
    management: "ggmthaimanagement@gmail.com",
  },
  contacts: [
    {
      name: "Ms. Fon",
      role: "Sales & Operations",
      phone: "+66945469539",
      phoneDisplay: "+66 94-546-9539",
      email: "ggm.thaitravel@gmail.com",
    },
    {
      name: "Ms. Amee",
      role: "Manager",
      phone: "+66922518492",
      phoneDisplay: "+66 92-251-8492",
      email: "ggm.managerthaitravel@gmail.com",
    },
  ],
  social: [
    {
      name: "WhatsApp",
      href: "https://wa.me/66945469539",
      label: "WhatsApp",
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/",
      label: "Facebook",
    },
    {
      name: "Line",
      href: "https://line.me/",
      label: "LINE",
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/",
      label: "Instagram",
    },
  ],
  markets: [
    "Malaysia",
    "Singapore",
    "Vietnam",
    "Philippines",
    "Indonesia",
    "Europe",
    "China",
  ],
  languages: [
    "English",
    "Chinese",
    "Malaysian",
    "Indonesian",
    "Vietnamese",
    "Japanese",
  ],
  specialties: [
    "Incentive groups",
    "Team building",
    "Group series",
    "Student groups",
    "Company trips",
    "Senior groups",
    "Family trips",
    "Honeymoon",
    "Golf packages",
    "MICE incentive",
  ],
  values: [
    {
      title: "Safety first",
      description:
        "Travel programs designed for safety with experienced specialists on the ground.",
    },
    {
      title: "Family-level care",
      description:
        "We treat every guest like family — attentive service from booking to departure.",
    },
    {
      title: "Local expertise",
      description:
        "Multilingual guides and nationwide operations based in Bangkok.",
    },
  ],
  expertise: {
    title: "30+ Years Of Expertise",
    description:
      "Backed by more than 30 years of executive experience and TAT License 14/03695, GGM Thai Travel delivers private and SIC ground services for agents across ASEAN, Europe, and China.",
    stats: [
      {
        value: "30+",
        label: "Years Of Executive Expertise",
      },
      {
        value: "12",
        label: "Destinations Across Thailand",
      },
      {
        value: "23+",
        label: "Ready-To-Quote Tour Programs",
      },
      {
        value: "6+",
        label: "Guide Languages Supported",
      },
    ],
  },
} as const;

export const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Destinations", href: "/destinations" },
  { label: "Tours", href: "/tours" },
  { label: "Services", href: "/services" },
  { label: "Fleet", href: "/fleet" },
  { label: "Contact", href: "/contact" },
] as const;

export const adminNavigation = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Tours", href: "/admin/tours", icon: "Map" },
  { label: "Destinations", href: "/admin/destinations", icon: "MapPin" },
  { label: "Inquiries", href: "/admin/inquiries", icon: "Inbox" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
] as const;

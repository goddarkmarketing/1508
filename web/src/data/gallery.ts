export type GalleryMarket = "All" | "Malaysia" | "Singapore" | "Indonesia" | "Thailand";

export type GalleryAlbum = {
  id: string;
  code: string;
  market: Exclude<GalleryMarket, "All">;
  title: string;
  dateLabel: string;
  cover: string;
  count: number;
};

export type GalleryPhoto = {
  src: string;
  albumId: string;
  market: Exclude<GalleryMarket, "All">;
  alt: string;
  width: number;
  height: number;
};

/** Curated highlights from Photo group 2026 Drive albums. */
export const galleryAlbums: GalleryAlbum[] = [
  {
    "id": "id-riway-090126",
    "code": "ID- Riway 090126",
    "market": "Indonesia",
    "title": "Riway International Gala",
    "dateLabel": "09/01/2026",
    "cover": "/gallery/id-riway-090126/1b4K-O9Ut3fu.webp",
    "count": 4
  },
  {
    "id": "ml-gcb-110826",
    "code": "ML-GCB 110826",
    "market": "Malaysia",
    "title": "Malaysia GCB group",
    "dateLabel": "11/08/2026",
    "cover": "/gallery/ml-gcb-110826/1Q6L5dYBGl9A.webp",
    "count": 4
  },
  {
    "id": "ml-mhn-040726",
    "code": "ML-MHN 040726",
    "market": "Malaysia",
    "title": "Malaysia MHN group",
    "dateLabel": "04/07/2026",
    "cover": "/gallery/ml-mhn-040726/1AMhzHXGKDLp.webp",
    "count": 4
  },
  {
    "id": "ml-mhn-070326",
    "code": "ML-MHN 070326",
    "market": "Malaysia",
    "title": "Malaysia MHN group",
    "dateLabel": "07/03/2026",
    "cover": "/gallery/ml-mhn-070326/1XmfhEZya_t5.webp",
    "count": 4
  },
  {
    "id": "ml-skz-080726",
    "code": "ML-SKZ 080726",
    "market": "Malaysia",
    "title": "Malaysia SKZ group",
    "dateLabel": "08/07/2026",
    "cover": "/gallery/ml-skz-080726/14hFv-OtZS39.webp",
    "count": 4
  },
  {
    "id": "ml-skz-150426",
    "code": "ML-SKZ 150426",
    "market": "Malaysia",
    "title": "Malaysia SKZ group",
    "dateLabel": "15/04/2026",
    "cover": "/gallery/ml-skz-150426/1shziFFf9FoQ.webp",
    "count": 4
  },
  {
    "id": "ml-udm-120326",
    "code": "ML-UDM 120326",
    "market": "Malaysia",
    "title": "Malaysia UDM group",
    "dateLabel": "12/03/2026",
    "cover": "/gallery/ml-udm-120326/1E8cfN8OKcJm.webp",
    "count": 4
  },
  {
    "id": "sg-gbl-040926",
    "code": "SG-GBL 040926",
    "market": "Singapore",
    "title": "Singapore GBL group",
    "dateLabel": "04/09/2026",
    "cover": "/gallery/sg-gbl-040926/1Q0414bsrGQV.webp",
    "count": 4
  },
  {
    "id": "sg-tgt-160726",
    "code": "SG-TGT 160726",
    "market": "Singapore",
    "title": "Singapore TGT group",
    "dateLabel": "16/07/2026",
    "cover": "/gallery/sg-tgt-160726/1_KDSIKK3cI5.webp",
    "count": 4
  },
  {
    "id": "sg-tgt-180226",
    "code": "SG-TGT 180226",
    "market": "Singapore",
    "title": "Singapore TGT group",
    "dateLabel": "18/02/2026",
    "cover": "/gallery/sg-tgt-180226/1U4J7x2dOQlN.webp",
    "count": 4
  },
  {
    id: "coway-kanchanaburi",
    code: "Coway Kanchanaburi",
    market: "Thailand",
    title: "Coway Kanchanaburi",
    dateLabel: "03/2025",
    cover: "/gallery/coway-kanchanaburi/coway-01.webp",
    count: 10,
  },
  {
    id: "ml-cpl-210525",
    code: "ML-CPL 210525",
    market: "Malaysia",
    title: "Malaysia CPL group",
    dateLabel: "21/05/2025",
    cover: "/gallery/ml-cpl-210525/210525-01.webp",
    count: 6,
  },
  {
    id: "ml-udm-080525-phuket",
    code: "ML-UDM 080525 Phuket",
    market: "Malaysia",
    title: "Malaysia UDM · Phuket",
    dateLabel: "08/05/2025",
    cover: "/gallery/ml-udm-080525-phuket/phuket-01.webp",
    count: 8,
  },
  {
    id: "vivo-group",
    code: "VIVO group",
    market: "Thailand",
    title: "VIVO incentive group",
    dateLabel: "03/2025",
    cover: "/gallery/vivo-group/group-01.webp",
    count: 6,
  },
];

export const galleryPhotos: GalleryPhoto[] = [
  {
    "src": "/gallery/id-riway-090126/1b4K-O9Ut3fu.webp",
    "albumId": "id-riway-090126",
    "market": "Indonesia",
    "alt": "Riway International Gala — group program",
    "width": 3500,
    "height": 2333
  },
  {
    "src": "/gallery/id-riway-090126/1MlyvPMgVZVi.webp",
    "albumId": "id-riway-090126",
    "market": "Indonesia",
    "alt": "Riway International Gala — group program",
    "width": 3500,
    "height": 2333
  },
  {
    "src": "/gallery/id-riway-090126/1NATa8y2Xbim.webp",
    "albumId": "id-riway-090126",
    "market": "Indonesia",
    "alt": "Riway International Gala — group program",
    "width": 3500,
    "height": 2333
  },
  {
    "src": "/gallery/id-riway-090126/1FZft-s_2eJd.webp",
    "albumId": "id-riway-090126",
    "market": "Indonesia",
    "alt": "Riway International Gala — group program",
    "width": 3500,
    "height": 2333
  },
  {
    "src": "/gallery/ml-gcb-110826/1Q6L5dYBGl9A.webp",
    "albumId": "ml-gcb-110826",
    "market": "Malaysia",
    "alt": "Malaysia GCB group — group program",
    "width": 1706,
    "height": 960
  },
  {
    "src": "/gallery/ml-gcb-110826/15rRE4FexmrL.webp",
    "albumId": "ml-gcb-110826",
    "market": "Malaysia",
    "alt": "Malaysia GCB group — group program",
    "width": 1477,
    "height": 1108
  },
  {
    "src": "/gallery/ml-gcb-110826/1Mr6e2YJdDOg.webp",
    "albumId": "ml-gcb-110826",
    "market": "Malaysia",
    "alt": "Malaysia GCB group — group program",
    "width": 1477,
    "height": 1108
  },
  {
    "src": "/gallery/ml-gcb-110826/1knuMgic0EpS.webp",
    "albumId": "ml-gcb-110826",
    "market": "Malaysia",
    "alt": "Malaysia GCB group — group program",
    "width": 1108,
    "height": 1477
  },
  {
    "src": "/gallery/ml-mhn-040726/1AMhzHXGKDLp.webp",
    "albumId": "ml-mhn-040726",
    "market": "Malaysia",
    "alt": "Malaysia MHN group — group program",
    "width": 1600,
    "height": 1200
  },
  {
    "src": "/gallery/ml-mhn-040726/1J9v4BYnkn5p.webp",
    "albumId": "ml-mhn-040726",
    "market": "Malaysia",
    "alt": "Malaysia MHN group — group program",
    "width": 1600,
    "height": 1200
  },
  {
    "src": "/gallery/ml-mhn-040726/1mScOsXv15SS.webp",
    "albumId": "ml-mhn-040726",
    "market": "Malaysia",
    "alt": "Malaysia MHN group — group program",
    "width": 1600,
    "height": 738
  },
  {
    "src": "/gallery/ml-mhn-040726/1nknfqS6byei.webp",
    "albumId": "ml-mhn-040726",
    "market": "Malaysia",
    "alt": "Malaysia MHN group — group program",
    "width": 1600,
    "height": 1200
  },
  {
    "src": "/gallery/ml-mhn-070326/1XmfhEZya_t5.webp",
    "albumId": "ml-mhn-070326",
    "market": "Malaysia",
    "alt": "Malaysia MHN group — group program",
    "width": 4032,
    "height": 3024
  },
  {
    "src": "/gallery/ml-mhn-070326/1S_2rAfACrcL.webp",
    "albumId": "ml-mhn-070326",
    "market": "Malaysia",
    "alt": "Malaysia MHN group — group program",
    "width": 4032,
    "height": 3024
  },
  {
    "src": "/gallery/ml-mhn-070326/1KmfAVNXpF5Z.webp",
    "albumId": "ml-mhn-070326",
    "market": "Malaysia",
    "alt": "Malaysia MHN group — group program",
    "width": 4032,
    "height": 3024
  },
  {
    "src": "/gallery/ml-mhn-070326/1rr2ErPwPgBS.webp",
    "albumId": "ml-mhn-070326",
    "market": "Malaysia",
    "alt": "Malaysia MHN group — group program",
    "width": 4032,
    "height": 3024
  },
  {
    "src": "/gallery/ml-skz-080726/14hFv-OtZS39.webp",
    "albumId": "ml-skz-080726",
    "market": "Malaysia",
    "alt": "Malaysia SKZ group — group program",
    "width": 1477,
    "height": 1108
  },
  {
    "src": "/gallery/ml-skz-080726/1RcNNDPh6OCJ.webp",
    "albumId": "ml-skz-080726",
    "market": "Malaysia",
    "alt": "Malaysia SKZ group — group program",
    "width": 1706,
    "height": 960
  },
  {
    "src": "/gallery/ml-skz-080726/1JbM-wZVKBVc.webp",
    "albumId": "ml-skz-080726",
    "market": "Malaysia",
    "alt": "Malaysia SKZ group — group program",
    "width": 1477,
    "height": 1108
  },
  {
    "src": "/gallery/ml-skz-080726/1SL_KDUecVAO.webp",
    "albumId": "ml-skz-080726",
    "market": "Malaysia",
    "alt": "Malaysia SKZ group — group program",
    "width": 1706,
    "height": 960
  },
  {
    "src": "/gallery/ml-skz-150426/1shziFFf9FoQ.webp",
    "albumId": "ml-skz-150426",
    "market": "Malaysia",
    "alt": "Malaysia SKZ group — group program",
    "width": 4032,
    "height": 3024
  },
  {
    "src": "/gallery/ml-skz-150426/1ax1EMuXSLO4.webp",
    "albumId": "ml-skz-150426",
    "market": "Malaysia",
    "alt": "Malaysia SKZ group — group program",
    "width": 4032,
    "height": 3024
  },
  {
    "src": "/gallery/ml-skz-150426/1x8NN6FWjfql.webp",
    "albumId": "ml-skz-150426",
    "market": "Malaysia",
    "alt": "Malaysia SKZ group — group program",
    "width": 1108,
    "height": 1477
  },
  {
    "src": "/gallery/ml-skz-150426/1OjW2uBk6lfV.webp",
    "albumId": "ml-skz-150426",
    "market": "Malaysia",
    "alt": "Malaysia SKZ group — group program",
    "width": 1108,
    "height": 1477
  },
  {
    "src": "/gallery/ml-udm-120326/1E8cfN8OKcJm.webp",
    "albumId": "ml-udm-120326",
    "market": "Malaysia",
    "alt": "Malaysia UDM group — group program",
    "width": 1706,
    "height": 960
  },
  {
    "src": "/gallery/ml-udm-120326/1k4FKR5XwlSB.webp",
    "albumId": "ml-udm-120326",
    "market": "Malaysia",
    "alt": "Malaysia UDM group — group program",
    "width": 1706,
    "height": 960
  },
  {
    "src": "/gallery/ml-udm-120326/13LeIXBHmaD0.webp",
    "albumId": "ml-udm-120326",
    "market": "Malaysia",
    "alt": "Malaysia UDM group — group program",
    "width": 1110,
    "height": 1474
  },
  {
    "src": "/gallery/sg-gbl-040926/1Q0414bsrGQV.webp",
    "albumId": "sg-gbl-040926",
    "market": "Singapore",
    "alt": "Singapore GBL group — group program",
    "width": 5712,
    "height": 4284
  },
  {
    "src": "/gallery/sg-gbl-040926/1xjYPPlstQww.webp",
    "albumId": "sg-gbl-040926",
    "market": "Singapore",
    "alt": "Singapore GBL group — group program",
    "width": 5712,
    "height": 4284
  },
  {
    "src": "/gallery/sg-gbl-040926/1J6lGGnv7kVI.webp",
    "albumId": "sg-gbl-040926",
    "market": "Singapore",
    "alt": "Singapore GBL group — group program",
    "width": 4032,
    "height": 3024
  },
  {
    "src": "/gallery/sg-gbl-040926/1SFaK4RDl0OK.webp",
    "albumId": "sg-gbl-040926",
    "market": "Singapore",
    "alt": "Singapore GBL group — group program",
    "width": 4032,
    "height": 3024
  },
  {
    "src": "/gallery/sg-tgt-160726/1_KDSIKK3cI5.webp",
    "albumId": "sg-tgt-160726",
    "market": "Singapore",
    "alt": "Singapore TGT group — group program",
    "width": 1477,
    "height": 1108
  },
  {
    "src": "/gallery/sg-tgt-160726/1FqRnHJ_iXHW.webp",
    "albumId": "sg-tgt-160726",
    "market": "Singapore",
    "alt": "Singapore TGT group — group program",
    "width": 1477,
    "height": 1108
  },
  {
    "src": "/gallery/sg-tgt-160726/1zQf6znZC8lO.webp",
    "albumId": "sg-tgt-160726",
    "market": "Singapore",
    "alt": "Singapore TGT group — group program",
    "width": 1108,
    "height": 1477
  },
  {
    "src": "/gallery/sg-tgt-160726/11HL_71SGrjR.webp",
    "albumId": "sg-tgt-160726",
    "market": "Singapore",
    "alt": "Singapore TGT group — group program",
    "width": 1108,
    "height": 1477
  },
  {
    "src": "/gallery/sg-tgt-180226/1U4J7x2dOQlN.webp",
    "albumId": "sg-tgt-180226",
    "market": "Singapore",
    "alt": "Singapore TGT group — group program",
    "width": 4032,
    "height": 3024
  },
  {
    "src": "/gallery/sg-tgt-180226/1DNZjoh8vVCg.webp",
    "albumId": "sg-tgt-180226",
    "market": "Singapore",
    "alt": "Singapore TGT group — group program",
    "width": 4032,
    "height": 3024
  },
  {
    "src": "/gallery/sg-tgt-180226/1BhN1kuNtDJK.webp",
    "albumId": "sg-tgt-180226",
    "market": "Singapore",
    "alt": "Singapore TGT group — group program",
    "width": 1706,
    "height": 960
  },
  {
    "src": "/gallery/sg-tgt-180226/1FNrJeMOo2_5.webp",
    "albumId": "sg-tgt-180226",
    "market": "Singapore",
    "alt": "Singapore TGT group — group program",
    "width": 960,
    "height": 1706
  },
  {
    src: "/gallery/coway-kanchanaburi/coway-01.webp",
    albumId: "coway-kanchanaburi",
    market: "Thailand",
    alt: "Coway Kanchanaburi group program",
    width: 5712,
    height: 4284,
  },
  {
    src: "/gallery/coway-kanchanaburi/coway-02.webp",
    albumId: "coway-kanchanaburi",
    market: "Thailand",
    alt: "Coway Kanchanaburi group program",
    width: 4284,
    height: 5712,
  },
  {
    src: "/gallery/coway-kanchanaburi/coway-03.webp",
    albumId: "coway-kanchanaburi",
    market: "Thailand",
    alt: "Coway Kanchanaburi group program",
    width: 5712,
    height: 4284,
  },
  {
    src: "/gallery/coway-kanchanaburi/coway-04.webp",
    albumId: "coway-kanchanaburi",
    market: "Thailand",
    alt: "Coway Kanchanaburi group program",
    width: 4284,
    height: 5712,
  },
  {
    src: "/gallery/coway-kanchanaburi/coway-05.webp",
    albumId: "coway-kanchanaburi",
    market: "Thailand",
    alt: "Coway Kanchanaburi group program",
    width: 5712,
    height: 4284,
  },
  {
    src: "/gallery/coway-kanchanaburi/coway-06.webp",
    albumId: "coway-kanchanaburi",
    market: "Thailand",
    alt: "Coway Kanchanaburi group program",
    width: 4284,
    height: 5712,
  },
  {
    src: "/gallery/coway-kanchanaburi/coway-07.webp",
    albumId: "coway-kanchanaburi",
    market: "Thailand",
    alt: "Coway Kanchanaburi group program",
    width: 5712,
    height: 4284,
  },
  {
    src: "/gallery/coway-kanchanaburi/coway-08.webp",
    albumId: "coway-kanchanaburi",
    market: "Thailand",
    alt: "Coway Kanchanaburi group program",
    width: 4284,
    height: 5712,
  },
  {
    src: "/gallery/coway-kanchanaburi/coway-09.webp",
    albumId: "coway-kanchanaburi",
    market: "Thailand",
    alt: "Coway Kanchanaburi group program",
    width: 5712,
    height: 4284,
  },
  {
    src: "/gallery/coway-kanchanaburi/coway-10.webp",
    albumId: "coway-kanchanaburi",
    market: "Thailand",
    alt: "Coway Kanchanaburi group program",
    width: 5712,
    height: 4284,
  },
];

export const galleryMarkets: GalleryMarket[] = [
  "All",
  "Malaysia",
  "Singapore",
  "Indonesia",
  "Thailand",
];

export function getAlbumById(id: string) {
  return galleryAlbums.find((a) => a.id === id);
}

export function getPhotosByAlbum(albumId: string) {
  return galleryPhotos.filter((p) => p.albumId === albumId);
}

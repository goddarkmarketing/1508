declare module "@svg-maps/thailand" {
  interface ThailandMapLocation {
    id: string;
    name: string;
    path: string;
  }

  interface ThailandMap {
    label: string;
    viewBox: string;
    locations: ThailandMapLocation[];
  }

  const map: ThailandMap;
  export default map;
}

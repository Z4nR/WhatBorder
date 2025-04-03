import { FeatureCollection } from 'geojson';

export interface DesktopConnectProps {
  id: string;
  desktop: string;
}

export interface SocketConnectProps {
  client: string;
  desktop: string;
}

export interface UpdateCoordinateProps {
  lat: number;
  long: number;
  client: string;
  desktop: string;
}

export interface PreviewMapProps {
  setLat: (value: React.SetStateAction<number>) => void;
  setLong: (value: React.SetStateAction<number>) => void;
  setPosition: (value: React.SetStateAction<[number, number] | null>) => void;
  position: any;
}

export interface GeoFormatProps {
  initialJson: FeatureCollection | null;
}

export interface MapViewProps {
  centerPoint: [number, number];
  mapData: FeatureCollection;
}

export interface UpdateLocationProps {
  placename: string;
  placeowner: string;
  placedesc: string;
  placeaddress: string;
  placetype: string;
  placelat: number;
  placelong: number;
}

export interface PlaceTableProps {
  place_id: string;
  place_owner: string;
  place_description: string;
  place_name: string;
  place_address: string;
  place_center_point: any;
  place_map: FeatureCollection;
  type: {
    name: string;
    label: string;
    color: string;
  };
  created_at: Date;
  updated_at: Date;
}

export interface MapInTableProps {
  place_id: string;
  place_center_point: any;
  place_map: any;
  color: string;
}

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
  placeId: string;
  placeOwner: string;
  placeDescription: string;
  placeName: string;
  placeAddress: string;
  placeCenterPoint: any;
  placeMap: {
    placeGeojson: FeatureCollection;
  };
  type: {
    name: string;
    label: string;
    color: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface MapInTableProps {
  placeId: string;
  placeCenterPoint: any;
  placeMap: {
    placeGeojson: FeatureCollection;
  };
  color: string;
}

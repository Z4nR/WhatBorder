import { FeatureCollection } from 'geojson';

export interface TablePlaceProps {
  data: any;
  loading: boolean;
  action: boolean;
}

export interface ProfileMiniDescription {
  createdAt: any;
  admin: boolean;
  description: string | null;
}

export interface ProfilePlaceProps {
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

export interface MapInProfileProps {
  place_id: string;
  place_center_point: any;
  place_map: any;
  color: string;
}

export interface MiniToolProps {
  setEdit: (state: boolean) => void;
  setDelete: (state: boolean) => void;
  myId: string;
}

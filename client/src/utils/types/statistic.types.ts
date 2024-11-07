export interface FlyMapToProps {
  position: [number, number] | null;
}

export interface MapStatDetailProps {
  data: {
    placeMap: any;
    placeId: string;
    type: {
      color: string;
    };
  };
  placeMap: any;
  position: any;
}

export interface AdminListProps {
  userId: string;
  userName: string;
  description: string;
  admin: boolean;
  createdAt: Date;
}

export interface UserListProps {
  userId: string;
  userName: string;
  description: string;
  createdAt: Date;
}

export interface PlaceListProps {
  placeId: string;
  placeName: string;
  placeAddress: string;
  type: {
    name: string;
    label: string;
  };
  createdBy: string;
  createdAt: Date;
}

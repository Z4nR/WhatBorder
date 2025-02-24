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

export interface MiniToolProps {
  setEdit: (state: boolean) => void;
  setDelete: (state: boolean) => void;
  myId: string;
}

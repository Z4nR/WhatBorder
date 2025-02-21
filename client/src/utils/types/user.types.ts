export interface UserProps {
  role: boolean;
  name: string;
  exp: number;
}

export interface UserState {
  role: boolean;
  name: string;
  exp: number;
  setUser: (state: UserProps) => void;
  clearUser: () => void;
}

export interface EditProfileCompareProps {
  username: string;
  fullname: string;
  description: string;
}

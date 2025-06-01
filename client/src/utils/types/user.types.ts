export interface UserProps {
  role: number;
  name: string;
  exp: number;
}

export interface UserState {
  role: number;
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

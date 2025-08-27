export interface UserProps {
  name: string;
  exp: number;
}

export interface UserState {
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

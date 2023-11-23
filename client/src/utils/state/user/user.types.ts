export interface UserData {
  role: boolean;
  name: string;
  exp: number;
}

export interface UserState {
  role: boolean;
  name: string;
  exp: number;
  setUser: (state: UserData) => void;
  clearUser: () => void;
}

export interface UserData {
  name: string;
  exp: number;
}

export interface UserState {
  name: string;
  exp: number;
  setUser: (state: UserData) => void;
  clearUser: () => void;
}

export interface UserData {
  id: string;
  name: string;
  exp: number;
}

export interface UserState {
  id: string;
  name: string;
  exp: number;
  setUser: (state: UserData) => void;
  clearUser: () => void;
}

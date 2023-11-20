export interface AuthData {
  accessToken: string;
}

export interface AuthState {
  accessToken: string;
  setToken: (state: AuthData) => void;
  deleteToken: () => void;
}

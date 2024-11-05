export interface AuthProps {
  accessToken: string;
}

export interface AuthState {
  accessToken: string;
  setToken: (state: AuthProps) => void;
  deleteToken: () => void;
}

export interface LoginProps {
  username: string;
  password: string;
}

export interface RegisterProps {
  username: string;
  fullname: string;
  password: string;
  verify: string;
  code: string;
}

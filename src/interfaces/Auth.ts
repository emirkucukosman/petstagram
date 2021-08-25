export interface User {
  id: string;
  email: string;
  username: string | null;
  photoURL: string | null;
}

export interface AuthState {
  isInitialised: boolean;
  isAuthenticated: boolean;
  user: User | null;
  loginStatus: "idle" | "loading" | "success" | "fail";
}

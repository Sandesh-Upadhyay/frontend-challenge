export type Role = "MANAGER" | "STORE_KEEPER";

export interface User {
  id: string;
  email: string;
  role: Role;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
}

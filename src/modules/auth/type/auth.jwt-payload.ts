export interface JwtPayload {
  username: string;
  sub: number; // User ID or other identifier
  role: string;
}

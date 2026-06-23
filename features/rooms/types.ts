export type Role = "owner" | "admin" | "user";

export interface Room {
  id?: string;
  name: string;
  description: string;
  ownerEmail: string;
  members: Record<string, Role>;
  createdAt: string;
}

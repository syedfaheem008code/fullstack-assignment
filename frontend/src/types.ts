export type Role = "ADMIN" | "EDITOR";
export interface User { id: string; name: string; email: string; role: Role; }
export interface Screen { _id: string; name: string; isActive: boolean; }
export interface PlaylistListItem { _id: string; name: string; itemCount: number; }
export interface PageResp<T> { items: T[]; page: number; limit: number; total: number; totalPages: number; }

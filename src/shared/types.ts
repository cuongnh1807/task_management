export type TJWTPayload = {
  sub: string;
  // address: string;
};

export type TUserReponse = {
  id: string;
  username?: string | null;
  email: string;
  created_at: Date;
  avatar_url?: string | null;
};

export class PaginationType<T> {
  items: T[];
  meta: {
    total: number;
    current_page: number;
    total_pages: number;
    per_page: number;
  };
}

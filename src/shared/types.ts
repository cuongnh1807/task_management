import {
  ENotificationStatus,
  EPriority,
  ETaskStatus,
  ETaskType,
} from './constants/enums';

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

export type TProjectReponse = {
  id: string;
  name: string;
  description?: string;
  created_by?: string;
  created_at?: string | Date;
  user?: {
    id: string;
    email: string;
    username?: string;
  };
};

export type TTaskReponse = {
  id: string;
  title: string;
  description?: string;
  status: ETaskStatus;
  priority: EPriority;
  type: ETaskType;
  code?: string;
};

export type TNotificationReponse = {
  id: string;
  content: string;
  task_id: string;
  user_id: string;
  status: ENotificationStatus;
  created_at: Date | string;
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

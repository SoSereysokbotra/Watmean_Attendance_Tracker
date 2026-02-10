export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface RefreshToken {
  user_agent: any;
  device_info: any;
  id: string;
  created_at: string;
  updated_at: string;
  token_hash: string;
  user_id: string;
  family_id: string;
  expires_at: string;
  revoked_at: string | null;
}

export interface User {
  id: string;
  created_at: string;
  updated_at: string;
  email: string;
  password?: string;
  full_name?: string;
  role: string;
  is_verified: boolean;
  status: string;
  student_id?: string | null;
  teacher_id?: string | null;
}

export interface VerificationCode {
  id: string;
  created_at: string;
  user_id: string;
  code_hash: string;
  purpose: string;
  expires_at: string;
  last_sent_at: string;
}

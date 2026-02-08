import { supabase } from "@/lib/supabase/client";
import { RefreshToken } from "@/lib/supabase/types";

export class RefreshTokenRepository {
  static async create(
    token: Omit<RefreshToken, "id" | "created_at" | "updated_at">,
  ): Promise<RefreshToken> {
    const { data, error } = await supabase
      .from("refresh_tokens")
      .insert([token])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  static async findByTokenHash(
    tokenHash: string,
  ): Promise<RefreshToken | null> {
    const { data, error } = await supabase
      .from("refresh_tokens")
      .select("*")
      .eq("token_hash", tokenHash)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }

    return data;
  }

  static async findByFamilyId(familyId: string): Promise<RefreshToken[]> {
    const { data, error } = await supabase
      .from("refresh_tokens")
      .select("*")
      .eq("family_id", familyId);

    if (error) {
      throw error;
    }

    return data;
  }

  static async revokeToken(tokenHash: string): Promise<void> {
    const { error } = await supabase
      .from("refresh_tokens")
      .update({ revoked_at: new Date().toISOString() })
      .eq("token_hash", tokenHash);

    if (error) {
      throw error;
    }
  }

  static async revokeAllTokensForUser(userId: string): Promise<void> {
    const { error } = await supabase
      .from("refresh_tokens")
      .update({ revoked_at: new Date().toISOString() })
      .eq("user_id", userId)
      .is("revoked_at", null);

    if (error) {
      throw error;
    }
  }

  static async deleteExpiredTokens(): Promise<void> {
    const { error } = await supabase
      .from("refresh_tokens")
      .delete()
      .lt("expires_at", new Date().toISOString());

    if (error) {
      throw error;
    }
  }

  static async getActiveSessions(userId: string): Promise<RefreshToken[]> {
    const { data, error } = await supabase
      .from("refresh_tokens")
      .select("*")
      .eq("user_id", userId)
      .is("revoked_at", null)
      .gt("expires_at", new Date().toISOString());

    if (error) {
      throw error;
    }

    return data;
  }
}

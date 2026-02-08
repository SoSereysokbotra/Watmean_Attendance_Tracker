import { supabase } from "@/lib/supabase/client";
import { VerificationCode } from "@/lib/supabase/types";

export class VerificationCodeRepository {
  static async create(
    code: Omit<VerificationCode, "id" | "created_at">,
  ): Promise<VerificationCode> {
    const { data, error } = await supabase
      .from("verification_codes")
      .insert([code])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  static async findByUserIdAndPurpose(
    userId: string,
    purpose: string,
  ): Promise<VerificationCode | null> {
    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("user_id", userId)
      .eq("purpose", purpose)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }

    return data;
  }

  static async deleteByUserIdAndPurpose(
    userId: string,
    purpose: string,
  ): Promise<void> {
    const { error } = await supabase
      .from("verification_codes")
      .delete()
      .eq("user_id", userId)
      .eq("purpose", purpose);

    if (error) {
      throw error;
    }
  }

  static async deleteExpiredCodes(): Promise<void> {
    const { error } = await supabase
      .from("verification_codes")
      .delete()
      .lt("expires_at", new Date().toISOString());

    if (error) {
      throw error;
    }
  }
}

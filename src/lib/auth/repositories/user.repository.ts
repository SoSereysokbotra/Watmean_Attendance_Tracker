import { supabase } from "@/lib/supabase/client";
import { User } from "@/lib/supabase/types";

export class UserRepository {
  static async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }

    return data;
  }

  static async findById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }

    return data;
  }

  static async create(
    user: Omit<User, "id" | "created_at" | "updated_at">,
  ): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .insert([user])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  static async update(id: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) {
      throw error;
    }
  }
}

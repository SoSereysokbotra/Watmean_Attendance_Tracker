import { db } from "@/lib/db";
import { invitations } from "@/lib/db/schema/invitations.schema";
import { eq } from "drizzle-orm";

export class InvitationRepository {
  static async create(data: {
    email: string;
    token: string;
    role: "student" | "teacher" | "admin";
    expiresAt: Date;
  }) {
    const result = await db.insert(invitations).values(data).returning();
    return result[0];
  }

  static async findByToken(token: string) {
    const result = await db
      .select()
      .from(invitations)
      .where(eq(invitations.token, token));
    return result[0];
  }

  static async findAll() {
    return await db.select().from(invitations);
  }

  static async findById(id: string) {
    const result = await db
      .select()
      .from(invitations)
      .where(eq(invitations.id, id));
    return result[0];
  }

  static async markAsAccepted(id: string) {
    const result = await db
      .update(invitations)
      .set({ status: "accepted", updatedAt: new Date() })
      .where(eq(invitations.id, id))
      .returning();
    return result[0];
  }

  static async markAsExpired(id: string) {
    const result = await db
      .update(invitations)
      .set({ status: "expired", updatedAt: new Date() })
      .where(eq(invitations.id, id))
      .returning();
    return result[0];
  }
}

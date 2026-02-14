import { NextRequest, NextResponse } from "next/server";
import { InvitationRepository } from "@/lib/db/repositories/invitations.repository";
import { z } from "zod";
import { nanoid } from "nanoid";
import { requireAdmin } from "@/lib/auth/middleware/rbac.middleware";
import { EmailService } from "@/lib/auth/services/email.service";

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["teacher", "admin"]), // Only allow inviting teachers or admins
  name: z.string().min(1).optional(), // Optional display name for the invite
});

export async function GET(request: NextRequest) {
  try {
    // Check admin authorization
    const authError = requireAdmin(request);
    if (authError) return authError;

    const invitations = await InvitationRepository.findAll();
    return NextResponse.json({ success: true, data: invitations });
  } catch (error) {
    console.error("Failed to fetch invitations:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin authorization
    const authError = requireAdmin(request);
    if (authError) return authError;

    const body = await request.json();
    const { email, role, name } = inviteSchema.parse(body);

    const token = `invite_${nanoid(12)}`; // e.g., invite_AbCdEf123456
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invitation = await InvitationRepository.create({
      email,
      token,
      role,
      expiresAt,
    });

    // Send invitation email with secure registration link
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    const link = `${baseUrl}/register?token=${token}`;
    await EmailService.sendInvitationEmail(email, link, { role, name });

    return NextResponse.json(
      { success: true, data: invitation },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: error.issues },
        { status: 400 },
      );
    }
    console.error("Failed to create invitation:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

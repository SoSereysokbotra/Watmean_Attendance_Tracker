import { NextRequest, NextResponse } from "next/server";
import { InvitationRepository } from "@/lib/db/repositories/invitations.repository";
import { requireAdmin } from "@/lib/auth/middleware/rbac.middleware";
import { EmailService } from "@/lib/auth/services/email.service";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    // Check admin authorization
    const authError = requireAdmin(request);
    if (authError) return authError;

    const { id } = await params;
    const invitation = await InvitationRepository.findById(id);

    if (!invitation) {
      return NextResponse.json(
        { success: false, message: "Invitation not found" },
        { status: 404 },
      );
    }

    if (invitation.status !== "pending") {
      return NextResponse.json(
        {
          success: false,
          message: "Only pending invitations can be resent.",
        },
        { status: 400 },
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    const link = `${baseUrl}/register?token=${invitation.token}`;

    await EmailService.sendInvitationEmail(invitation.email, link, {
      role: invitation.role,
    });

    return NextResponse.json({
      success: true,
      message: "Invitation email resent.",
    });
  } catch (error) {
    console.error("Failed to resend invitation:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { InvitationRepository } from "@/lib/db/repositories/invitations.repository";

interface RouteParams {
  params: Promise<{
    token: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { token } = await params;
    const invitation = await InvitationRepository.findByToken(token);

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
          message: "Invitation is no longer valid.",
        },
        { status: 400 },
      );
    }

    if (new Date(invitation.expiresAt) < new Date()) {
      // Soft-expire here for safety (doesn't need to be awaited by caller)
      await InvitationRepository.markAsExpired(invitation.id);
      return NextResponse.json(
        { success: false, message: "Invitation has expired." },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        email: invitation.email,
        role: invitation.role,
      },
    });
  } catch (error) {
    console.error("Failed to fetch invitation by token:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

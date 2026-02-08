import { NextRequest, NextResponse } from "next/server";
import { RefreshTokenRepository } from "@/lib/auth/repositories/refreshToken.repository";
import {
  authenticate,
  getAuthUser,
} from "@/lib/auth/middleware/auth.middleware";

interface RouteParams {
  params: {
    sessionId: string;
  };
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  // Authenticate request
  const authResponse = await authenticate(request);
  if (authResponse.status !== 200) {
    return authResponse;
  }

  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    const { sessionId } = params;

    // Get the token to verify ownership
    const sessions = await RefreshTokenRepository.getActiveSessions(user.id);
    const sessionToRevoke = sessions.find((s) => s.id === sessionId);

    if (!sessionToRevoke) {
      return NextResponse.json(
        { success: false, message: "Session not found" },
        { status: 404 },
      );
    }

    // Revoke the specific session
    await RefreshTokenRepository.revokeToken(sessionToRevoke.token_hash);

    return NextResponse.json({
      success: true,
      message: "Session revoked successfully",
    });
  } catch (error) {
    console.error("Revoke session error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

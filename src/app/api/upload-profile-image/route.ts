import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { CookieUtil } from "@/lib/auth/utils/cookie.util";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { JwtPayload } from "@/lib/auth/types";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const accessToken = await CookieUtil.getAccessTokenCookie();
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded: JwtPayload;
    try {
      decoded = TokenUtil.verifyAccessToken(accessToken);
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get file from request
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!file || !userId) {
      return NextResponse.json(
        { error: "Missing file or userId" },
        { status: 400 },
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary
    return new Promise((resolve) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "watmean/profiles",
          public_id: `${userId}_${Date.now()}`,
          overwrite: true,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            resolve(
              NextResponse.json(
                { error: error.message || "Upload failed" },
                { status: 500 },
              ),
            );
          } else {
            resolve(NextResponse.json({ secure_url: result?.secure_url }));
          }
        },
      );

      stream.end(buffer);
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

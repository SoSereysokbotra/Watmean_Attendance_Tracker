import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { authConfig } from "@/lib/auth/config";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define paths that are accessible to everyone (authenticated or not)
  const isPublicPath = pathname === "/" || pathname.startsWith("/api/auth"); // Even if API excluded by matcher, handle gracefully

  // Define auth-only paths (only for unauthenticated users)
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/verify" ||
    pathname.startsWith("/forgot");

  // Get token from cookies
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;

  // 1. Redirect if unauthenticated user tries to access private routes
  if (!isPublicPath && !isAuthPage && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Redirect if authenticated user tries to access auth-only routes (like login/register)
  if (isAuthPage && token) {
    try {
      const secret = new TextEncoder().encode(authConfig.jwt.accessSecret);
      const { payload } = await jwtVerify(token, secret);
      const role = payload.role as string;

      // Redirect based on role
      if (role === "teacher") {
        return NextResponse.redirect(
          new URL("/teacher/dashboard", request.url),
        );
      } else if (role === "student") {
        return NextResponse.redirect(
          new URL("/student/dashboard", request.url),
        );
      } else if (role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    } catch (error) {
      const response = NextResponse.next();
      response.cookies.delete(authConfig.cookies.accessToken);
      return response;
    }
  }

  // 3. For protected routes, verify token and role
  if (!isPublicPath && token) {
    try {
      const secret = new TextEncoder().encode(authConfig.jwt.accessSecret);
      const { payload } = await jwtVerify(token, secret);
      const role = payload.role as string;

      // Role-based access control
      if (pathname.startsWith("/teacher") && role !== "teacher") {
        if (role === "student") {
          return NextResponse.redirect(
            new URL("/student/dashboard", request.url),
          );
        } else if (role === "admin") {
          // Admin might have access, but strictly per requirements:
          return NextResponse.redirect(
            new URL("/admin/dashboard", request.url),
          );
        }
        return NextResponse.redirect(new URL("/login", request.url));
      }

      if (pathname.startsWith("/student") && role !== "student") {
        if (role === "teacher") {
          return NextResponse.redirect(
            new URL("/teacher/dashboard", request.url),
          );
        }
        return NextResponse.redirect(new URL("/login", request.url));
      }

      if (pathname.startsWith("/admin") && role !== "admin") {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // Add user info to headers for easier access in server components/API
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", payload.id as string);
      requestHeaders.set("x-user-role", role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      // Token invalid or expired
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete(authConfig.cookies.accessToken);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

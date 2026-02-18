import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

const protectedRoutes = ["/articles/new", "/my-articles", "/profile/edit"];
const authRoutes = ["/login", "/register"];

// Helper function to check if path matches protected route patterns
function isProtectedPath(pathname: string): boolean {
  // Check exact matches
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    return true;
  }

  // Check dynamic patterns
  const protectedPatterns = [
    /^\/articles\/[^/]+\/edit$/, // /articles/{slug}/edit
    /^\/[^/]+\/articles$/, // /{username}/articles
  ];

  return protectedPatterns.some((pattern) => pattern.test(pathname));
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const session = token ? await verifyToken(token) : null;

  const pathname = request.nextUrl.pathname;

  const isProtected = isProtectedPath(pathname);
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

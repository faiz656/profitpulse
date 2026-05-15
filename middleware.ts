import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_ROUTES = ["/auth/login", "/auth/signup", "/auth/forgot-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for Supabase session cookie
  const hasSession = Array.from(request.cookies.getAll()).some(
    c => c.name.includes("auth-token") || c.name.includes("supabase") || c.name.includes("sb-")
  );

  const isAuthRoute = AUTH_ROUTES.some(p => pathname.startsWith(p));

  // If Supabase not configured, allow everything (dev mode)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isConfigured = supabaseUrl && supabaseUrl !== "your_supabase_url_here";
  if (!isConfigured) return NextResponse.next();

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow everything else — dashboard works in demo mode without login
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/src/lib/auth";

const PROTECTED_ROUTES = ["/dashboard"];

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({ headers: req.headers });

  if (session) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("callbackUrl", pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/dashboard/:path*", // protect everything inside /dashboard
  ],
};

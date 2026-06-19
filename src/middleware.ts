import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest } from "next/server";

export default withAuth(async function proxy(request: NextRequest) {}, {
  isReturnToCurrentPage: true,
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/analyses/:path*",
    "/settings/:path*",
  ],
};

/* import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*"],
}; */

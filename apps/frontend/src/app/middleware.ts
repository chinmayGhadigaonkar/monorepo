import { getCookieCache } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

import { rateLimiter } from "@/lib/rate-limiter";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip static assets and Next.js internals
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/favicon") ||
        pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff2?)$/)
    ) {
        return NextResponse.next();
    }

    // Skip auth routes — never rate-limit or redirect sign-in/sign-up
    if (
        pathname.startsWith("/signin") ||
        pathname.startsWith("/signup") ||
        pathname.startsWith("/api/auth")
    ) {
        return NextResponse.next();
    }

    const ip = request.headers.get("x-forwarded-for") ?? "anonymous";

    // Rate limit all other routes
    const { success } = await rateLimiter.limit(ip);
    if (!success) {
        return new NextResponse("Too many requests", { status: 429 });
    }

    // Allow API routes through after rate limiting
    if (pathname.startsWith("/api")) {
        return NextResponse.next();
    }

    // Protect page routes — redirect unauthenticated users
    const session = await getCookieCache(request);
    if (!session) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }
    const workspaceId = session.user.lastUsedWorkspaceId;
    if (!workspaceId) {
        return NextResponse.redirect(new URL("/workspace/new", request.url));
    }

    return NextResponse.next();
}

export const config = {
    // Exclude static files at the matcher level too
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

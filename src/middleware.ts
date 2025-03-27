import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export const middleware = async (request: NextRequest) => {
    const { pathname } = request.nextUrl;

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (pathname.startsWith("/admin")) {
        if (!token || token.role !== "admin") {
            return NextResponse.redirect(new URL("/dang-nhap", request.url));
        }
    }

    if (pathname === "/api/card-charge") {
        if (!token) {
            return NextResponse.json(
                { result: false, message: "Bạn cần đăng nhập để thực hiện giao dịch." },
                { status: 401 }
            );
        }
    }

    return NextResponse.next();
};

export const config = {
    matcher: ["/admin/:path*", "/api/card-charge/:path*"],
};
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Các đường dẫn không yêu cầu đăng nhập
const publicPaths = ["/auth"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Nếu là trang public → cho qua
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // ✅ Lấy token từ cookie (do bạn set trong lúc đăng nhập)
  const token = req.cookies.get("token")?.value;

  // ❌ Nếu không có token → chuyển hướng về /auth
  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/auth";
    loginUrl.search = ""; // xoá query để tránh redirect vòng
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Có token → cho phép truy cập
  return NextResponse.next();
}

// ✅ Chỉ áp dụng middleware cho các route được bảo vệ
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|auth|login|register).*)",
  ],
};

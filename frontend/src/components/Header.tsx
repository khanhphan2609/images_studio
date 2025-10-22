import Link from "next/link";
import React from "react";

/**
 * Placeholder cho icon logo của remove.bg.
 * Trong một dự án thực tế, bạn nên thay thế điều này bằng file SVG hoặc Image.
 */
const LogoIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-gray-900" // Lấy màu từ text-gray-900 của Tailwind
  >
    <path
      d="M7.40013 4.40013L4.40013 7.40013V20.6001L7.40013 23.6001H20.6001L23.6001 20.6001V7.40013L20.6001 4.40013H7.40013Z"
      stroke="currentColor"
      strokeWidth="2.5"
    />
    <path
      d="M14 14H23.6001V7.40013L20.6001 4.40013H14V14Z"
      fill="currentColor"
    />
  </svg>
);

const Header = () => {
  return (
    <header className="w-full bg-white border-b border-gray-200 fixed">
      <nav className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Phần bên trái: Logo + Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <LogoIcon />
            <span className="font-bold text-xl text-gray-900">
              khanhphan.studio
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-6">
            <li>
              <Link
                href="/upload"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Nội dung tải lên
              </Link>
            </li>
            <li>
              <Link
                href="/editor"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Chỉnh sửa hàng loạt
              </Link>
            </li>
          </ul>
        </div>

        {/* Phần bên phải: Nút Đăng nhập / Đăng ký */}
        <div className="flex items-center gap-4">
          <Link
            href="/auth"
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Đăng nhập
          </Link>
          <Link
            href="/auth"
            className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors"
          >
            Đăng ký
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;

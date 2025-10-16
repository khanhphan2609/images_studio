"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, LogOut } from "lucide-react";
import "@/assets/css/header.css";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // Kiểm tra xem người dùng đã đăng nhập chưa
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUsername = localStorage.getItem("username");
    if (token && savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
    window.location.href = "/auth"; // chuyển hướng về trang đăng nhập
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Links */}
          <div className="flex items-center gap-6">
            <a href="" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-semibold shadow-md">
                KD
              </div>
              <span className="hidden sm:inline-block text-lg font-semibold leading-none">
                Khánh Phan Studio
              </span>
            </a>

            <nav className="hidden md:flex items-center space-x-4">
              <a
                href="/uploads"
                className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Nội dung tải lên
              </a>
              <a
                href="/editor"
                className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Chỉnh sửa hàng loạt
              </a>
            </nav>
          </div>

          {/* Nếu đã đăng nhập */}
          {username ? (
            <div className="hidden md:flex items-center space-x-3">
              <span className="text-sm font-medium text-slate-700">
                👋 {username}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md bg-red-500 text-white text-sm font-medium hover:bg-red-600 flex items-center gap-1"
              >
                <LogOut size={16} />
                Đăng xuất
              </button>
            </div>
          ) : (
            /* Nếu chưa đăng nhập */
            <div className="hidden md:flex items-center space-x-3">
              <a href="/auth" className="px-3 py-2 button">
                Đăng nhập
              </a>
              <a href="/auth" className="px-3 py-2 button">
                Đăng ký
              </a>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-slate-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-4 space-y-2">
          <a
            href="/uploads"
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Nội dung tải lên
          </a>
          <a
            href="/editor"
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Chỉnh sửa hàng loạt
          </a>

          {username ? (
            <>
              <div className="block px-3 py-2 text-sm font-medium text-slate-700">
                👋 {username}
              </div>
              <button
                onClick={handleLogout}
                className="w-full block px-3 py-2 button"
              >
              </button>
            </>
          ) : (
            <>
              <a
                href="/auth"
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Đăng nhập
              </a>
              <a
                href="/auth"
                className="block px-3 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 text-center"
              >
                Đăng ký
              </a>
            </>
          )}
        </div>
      )}
    </header>
  );
}

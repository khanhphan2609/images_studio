// app/login/page.tsx
"use client";
import { useState } from "react";
import { loginUser } from "@/lib/webauthn";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const result = await loginUser(username);
      if (result.success) {
        localStorage.setItem("token", result.token);
        setMessage("✅ Đăng nhập thành công!");
      } else {
        setMessage("❌ Sai thông tin hoặc chưa đăng ký.");
      }
    } catch (e: any) {
      setMessage("❌ Lỗi: " + e.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Đăng nhập bằng Face ID / Vân tay</h2>
        <input
          type="text"
          className="border w-full p-2 rounded mb-3"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Đăng nhập
        </button>
        {message && <p className="text-center mt-3 text-sm">{message}</p>}
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { registerUser } from "@/lib/webauthn";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username.trim()) {
      setMessage("⚠️ Vui lòng nhập tên đăng nhập!");
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      const result = await registerUser(username);
      if (result.success) {
        setMessage("✅ Đăng ký thành công! Bạn có thể đăng nhập.");
      } else {
        setMessage("❌ Đăng ký thất bại: " + (result.error || "Không rõ nguyên nhân"));
      }
    } catch (e: any) {
      console.error(e);
      setMessage("❌ Lỗi frontend: " + (e?.message || "Không rõ nguyên nhân"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Đăng ký sinh trắc học</h2>
        <input
          type="text"
          className="border w-full p-2 rounded mb-3"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          onClick={handleRegister}
          disabled={loading}
          className={`w-full p-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Đang xử lý..." : "Đăng ký"}
        </button>
        {message && <p className="text-center mt-3 text-sm">{message}</p>}
      </div>
    </div>
  );
}
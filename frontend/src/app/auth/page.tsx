"use client";
import { useState } from "react";
import { loginUser, registerUser } from "@/lib/webauthn";
import "@/assets/css/auth.css"; 

export default function AuthPage() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Xử lý đăng nhập
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return setMessage("⚠️ Vui lòng nhập tên đăng nhập!");

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

  // Xử lý đăng ký
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return setMessage("⚠️ Vui lòng nhập tên đăng nhập!");

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
      setMessage("❌ Lỗi frontend: " + (e?.message || "Không rõ nguyên nhân"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <div className="card-switch">
        <label className="switch">
          {/* Checkbox điều khiển flip */}
          <input type="checkbox" className="toggle" />
          <span className="slider"></span>
          <span className="card-side"></span>

          {/* Nội dung chính (flip-card) */}
          <div className="flip-card__inner">
            {/* --- Mặt trước: Đăng nhập --- */}
            <div className="flip-card__front">
              <div className="title">Đăng nhập bằng sinh trắc học</div>
              <form className="flip-card__form" onSubmit={handleLogin}>
                <input
                  className="flip-card__input"
                  placeholder="Tên đăng nhập"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <button type="submit" className="flip-card__btn">
                  Đăng nhập
                </button>
              </form>
              {message && <p className="text-sm mt-2">{message}</p>}
            </div>

            {/* --- Mặt sau: Đăng ký --- */}
            <div className="flip-card__back">
              <div className="title">Đăng ký bằng sinh trắc học</div>
              <form className="flip-card__form" onSubmit={handleRegister}>
                <input
                  className="flip-card__input"
                  placeholder="Tên đăng nhập"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="flip-card__btn"
                >
                  {loading ? "Đang xử lý..." : "Đăng ký"}
                </button>
              </form>
              {message && <p className="text-sm mt-2">{message}</p>}
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}

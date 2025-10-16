"use client";

import { useState, useRef, DragEvent } from "react";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

export default function UploadsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  // 📁 Xử lý chọn tệp
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) readAndSaveFile(selected);
  };

  // 📂 Xử lý kéo/thả file
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) readAndSaveFile(droppedFile);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // 📸 Đọc và lưu ảnh vào localStorage an toàn
  const readAndSaveFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("❌ Vui lòng chọn một tệp hình ảnh hợp lệ!");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (!result.startsWith("data:image")) {
        alert("⚠️ File không hợp lệ hoặc không đọc được!");
        return;
      }

      localStorage.setItem("uploadedImage", result);
      router.push("/editor");
    };
    reader.onerror = () => {
      alert("❌ Không thể đọc tệp. Vui lòng thử lại!");
    };
    reader.readAsDataURL(file);
  };

  // 🌐 Xử lý nhập URL ảnh an toàn
  const handleUploadFromUrl = async () => {
    const url = imageUrl.trim();
    if (!url) {
      alert("⚠️ Vui lòng nhập đường dẫn hình ảnh!");
      return;
    }

    try {
      // Kiểm tra định dạng URL
      new URL(url);

      // Kiểm tra ảnh có tải được không (CORS-safe)
      const response = await fetch(url);
      if (
        !response.ok ||
        !response.headers.get("content-type")?.startsWith("image")
      ) {
        throw new Error("URL không phải hình ảnh hợp lệ!");
      }

      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64 = reader.result as string;
        localStorage.setItem("uploadedImage", base64);
        router.push("/editor");
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error(error);
      alert("❌ URL không hợp lệ hoặc không thể tải hình ảnh!");
    }
  };

  return (
    <div className="container mx-auto grid grid-rows-[auto_1fr_auto] min-h-screen gap-12 px-4">
      <Header />

      <main className="flex flex-col items-center justify-center text-center gap-6 row-start-2">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-2">
          Tải lên hình ảnh để chỉnh sửa
          <span className="text-yellow-400 text-5xl leading-none">✦</span>
        </h1>

        {/* Khu vực kéo-thả */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`w-full max-w-xl h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400"
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          <p className="text-gray-600 text-lg mb-2">
            Kéo và thả hình ảnh vào đây
          </p>
          <p className="text-gray-500 text-sm">
            hoặc{" "}
            <span className="text-blue-600 underline">chọn tệp từ máy</span>
          </p>
        </div>

        {/* hoặc nhập URL ảnh */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mt-4">
          <input
            type="text"
            placeholder="Dán URL hình ảnh tại đây..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-72 sm:w-96 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
          <button
            onClick={handleUploadFromUrl}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-all shadow-md"
          >
            Tải từ URL
          </button>
        </div>

        {/* Ghi chú điều khoản */}
        <p className="text-gray-500 text-sm max-w-lg mt-6">
          Khi tải lên một hình ảnh hoặc URL tức là bạn đồng ý với{" "}
          <a href="#" className="text-blue-600 underline">
            Điều khoản dịch vụ
          </a>{" "}
          của chúng tôi. Để tìm hiểu thêm, vui lòng xem{" "}
          <a href="#" className="text-blue-600 underline">
            Chính sách quyền riêng tư
          </a>
          .
        </p>
      </main>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  Download,
  Scissors,
  ImageIcon,
  Sparkles,
  SlidersHorizontal,
  LayoutTemplate,
  ArrowLeft,
  Plus,
  Trash2,
} from "lucide-react";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

export default function EditorPage() {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const router = useRouter();

  // 🔹 Lấy danh sách ảnh từ localStorage khi trang mở
  useEffect(() => {
    const savedImages = localStorage.getItem("uploadedImages");
    if (savedImages) {
      setImages(JSON.parse(savedImages));
    } else {
      const singleImage = localStorage.getItem("uploadedImage");
      if (singleImage) {
        setImages([singleImage]);
        localStorage.setItem("uploadedImages", JSON.stringify([singleImage]));
      }
    }
  }, []);

  // 🔹 Lưu mảng ảnh vào localStorage mỗi khi thay đổi
  useEffect(() => {
    if (images.length > 0) {
      localStorage.setItem("uploadedImages", JSON.stringify(images));
    } else {
      localStorage.removeItem("uploadedImages");
    }
  }, [images]);

  // 🔹 Xử lý thêm ảnh mới
  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage = event.target?.result as string;
        setImages((prev) => {
          const updated = [...prev, newImage];
          localStorage.setItem("uploadedImages", JSON.stringify(updated)); // lưu ngay
          return updated;
        });
        setCurrentIndex(images.length); // chuyển sang ảnh mới
      };
      reader.readAsDataURL(file);
    }
  };

  // 🔹 Xử lý xoá ảnh
  const handleDeleteImage = (index: number) => {
    if (!confirm("🗑️ Bạn có chắc muốn xoá ảnh này không?")) return;
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    localStorage.setItem("uploadedImages", JSON.stringify(updated));

    // Nếu xóa ảnh đang hiển thị, điều chỉnh currentIndex
    if (index === currentIndex) {
      setCurrentIndex(updated.length > 0 ? Math.max(0, index - 1) : 0);
    }
  };

  const tools = [
    { name: "Phân cắt", icon: <Scissors size={18} /> },
    { name: "Nền", icon: <ImageIcon size={18} /> },
    { name: "Hiệu ứng", icon: <Sparkles size={18} /> },
    { name: "Điều chỉnh", icon: <SlidersHorizontal size={18} /> },
    { name: "Thiết kế", icon: <LayoutTemplate size={18} /> },
  ];

  if (images.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        <Header />
        <main className="flex flex-col items-center justify-center flex-1">
          <p className="text-lg mb-4">Không có hình ảnh nào được tải lên.</p>
          <button
            onClick={() => router.push("/uploads")}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-all shadow-md"
          >
            <ArrowLeft size={18} />
            Quay lại trang tải ảnh
          </button>
        </main>
      </div>
    );

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <Header />

      {/* Thanh công cụ */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-3 shadow-sm">
        <div className="flex gap-6">
          {tools.map((tool) => (
            <button
              key={tool.name}
              onClick={() => setActiveTool(tool.name)}
              className={`flex items-center gap-2 text-sm font-medium transition-all ${
                activeTool === tool.name
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              {tool.icon}
              {tool.name}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/uploads")}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
          >
            <ArrowLeft size={16} />
            Quay lại
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-full transition shadow-md">
            <Download size={16} />
            Tải xuống
          </button>
        </div>
      </div>

      {/* Khu vực chỉnh sửa ảnh */}
      <main className="flex flex-col items-center justify-center flex-1 p-4 overflow-hidden">
        <div className="relative bg-white rounded-3xl shadow-lg p-4 border border-gray-200 flex items-center justify-center max-h-[70vh]">
          <img
            src={images[currentIndex]}
            alt="Uploaded"
            className="max-h-[60vh] max-w-full object-contain rounded-2xl"
          />
          <button className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-white/90 border border-gray-200 rounded-full px-4 py-1 text-sm font-medium text-gray-700 shadow-md hover:bg-gray-100 transition">
            ✦ Tạo nền Magic
          </button>
        </div>

        {/* Thumbnail nhỏ */}
        <div className="flex gap-4 mt-4">
          {images.map((img, i) => (
            <div key={i} className="relative">
              <button
                onClick={() => setCurrentIndex(i)}
                className={`w-14 h-14 rounded-xl p-1 shadow-sm transition ${
                  i === currentIndex
                    ? "border-2 border-blue-500 bg-white"
                    : "border border-gray-300 hover:border-blue-300"
                }`}
              >
                <img
                  src={img}
                  alt={`thumb-${i}`}
                  className="rounded-lg object-contain w-full h-full"
                />
              </button>

              {/* Nút xoá ảnh */}
              <button
                onClick={() => handleDeleteImage(i)}
                className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full p-1 shadow hover:bg-red-50 hover:text-red-500 transition"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          {/* Nút thêm ảnh */}
          <label className="w-14 h-14 flex items-center justify-center rounded-xl border border-gray-300 text-gray-400 hover:bg-gray-50 cursor-pointer transition">
            <Plus size={18} />
            <input
              type="file"
              accept="image/*"
              onChange={handleAddImage}
              className="hidden"
            />
          </label>
        </div>
      </main>
    </div>
  );
}

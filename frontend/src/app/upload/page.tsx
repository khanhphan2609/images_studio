"use client";

import React, { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const uploadImage = (src: string) => {
    const saved = localStorage.getItem("uploadedImages");
    const images = saved ? JSON.parse(saved) : [];
    images.push(src);
    localStorage.setItem("uploadedImages", JSON.stringify(images));
    router.push("/editor");
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => uploadImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleURLUpload = () => {
    const url = prompt("Nhập URL ảnh:");
    if (!url) return;
    uploadImage(url);
  };

  // Drag & Drop toàn màn hình
  useEffect(() => {
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer?.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => uploadImage(reader.result as string);
      reader.readAsDataURL(file);
    };
    const handleDragOver = (e: DragEvent) => e.preventDefault();
    window.addEventListener("drop", handleDrop);
    window.addEventListener("dragover", handleDragOver);
    return () => {
      window.removeEventListener("drop", handleDrop);
      window.removeEventListener("dragover", handleDragOver);
    };
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-gray-50">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10">
        Tải lên hình ảnh
      </h1>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileInput}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-blue-700 transition-colors mb-4"
      >
        Tải lên từ máy
      </button>

      <button
        onClick={handleURLUpload}
        className="text-blue-600 underline hover:text-blue-700 mb-4"
      >
        Nhập URL ảnh
      </button>

      <p className="mt-6 text-gray-500">
        Hoặc kéo thả ảnh vào bất kỳ đâu trên màn hình
      </p>
    </main>
  );
}

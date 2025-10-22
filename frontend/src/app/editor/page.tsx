"use client";

import React, { useRef, useState } from "react";
import useUploadImage from "@/hooks/useUploadImage";
import EditorNavbar from "@/components/EditorNavbar";

export default function EditorPage() {
  const { images, addImage, removeImage } = useUploadImage();
  const [mainIndex, setMainIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => addImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAction = (action: string) => {
    console.log("🔧 Chức năng được chọn:", action);
    // ví dụ: if (action === "crop") openCropModal();
  };

  if (images.length === 0)
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <p className="text-gray-500">
          Chưa có ảnh để hiển thị. Vui lòng <a className="underline" href="/upload">tải ảnh lên!</a>
        </p>
      </div>
    );

  const mainImage = images[mainIndex];

  return (
    <main className="flex flex-col items-center justify-start min-h-screen px-4 py-8 bg-gray-50">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-15">Editor</h1>

      <EditorNavbar onAction={handleAction} />

      {/* Ảnh chính */}
      <div className="mb-6">
        <img
          src={mainImage}
          alt="Main"
          className="max-w-full max-h-[60vh] object-contain rounded-md shadow-md"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-4 flex-wrap justify-center">
        {images.map((img, index) => (
          <div key={index} className="relative">
            <img
              src={img}
              alt={`Thumbnail ${index}`}
              className={`w-16 h-16 object-cover rounded-md shadow-md cursor-pointer ${
                index === mainIndex ? "ring-4 ring-blue-500" : ""
              }`}
              onClick={() => setMainIndex(index)}
            />
            <button
              onClick={() => {
                removeImage(index);
                if (index === mainIndex) setMainIndex(0);
                else if (index < mainIndex) setMainIndex(mainIndex - 1);
              }}
              className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}

        {/* Ô thêm ảnh */}
        <div className="w-16 h-16 border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center cursor-pointer hover:border-blue-600 relative">
          <input
            type="file"
            accept="image/*"
            className="absolute w-16 h-16 opacity-0 cursor-pointer"
            ref={fileInputRef}
            onChange={handleFileInput}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-500 text-3xl font-bold"
          >
            +
          </button>
        </div>
      </div>
    </main>
  );
}

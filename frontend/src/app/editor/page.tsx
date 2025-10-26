"use client";

import React, { useRef, useState } from "react";
import useUploadImage from "@/hooks/useUploadImage";
import EditorNavbar from "@/components/EditorNavbar";
import CropModal from "@/components/CropModal";
import Loader from "@/components/Loader";

export default function EditorPage() {
  const { images, addImage, removeImage, updateImage } = useUploadImage();
  const [mainIndex, setMainIndex] = useState(0);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEffects, setShowEffects] = useState(false); // 🌈 Hiển thị menu hiệu ứng
  const [currentEffect, setCurrentEffect] = useState<FilterKey>("none"); // Hiệu ứng đang chọn
  const [effectValue, setEffectValue] = useState<number>(100); // % cường độ hiệu ứng
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 📤 Xử lý khi chọn ảnh
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => addImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  // ✂️ Khi lưu ảnh đã cắt
  const handleCropSave = (croppedImage: string) => {
    updateImage(mainIndex, croppedImage);
    setIsCropOpen(false);
  };

  // 🪄 Hàm xoá nền riêng biệt
  const handleRemoveBg = async () => {
    const currentImage = images[mainIndex];
    if (!currentImage) return;

    try {
      setIsProcessing(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/remove-bg`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: currentImage }),
        }
      );
      const data = await response.json();
      if (data.image) updateImage(mainIndex, data.image);
      else alert("❌ Lỗi khi xoá nền: " + (data.error || "Không xác định"));
    } catch (error) {
      console.error(error);
      alert("Không thể kết nối tới máy chủ. Vui lòng thử lại sau!");
    } finally {
      setIsProcessing(false);
    }
  };

  // 🌈 Bật/tắt menu hiệu ứng
  const handleEffects = () => {
    setShowEffects((prev) => !prev);
  };

  // Danh sách filter CSS (có thể chỉnh %)
  const filters = {
    none: (v: number) => "none",
    grayscale: (v: number) => `grayscale(${v / 100})`,
    sepia: (v: number) => `sepia(${v / 100})`,
    invert: (v: number) => `invert(${v / 100})`,
    brightness: (v: number) => `brightness(${v / 50})`,
    contrast: (v: number) => `contrast(${v / 100})`,
    blur: (v: number) => `blur(${v / 20}px)`,
  };

  type FilterKey = keyof typeof filters;

  // 📸 Áp dụng hiệu ứng
  const applyEffect = (effect: FilterKey) => {
    setCurrentEffect(effect);
    setEffectValue(100); // reset về mặc định
  };

  // ⚙️ Xử lý hành động từ navbar
  const handleAction = (action: string) => {
    if (action === "crop") setIsCropOpen(true);
    if (action === "remove-bg") handleRemoveBg();
    if (action === "effects") handleEffects(); // 🌈 Hiển thị hiệu ứng
  };

  if (images.length === 0)
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <p className="text-gray-500">
          Chưa có ảnh để hiển thị. Vui lòng{" "}
          <a
            className="underline text-blue-600 hover:text-blue-800"
            href="/upload"
          >
            tải ảnh lên!
          </a>
        </p>
      </div>
    );

  const mainImage = images[mainIndex];

  return (
    <main className="flex flex-col items-center justify-start min-h-screen px-4 py-8 bg-gray-50 relative">
      {/* Tiêu đề */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10">Editor</h1>

      {/* Thanh công cụ */}
      <EditorNavbar onAction={handleAction} />

      {/* Ảnh chính */}
      <div className="mb-6 transition-all duration-500 ease-in-out">
        <img
          src={mainImage}
          alt="Main"
          className="max-w-full max-h-[60vh] object-contain rounded-md shadow-md transition-all duration-300"
          style={{ filter: filters[currentEffect](effectValue) }}
        />
      </div>

      {/* Slider điều chỉnh cường độ */}
      {currentEffect !== "none" && (
        <div className="flex items-center gap-3 mb-6">
          <label className="text-sm font-medium text-gray-700">
            Cường độ: {effectValue}%
          </label>
          <input
            type="range"
            min="0"
            max="200"
            value={effectValue}
            onChange={(e) => setEffectValue(Number(e.target.value))}
            className="w-64 accent-blue-600 cursor-pointer"
          />
        </div>
      )}

      {/* 🌈 Danh sách hiệu ứng */}
      {showEffects && (
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          {(Object.keys(filters) as FilterKey[]).map((effect) => (
            <div
              key={effect}
              className={`relative cursor-pointer border-2 rounded-md p-1 ${
                currentEffect === effect
                  ? "border-blue-500"
                  : "border-transparent"
              }`}
              onClick={() => applyEffect(effect)}
            >
              <img
                src={mainImage}
                alt={effect}
                className="w-20 h-20 object-cover rounded-md"
                style={{ filter: filters[effect](100) }}
              />
              <span className="absolute bottom-1 left-1 right-1 text-center text-xs bg-black/50 text-white rounded-md">
                {effect}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Danh sách ảnh nhỏ */}
      <div className="flex gap-4 flex-wrap justify-center">
        {images.map((img, index) => (
          <div key={index} className="relative">
            <img
              src={img}
              alt={`Thumbnail ${index}`}
              className={`w-16 h-16 object-cover rounded-md shadow-md cursor-pointer transition-all ${
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
              className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
            >
              ×
            </button>
          </div>
        ))}

        {/* Nút thêm ảnh */}
        <div
          className="w-16 h-16 border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center cursor-pointer hover:border-blue-600 relative"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            accept="image/*"
            className="absolute w-16 h-16 opacity-0 cursor-pointer"
            ref={fileInputRef}
            onChange={handleFileInput}
          />
          <span className="text-gray-500 text-3xl font-bold">+</span>
        </div>
      </div>

      {/* Modal cắt ảnh */}
      {isCropOpen && (
        <CropModal
          image={mainImage}
          onClose={() => setIsCropOpen(false)}
          onSave={handleCropSave}
        />
      )}

      {/* Loader khi xử lý */}
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xl font-semibold z-40">
          <Loader />
        </div>
      )}
    </main>
  );
}

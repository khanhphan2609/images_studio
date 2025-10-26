"use client";

import React, { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg } from "@/utils/cropImage"; // cần có utils này

interface CropModalProps {
  image: string;
  onClose: () => void;
  onSave: (croppedImage: string) => void;
}

export default function CropModal({ image, onClose, onSave }: CropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSave = async () => {
    const croppedImage = await getCroppedImg(image, croppedAreaPixels);
    onSave(croppedImage);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-4 shadow-lg w-[90%] max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">✂️ Cắt ảnh</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Cropper */}
        <div className="relative w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col mt-4 space-y-3">
          {/* Zoom */}
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-600">🔍 Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-2/3"
            />
          </div>

          {/* Aspect Ratio Options */}
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {[
              { label: "Tự do", value: undefined },
              { label: "1:1", value: 1 },
              { label: "16:9", value: 16 / 9 },
              { label: "4:3", value: 4 / 3 },
              { label: "3:2", value: 3 / 2 },
              { label: "9:16", value: 9 / 16 },
            ].map((option) => (
              <button
                key={option.label}
                onClick={() => setAspect(option.value)}
                className={`px-3 py-1 rounded-full text-sm border ${
                  aspect === option.value
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex justify-between mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
            >
              Huỷ
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Lưu ảnh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

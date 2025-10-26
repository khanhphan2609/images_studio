"use client";

import { useState, useEffect } from "react";

export default function useUploadImage() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("uploadedImages");
    if (saved) setImages(JSON.parse(saved));
  }, []);

  const saveImages = (imgs: string[]) => {
    setImages(imgs);
    localStorage.setItem("uploadedImages", JSON.stringify(imgs));
  };

  const addImage = (img: string) => {
    const newImages = [...images, img];
    saveImages(newImages);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    saveImages(newImages);
  };

   const updateImage = (index: number, newImg: string) => {
    const newImages = [...images];
    newImages[index] = newImg;
    saveImages(newImages);
  };

  return {
    images,
    addImage,
    removeImage,
    updateImage,
    setImages,
  };
}

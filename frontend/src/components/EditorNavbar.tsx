"use client";

import React from "react";

interface EditorNavbarProps {
  onAction?: (action: string) => void;
}

export default function EditorNavbar({ onAction }: EditorNavbarProps) {
  const actions = [
    { name: "Cắt ảnh", icon: "✂️", key: "crop" },
    { name: "Xoá nền", icon: "🪄", key: "remove-bg" },
    { name: "Hiệu ứng", icon: "🌈", key: "effects" },
    { name: "Sắp xếp", icon: "🧩", key: "arrange" },
    { name: "Tải Xuống", icon: "+", key: "download" },
  ];

  return (
    <nav
      className="
        fixed top-[60px] left-1/2 -translate-x-1/2
        flex items-center justify-center gap-6
        bg-white/90 backdrop-blur-sm 
        shadow-md px-6 py-2 
        border border-gray-200 
        z-30 rounded-full
      "
    >
      {actions.map((action) => (
        <button
          key={action.key}
          onClick={() => onAction?.(action.key)}
          className="
            flex items-center gap-2
            px-4 py-2
            hover:bg-gray-100 
            rounded-md 
            font-medium 
            text-sm
            transition-colors
          "
        >
          <span>{action.icon}</span>
          {action.name}
        </button>
      ))}
    </nav>
  );
}

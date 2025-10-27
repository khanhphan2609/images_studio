export const generateImage = async (bgPrompt: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/image/generate-image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: "tạo nền chính cho ảnh" + bgPrompt }),
  });
  return res.json();
};

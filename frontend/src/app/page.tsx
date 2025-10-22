import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans items-center justify-items-center min-h-screen">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start justify-center min-h-[60vh]">
        <ol className="font-sans list-inside list-decimal text-sm/6 text-center text-xl sm:text-left fo">
          <li className="mb-2 tracking-[-.01em]">
            Bắt đầu bằng việc <a className="underline" href="">tải nội dung lên</a>
          </li>
          <li className="tracking-[-.01em]">
            Tiếp tục <a className="underline" href="">chỉnh sửa ảnh</a>
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="#"
            rel="noopener noreferrer"
          >
            Hướng dẫn
          </a>
        </div>
      </main>
    </div>
  );
}

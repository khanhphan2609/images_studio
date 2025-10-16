import Image from "next/image";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="container mx-auto grid grid-rows-[auto_1fr_auto] min-h-screen gap-16">
      <Header />
      <main className="flex flex-col justify-center items-center gap-8 row-start-2">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-semibold shadow-md">
          KD
        </div>
        <ol className="list-inside list-decimal text-base leading-6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Bắt đầu bằng việc {" "}
            <a href="/uploads" className="underline underline-offset-4">
              tải ảnh lên
            </a>
            .
          </li>
          <li className="tracking-[-.01em]">
            <a href="/editor" className="underline underline-offset-4">
              Chỉnh sửa hàng loạt
            </a> theo phong cách bạn muốn.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/uploads"
            target="_blank"
            rel="noopener noreferrer"
          >
            Thử ngay
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Hướng dẫn
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        Develop by{" "}
        <a
          href="http://khanhphan.id.vn"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4"
        >
          Khánh Phan
        </a>
      </footer>
    </div>
  );
}

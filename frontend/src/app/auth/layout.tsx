export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-[400px]">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Studio Login System
        </h1>
        {children}
      </div>
    </div>
  );
}

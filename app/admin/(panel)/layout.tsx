"use client";

import "../../globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: any) {
  const pathname = usePathname();

  // ❗ Login page → NO SIDEBAR
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }
  return (
    <div className="flex min-h-screen">

      {/* LEFT SIDEBAR */}
      <div className="w-64 bg-[#F2EFE7] border-r border-gray-300 p-4">
        <h2 className="text-xl font-bold mb-6 text-[#004B4B]">
          TutorSewa Admin
        </h2>

        <nav className="flex flex-col space-y-2">

          <Link
            href="/admin/dashboard"
            className={`p-2 rounded ${
              pathname === "/admin/dashboard"
                ? "bg-[#004B4B] text-white"
                : "text-[#004B4B] hover:bg-gray-200"
            }`}
          >
            Dashboard
          </Link>

          <Link
            href="/admin/tutors"
            className={`p-2 rounded ${
              pathname === "/admin/tutors"
                ? "bg-[#004B4B] text-white"
                : "text-[#004B4B] hover:bg-gray-200"
            }`}
          >
            Tutors
          </Link>

          <Link
            href="/admin/students"
            className={`p-2 rounded ${
              pathname === "/admin/students"
                ? "bg-[#004B4B] text-white"
                : "text-[#004B4B] hover:bg-gray-200"
            }`}
          >
            Students
          </Link>

          <Link
            href="/admin/payments"
            className={`p-2 rounded ${
              pathname === "/admin/payments"
                ? "bg-[#004B4B] text-white"
                : "text-[#004B4B] hover:bg-gray-200"
            }`}
          >
            Payments
          </Link>

          <Link
            href="/admin/settings"
            className={`p-2 rounded ${
              pathname === "/admin/settings"
                ? "bg-[#004B4B] text-white"
                : "text-[#004B4B] hover:bg-gray-200"
            }`}
          >
            Settings
          </Link>
        </nav>
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 p-8 bg-white">{children}</div>
    </div>
  );
}

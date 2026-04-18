// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import AdminTopbar from "../../components/admin/AdminTopbar";

// export default function AdminLayout({ children }: any) {
//   const pathname = usePathname();

 
//   if (pathname === "/admin/login") {
//     return <>{children}</>;
//   }

//   return (
//     <div className="flex min-h-screen bg-[#F4F2EC]">

//       {/* ================= SIDEBAR ================= */}
//       <aside className="w-64 bg-[#F2EFE7] border-r border-[#E5E0D8] p-5 flex flex-col">

//         <h2 className="text-xl font-bold mb-8 text-[#004B4B]">
//           TutorSewa Admin
//         </h2>

//         <nav className="flex flex-col space-y-2 text-sm">
//           {[
//             ["Dashboard", "/admin/dashboard"],
//             ["Tutors", "/admin/tutors"],
//             ["Students", "/admin/students"],
//             ["Payments", "/admin/payments"],
//             ["Earnings", "/admin/earnings"],
//             ["Thrift Section", "/admin/thrift"],
//             ["Settings", "/admin/settings"],
//           ].map(([label, href]) => {
//             const active = pathname === href;

//             return (
//               <Link
//                 key={href}
//                 href={href}
//                 className={`px-4 py-2 rounded-lg transition font-medium ${
//                   active
//                     ? "bg-[#004B4B] text-white shadow-sm"
//                     : "text-[#004B4B] hover:bg-[#E7E2D8]"
//                 }`}
//               >
//                 {label}
//               </Link>
//             );
//           })}
//         </nav>

//       </aside>

//       {/* ================= MAIN CONTENT ================= */}
//       <div className="flex-1 flex flex-col">

//         {/* TOPBAR */}
//         <div className="border-b border-[#E5E0D8] bg-white">
//           <AdminTopbar />
//         </div>

//         {/* PAGE CONTENT (FIXED CENTERED LAYOUT) */}
//         <main className="flex-1 overflow-y-auto">

//          <div className="px-8 py-6">
//   {children}
// </div>

//         </main>

//       </div>
//     </div>
//   );
// }


"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminTopbar from "../../components/admin/AdminTopbar";

export default function AdminLayout({ children }: any) {
  const pathname = usePathname();

 
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
  <div className="min-h-screen bg-[#F4F2EC]">

    {/* 🔝 FULL-WIDTH TOPBAR (covers entire width) */}
    <div className="sticky top-0 z-50 bg-white border-b">
      <AdminTopbar />
    </div>

    {/* ⬇️ BELOW TOPBAR: sidebar + content */}
    <div className="flex">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#F2EFE7] border-r border-[#E5E0D8] p-5 flex flex-col">
        <nav className="flex flex-col space-y-3 text-m">
          {[
            ["Dashboard", "/admin/dashboard"],
            ["Tutors", "/admin/tutors"],
            ["Students", "/admin/students"],
            ["Payments", "/admin/payments"],
            ["Earnings", "/admin/earnings"],
            ["Thrift Section", "/admin/thrift"],
            ["Settings", "/admin/settings"],
          ].map(([label, href]) => {
            const active = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={`px-5 py-3 rounded-xl font-medium transition-all duration-200 transform
                  ${
                    active
                      ? "bg-[#004B4B] text-white shadow-md scale-[1.02]"
                      : "text-[#004B4B] hover:bg-[#E7E2D8] hover:scale-[1.02]"
                  }
                `}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* CONTENT */}
      <div className="flex-1">
        <main className="overflow-y-auto">
          <div className="px-8 py-6">{children}</div>
        </main>
      </div>

    </div>
  </div>
);
}
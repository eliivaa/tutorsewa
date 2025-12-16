// "use client";

// import Topbar from "@/app/components/Topbar";
// import {
//   Home,
//   Calendar,
//   MessageSquare,
//   CreditCard,
//   ShoppingBag,
//   Settings,
//   Search,
// } from "lucide-react";
// import { usePathname, useRouter } from "next/navigation";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const menuItems = [
//     { name: "Dashboard", path: "/dashboard", icon: <Home size={18} /> },
//     { name: "My Sessions", path: "/dashboard/sessions", icon: <Calendar size={18} /> },
//     { name: "Browse Tutors", path: "/dashboard/browse", icon: <Search size={18} /> },
//     { name: "Messages", path: "/dashboard/messages", icon: <MessageSquare size={18} /> },
//     { name: "Payments", path: "/dashboard/payments", icon: <CreditCard size={18} /> },
//     { name: "Thrift Section", path: "/dashboard/thrift", icon: <ShoppingBag size={18} /> },
//     { name: "Settings", path: "/dashboard/settings", icon: <Settings size={18} /> },
//   ];

//   return (
//     <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
//       <Topbar />

//       <div className="flex flex-1">
//         {/* SIDEBAR */}
//         <aside className="w-64 bg-[#48A6A7] text-white flex flex-col">
//           <nav className="flex-1 mt-4 space-y-1 px-4 text-sm">
//             {menuItems.map((item) => (
//               <button
//                 key={item.name}
//                 onClick={() => router.push(item.path)}
//                 className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition ${
//                   pathname === item.path
//                     ? "bg-white text-[#006A6A] font-medium"
//                     : "hover:bg-white/20"
//                 }`}
//               >
//                 {item.icon}
//                 {item.name}
//               </button>
//             ))}
//           </nav>
//         </aside>

//         {/* PAGE CONTENT */}
//         <main className="flex-1 p-8">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }


"use client";

import Topbar from "@/app/components/Topbar";
import {
  Home,
  Calendar,
  MessageSquare,
  CreditCard,
  ShoppingBag,
  Settings,
  Search,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
    { name: "My Sessions", path: "/dashboard/sessions", icon: <Calendar size={20} /> },
    { name: "Browse Tutors", path: "/dashboard/browse", icon: <Search size={20} /> },
    { name: "Messages", path: "/dashboard/messages", icon: <MessageSquare size={20} /> },
    { name: "Payments", path: "/dashboard/payments", icon: <CreditCard size={20} /> },
    { name: "Thrift Section", path: "/dashboard/thrift", icon: <ShoppingBag size={20} /> },
    { name: "Settings", path: "/dashboard/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      <Topbar />

      <div className="flex flex-1">
        {/* SIDEBAR */}
        <aside className="w-72 bg-[#48A6A7] text-white flex flex-col">
          <nav className="flex-1 mt-6 space-y-1 px-4 text-[15px]">
            {menuItems.map((item) => {
              const active = pathname === item.path;

              return (
                <button
                  key={item.name}
                  onClick={() => router.push(item.path)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition ${
                    active
                      ? "bg-white text-[#006A6A] font-semibold"
                      : "hover:bg-white/20"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* PAGE CONTENT */}
<main className="flex-1 px-10 py-8">
  {/* Content container */}
  <div className="max-w-[1100px]">
    {children}
  </div>
</main>

      </div>
    </div>
  );
}

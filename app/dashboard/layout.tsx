"use client";

import Topbar from "@/app/components/Topbar";
import { useEffect, useState } from "react";

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

  const [unread, setUnread] = useState(0);

useEffect(() => {
  const fetchUnread = () => {
    fetch("/api/messages/unread-count")
      .then((r) => r.json())
      .then((d) => setUnread(d.count || 0));
  };

  fetchUnread();

  const interval = setInterval(fetchUnread, 5000);

  return () => clearInterval(interval);
}, []);


  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <Home size={18} /> },
    { name: "My Sessions", path: "/dashboard/sessions", icon: <Calendar size={18} /> },
    { name: "Browse Tutors", path: "/dashboard/browse", icon: <Search size={18} /> },
    { name: "Messages", path: "/dashboard/messages", icon: <MessageSquare size={18} /> },
    { name: "Payments", path: "/dashboard/payments", icon: <CreditCard size={18} /> },
    { name: "Thrift Section", path: "/dashboard/thrift", icon: <ShoppingBag size={18} /> },
    { name: "Settings", path: "/dashboard/settings", icon: <Settings size={18} /> },
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
                      ? "bg-white text-[#006A6A] font-semibolfd"
                      : "hover:bg-white/20"
                  }`}
                >
                 {item.icon}
<span className="flex-1 text-left">{item.name}</span>

{/* UNREAD BADGE */}
{item.name === "Messages" && unread > 0 && (
  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
    {unread}
  </span>
)}

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

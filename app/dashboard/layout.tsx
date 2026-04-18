

"use client";

import Topbar from "@/app/components/Topbar";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

import {
  Home,
  Calendar,
  MessageSquare,
  CreditCard,
  ShoppingBag,
  Settings,
  Search,
  Receipt,
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

  /* ================= FETCH UNREAD ================= */
  useEffect(() => {
    const fetchUnread = () => {
      fetch("/api/messages/unread-count")
        .then((r) => r.json())
        .then((d) => setUnread(d.count || 0));
    };

    fetchUnread();

    const interval = setInterval(fetchUnread, 5000);

    // 🔥 instant update listener
    const handler = () => fetchUnread();
    window.addEventListener("messages-updated", handler);

    return () => {
      clearInterval(interval);
      window.removeEventListener("messages-updated", handler);
    };
  }, []);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <Home size={18} /> },
    { name: "My Sessions", path: "/dashboard/sessions", icon: <Calendar size={18} /> },
    { name: "Browse Tutors", path: "/dashboard/browse", icon: <Search size={18} /> },
    { name: "Messages", path: "/dashboard/messages", icon: <MessageSquare size={18} /> },
    { name: "Payments", path: "/dashboard/payments", icon: <CreditCard size={18} /> },
    { name: "Wallet", path: "/dashboard/wallet", icon: <Receipt size={18} /> },
    { name: "Thrift Section", path: "/dashboard/thrift", icon: <ShoppingBag size={18} /> },
    { name: "Settings", path: "/dashboard/settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
        <Toaster position="top-right" />
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

                  <span className="flex-1 text-left">{item.name}</span>

                  {/* 🔥 UNREAD BADGE (FINAL VERSION) */}
                  {item.name === "Messages" && unread > 0 && (
                    <span className="min-w-[22px] h-[22px] flex items-center justify-center text-[11px] font-semibold bg-red-500 text-white rounded-full animate-pulse">
                      {unread}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* PAGE CONTENT */}
        <main className="flex-1 px-10 py-8">{children}</main>
      </div>
    </div>
  );
}
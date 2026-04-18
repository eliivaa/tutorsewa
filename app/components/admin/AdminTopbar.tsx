// "use client";

// import { Bell, LogOut } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { useRouter } from "next/navigation";

// type Admin = {
//   id: string;
//   email: string;
//   role: string;
// };

// type Notification = {
//   id: string;
//   title: string;
//   message: string;
//   isRead: boolean;
//   createdAt: string;
//   actionUrl?: string | null;
// };

// export default function AdminTopbar() {
//   const router = useRouter();

//   const [admin, setAdmin] = useState<Admin | null>(null);
//   const [open, setOpen] = useState(false);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const ref = useRef<HTMLDivElement>(null);

//   /* ================= FETCH ADMIN ================= */
//   useEffect(() => {
//     fetch("/api/admin/me")
//       .then((res) => {
//         if (!res.ok) throw new Error("Unauthorized");
//         return res.json();
//       })
//       .then((data) => setAdmin(data.admin))
//       .catch(() => setAdmin(null));
//   }, []);

//   /* ================= FETCH ADMIN NOTIFICATIONS ================= */
//   useEffect(() => {
//     if (!open) return;

//     fetch("/api/admin/notifications")
//       .then((res) => res.json())
//       .then((data) => setNotifications(data.notifications || []))
//       .catch(() => setNotifications([]));
//   }, [open]);

//   /* ================= CLOSE DROPDOWN OUTSIDE CLICK ================= */
//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (ref.current && !ref.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   /* ================= UNREAD COUNT ================= */
//   const unreadCount = notifications.filter((n) => !n.isRead).length;

//   /* ================= MARK READ ================= */
//   async function markRead(id: string) {
//     await fetch("/api/admin/notifications/read", {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id }),
//     });

//     setNotifications((prev) =>
//       prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
//     );
//   }

//   /* ================= LOGOUT ================= */
//   async function logout() {
//     await fetch("/api/admin/logout", { method: "POST" });
//     router.push("/admin/login");
//   }

//   return (
//     <header className="sticky top-0 z-40 h-14 bg-white border-b">
//       <div className="flex items-center justify-between h-full px-6">

//         {/* LEFT TITLE */}
//         <h1 className="text-lg font-semibold text-[#004B4B]">
//           Admin Panel
//         </h1>

//         {/* RIGHT SIDE */}
//         <div className="flex items-center gap-6">

//           {/* NOTIFICATION BELL */}
//           <div className="relative" ref={ref}>
//             <button
//               onClick={() => setOpen(!open)}
//               className="relative text-gray-600 hover:text-[#004B4B]"
//             >
//               <Bell size={22} />

//               {unreadCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
//                   {unreadCount}
//                 </span>
//               )}
//             </button>

//             {open && (
//               <div className="absolute right-0 mt-3 w-[420px] bg-white shadow-xl rounded-xl border z-50 overflow-hidden">
//                 <div className="p-4 font-semibold border-b">
//                   Admin Activity
//                 </div>

//                 <div className="max-h-96 overflow-y-auto">
//                   {notifications.length === 0 ? (
//                     <p className="p-4 text-sm text-gray-500">
//                       No activity yet
//                     </p>
//                   ) : (
//                     notifications.map((n) => (
//                       <div
//                         key={n.id}
//                         onClick={async () => {
//                           if (!n.isRead) await markRead(n.id);
//                           if (n.actionUrl) router.push(n.actionUrl);
//                           setOpen(false);
//                         }}
//                         className={`p-4 border-b cursor-pointer transition ${
//                           !n.isRead
//                             ? "bg-[#E6F9F5] hover:bg-[#D6F3EE]"
//                             : "hover:bg-gray-50"
//                         }`}
//                       >
//                         <p className="font-semibold text-sm text-[#004B4B]">
//                           {n.title}
//                         </p>

//                         <p
//                           className={`text-sm mt-1 ${
//                             n.isRead
//                               ? "text-gray-700"
//                               : "text-gray-800 font-semibold"
//                           }`}
//                         >
//                           {n.message}
//                         </p>

//                         <p className="text-xs text-gray-400 mt-1">
//                           {new Date(n.createdAt).toLocaleString()}
//                         </p>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* ADMIN INFO */}
//           <div className="flex items-center gap-3">
//             <div className="h-9 w-9 rounded-full bg-[#E6F9F5] flex items-center justify-center font-semibold text-[#004B4B]">
//               A
//             </div>

//             <div className="leading-tight hidden sm:block">
//               <p className="text-sm font-medium text-[#004B4B]">
//                 {admin?.email || "Admin User"}
//               </p>
//               <p className="text-xs text-gray-500">
//                 Administrator
//               </p>
//             </div>
//           </div>

//           {/* LOGOUT */}
//           <button
//             onClick={logout}
//             className="text-gray-500 hover:text-red-600"
//           >
//             <LogOut size={20} />
//           </button>

//         </div>
//       </div>
//     </header>
//   );
// }



// "use client";

// import { Bell, LogOut } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   formatNotificationTime,
//   getNotificationIcon,
// } from "@/lib/notificationHelpers";

// type Notification = {
//   id: string;
//   title: string;
//   message: string;
//   type?: string;
//   isRead: boolean;
//   createdAt: string;
//   actionUrl?: string | null;
// };

// export default function AdminTopbar() {
//   const router = useRouter();

//   const [open, setOpen] = useState(false);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const ref = useRef<HTMLDivElement>(null);

//   const fetchNotifications = async () => {
//     try {
//       const res = await fetch(
//         "/api/admin/notifications?recentOnly=true&limit=8&sort=latest",
//         { cache: "no-store" }
//       );
//       const data = await res.json();
//       setNotifications(data.notifications || []);
//     } catch {
//       setNotifications([]);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//     const interval = setInterval(fetchNotifications, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//   setOpen(false);
// }, [router]);

//   useEffect(() => {
//   setOpen(false);
// }, [router]);

//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (ref.current && !ref.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const unreadCount = notifications.filter((n) => !n.isRead).length;

//   async function markRead(id: string) {
//     await fetch("/api/admin/notifications/read", {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id }),
//     });

//     setNotifications((prev) =>
//       prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
//     );
//   }

//   return (
//     <header className="sticky top-0 bg-white border-b h-14">
//       <div className="flex justify-between items-center px-6 h-full">

//         <h1 className="font-semibold"></h1>

//         <div className="flex items-center gap-6">

//           <div className="relative" ref={ref}>
//             <button onClick={() => setOpen(!open)} className="relative">
//               <Bell size={22} />
//               {unreadCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
//                   {unreadCount}
//                 </span>
//               )}
//             </button>

//             {open && (
//               <div className="absolute right-0 mt-3 w-[420px] bg-white shadow-xl rounded-xl border">

//                 <div className="p-4 border-b font-semibold">
//                   Admin Activity
//                 </div>

//                 <div className="max-h-96 overflow-y-auto">

//                   {notifications.length === 0 ? (
//                     <div className="p-6 text-center text-gray-500">
//                       <Bell className="mx-auto mb-2" />
//                       <p>You’re all caught up</p>
//                     </div>
//                   ) : (
//                     notifications.map((n) => {
//                       const Icon = getNotificationIcon(n.type);

//                       return (
//                         <div
//                           key={n.id}
//                           onClick={async () => {
//                             if (!n.isRead) await markRead(n.id);
//                             if (n.actionUrl) router.push(n.actionUrl);
//                           }}
//                           className={`p-4 border-b cursor-pointer rounded-lg transition ${
//                             !n.isRead
//                               ? "border-l-4 border-l-[#0F9D8A] bg-[#F0FDFA]"
//                               : "hover:bg-gray-50"
//                           }`}
//                         >
//                           <div className="flex gap-3 items-start">
//                             <Icon size={16} className="text-[#0F9D8A] mt-1" />

//                             <div className="flex-1">
//                               <p className="font-semibold text-sm">
//                                 {n.title}
//                               </p>
//                               <p className="text-sm text-gray-700">
//                                 {n.message}
//                               </p>

//                               <p className="text-xs text-gray-400 mt-1">
//                                 {formatNotificationTime(n.createdAt)}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })
//                   )}
//                 </div>

//                 <div className="p-3 border-t bg-gray-50">
//                   <button
                  
//                     onClick={() => {
//   setOpen(false); 
//   router.push("/admin/notifications");
// }}
//                     className="w-full text-sm font-medium text-[#004B4B] hover:underline"
//                   >
//                     See all notifications
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* ADMIN INFO */}
//           <div className="flex items-center gap-3">
//             <div className="h-9 w-9 rounded-full bg-[#E6F9F5] flex items-center justify-center font-semibold text-[#004B4B]">
//               A
//             </div>

//             <div className="leading-tight hidden sm:block">
//               <p className="text-sm font-medium text-[#004B4B]">Admin</p>
//               <p className="text-xs text-gray-500">
//                 admin@tutorsewa.com
//               </p>
//             </div>
//           </div>

//           <button
//             onClick={() => router.push("/admin/login")}
//             className="text-gray-500 hover:text-red-600"
//           >
//             <LogOut size={20} />
//           </button>

//         </div>
//       </div>
//     </header>
//   );
// }


"use client";

import { Bell, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  formatNotificationTime,
  getNotificationIcon,
} from "@/lib/notificationHelpers";

type Notification = {
  id: string;
  title: string;
  message: string;
  type?: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string | null;
};

export default function AdminTopbar() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  async function fetchNotifications() {
    try {
      const res = await fetch(
        "/api/notifications?admin=true&recentOnly=true&limit=8&sort=latest",
        { cache: "no-store" }
      );
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch {
      setNotifications([]);
    }
  }

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  
async function markRead(id: string) {
  // optimistic update
  setNotifications(prev =>
    prev.map(n => n.id === id ? { ...n, isRead: true } : n)
  );

  await fetch("/api/notifications/read", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  // sync with backend
  await fetchNotifications();
}

  return (
   <header className="sticky top-0 z-50 bg-white border-b h-14"> 
      <div className="flex justify-between items-center px-6 h-full">
       <div
  onClick={() => router.push("/admin/dashboard")}
  className="flex gap-2 cursor-pointer items-center"
>
  <Image
    src="/tutorsewa-logo.png"
    width={40}
    height={40}
    alt="logo"
  />

  <span className="text-lg font-semibold">
    <span className="text-[#48A6A7]">TUTOR</span>
    <span className="text-[#006A6A]">SEWA</span>
  </span>
</div>

        <div className="flex items-center gap-6">
          <div className="relative" ref={ref}>
            <button onClick={() => setOpen((prev) => !prev)} className="relative">
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full min-w-[18px] text-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {open && (
            <div className="absolute right-2 top-14 w-[360px] z-[99999] bg-white shadow-xl rounded-xl border overflow-hidden">
                <div className="p-4 border-b font-semibold">Admin Activity</div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      <Bell className="mx-auto mb-2" />
                      <p>You’re all caught up</p>
                    </div>
                  ) : (
                    notifications.map((n) => {
                      const Icon = getNotificationIcon(n.type);

                      return (
                        <div
                          key={n.id}
                          onClick={async () => {
                             console.log("CLICKED:", n.actionUrl);
                            if (!n.isRead) {
                              await markRead(n.id);
                            }
                            if (n.actionUrl) {
                              router.push(n.actionUrl);
                            }
                            setOpen(false);
                          }}
                          className={`p-4 border-b cursor-pointer rounded-lg transition ${
                            !n.isRead
                              ? "border-l-4 border-l-[#0F9D8A] bg-[#F0FDFA]"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex gap-3 items-start">
                            <Icon size={16} className="text-[#0F9D8A] mt-1" />
                            <div className="flex-1">
                              <p className="font-semibold text-sm">{n.title}</p>
                              <p className="text-sm text-gray-700">{n.message}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {formatNotificationTime(n.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="p-3 border-t bg-gray-50">
                  <button
                    onClick={() => {
                      setOpen(false);
                      router.push("/admin/notifications");
                    }}
                    className="w-full text-sm font-medium text-[#004B4B] hover:underline"
                  >
                    See all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-[#E6F9F5] flex items-center justify-center font-semibold text-[#004B4B]">
              A
            </div>

            <div className="leading-tight hidden sm:block">
              <p className="text-sm font-medium text-[#004B4B]">Admin</p>
              <p className="text-xs text-gray-500">admin@tutorsewa.com</p>
            </div>
          </div>

          <button
            onClick={() => router.push("/admin/login")}
            className="text-gray-500 hover:text-red-600"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
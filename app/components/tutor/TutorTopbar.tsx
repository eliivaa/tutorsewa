// "use client";

// import Image from "next/image";
// import { Bell, LogOut } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// interface TutorTopbarProps {
//   tutor: {
//     name: string;
//     email: string;
//     photo?: string | null;
//     status: string;
//   };
// }

// type Notification = {
//   id: string;
//   title: string;
//   message: string;
//   type: string;
//   isRead: boolean;
//   createdAt: string;
//   actionUrl?: string | null;
// };

// export default function TutorTopbar({ tutor }: TutorTopbarProps) {
//   const router = useRouter();

//   const [open, setOpen] = useState(false);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const ref = useRef<HTMLDivElement>(null);

//   /* ================= FETCH NOTIFICATIONS ================= */
//   useEffect(() => {
//     if (!open) return;

//     fetch("/api/notifications?tutor=true")
//       .then((res) => res.json())
//       .then((data) => setNotifications(data.notifications || []))
//       .catch(() => setNotifications([]));
//   }, [open]);

//   /* ================= CLOSE ON OUTSIDE CLICK ================= */
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
//     await fetch("/api/notifications/read", {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ notificationId: id }),
//     });

//     setNotifications((prev) =>
//       prev.map((x) => (x.id === id ? { ...x, isRead: true } : x))
//     );
//   }

//   return (
//     <header className="sticky top-0 z-40 h-14 bg-white border-b">
//       <div className="flex items-center justify-between h-full px-6">

//         {/* LOGO */}
//         <div
//           className="flex items-center gap-2 cursor-pointer"
//           onClick={() => router.push("/tutor/dashboard")}
//         >
//           <Image
//             src="/tutorsewa-logo.png"
//             width={40}
//             height={40}
//             alt="TutorSewa"
//             priority
//           />
//           <span className="text-lg font-semibold">
//             <span className="text-[#48A6A7]">TUTOR</span>
//             <span className="text-[#006A6A]">SEWA</span>
//           </span>
//         </div>

//         {/* RIGHT SIDE */}
//         <div className="flex items-center gap-6">

//           {/* 🔔 NOTIFICATIONS */}
//           <div className="relative" ref={ref}>
//             <button
//               onClick={() => setOpen((o) => !o)}
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
//                   Notifications
//                 </div>

//                 <div className="max-h-96 overflow-y-auto">
//                   {notifications.length === 0 ? (
//                     <p className="p-4 text-sm text-gray-500">
//                       No notifications
//                     </p>
//                   ) : (
//                     notifications.map((n) => (
//                       <div
//                         key={n.id}
//                         onClick={async () => {
//                           if (!n.isRead) await markRead(n.id);
//                           if (n.actionUrl) {
//                             router.push(n.actionUrl);
//                             setOpen(false);
//                           }
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

//           {/* PROFILE */}
//           <div
//             onClick={() => router.push("/tutor/profile")}
//             className="flex items-center gap-3 cursor-pointer"
//           >
//             {tutor.photo ? (
//               <div className="h-10 w-10 rounded-full overflow-hidden border">
//                 <Image
//                   src={tutor.photo}
//                   alt="Tutor avatar"
//                   width={40}
//                   height={40}
//                   className="object-cover"
//                 />
//               </div>
//             ) : (
//               <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-[#004B4B]">
//                {tutor?.name?.charAt(0)?.toUpperCase() || "T"}
//               </div>
//             )}

//             <div className="leading-tight hidden sm:block">
//               <p className="text-sm font-medium text-[#004B4B]">
//                 {tutor.name}
//               </p>
//               <p className="text-xs text-gray-500">
//                 {tutor.email}
//               </p>
//             </div>
//           </div>

//           {/* LOGOUT */}
//           <Link href="/logout" className="text-gray-500 hover:text-red-600">
//             <LogOut size={20} />
//           </Link>
//         </div>
//       </div>
//     </header>
//   );
// }





// "use client";

// import Image from "next/image";
// import { Bell, LogOut } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import {
//   formatNotificationTime,
//   getNotificationIcon,
// } from "@/lib/notificationHelpers";

// type Notification = {
//   id: string;
//   title: string;
//   message: string;
//   type: string;
//   isRead: boolean;
//   createdAt: string;
//   actionUrl?: string | null;
// };

// export default function TutorTopbar({ tutor }: any) {
//   const router = useRouter();

//   const [open, setOpen] = useState(false);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const ref = useRef<HTMLDivElement>(null);

//   const fetchNotifications = async () => {
//     try {
//       const res = await fetch(
//         "/api/notifications?tutor=true&recentOnly=true&limit=8&sort=latest",
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
//     await fetch("/api/notifications/read", {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ notificationId: id }),
//     });

//     setNotifications((prev) =>
//       prev.map((x) => (x.id === id ? { ...x, isRead: true } : x))
//     );
//   }

//   return (
//     <header className="sticky top-0 z-40 h-14 bg-white border-b">
//       <div className="flex items-center justify-between h-full px-6">

//         <div
//           onClick={() => router.push("/tutor/dashboard")}
//           className="flex gap-2 cursor-pointer"
//         >
//           <Image src="/tutorsewa-logo.png" width={40} height={40} alt="logo" />
//           <span className="text-lg font-semibold">
//             <span className="text-[#48A6A7]">TUTOR</span>
//             <span className="text-[#006A6A]">SEWA</span>
//           </span>
//         </div>

//         <div className="flex items-center gap-6">

//           <div className="relative" ref={ref}>
//             <button onClick={() => setOpen(!open)}>
//               <Bell size={22} />
//               {unreadCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
//                   {unreadCount}
//                 </span>
//               )}
//             </button>

//             {open && (
//               <div className="absolute right-0 mt-3 w-[420px] bg-white shadow-xl rounded-xl border">

//                 <div className="p-4 font-semibold border-b">
//                   Notifications
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
//                             setOpen(false);
//                           }}
//                           className={`p-4 border-b cursor-pointer rounded-lg ${
//                             !n.isRead
//                               ? "border-l-4 border-l-[#0F9D8A] bg-[#F0FDFA]"
//                               : "hover:bg-gray-50"
//                           }`}
//                         >
//                           <div className="flex gap-3 items-start">
//                             <Icon size={16} className="text-[#0F9D8A]" />

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
                  
//                  <button
//   onClick={() => {
//     setOpen(false); 
//     router.push("/tutor/notifications");
//   }}
//   className="w-full text-sm font-medium text-[#004B4B] hover:underline"
// >
//   See all notifications
// </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* PROFILE */}
//           <div
//             onClick={() => router.push("/tutor/profile")}
//             className="flex items-center gap-3 cursor-pointer"
//           >
//             {tutor?.photo ? (
//               <div className="h-10 w-10 rounded-full overflow-hidden border">
//   <Image
//     src={tutor.photo}
//     width={40}
//     height={40}
//     alt="avatar"
//     className="object-cover w-full h-full"
//   />
// </div>
//             ) : (
//               <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-[#004B4B]">
//                 {tutor?.name?.charAt(0)?.toUpperCase()}
//               </div>
//             )}

//             <div className="hidden sm:block">
//               <p className="text-sm">{tutor?.name}</p>
//               <p className="text-xs text-gray-500">{tutor?.email}</p>
//             </div>
//           </div>

//           <Link href="/logout">
//             <LogOut />
//           </Link>

//         </div>
//       </div>
//     </header>
//   );
// }


"use client";

import Image from "next/image";
import { Bell, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

export default function TutorTopbar({ tutor }: any) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  async function fetchNotifications() {
    try {
      const res = await fetch(
        "/api/notifications?tutor=true&recentOnly=true&limit=8&sort=latest",
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

//  async function markRead(id: string) {
//   // optimistic update
//   setNotifications(prev =>
//     prev.map(n => n.id === id ? { ...n, isRead: true } : n)
//   );

//   await fetch("/api/notifications/read", {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ id }),
//   });

//   // sync with backend
//   await fetchNotifications();
// }

async function markRead(id: string) {
  console.log("CLICKED notification id:", id);

  const res = await fetch("/api/notifications/read", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  console.log("READ API status:", res.status);
  const data = await res.json().catch(() => ({}));
  console.log("READ API response:", data);

  // IMPORTANT: keep UI in sync
  await fetchNotifications();
}

  return (
    <header className="sticky top-0 z-40 h-14 bg-white border-b">
      <div className="flex items-center justify-between h-full px-6">
        {/* <div
          onClick={() => router.push("/tutor/dashboard")}
          className="flex gap-2 cursor-pointer"
        >
          <Image src="/tutorsewa-logo.png" width={60} height={60} alt="logo" />
          <span className="text-lg font-semibold">
            <span className="text-[#48A6A7]">TUTOR</span>
            <span className="text-[#006A6A]">SEWA</span>
          </span>
        </div> */}

      <div
  onClick={() => router.push("/tutor/dashboard")}
  className="flex items-center gap-3 cursor-pointer"
>
  <Image
    src="/tutorsewa-logo.png"
    width={60}
    height={60}
    alt="logo"
    className="object-contain"
  />

  <span className="text-xl font-semibold leading-none flex items-center">
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
              <div className="absolute right-0 mt-3 w-[420px] bg-white shadow-xl rounded-xl border overflow-hidden">
                <div className="p-4 font-semibold border-b">Notifications</div>

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
                          // onClick={async () => {
                          //   if (!n.isRead) {
                          //     await markRead(n.id);
                          //   }
                          //   if (n.actionUrl) {
                          //     router.push(n.actionUrl);
                          //   }
                          //   setOpen(false);
                          // }}

                          onClick={async () => {
  console.log("Notification clicked:", n.id, n.actionUrl);

  if (!n.isRead) {
    await markRead(n.id);
  }

  if (n.actionUrl) {
    console.log("Redirecting to:", n.actionUrl);
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
                      router.push("/tutor/notifications");
                    }}
                    className="w-full text-sm font-medium text-[#004B4B] hover:underline"
                  >
                    See all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <div
            onClick={() => router.push("/tutor/profile")}
            className="flex items-center gap-3 cursor-pointer"
          >
            {tutor?.photo ? (
              <div className="h-10 w-10 rounded-full overflow-hidden border">
                <Image
                  src={tutor.photo}
                  width={40}
                  height={40}
                  alt="avatar"
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-[#004B4B]">
                {tutor?.name?.charAt(0)?.toUpperCase() || "T"}
              </div>
            )}

            <div className="hidden sm:block">
              <p className="text-sm font-medium">{tutor?.name || "Tutor"}</p>
              <p className="text-xs text-gray-500">{tutor?.email}</p>
            </div>
          </div>

          <Link href="/logout">
            <LogOut />
          </Link>
        </div>
      </div>
    </header>
  );
}
// "use client";

// import Image from "next/image";
// import { useEffect, useState, useRef } from "react";
// import { useSession, signOut } from "next-auth/react";
// import { Bell, ChevronDown } from "lucide-react";
// import { useRouter } from "next/navigation";

// export default function Topbar() {
//   const { data } = useSession();
//   const router = useRouter();

//   const name = data?.user?.name || "";
//   const email = data?.user?.email || "";
//   const image = data?.user?.image || null;

//   /* ======================
//      NOTIFICATION STATE
//   ====================== */

//   const [open, setOpen] = useState(false);
//   const [notifications, setNotifications] = useState<any[]>([]);
//   const notificationRef = useRef<HTMLDivElement>(null);

//   /* ======================
//      PROFILE DROPDOWN
//   ====================== */

//   const [menuOpen, setMenuOpen] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null);

//   /* ======================
//      FETCH NOTIFICATIONS
//   ====================== */

//   const fetchNotifications = async () => {
//     try {
//       const res = await fetch("/api/notifications", {
//         cache: "no-store",
//       });

//       const data = await res.json();

//       setNotifications(data.notifications || []);
//     } catch (err) {
//       console.error("Notification fetch error", err);
//     }
//   };

//   useEffect(() => {
//     if (open) {
//       fetchNotifications();
//     }
//   }, [open]);

//   /* ======================
//      AUTO REFRESH EVERY 15s
//   ====================== */

//   useEffect(() => {
//     const interval = setInterval(fetchNotifications, 15000);
//     return () => clearInterval(interval);
//   }, []);

//   /* ======================
//      CLOSE DROPDOWNS
//   ====================== */

//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (
//         notificationRef.current &&
//         !notificationRef.current.contains(e.target as Node)
//       ) {
//         setOpen(false);
//       }

//       if (
//         menuRef.current &&
//         !menuRef.current.contains(e.target as Node)
//       ) {
//         setMenuOpen(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () =>
//       document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const unreadCount = notifications.filter((n) => !n.isRead).length;

//   return (
//     <header className="sticky top-0 bg-white border-b z-40">
//       <div className="flex items-center justify-between h-14 px-6">

//         {/* LOGO */}

//         <div className="flex items-center gap-2">
//           <Image
//             src="/tutorsewa-logo.png"
//             width={55}
//             height={55}
//             alt="TutorSewa Logo"
//             priority
//           />
//           <span className="text-lg font-semibold">
//             <span className="text-[#48A6A7]">TUTOR</span>
//             <span className="text-[#006A6A]">SEWA</span>
//           </span>
//         </div>

//         {/* RIGHT SIDE */}

//         <div className="flex items-center gap-6">

//           {/* 🔔 NOTIFICATION */}

//           <div className="relative" ref={notificationRef}>
//             <button
//               onClick={() => setOpen(!open)}
//               className="relative"
//             >
//               <Bell className="w-6 h-6 text-gray-700" />

//               {unreadCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
//                   {unreadCount}
//                 </span>
//               )}
//             </button>

//             {open && (
//               <div className="absolute right-0 mt-3 w-96 bg-white shadow-xl rounded-xl border z-50">

//                 <div className="p-4 font-semibold border-b">
//                   Notifications
//                 </div>

//                 <div className="max-h-96 overflow-y-auto">

//                   {notifications.length === 0 && (
//                     <p className="p-4 text-sm text-gray-500">
//                       No notifications
//                     </p>
//                   )}

//                   {notifications.map((n) => (
//                     <div
//                       key={n.id}
//                       onClick={async () => {

//                         /* MARK READ */

//                         if (!n.isRead) {

//                           await fetch("/api/notifications/read", {
//                             method: "PATCH",
//                             headers: {
//                               "Content-Type": "application/json",
//                             },
//                             body: JSON.stringify({
//                               notificationId: n.id,
//                             }),
//                           });

//                           setNotifications((prev) =>
//                             prev.map((x) =>
//                               x.id === n.id
//                                 ? { ...x, isRead: true }
//                                 : x
//                             )
//                           );
//                         }

//                         /* ACTION URL */

//                         if (n.actionUrl) {
//                           router.push(n.actionUrl);
//                           setOpen(false);
//                         }

//                       }}
//                       className={`p-4 border-b cursor-pointer transition ${
//                         !n.isRead
//                           ? "bg-[#E6F9F5] hover:bg-[#D6F3EE]"
//                           : "hover:bg-gray-50"
//                       }`}
//                     >

//                       <p className="font-semibold text-sm text-[#004B4B]">
//                         {n.title}
//                       </p>

//                       <p className="text-sm mt-1">
//                         {n.message}
//                       </p>

//                       <p className="text-xs text-gray-400 mt-1">
//                         {new Date(n.createdAt).toLocaleString()}
//                       </p>

//                     </div>
//                   ))}

//                 </div>

//               </div>
//             )}
//           </div>

//           {/* 👤 PROFILE */}

//           <div className="relative" ref={menuRef}>
//             <div
//               onClick={() => setMenuOpen(!menuOpen)}
//               className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg transition"
//             >

//               {image ? (
//                 <div className="h-10 w-10 rounded-full overflow-hidden border">
//                   <Image
//                     src={image}
//                     width={40}
//                     height={40}
//                     alt="avatar"
//                     className="object-cover"
//                   />
//                 </div>
//               ) : (
//                 <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm">
//                   {(name.charAt(0) ||
//                     email.charAt(0) ||
//                     "?").toUpperCase()}
//                 </div>
//               )}

//               <div className="hidden sm:block text-left">
//                 <p className="text-sm font-medium">{name}</p>
//                 <p className="text-xs text-gray-500">{email}</p>
//               </div>

//               <ChevronDown className="w-4 h-4 text-gray-600" />

//             </div>

//             {menuOpen && (
//               <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg overflow-hidden z-50">

//                 <button
//                   onClick={() => {
//                     router.push("/dashboard/profile");
//                     setMenuOpen(false);
//                   }}
//                   className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
//                 >
//                   My Profile
//                 </button>

//                 <button
//                   onClick={() =>
//                     signOut({ callbackUrl: "/" })
//                   }
//                   className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
//                 >
//                   Logout
//                 </button>

//               </div>
//             )}

//           </div>

//         </div>

//       </div>
//     </header>
//   );
// }



// "use client";

// import Image from "next/image";
// import { useEffect, useState, useRef } from "react";
// import { useSession, signOut } from "next-auth/react";
// import { Bell, ChevronDown } from "lucide-react";
// import { useRouter } from "next/navigation";

// type Notification = {
//   id: string;
//   title: string;
//   message: string;
//   isRead: boolean;
//   createdAt: string;
//   actionUrl?: string | null;
// };

// export default function Topbar() {
//   const { data } = useSession();
//   const router = useRouter();

//   const name = data?.user?.name || "";
//   const email = data?.user?.email || "";
//   const image = data?.user?.image || null;

//   /* ====================== STATE ====================== */

//   const [open, setOpen] = useState(false);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const notificationRef = useRef<HTMLDivElement>(null);

//   const [menuOpen, setMenuOpen] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null);

//   /* ====================== FETCH ====================== */

//   const fetchNotifications = async () => {
//     try {
//       const res = await fetch(
//         "/api/notifications?recentOnly=true&limit=8&sort=latest",
//         { cache: "no-store" }
//       );

//       const data = await res.json();
//       setNotifications(data.notifications || []);
//     } catch (err) {
//       console.error("Notification fetch error", err);
//     }
//   };

//   /* ====================== AUTO LOAD + POLLING ====================== */

//   useEffect(() => {
//     fetchNotifications();

//     const interval = setInterval(fetchNotifications, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   /* ====================== CLOSE DROPDOWNS ====================== */

//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (
//         notificationRef.current &&
//         !notificationRef.current.contains(e.target as Node)
//       ) {
//         setOpen(false);
//       }

//       if (
//         menuRef.current &&
//         !menuRef.current.contains(e.target as Node)
//       ) {
//         setMenuOpen(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () =>
//       document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const unreadCount = notifications.filter((n) => !n.isRead).length;

//   /* ====================== MARK READ ====================== */

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
//     <header className="sticky top-0 bg-white border-b z-40">
//       <div className="flex items-center justify-between h-14 px-6">

//         {/* LOGO */}
//         <div className="flex items-center gap-2">
//           <Image
//             src="/tutorsewa-logo.png"
//             width={55}
//             height={55}
//             alt="TutorSewa Logo"
//             priority
//           />
//           <span className="text-lg font-semibold">
//             <span className="text-[#48A6A7]">TUTOR</span>
//             <span className="text-[#006A6A]">SEWA</span>
//           </span>
//         </div>

//         {/* RIGHT */}
//         <div className="flex items-center gap-6">

//           {/* 🔔 NOTIFICATION */}
//           <div className="relative" ref={notificationRef}>
//             <button
//               onClick={() => setOpen(!open)}
//               className="relative"
//             >
//               <Bell className="w-6 h-6 text-gray-700" />

//               {unreadCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
//                   {unreadCount}
//                 </span>
//               )}
//             </button>

//             {open && (
//               <div className="absolute right-0 mt-3 w-96 bg-white shadow-xl rounded-xl border z-50 overflow-hidden">

//                 <div className="p-4 font-semibold border-b">
//                   Notifications
//                 </div>

//                 <div className="max-h-96 overflow-y-auto">
//                   {notifications.length === 0 ? (
//                     <p className="p-4 text-sm text-gray-500">
//                       You’re all caught up
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
//                             ? "bg-[#E6F9F5] hover:bg-[#D6F3EE] border-l-4 border-l-[#0F9D8A]"
//                             : "hover:bg-gray-50"
//                         }`}
//                       >
//                         <p className="font-semibold text-sm text-[#004B4B]">
//                           {n.title}
//                         </p>

//                         <p className="text-sm mt-1">
//                           {n.message}
//                         </p>

//                         <p className="text-xs text-gray-400 mt-1">
//                           {new Date(n.createdAt).toLocaleString()}
//                         </p>
//                       </div>
//                     ))
//                   )}
//                 </div>

//                 <div className="p-3 border-t bg-gray-50">
//                   <button
//                     onClick={() => router.push("/dashboard/notifications")}
//                     className="w-full text-sm font-medium text-[#004B4B] hover:underline"
//                   >
//                     See all notifications
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* PROFILE */}
//           <div className="relative" ref={menuRef}>
//            <div
//   onClick={() => setMenuOpen(!menuOpen)}
//   className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg transition"
// >

//   {/* AVATAR */}
//   {image ? (
//     <div className="h-10 w-10 rounded-full overflow-hidden border">
//       <Image
//         src={image}
//         width={40}
//         height={40}
//         alt="avatar"
//         className="object-cover"
//       />
//     </div>
//   ) : (
//     <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-[#004B4B]">
//       {(name.charAt(0) || email.charAt(0) || "?").toUpperCase()}
//     </div>
//   )}

//   {/* NAME + EMAIL */}
//   <div className="hidden sm:block text-left leading-tight">
//     <p className="text-sm font-medium text-[#004B4B]">
//       {name || "User"}
//     </p>
//     <p className="text-xs text-gray-500">
//       {email}
//     </p>
//   </div>

//   {/* ARROW */}
//   <ChevronDown className="w-4 h-4 text-gray-600" />

// </div>
//             {menuOpen && (
//               <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg">
//                 <button
//                   onClick={() => router.push("/dashboard/profile")}
//                   className="w-full text-left px-4 py-2 hover:bg-gray-50"
//                 >
//                   My Profile
//                 </button>

//                 <button
//                   onClick={() => signOut({ callbackUrl: "/" })}
//                   className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>

//         </div>
//       </div>
//     </header>
//   );
// }






// "use client";

// import Image from "next/image";
// import { useEffect, useState, useRef } from "react";
// import { useSession, signOut } from "next-auth/react";
// import { Bell, ChevronDown } from "lucide-react";
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

// export default function Topbar() {
//   const { data } = useSession();
//   const router = useRouter();

//   const name = data?.user?.name || "";
//   const email = data?.user?.email || "";
//   const image = data?.user?.image || null;

//   const [open, setOpen] = useState(false);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const notificationRef = useRef<HTMLDivElement>(null);

//   const [menuOpen, setMenuOpen] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null);

//   const fetchNotifications = async () => {
//     try {
//       const res = await fetch(
//         "/api/notifications?recentOnly=true&limit=8&sort=latest",
//         { cache: "no-store" }
//       );

//       const data = await res.json();
//       setNotifications(data.notifications || []);
//     } catch (err) {
//       console.error("Notification fetch error", err);
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
//     function handleClickOutside(e: MouseEvent) {
//       if (
//         notificationRef.current &&
//         !notificationRef.current.contains(e.target as Node)
//       ) {
//         setOpen(false);
//       }

//       if (
//         menuRef.current &&
//         !menuRef.current.contains(e.target as Node)
//       ) {
//         setMenuOpen(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () =>
//       document.removeEventListener("mousedown", handleClickOutside);
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
//     <header className="sticky top-0 bg-white border-b z-40">
//       <div className="flex items-center justify-between h-14 px-6">

//         {/* LOGO */}
//         <div className="flex items-center gap-2">
//           <Image
//             src="/tutorsewa-logo.png"
//             width={55}
//             height={55}
//             alt="TutorSewa Logo"
//             priority
//           />
//           <span className="text-lg font-semibold">
//             <span className="text-[#48A6A7]">TUTOR</span>
//             <span className="text-[#006A6A]">SEWA</span>
//           </span>
//         </div>

//         {/* RIGHT */}
//         <div className="flex items-center gap-6">

//           {/* 🔔 NOTIFICATION */}
//           <div className="relative" ref={notificationRef}>
//             <button onClick={() => setOpen(!open)} className="relative">
//               <Bell className="w-6 h-6 text-gray-700" />

//               {unreadCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
//                   {unreadCount}
//                 </span>
//               )}
//             </button>

//             {open && (
//               <div className="absolute right-0 mt-3 w-96 bg-white shadow-xl rounded-xl border z-50 overflow-hidden">

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
//                             if (n.actionUrl) {
//                               router.push(n.actionUrl);
//                               setOpen(false);
//                             }
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
//                               <p className="font-semibold text-sm text-[#004B4B]">
//                                 {n.title}
//                               </p>

//                               <p className="text-sm text-gray-700 mt-1">
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
//   router.push("/dashboard/notifications");
// }}
//                     className="w-full text-sm font-medium text-[#004B4B] hover:underline"
//                   >
//                     See all notifications
//                   </button>
//                 </div>

//               </div>
//             )}
//           </div>

//           {/* PROFILE */}
//           <div className="relative" ref={menuRef}>
//             <div
//               onClick={() => setMenuOpen(!menuOpen)}
//               className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg transition"
//             >
//               {image ? (
//                 <div className="h-10 w-10 rounded-full overflow-hidden border">
//                   <Image
//                     src={image}
//                     width={40}
//                     height={40}
//                     alt="avatar"
//                     className="object-cover"
//                   />
//                 </div>
//               ) : (
//                 <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-[#004B4B]">
//                   {(name.charAt(0) || email.charAt(0) || "?").toUpperCase()}
//                 </div>
//               )}

//               <div className="hidden sm:block text-left leading-tight">
//                 <p className="text-sm font-medium text-[#004B4B]">
//                   {name || "User"}
//                 </p>
//                 <p className="text-xs text-gray-500">
//                   {email}
//                 </p>
//               </div>

//               <ChevronDown className="w-4 h-4 text-gray-600" />
//             </div>

//             {menuOpen && (
//               <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg">
//                 <button
//                   onClick={() => router.push("/dashboard/profile")}
//                   className="w-full text-left px-4 py-2 hover:bg-gray-50"
//                 >
//                   My Profile
//                 </button>

//                 <button
//                   onClick={() => signOut({ callbackUrl: "/" })}
//                   className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>

//         </div>
//       </div>
//     </header>
//   );
// }

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Bell, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
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

export default function Topbar() {
  const { data } = useSession();
  const router = useRouter();

  const name = data?.user?.name || "";
  const email = data?.user?.email || "";
  const image = data?.user?.image || null;

  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notificationRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  async function fetchNotifications() {
    try {
      const res = await fetch(
        "/api/notifications?recentOnly=true&limit=8&sort=latest",
        { cache: "no-store" }
      );

      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error("Notification fetch error", err);
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
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }

      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
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
    <header className="sticky top-0 bg-white border-b z-40">
      <div className="flex items-center justify-between h-14 px-6">
        <div className="flex items-center gap-2">
          <Image
            src="/tutorsewa-logo.png"
            width={55}
            height={55}
            alt="TutorSewa Logo"
            priority
          />
          <span className="text-lg font-semibold">
            <span className="text-[#48A6A7]">TUTOR</span>
            <span className="text-[#006A6A]">SEWA</span>
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative" ref={notificationRef}>
            <button onClick={() => setOpen((prev) => !prev)} className="relative">
              <Bell className="w-6 h-6 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 min-w-[18px] text-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-96 bg-white shadow-xl rounded-xl border z-50 overflow-hidden">
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
                          onClick={async () => {
                            if (!n.isRead) {
                              await markRead(n.id);
                            }

                            if (n.actionUrl) {
                              router.push(n.actionUrl);
                              setOpen(false);
                            }
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
                              <p className="font-semibold text-sm text-[#004B4B]">
                                {n.title}
                              </p>
                              <p className="text-sm text-gray-700 mt-1">{n.message}</p>
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
                      router.push("/dashboard/notifications");
                    }}
                    className="w-full text-sm font-medium text-[#004B4B] hover:underline"
                  >
                    See all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={menuRef}>
            <div
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg transition"
            >
              {image ? (
                <div className="h-10 w-10 rounded-full overflow-hidden border">
                  <Image
                    src={image}
                    width={40}
                    height={40}
                    alt="avatar"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-[#004B4B]">
                  {(name.charAt(0) || email.charAt(0) || "?").toUpperCase()}
                </div>
              )}

              <div className="hidden sm:block text-left leading-tight">
                <p className="text-sm font-medium text-[#004B4B]">{name || "User"}</p>
                <p className="text-xs text-gray-500">{email}</p>
              </div>

              <ChevronDown className="w-4 h-4 text-gray-600" />
            </div>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg">
                <button
                  onClick={() => router.push("/dashboard/profile")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50"
                >
                  My Profile
                </button>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
// "use client";

// import Image from "next/image";
// import { Bell, LogOut } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// interface TutorTopbarProps {
//   tutor: {
//     id?: string; // optional
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

//   // extra fields returned by API (for tutor)
//   studentName?: string | null;
//   subject?: string | null;
//   level?: string | null;
//   payMode?: "HALF" | "FULL" | null;
// };

// export default function TutorTopbar({ tutor }: TutorTopbarProps) {
//   const router = useRouter();

//   const [open, setOpen] = useState(false);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const ref = useRef<HTMLDivElement>(null);

//   // Fetch only when dropdown open
//   useEffect(() => {
//     if (!open) return;

//     fetch("/api/notifications?tutor=true")
//       .then((res) => res.json())
//       .then((data) => setNotifications(data.notifications || []))
//       .catch(() => setNotifications([]));
//   }, [open]);

//   // Close on outside click
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

//   function buildTutorMessage(n: Notification) {
//     // If API already gave the full message, use it
//     // (But we also support building from fields)
//     if (n.message && (n.message.includes("paid") || n.message.includes("payment"))) {
//       return n.message;
//     }

//     const student = n.studentName || "A student";
//     const subject = n.subject || "a subject";
//     const level = n.level ? `Grade ${n.level}` : "";

//     if (n.type === "PAYMENT_CONFIRMED") {
//       if (n.payMode === "HALF") {
//         return `${student} paid 50% for ${level ? `${level} ` : ""}${subject}`.trim();
//       }
//       if (n.payMode === "FULL") {
//         return `${student} completed full payment for ${subject}${level ? ` (${level})` : ""}`.trim();
//       }
//       return `${student} completed payment for ${subject}${level ? ` (${level})` : ""}`.trim();
//     }

//     if (n.type === "SESSION_LINK_SHARED") {
//       return `Session link shared for ${subject}${level ? ` (${level})` : ""}`.trim();
//     }

//     return n.message || "New notification";
//   }

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
//                 <div className="p-4 font-semibold border-b">Notifications</div>

//                 <div className="max-h-96 overflow-y-auto">
//                   {notifications.length === 0 ? (
//                     <p className="p-4 text-sm text-gray-500">No notifications</p>
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
//                             n.isRead ? "text-gray-700" : "text-gray-800 font-semibold"
//                           }`}
//                         >
//                           {buildTutorMessage(n)}
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
//                 {tutor.name.charAt(0).toUpperCase()}
//               </div>
//             )}

//             <div className="leading-tight hidden sm:block">
//               <p className="text-sm font-medium text-[#004B4B]">{tutor.name}</p>
//               <p className="text-xs text-gray-500">{tutor.email}</p>
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


"use client";

import Image from "next/image";
import { Bell, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface TutorTopbarProps {
  tutor: {
    name: string;
    email: string;
    photo?: string | null;
    status: string;
  };
}

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string | null;
};

export default function TutorTopbar({ tutor }: TutorTopbarProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  /* ================= FETCH NOTIFICATIONS ================= */
  useEffect(() => {
    if (!open) return;

    fetch("/api/notifications?tutor=true")
      .then((res) => res.json())
      .then((data) => setNotifications(data.notifications || []))
      .catch(() => setNotifications([]));
  }, [open]);

  /* ================= CLOSE ON OUTSIDE CLICK ================= */
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
    await fetch("/api/notifications/read", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId: id }),
    });

    setNotifications((prev) =>
      prev.map((x) => (x.id === id ? { ...x, isRead: true } : x))
    );
  }

  return (
    <header className="sticky top-0 z-40 h-14 bg-white border-b">
      <div className="flex items-center justify-between h-full px-6">

        {/* LOGO */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/tutor/dashboard")}
        >
          <Image
            src="/tutorsewa-logo.png"
            width={40}
            height={40}
            alt="TutorSewa"
            priority
          />
          <span className="text-lg font-semibold">
            <span className="text-[#48A6A7]">TUTOR</span>
            <span className="text-[#006A6A]">SEWA</span>
          </span>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6">

          {/* 🔔 NOTIFICATIONS */}
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((o) => !o)}
              className="relative text-gray-600 hover:text-[#004B4B]"
            >
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                  {unreadCount}
                </span>
              )}
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-[420px] bg-white shadow-xl rounded-xl border z-50 overflow-hidden">
                <div className="p-4 font-semibold border-b">
                  Notifications
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500">
                      No notifications
                    </p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={async () => {
                          if (!n.isRead) await markRead(n.id);
                          if (n.actionUrl) {
                            router.push(n.actionUrl);
                            setOpen(false);
                          }
                        }}
                        className={`p-4 border-b cursor-pointer transition ${
                          !n.isRead
                            ? "bg-[#E6F9F5] hover:bg-[#D6F3EE]"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <p className="font-semibold text-sm text-[#004B4B]">
                          {n.title}
                        </p>

                        <p
                          className={`text-sm mt-1 ${
                            n.isRead
                              ? "text-gray-700"
                              : "text-gray-800 font-semibold"
                          }`}
                        >
                          {n.message}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* PROFILE */}
          <div
            onClick={() => router.push("/tutor/profile")}
            className="flex items-center gap-3 cursor-pointer"
          >
            {tutor.photo ? (
              <div className="h-10 w-10 rounded-full overflow-hidden border">
                <Image
                  src={tutor.photo}
                  alt="Tutor avatar"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-[#004B4B]">
                {tutor.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="leading-tight hidden sm:block">
              <p className="text-sm font-medium text-[#004B4B]">
                {tutor.name}
              </p>
              <p className="text-xs text-gray-500">
                {tutor.email}
              </p>
            </div>
          </div>

          {/* LOGOUT */}
          <Link href="/logout" className="text-gray-500 hover:text-red-600">
            <LogOut size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
}

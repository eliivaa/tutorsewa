// "use client";

// import Image from "next/image";
// import { useMemo, useRef, useEffect, useState } from "react";
// import { useSession, signOut } from "next-auth/react";
// import { Bell } from "lucide-react";
// import { useRouter } from "next/navigation";

// export default function Topbar() {
//   const { data } = useSession();
//   const router = useRouter();

//   const name = data?.user?.name || "";
//   const email = data?.user?.email || "";
//   const image = data?.user?.image || null;

//   return (
//     <header className="sticky top-0 bg-white border-b">
//       <div className="flex items-center justify-between h-14 px-4">

//         {/* Logo */}
//          <div className="flex items-center gap-2">
//           <Image
//             src="/tutorsewa-logo.png"
//             width={55}
//             height={55}
//             alt="TutorSewa Logo"
//             className="cursor-pointer"
//             priority
//           />
//           <span className="text-lg font-semibold">
//   <span className="text-[#48A6A7]">TUTOR</span>
//   <span className="text-[#006A6A]">SEWA</span>
// </span>

//         </div>

//         {/* Profile */}
//        {/* Profile */}
// <div 
//   onClick={() => router.push("/dashboard/profile")} 
//   className="flex items-center gap-2 cursor-pointer"
// >
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
//     <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm">
//       {(name.charAt(0) || email.charAt(0) || "?").toUpperCase()}
//     </div>
//   )}

//   <div>
//     <p className="text-sm">{name}</p>
//     <p className="text-xs text-gray-500">{email}</p>
//   </div>
// </div>


//       </div>
//     </header>
//   );
// }


"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const { data } = useSession();
  const router = useRouter();

  const name = data?.user?.name || "";
  const email = data?.user?.email || "";
  const image = data?.user?.image || null;

  /* ======================
     NOTIFICATION STATE
  ====================== */
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  /* ======================
     FETCH NOTIFICATIONS
  ====================== */
  useEffect(() => {
    if (open) {
      fetch("/api/notifications")
        .then((res) => res.json())
        .then((data) =>
          setNotifications(data.notifications || [])
        );
    }
  }, [open]);

  /* ======================
     CLOSE ON OUTSIDE CLICK
  ====================== */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 bg-white border-b z-40">
      <div className="flex items-center justify-between h-14 px-4">

        {/* LOGO */}
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

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* 🔔 NOTIFICATION BELL */}
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen(!open)}
              className="relative"
            >
              <Bell className="w-6 h-6 text-gray-700" />

              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* 🔽 DROPDOWN */}
            {open && (
              <div className="absolute right-0 mt-3 w-96 bg-white shadow-xl rounded-xl border z-50">
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
                        onClick={() => {
                          if (n.actionUrl) {
                            router.push(n.actionUrl);
                            setOpen(false);
                          }
                        }}
                        className={`p-4 border-b text-sm cursor-pointer ${
                          !n.isRead ? "bg-[#E6F9F5]" : ""
                        }`}
                      >
                        <p className="font-medium">{n.title}</p>
                        <p className="text-gray-600">{n.message}</p>
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

          {/* 👤 PROFILE */}
          <div
            onClick={() => router.push("/dashboard/profile")}
            className="flex items-center gap-2 cursor-pointer"
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
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                {(name.charAt(0) ||
                  email.charAt(0) ||
                  "?").toUpperCase()}
              </div>
            )}

            <div>
              <p className="text-sm">{name}</p>
              <p className="text-xs text-gray-500">{email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

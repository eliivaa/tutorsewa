// "use client";

// import Image from "next/image";
// import { useEffect, useState, useRef } from "react";
// import { useSession } from "next-auth/react";
// import { Bell } from "lucide-react";
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
//   const ref = useRef<HTMLDivElement>(null);

//   /* ======================
//      FETCH NOTIFICATIONS
//   ====================== */
//   useEffect(() => {
//     if (open) {
//       fetch("/api/notifications")
//         .then((res) => res.json())
//         .then((data) =>
//           setNotifications(data.notifications || [])
//         );
//     }
//   }, [open]);

//   /* ======================
//      CLOSE ON OUTSIDE CLICK
//   ====================== */
//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (ref.current && !ref.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () =>
//       document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const unreadCount = notifications.filter((n) => !n.isRead).length;

//   return (
//     <header className="sticky top-0 bg-white border-b z-40">
//       <div className="flex items-center justify-between h-14 px-4">

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
//         <div className="flex items-center gap-4">

//           {/* 🔔 NOTIFICATION BELL */}
//           <div className="relative" ref={ref}>
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

//             {/* 🔽 DROPDOWN */}
//             {open && (
//               <div className="absolute right-0 mt-3 w-96 bg-white shadow-xl rounded-xl border z-50">
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
//                      <div
//   key={n.id}
//  onClick={async () => {
//   // mark notification as read
//   if (!n.isRead) {
//     await fetch("/api/notifications/read", {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ notificationId: n.id }),
//     });

//     setNotifications((prev) =>
//       prev.map((x) =>
//         x.id === n.id ? { ...x, isRead: true } : x
//       )
//     );
//   }

//   if (n.actionUrl) {
//     router.push(n.actionUrl);
//     setOpen(false);
//   }
// }}

//   className={`p-4 border-b cursor-pointer transition ${
//     !n.isRead
//       ? "bg-[#E6F9F5] hover:bg-[#D6F3EE]"
//       : "hover:bg-gray-50"
//   }`}
// >
// <p className="font-semibold text-sm text-[#004B4B]">
//   {n.title}
// </p>

// {/* Context line */}
// <p
//   className={`text-sm mt-1 ${
//     n.isRead
//       ? "text-gray-700 font-normal"
//       : "text-gray-800 font-semibold"
//   }`}
// >
//   {/* BOOKING ACCEPTED */}
//   {n.type === "BOOKING_ACCEPTED" && n.booking?.tutor?.name && (
//     <>
//       <span>{n.booking.tutor.name}</span>{" "}
//       <span className="text-green-600 font-semibold">
//         accepted
//       </span>{" "}
//       your{" "}
//       <span>{n.booking.subject}</span>{" "}
//       session.
//     </>
//   )}

//   {/* BOOKING REJECTED */}
//   {n.type === "BOOKING_REJECTED" && n.booking?.tutor?.name && (
//     <>
//       <span>{n.booking.tutor.name}</span>{" "}
//       <span className="text-red-600 font-semibold">
//         rejected
//       </span>{" "}
//       your{" "}
//       <span>{n.booking.subject}</span>{" "}
//       session.
//     </>
//   )}

//   {/* PAYMENT CONFIRMED */}
//   {n.type === "PAYMENT_CONFIRMED" && (
//     <>{n.message}</>
//   )}

//   {/* FALLBACK */}
//   {!["BOOKING_ACCEPTED", "BOOKING_REJECTED", "PAYMENT_CONFIRMED"].includes(n.type) &&
//     n.message}
// </p>


// {/* Action hint (IMPORTANT) */}
// {n.type === "BOOKING_ACCEPTED" && (
//   <p className="text-xs text-[#006A6A] mt-1 font-medium">
//     Please complete the payment to confirm the session.
//   </p>
// )}

//  <p className="text-xs text-gray-400 mt-1">
//     {new Date(n.createdAt).toLocaleString()}
//                         </p>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* 👤 PROFILE */}
//           <div
//             onClick={() => router.push("/dashboard/profile")}
//             className="flex items-center gap-2 cursor-pointer"
//           >
//             {image ? (
//               <div className="h-10 w-10 rounded-full overflow-hidden border">
//                 <Image
//                   src={image}
//                   width={40}
//                   height={40}
//                   alt="avatar"
//                   className="object-cover"
//                 />
//               </div>
//             ) : (
//               <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm">
//                 {(name.charAt(0) ||
//                   email.charAt(0) ||
//                   "?").toUpperCase()}
//               </div>
//             )}

//             <div>
//               <p className="text-sm">{name}</p>
//               <p className="text-xs text-gray-500">{email}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { Bell, ChevronDown } from "lucide-react";
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
  const notificationRef = useRef<HTMLDivElement>(null);

  /* ======================
     PROFILE DROPDOWN STATE
  ====================== */
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  /* ======================
     FETCH NOTIFICATIONS
  ====================== */
  useEffect(() => {
    if (open) {
      fetch("/api/notifications")
        .then((res) => res.json())
        .then((data) => {
          setNotifications(data.notifications || []);
        });
    }
  }, [open]);

  /* ======================
     CLOSE ON OUTSIDE CLICK
  ====================== */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }

      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 bg-white border-b z-40">
      <div className="flex items-center justify-between h-14 px-6">

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
        <div className="flex items-center gap-6">

          {/* 🔔 NOTIFICATION */}
          <div className="relative" ref={notificationRef}>
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
                        onClick={async () => {
                          if (!n.isRead) {
                            await fetch("/api/notifications/read", {
                              method: "PATCH",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                notificationId: n.id,
                              }),
                            });

                            setNotifications((prev) =>
                              prev.map((x) =>
                                x.id === n.id
                                  ? { ...x, isRead: true }
                                  : x
                              )
                            );
                          }

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

                        <p className="text-sm mt-1">
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

          {/* 👤 PROFILE DROPDOWN */}
          <div className="relative" ref={menuRef}>
            <div
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg transition"
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

              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium">{name}</p>
                <p className="text-xs text-gray-500">{email}</p>
              </div>

              <ChevronDown className="w-4 h-4 text-gray-600" />
            </div>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg overflow-hidden z-50">

                <button
                  onClick={() => {
                    router.push("/dashboard/profile");
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  My Profile
                </button>

                <button
                  onClick={() =>
                    signOut({ callbackUrl: "/" })
                  }
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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

// "use client";

// import Image from "next/image";
// import { useMemo } from "react";
// import { useSession } from "next-auth/react";
// import { Bell } from "lucide-react";

// export default function Topbar() {
//   const { data } = useSession();
//   const name = data?.user?.name || "";
//   const email = data?.user?.email || "";

//   // initials from name, else from email
//   const initials = useMemo(() => {
//     if (name?.trim()) {
//       const parts = name.trim().split(/\s+/);
//       return (parts[0]?.[0] || "").concat(parts[1]?.[0] || "").toUpperCase();
//     }
//     return (email?.[0] || "?").toUpperCase();
//   }, [name, email]);

//   return (
//     <header className="sticky top-0 z-40 bg-white border-b border-black/5">
//       <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 h-14 flex items-center justify-between">
//         {/* Brand */}
//         <div className="flex items-center gap-2">
//           <Image
//             src="/tutorsewa-logo.png"
//             alt="TutorSewa"
//             width={28}
//             height={28}
//             priority
//           />
//           <span className="text-lg font-semibold">
//             <span className="text-[#48A6A7]">TUTOR</span>
//             <span className="text-[#006A6A]">SEWA</span>
//           </span>
//         </div>

//         {/* Right: bell + user chip */}
//         <div className="flex items-center gap-3">
//           {/* bell */}
//           <button
//             aria-label="Notifications"
//             className="relative rounded-full p-2 hover:bg-black/5 transition"
//           >
//             <Bell size={18} className="text-[#006A6A]" />
//             {/* small unread dot (optional) */}
//             <span className="absolute right-1 top-1 inline-block h-2 w-2 rounded-full bg-[#48A6A7]" />
//           </button>

//           {/* user chip */}
//           <div className="flex items-center gap-2">
//             <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-700">
//               {initials}
//             </div>
//             <div className="hidden sm:block leading-tight">
//               <p className="text-sm font-medium text-gray-900">{name || email}</p>
//               <p className="text-xs text-gray-500">{name ? email : " "}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }


"use client";

import Image from "next/image";
import { useMemo, useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Bell } from "lucide-react";

export default function Topbar() {
  const { data } = useSession();
  const name = data?.user?.name || "";
  const email = data?.user?.email || "";
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ Generate initials (name or email)
  const initials = useMemo(() => {
    if (name?.trim()) {
      const parts = name.trim().split(/\s+/);
      return (parts[0]?.[0] || "").concat(parts[1]?.[0] || "").toUpperCase();
    }
    return (email?.[0] || "?").toUpperCase();
  }, [name, email]);

  // ✅ Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-black/5">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Image
            src="/tutorsewa-logo.png"
            alt="TutorSewa"
            width={28}
            height={28}
            priority
          />
          <span className="text-lg font-semibold">
            <span className="text-[#48A6A7]">TUTOR</span>
            <span className="text-[#006A6A]">SEWA</span>
          </span>
        </div>

        {/* Right Section: Notification + Profile */}
        <div className="flex items-center gap-3 relative" ref={dropdownRef}>
          {/* 🔔 Notification Bell */}
          <button
            aria-label="Notifications"
            className="relative rounded-full p-2 hover:bg-black/5 transition"
          >
            <Bell size={18} className="text-[#006A6A]" />
            <span className="absolute right-1 top-1 inline-block h-2 w-2 rounded-full bg-[#48A6A7]" />
          </button>

          {/* 👤 Profile Section */}
          <div className="flex items-center gap-2 cursor-pointer select-none">
            <div
              className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-700"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {initials}
            </div>
            <div
              className="hidden sm:block leading-tight"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <p className="text-sm font-medium text-gray-900">
                {name || email}
              </p>
              <p className="text-xs text-gray-500">
                {name ? email : " "}
              </p>
            </div>
          </div>

          {/* ⚙️ Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-12 bg-white shadow-md rounded-md py-2 w-44 text-sm animate-fadeIn">
              <button className="block w-full text-left px-4 py-2 hover:bg-[#F2EFE7] transition">
                View Profile
              </button>
              <button className="block w-full text-left px-4 py-2 hover:bg-[#F2EFE7] transition">
                Settings
              </button>
              <button
                onClick={() => signOut()}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-[#F2EFE7] transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

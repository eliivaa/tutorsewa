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
//   const image = data?.user?.image || null; // 👈 added

//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   const initials = useMemo(() => {
//     return (
//       name?.charAt(0)?.toUpperCase() ||
//       email?.charAt(0)?.toUpperCase() ||
//       "?"
//     );
//   }, [name, email]);

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClick = (e: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClick);
//     return () => document.removeEventListener("mousedown", handleClick);
//   }, []);

//   return (
//     <header className="sticky top-0 z-40 bg-white border-b border-black/5">
//       <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 h-14 flex items-center justify-between">

//         {/* Brand */}
//         <div className="flex items-center gap-2">
//           <Image src="/tutorsewa-logo.png" alt="TutorSewa" width={28} height={28} />
//           <span className="text-lg font-semibold">
//             <span className="text-[#48A6A7]">TUTOR</span>
//             <span className="text-[#006A6A]">SEWA</span>
//           </span>
//         </div>

//         {/* Profile Section */}
//         <div className="flex items-center gap-3 relative" ref={dropdownRef}>
          
//           {/* Notifications */}
//           <button className="relative rounded-full p-2 hover:bg-black/5 transition">
//             <Bell size={18} className="text-[#006A6A]" />
//             <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#48A6A7]" />
//           </button>

//           {/* Avatar + Name */}
//           <div
//             className="flex items-center gap-2 cursor-pointer"
//             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//           >
//             {/* If user uploaded a real photo */}
//             {image ? (
//               <Image
//                 src={image}
//                 alt="User Avatar"
//                 width={35}
//                 height={35}
//                 className="rounded-full object-cover border border-gray-300"
//               />
//             ) : (
//               <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-700">
//                 {initials}
//               </div>
//             )}

//             <div className="hidden sm:block text-left">
//               <p className="text-sm font-medium text-gray-900">{name}</p>
//               <p className="text-xs text-gray-500">{email}</p>
//             </div>
//           </div>

//           {/* Dropdown Menu */}
//           {isDropdownOpen && (
//             <div className="absolute right-0 top-12 bg-white shadow-md rounded-md py-2 w-44 text-sm animate-fadeIn">
//               <button
//                 onClick={() => router.push("/dashboard/profile")}
//                 className="block w-full text-left px-4 py-2 hover:bg-[#F2EFE7]"
//               >
//                 View Profile
//               </button>

//               <button className="block w-full text-left px-4 py-2 hover:bg-[#F2EFE7]">
//                 Settings
//               </button>

//               <button
//                 onClick={() => signOut()}
//                 className="block w-full text-left px-4 py-2 text-red-600 hover:bg-[#F2EFE7]"
//               >
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>

//       </div>
//     </header>
//   );
// }


"use client";

import Image from "next/image";
import { useMemo, useRef, useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const { data } = useSession();
  const router = useRouter();

  const name = data?.user?.name || "";
  const email = data?.user?.email || "";
  const image = data?.user?.image || null;

  return (
    <header className="sticky top-0 bg-white border-b">
      <div className="flex items-center justify-between h-14 px-4">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src="/tutorsewa-logo.png" width={28} height={28} alt="TutorSewa"/>
          <span className="text-lg font-semibold">TUT<span className="text-[#006A6A]">ORSEWA</span></span>
        </div>

        {/* Profile */}
        <div onClick={() => router.push("/dashboard/profile")} className="flex items-center gap-2 cursor-pointer">

          {image ? (
            <Image src={image} width={32} height={32} className="rounded-full" alt="avatar"/>
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
              {(name.charAt(0) || email.charAt(0) || "?").toUpperCase()}
            </div>
          )}

          <div>
            <p className="text-sm">{name}</p>
            <p className="text-xs text-gray-500">{email}</p>
          </div>
        </div>

      </div>
    </header>
  );
}

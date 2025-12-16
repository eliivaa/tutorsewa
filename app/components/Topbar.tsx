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
          <Image
            src="/tutorsewa-logo.png"
            width={55}
            height={55}
            alt="TutorSewa Logo"
            className="cursor-pointer"
            priority
          />
          <span className="text-lg font-semibold">
  <span className="text-[#48A6A7]">TUTOR</span>
  <span className="text-[#006A6A]">SEWA</span>
</span>

        </div>

        {/* Profile */}
       {/* Profile */}
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

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

type Tutor = {
  name: string;
  email: string;
  photo?: string | null;
};

export default function TutorTopbar({ tutor }: { tutor: Tutor }) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="flex items-center justify-between h-14 px-6">

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

          <div className="leading-tight">
            <p className="text-sm font-medium text-[#004B4B]">
              {tutor.name}
            </p>
            <p className="text-xs text-gray-500">
              {tutor.email}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

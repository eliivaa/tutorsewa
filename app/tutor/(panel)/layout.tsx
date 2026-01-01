// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import TutorTopbar from "@/app/components/tutor/TutorTopbar";

// /* ======================
//    TYPES
// ====================== */
// interface TutorMe {
//   name: string;
//   email: string;
//   photo?: string | null;
//   status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
// }

// /* ======================
//    SIDEBAR LINK
// ====================== */
// function SidebarLink({
//   label,
//   href,
//   disabled = false,
// }: {
//   label: string;
//   href: string;
//   disabled?: boolean;
// }) {
//   return (
//     <Link
//       href={disabled ? "#" : href}
//       className={`block p-3 rounded text-sm font-medium ${
//         disabled
//           ? "opacity-40 cursor-not-allowed"
//           : "hover:bg-[#066666]"
//       }`}
//     >
//       {label}
//     </Link>
//   );
// }

// /* ======================
//    LAYOUT
// ====================== */
// export default function TutorLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [tutor, setTutor] = useState<TutorMe | null>(null);

//   useEffect(() => {
//     fetch("/api/tutor/me")
//       .then((res) => res.json())
//       .then(setTutor);
//   }, []);

//   if (!tutor)
//     return <p className="p-10 text-[#004B4B]">Loading...</p>;

//   const isApproved = tutor.status === "APPROVED";

//   return (
//     <div className="min-h-screen bg-[#F4F4ED]">

//       {/* TOPBAR */}
//       <TutorTopbar tutor={tutor} />

//       <div className="flex">

//         {/* SIDEBAR */}
//         <aside className="w-64 bg-[#004B4B] text-white p-6 space-y-3 min-h-[calc(100vh-56px)]">
//           <h2 className="text-2xl font-bold mb-8">Tutor Panel</h2>

//           <SidebarLink label="Dashboard" href="/tutor/dashboard" />
//           <SidebarLink label="My Profile" href="/tutor/profile" />

//           <SidebarLink
//             label="Subjects & Pricing"
//             href="/tutor/subjects"
//             disabled={!isApproved}
//           />

//           <SidebarLink
//             label="Availability & Schedule"
//             href="/tutor/availability"
//             disabled={!isApproved}
//           />

//           <SidebarLink
//             label="Bookings"
//             href="/tutor/bookings"
//             disabled={!isApproved}
//           />

//           <SidebarLink
//             label="Payments"
//             href="/tutor/payments"
//             disabled={!isApproved}
//           />

//           <SidebarLink label="Logout" href="/logout" />
//         </aside>

//         {/* PAGE CONTENT */}
//         <main className="flex-1 p-10">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TutorTopbar from "@/app/components/tutor/TutorTopbar";

/* ======================
   TYPES
====================== */
interface TutorMe {
  name: string;
  email: string;
  photo?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
}

/* ======================
   SIDEBAR LINK
====================== */
function SidebarLink({
  label,
  href,
  disabled = false,
}: {
  label: string;
  href: string;
  disabled?: boolean;
}) {
  return (
    <Link
      href={disabled ? "#" : href}
      className={`block p-3 rounded text-sm font-medium transition ${
        disabled
          ? "opacity-40 cursor-not-allowed"
          : "hover:bg-[#066666]"
      }`}
      onClick={(e) => {
        if (disabled) e.preventDefault();
      }}
    >
      {label}
    </Link>
  );
}

/* ======================
   LAYOUT
====================== */
export default function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tutor, setTutor] = useState<TutorMe | null>(null);

  useEffect(() => {
    fetch("/api/tutor/me")
      .then((res) => res.json())
      .then(setTutor);
  }, []);

  if (!tutor)
    return <p className="p-10 text-[#004B4B]">Loading...</p>;

  const isApproved = tutor.status === "APPROVED";
  const isSuspended = tutor.status === "SUSPENDED";

  return (
    <div className="min-h-screen bg-[#F4F4ED]">

      {/* TOPBAR */}
      <TutorTopbar tutor={tutor} />

      <div className="flex">

        {/* SIDEBAR */}
        <aside className="w-64 bg-[#004B4B] text-white p-6 space-y-3 min-h-[calc(100vh-56px)]">
          <h2 className="text-2xl font-bold mb-8">Tutor Panel</h2>

          {/* Always allowed */}
          <SidebarLink label="Dashboard" href="/tutor/dashboard" />

          {/* ❌ Disabled when SUSPENDED */}
          <SidebarLink
            label="My Profile"
            href="/tutor/profile"
            disabled={isSuspended}
          />

          {/* ❌ Only APPROVED tutors */}
          <SidebarLink
            label="Subjects & Pricing"
            href="/tutor/subjects"
            disabled={!isApproved}
          />

          <SidebarLink
            label="Availability & Schedule"
            href="/tutor/availability"
            disabled={!isApproved}
          />

          <SidebarLink
            label="Bookings"
            href="/tutor/bookings"
            disabled={!isApproved}
          />

          <SidebarLink
            label="Payments"
            href="/tutor/payments"
            disabled={!isApproved}
          />

          <SidebarLink label="Logout" href="/logout" />
        </aside>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-10">
          {children}
        </main>
      </div>
    </div>
  );
}

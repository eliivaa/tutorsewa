// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";

// /* ======================
//    TYPES
// ====================== */
// interface TutorData {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
//   status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
//   subjects?: string[];
//   experience?: number;
//   rating?: number;
//   totalStudents?: number;
//   upcomingSession?: {
//     student: string;
//     date: string;
//     time: string;
//     type: string;
//   } | null;
// }

// /* ======================
//    SIDEBAR LINK COMPONENT
// ====================== */
// interface SidebarLinkProps {
//   label: string;
//   href: string;
//   disabled?: boolean;
//   active?: boolean;
// }

// function SidebarLink({
//   label,
//   href,
//   disabled = false,
//   active = false,
// }: SidebarLinkProps) {
//   const base = "flex items-center gap-3 p-3 rounded text-sm font-medium";

//   const activeClass = active
//     ? "bg-[#E6F9F5] text-[#004B4B]"
//     : "hover:bg-[#066666]";

//   const disabledClass = "opacity-40 cursor-not-allowed";

//   return (
//     <Link
//       href={disabled ? "#" : href}
//       className={`${base} ${disabled ? disabledClass : activeClass}`}
//     >
//       {label}
//     </Link>
//   );
// }

// /* ======================
//    MAIN COMPONENT
// ====================== */
// export default function TutorDashboard() {
//   const [data, setData] = useState<TutorData | null>(null);

//   useEffect(() => {
//     fetch("/api/tutor/me")
//       .then((res) => res.json())
//       .then((d) => setData(d));
//   }, []);

//   if (!data)
//     return <p className="p-8 text-[#004B4B]">Loading dashboard...</p>;

//   const isApproved = data.status === "APPROVED";

//   return (
//     <div className="flex bg-[#F4F4ED] min-h-screen">

     

//       {/* ======================
//          MAIN CONTENT
//       ====================== */}
//       <main className="flex-1 p-10">

//         <h1 className="text-3xl font-semibold text-[#004B4B] mb-4">
//           Welcome, {data.name}
//         </h1>

//         {/* STATUS MESSAGE */}
//         {data.status === "PENDING" && (
//           <AlertBox
//             color="yellow"
//             message="⏳ Your profile is under admin review."
//           />
//         )}

//         {data.status === "REJECTED" && (
//           <AlertBox
//             color="red"
//             message="❌ Your tutor profile was rejected. Contact admin for details."
//           />
//         )}

//         {data.status === "APPROVED" && (
//           <AlertBox
//             color="green"
//             message="✔ Approved — students can now book sessions with you!"
//           />
//         )}

//         {/* ======================
//            STATS CARDS
//         ====================== */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
//           <StatCard title="Total Students" value={data.totalStudents ?? 0} />
//           <StatCard
//             title="Rating"
//             value={data.rating ? `${data.rating} ⭐` : "No ratings yet"}
//           />
//           <StatCard
//             title="Experience"
//             value={data.experience ? `${data.experience}` : "—"}
//           />
//           <StatCard
//             title="Total Subjects"
//             value={data.subjects?.length ?? 0}
//           />
//         </div>

//         {/* ======================
//            UPCOMING SESSION
//         ====================== */}
//         {data.upcomingSession && (
//           <div className="bg-white shadow p-6 rounded-lg mb-6 border">
//             <h2 className="text-xl font-semibold text-[#004B4B] mb-4">
//               Next Upcoming Session
//             </h2>

//             <p><b>Student:</b> {data.upcomingSession.student}</p>
//             <p><b>Date:</b> {data.upcomingSession.date}</p>
//             <p><b>Time:</b> {data.upcomingSession.time}</p>
//             <p><b>Type:</b> {data.upcomingSession.type}</p>

//             <div className="mt-4 flex gap-3">
//               <button className="px-4 py-2 rounded bg-gray-300 text-gray-700">
//                 Join Session
//               </button>
//               <button className="px-4 py-2 rounded bg-[#004B4B] text-white">
//                 View Details
//               </button>
//             </div>
//           </div>
//         )}

       
      
//       </main>
//     </div>
//   );
// }

// /* ======================
//    SMALL COMPONENTS
// ====================== */

// function AlertBox({ color, message }: { color: string; message: string }) {
//   const colors: any = {
//     yellow: "bg-yellow-100 border-yellow-300 text-yellow-800",
//     red: "bg-red-100 border-red-300 text-red-700",
//     green: "bg-green-100 border-green-300 text-green-700",
//   };

//   return (
//     <div className={`border p-4 rounded mb-6 ${colors[color]}`}>
//       {message}
//     </div>
//   );
// }

// function StatCard({ title, value }: { title: string; value: any }) {
//   return (
//     <div className="bg-white border shadow-sm p-4 rounded-lg text-center">
//       <div className="text-gray-600 text-sm">{title}</div>
//       <div className="text-2xl font-bold text-[#004B4B]">{value}</div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* ======================
   TYPES
====================== */
interface TutorData {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  subjects?: string[];
  experience?: number;
  rating?: number;
  totalStudents?: number;
  upcomingSession?: {
    student: string;
    date: string;
    time: string;
    type: string;
  } | null;
}

/* ======================
   MAIN COMPONENT
====================== */
export default function TutorDashboard() {
  const [data, setData] = useState<TutorData | null>(null);

  useEffect(() => {
    fetch("/api/tutor/me")
      .then((res) => res.json())
      .then((d) => setData(d));
  }, []);

  if (!data)
    return <p className="p-8 text-[#004B4B]">Loading dashboard...</p>;

  const isApproved = data.status === "APPROVED";

  return (
    <div className="flex bg-[#F4F4ED] min-h-screen">
      <main className="flex-1 p-10">

        <h1 className="text-3xl font-semibold text-[#004B4B] mb-4">
          Welcome, {data.name}
        </h1>

        {/* ======================
           STATUS MESSAGES
        ====================== */}
        {data.status === "PENDING" && (
          <AlertBox
            color="yellow"
            message="⏳ Your profile is under admin review. You will be notified once approved."
          />
        )}

        {data.status === "REJECTED" && (
          <AlertBox
            color="red"
            message="❌ Your tutor profile was rejected. Please contact TutorSewa admin for details."
          />
        )}

        {data.status === "SUSPENDED" && (
          <AlertBox
            color="red"
            message="🚫 Your tutor account has been suspended. Please contact TutorSewa admin for more information."
          />
        )}

        {data.status === "APPROVED" && (
          <AlertBox
            color="green"
            message="✔ Approved — students can now book sessions with you!"
          />
        )}

        {/* ======================
           STATS CARDS
        ====================== */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
          <StatCard title="Total Students" value={data.totalStudents ?? 0} />
          <StatCard
            title="Rating"
            value={data.rating ? `${data.rating} ⭐` : "No ratings yet"}
          />
          <StatCard
            title="Experience"
            value={data.experience ? `${data.experience}` : "—"}
          />
          <StatCard
            title="Total Subjects"
            value={data.subjects?.length ?? 0}
          />
        </div>

        {/* ======================
           UPCOMING SESSION
        ====================== */}
        {isApproved && data.upcomingSession && (
          <div className="bg-white shadow p-6 rounded-lg mb-6 border">
            <h2 className="text-xl font-semibold text-[#004B4B] mb-4">
              Next Upcoming Session
            </h2>

            <p><b>Student:</b> {data.upcomingSession.student}</p>
            <p><b>Date:</b> {data.upcomingSession.date}</p>
            <p><b>Time:</b> {data.upcomingSession.time}</p>
            <p><b>Type:</b> {data.upcomingSession.type}</p>

            <div className="mt-4 flex gap-3">
              <button className="px-4 py-2 rounded bg-gray-300 text-gray-700">
                Join Session
              </button>
              <button className="px-4 py-2 rounded bg-[#004B4B] text-white">
                View Details
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

/* ======================
   SMALL COMPONENTS
====================== */

function AlertBox({ color, message }: { color: string; message: string }) {
  const colors: any = {
    yellow: "bg-yellow-100 border-yellow-300 text-yellow-800",
    red: "bg-red-100 border-red-300 text-red-700",
    green: "bg-green-100 border-green-300 text-green-700",
  };

  return (
    <div className={`border p-4 rounded mb-6 ${colors[color]}`}>
      {message}
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-white border shadow-sm p-4 rounded-lg text-center">
      <div className="text-gray-600 text-sm">{title}</div>
      <div className="text-2xl font-bold text-[#004B4B]">{value}</div>
    </div>
  );
}

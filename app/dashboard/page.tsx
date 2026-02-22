// "use client";

// import { useSession } from "next-auth/react";
// import Image from "next/image";
// import { Calendar, Clock, User, CreditCard } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// export default function DashboardPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   // 🚀 Redirect if profile incomplete
//   useEffect(() => {
//     if (status === "loading") return;

//     if (session?.user?.profileIncomplete) {
//       router.push("/complete-profile");
//     }
//   }, [session, status]);

//   return (
//     <>
//       <h1 className="text-2xl font-bold text-[#006A6A] mb-2">
//         Welcome back, {session?.user?.name} 👋
//       </h1>

//       <p className="text-gray-600 mb-6">
//         Manage your sessions, tutors & learning progress
//       </p>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
//         {[
//           {
//             label: "Upcoming Sessions",
//             value: "2",
//             icon: <Calendar className="text-[#48A6A7]" size={24} />
//           },
//           {
//             label: "Total Hours",
//             value: "14",
//             icon: <Clock className="text-[#48A6A7]" size={24} />
//           },
//           {
//             label: "Tutors Connected",
//             value: "5",
//             icon: <User className="text-[#48A6A7]" size={24} />
//           },
//           {
//             label: "Pending Payments",
//             value: "₨ 500",
//             icon: <CreditCard className="text-[#48A6A7]" size={24} />
//           },
//         ].map((item, i) => (
//           <div
//             key={i}
//             className="bg-white rounded-xl shadow p-4 flex items-center gap-4"
//           >
//             {item.icon}
//             <div>
//               <h3 className="text-xl font-semibold">{item.value}</h3>
//               <p className="text-sm text-gray-500">{item.label}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="mt-12 flex flex-col items-center text-center">
//         <div className="bg-[#F2EFE7] p-10 rounded-xl shadow-inner max-w-md">
//           <Image
//             src="/no-session.webp"
//             width={180}
//             height={180}
//             alt="No Session"
//           />
//           <h2 className="text-lg font-semibold mt-6">No session yet!</h2>
//           <p className="text-gray-600 mb-4">
//             Start your first session and unlock your learning potential.
//           </p>
//           <button className="bg-[#006A6A] text-white px-5 py-2 rounded-md">
//             Browse Tutors
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }

"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { Calendar, Clock, User, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState({
    upcomingSessions: 0,
    totalHours: 0,
    tutorsConnected: 0,
    pendingPayments: 0,
    totalBookings: 0,
  });

  /* 🚀 Redirect if profile incomplete */
  useEffect(() => {
    if (status === "loading") return;

    if (session?.user?.profileIncomplete) {
      router.push("/complete-profile");
    }
  }, [session, status]);

  /* ================= FETCH DASHBOARD STATS ================= */
  useEffect(() => {
    async function fetchStats() {
      const res = await fetch("/api/dashboard/stats");
      const data = await res.json();
      setStats(data);
    }

    fetchStats();
  }, []);

  const cards = [
    {
      label: "Upcoming Sessions",
      value: stats.upcomingSessions,
      icon: <Calendar className="text-[#48A6A7]" size={24} />,
    },
    {
      label: "Total Hours",
      value: stats.totalHours,
      icon: <Clock className="text-[#48A6A7]" size={24} />,
    },
    {
      label: "Tutors Connected",
      value: stats.tutorsConnected,
      icon: <User className="text-[#48A6A7]" size={24} />,
    },
    {
      label: "Pending Payments",
      value: `₨ ${stats.pendingPayments}`,
      icon: <CreditCard className="text-[#48A6A7]" size={24} />,
    },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold text-[#006A6A] mb-2">
        Welcome back, {session?.user?.name} 👋
      </h1>

      <p className="text-gray-600 mb-6">
        Manage your sessions, tutors & learning progress
      </p>

      {/* ================= STATS CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {cards.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow p-4 flex items-center gap-4"
          >
            {item.icon}
            <div>
              <h3 className="text-xl font-semibold">{item.value}</h3>
              <p className="text-sm text-gray-500">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 UPCOMING SESSION EXISTS */}
{stats.upcomingSessions > 0 && (
  <div className="mt-12 bg-white rounded-xl shadow p-8">
    <h2 className="text-lg font-semibold text-[#004B4B] mb-4">
      📅 Upcoming Session
    </h2>

    <div className="flex items-center justify-between bg-[#F5FDFD] p-5 rounded-lg">
      <div>
        <p className="text-sm text-gray-500">
          You have {stats.upcomingSessions} upcoming session
          {stats.upcomingSessions > 1 && "s"} scheduled.
        </p>

        <p className="text-gray-600 mt-1">
          Stay prepared and join on time!
        </p>
      </div>

      <button
        onClick={() => router.push("/dashboard/my-sessions")}
        className="bg-[#006A6A] text-white px-4 py-2 rounded-md hover:bg-[#004B4B] transition"
      >
        View Sessions
      </button>
    </div>
  </div>
)}

      {/* ================= EMPTY STATES ================= */}

      {/* 🔹 BRAND NEW USER */}
      
        {stats.totalBookings > 0 &&
  stats.upcomingSessions === 0 && (
    <div className="mt-12 space-y-6">

      {/* 🔹 NO UPCOMING SESSIONS HEADER */}
      <div className="bg-[#FFF8E1] border border-[#FFE0B2] rounded-xl p-6 text-center">
        <h2 className="text-lg font-semibold text-[#B26A00]">
          📅 No upcoming sessions
        </h2>
        <p className="text-gray-600 mt-2">
          You currently don’t have any sessions scheduled.
        </p>
        <p className="text-gray-500 text-sm mt-1">
          Stay consistent — regular practice leads to better results.
        </p>
      </div>

      {/* 🔹 GREAT JOB SUMMARY */}
      <div className="bg-white rounded-xl shadow p-8 text-center">
        <h2 className="text-lg font-semibold text-[#004B4B]">
          🎉 Great job!
        </h2>

        <p className="text-gray-600 mt-2">
          You have completed{" "}
          <span className="font-semibold text-[#006A6A]">
            {stats.totalHours}
          </span>{" "}
          learning hours.
        </p>

        <p className="text-gray-500 mt-1">
          You’ve connected with{" "}
          <span className="font-semibold text-[#006A6A]">
            {stats.tutorsConnected}
          </span>{" "}
          tutor{stats.tutorsConnected !== 1 && "s"}.
        </p>

        <p className="text-gray-500 mt-3">
          Book your next session to continue improving.
        </p>

        <button
          onClick={() => router.push("/dashboard/browse")}
          className="mt-6 bg-[#006A6A] text-white px-5 py-2 rounded-md hover:bg-[#004B4B] transition"
        >
          Book Another Session
        </button>
      </div>

    </div>
)}

    </>
  );
}

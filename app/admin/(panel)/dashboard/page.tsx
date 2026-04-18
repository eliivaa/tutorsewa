// "use client";

// import { useEffect, useState } from "react";

// export default function AdminDashboard() {
//   const [stats, setStats] = useState<any>(null);

//   useEffect(() => {
//     fetch("/api/admin/dashboard")
//       .then((res) => res.json())
//       .then(setStats);
//   }, []);

//   if (!stats) {
//     return (
//       <p className="text-gray-500 text-sm">
//         Loading dashboard data...
//       </p>
//     );
//   }

//   return (
//     <div className="space-y-8 text-[#004B4B]">

//       {/* TITLE */}
//       <div>
//         <h1 className="text-2xl font-bold">Dashboard Overview</h1>
//         <p className="text-gray-600 text-sm">
//           Platform statistics and earnings summary
//         </p>
//       </div>

//       {/* STAT CARDS */}
//       <div className="grid grid-cols-4 gap-6">
//         <StatCard
//           title="Total Students"
//           value={stats.totalStudents}
//         />
//         <StatCard
//           title="Total Tutors"
//           value={stats.totalTutors}
//         />
//         <StatCard
//           title="Total Bookings"
//           value={stats.totalBookings}
//         />
//         <StatCard
//           title="Total Earnings"
//           value={`NPR ${stats.totalEarnings}`}
//         />
//       </div>

//       {/* INFO SECTION */}
//       <div className="bg-white border rounded-xl p-6 shadow-sm">
//         <h2 className="text-lg font-semibold mb-2">
//           System Summary
//         </h2>
//         <p className="text-sm text-gray-600">
//           This dashboard provides a real-time overview of users,
//           bookings, and revenue generated through the TutorSewa
//           platform. Earnings are calculated only from verified
//           payments completed via eSewa.
//         </p>
//       </div>

//     </div>
//   );
// }

// /* ================= HELPER ================= */

// function StatCard({
//   title,
//   value,
// }: {
//   title: string;
//   value: string | number;
// }) {
//   return (
//     <div className="bg-white border rounded-xl p-5 shadow-sm">
//       <p className="text-sm text-gray-600">{title}</p>
//       <p className="text-2xl font-bold mt-1">{value}</p>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then(setStats);
  }, []);

  if (!stats) {
    return <p className="text-gray-500">Loading dashboard...</p>;
  }

  // 🔹 Merge student + tutor monthly data
  const registrationData = stats.registrations.studentMonthly.map(
    (s: any, i: number) => ({
      month: s.month,
      students: s.count,
      tutors: stats.registrations.tutorMonthly[i]?.count ?? 0,
    })
  );

  return (
    <div className="space-y-8 text-[#004B4B]">

      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-sm text-gray-600">
          Platform statistics and earnings summary
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard title="Total Students" value={stats.totalStudents} />
        <StatCard title="Total Tutors" value={stats.totalTutors} />
        <StatCard title="Total Bookings" value={stats.totalBookings} />
        <StatCard title="Total Earnings" value={`NPR ${stats.totalEarnings}`} />
      </div>

      {/* MONTHLY REGISTRATION */}
<div className="bg-white border rounded-xl p-6 shadow-sm relative z-0">
        <h2 className="font-semibold mb-4">Monthly Registration</h2>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={registrationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="students" fill="#4FA3A5" radius={[4, 4, 0, 0]} />
            <Bar dataKey="tutors" fill="#004B4B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* MONTHLY EARNINGS */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="font-semibold mb-4">Monthly Earnings</h2>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={stats.earningsMonthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="admin" fill="#F9A825" radius={[4, 4, 0, 0]} />
            <Bar dataKey="tutor" fill="#2E7D32" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

/* CARD */
function StatCard({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm">
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

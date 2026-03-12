// "use client";

// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import CountUp from "react-countup";

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
//     <div className="bg-gradient-to-br from-[#F4F4ED] via-white to-[#EDE6D6] min-h-screen">

//       <motion.main
//         className="p-10"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <h1 className="text-3xl font-semibold text-[#004B4B] mb-6">
//           Welcome back, {data.name} 👋
//         </h1>

//         {/* ======================
//            STATUS MESSAGES
//         ====================== */}
//         <AlertBox status={data.status} />

//         {/* ======================
//            STATS CARDS
//         ====================== */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-8">
//           <StatCard title="Total Students" value={data.totalStudents ?? 0} />
//           <StatCard
//             title="Rating"
//             value={data.rating ?? 0}
//             suffix=" ⭐"
//           />
//           <StatCard
//             title="Experience"
//             value={data.experience ?? 0}
//             suffix=" yrs"
//           />
//           <StatCard
//             title="Total Subjects"
//             value={data.subjects?.length ?? 0}
//           />
//         </div>

//         {/* ======================
//            UPCOMING SESSION
//         ====================== */}
//         {isApproved && data.upcomingSession && (
//           <motion.div
//             className="bg-white shadow-lg p-6 rounded-xl border border-gray-100"
//             whileHover={{ scale: 1.01 }}
//             transition={{ type: "spring", stiffness: 200 }}
//           >
//             <h2 className="text-xl font-semibold text-[#004B4B] mb-4">
//               🎓 Next Upcoming Session
//             </h2>

//             <div className="space-y-2 text-gray-700">
//               <p><b>Student:</b> {data.upcomingSession.student}</p>
//               <p><b>Date:</b> {data.upcomingSession.date}</p>
//               <p><b>Time:</b> {data.upcomingSession.time}</p>
//               <p><b>Type:</b> {data.upcomingSession.type}</p>
//             </div>

//             <div className="mt-6 flex gap-4">
//               <button className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-all duration-300">
//                 Join Session
//               </button>

//               <button className="px-5 py-2 rounded-lg bg-[#004B4B] text-white hover:bg-[#066666] transition-all duration-300 hover:shadow-lg">
//                 View Details
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </motion.main>
//     </div>
//   );
// }

// /* ======================
//    ALERT BOX
// ====================== */
// function AlertBox({ status }: { status: string }) {
//   const config: any = {
//     PENDING: {
//       color: "bg-yellow-100 border-yellow-300 text-yellow-800",
//       message:
//         "⏳ Your profile is under admin review. You will be notified once approved.",
//     },
//     REJECTED: {
//       color: "bg-red-100 border-red-300 text-red-700",
//       message:
//         "❌ Your tutor profile was rejected. Please contact admin for details.",
//     },
//     SUSPENDED: {
//       color: "bg-red-100 border-red-300 text-red-700",
//       message:
//         "🚫 Your tutor account has been suspended. Contact admin.",
//     },
//     APPROVED: {
//       color: "bg-green-100 border-green-300 text-green-700",
//       message:
//         "✔ Approved — students can now book sessions with you!",
//     },
//   };

//   const current = config[status];

//   return (
//     <motion.div
//       className={`border p-4 rounded-lg mb-6 ${current.color}`}
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.4 }}
//     >
//       {current.message}
//     </motion.div>
//   );
// }

// /* ======================
//    STAT CARD
// ====================== */
// function StatCard({
//   title,
//   value,
//   suffix = "",
// }: {
//   title: string;
//   value: number;
//   suffix?: string;
// }) {
//   return (
//     <motion.div
//       whileHover={{ scale: 1.05 }}
//       whileTap={{ scale: 0.98 }}
//       transition={{ type: "spring", stiffness: 200 }}
//       className="bg-white border border-gray-100 shadow-sm p-6 rounded-xl text-center cursor-pointer"
//     >
//       <div className="text-gray-500 text-sm mb-2">{title}</div>

//       <div className="text-2xl font-bold text-[#004B4B]">
//         <CountUp end={value} duration={1.2} />
//         {suffix}
//       </div>
//     </motion.div>
//   );
// }



"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

/* ======================
   TYPES
====================== */
interface TutorData {
  id: string;
  name: string;
  email: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  subjects?: string[];
  experience?: string;
  rating?: number;
  totalStudents?: number;
}

/* ======================
   MAIN COMPONENT
====================== */
export default function TutorDashboard() {
  const [data, setData] = useState<TutorData | null>(null);

  useEffect(() => {
    fetch("/api/tutor/me")
      .then((res) => res.json())
      .then((d) => setData(d.tutor));
  }, []);

  const charts = useMemo(() => {
    const baseStudents = data?.totalStudents ?? 0;
    const baseRating = data?.rating ?? 0;

    const expNum = data?.experience
      ? parseInt(data.experience.toString())
      : 0;

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const weeklyEarnings = days.map((d, i) => {
      const wave = Math.sin((i + 1) * 0.9) * 250;
      const expBoost = expNum * 40;
      const ratingBoost = baseRating * 60;
      const studentsBoost = baseStudents * 25;

      const value = Math.max(
        0,
        Math.round(
          700 + expBoost + ratingBoost + studentsBoost + wave + i * 35
        )
      );

      return { day: d, earnings: value };
    });

    const studentGrowth = days.map((d, i) => {
      const growth = Math.max(
        0,
        Math.round(baseStudents + i + Math.max(0, i - 2))
      );
      return { day: d, students: growth };
    });

    const sessionsBreakdown = [
      { name: "1-to-1", value: Math.max(0, Math.round(baseStudents * 1.3)) },
      { name: "Group", value: Math.max(0, Math.round(baseStudents * 0.6)) },
      { name: "Completed", value: Math.max(0, Math.round(baseStudents * 0.9)) },
      { name: "Pending", value: Math.max(0, Math.round(baseStudents * 0.4)) },
    ];

    return { weeklyEarnings, studentGrowth, sessionsBreakdown };
  }, [data]);

  if (!data) {
    return (
      <p className="p-8 text-[#004B4B]">
        Loading dashboard...
      </p>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#F4F4ED] via-white to-[#EDE6D6] overflow-hidden">

      {/* Background blobs */}
      <div className="absolute top-20 left-40 w-96 h-96 bg-[#004B4B]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-20 w-80 h-80 bg-[#EDE6D6] rounded-full blur-3xl animate-pulse"></div>

      <motion.main
        className="relative p-10 z-10"
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >

        {/* HEADER */}
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <h1 className="text-3xl font-semibold text-[#004B4B] mb-2">
              Welcome back, {data.name} 👋
            </h1>
            <p className="text-sm text-gray-600">
              Here’s your weekly overview.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur border rounded-xl px-4 py-3 shadow-sm">
            <p className="text-xs text-gray-500">
              Tutor Status
            </p>
            <p className="text-sm font-semibold text-[#004B4B]">
              {data.status}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <AlertBox status={data.status} />
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-8">

          <StatCard
            title="Total Students"
            value={data.totalStudents ?? 0}
          />

          <StatCard
            title="Rating"
            value={data.rating ?? 0}
            suffix=" ⭐"
            decimals={1}
          />

          {/* EXPERIENCE */}
          <div className="bg-white border border-gray-100 shadow-sm p-6 rounded-2xl text-center">
            <div className="text-gray-500 text-sm mb-2">
              Experience
            </div>
            <div className="text-2xl font-bold text-[#004B4B]">
              {data.experience ?? "0 yrs"}
            </div>
          </div>

          <StatCard
            title="Total Subjects"
            value={data.subjects?.length ?? 0}
          />

        </div>

        {/* CHART ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <motion.div
            className="bg-white rounded-2xl shadow-sm border p-6 lg:col-span-2"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-lg font-semibold text-[#004B4B] mb-4">
              Weekly Earnings
            </h2>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.weeklyEarnings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </motion.div>

          <motion.div
            className="bg-white rounded-2xl shadow-sm border p-6"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
          >

            <h2 className="text-lg font-semibold text-[#004B4B] mb-4">
              Sessions Breakdown
            </h2>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.sessionsBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </motion.div>

        </div>

        {/* STUDENT GROWTH */}
        <motion.div
          className="mt-6 bg-white rounded-2xl shadow-sm border p-6"
        >

          <h2 className="text-lg font-semibold text-[#004B4B] mb-4">
            Student Growth
          </h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.studentGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="students"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

        </motion.div>

      </motion.main>
    </div>
  );
}

/* ======================
   ALERT BOX
====================== */
function AlertBox({ status }: { status: string }) {

  const config: any = {

    PENDING: {
      color: "bg-yellow-100 border-yellow-300 text-yellow-800",
      message:
        "⏳ Your profile is under admin review.",
    },

    APPROVED: {
      color: "bg-green-100 border-green-300 text-green-700",
      message:
        "✔ Approved — students can now book sessions with you!",
    },

    REJECTED: {
      color: "bg-red-100 border-red-300 text-red-700",
      message:
        "❌ Your tutor profile was rejected.",
    },

    SUSPENDED: {
      color: "bg-red-100 border-red-300 text-red-700",
      message:
        "🚫 Your tutor account has been suspended.",
    },
  };

  const current = config[status];

  return (
    <div className={`border p-4 rounded-lg ${current.color}`}>
      {current.message}
    </div>
  );
}

/* ======================
   STAT CARD
====================== */
function StatCard({
  title,
  value,
  suffix = "",
  decimals = 0,
}: {
  title: string;
  value: number;
  suffix?: string;
  decimals?: number;
}) {

  return (
    <div className="bg-white border border-gray-100 shadow-sm p-6 rounded-2xl text-center">

      <div className="text-gray-500 text-sm mb-2">
        {title}
      </div>

      <div className="text-2xl font-bold text-[#004B4B]">
        <CountUp
          end={value}
          duration={1.4}
          decimals={decimals}
        />
        {suffix}
      </div>

    </div>
  );
}
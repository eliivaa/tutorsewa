"use client";

import { useEffect, useState } from "react";
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

interface ChartData {
  weeklyEarnings: { day: string; earnings: number }[];
  studentGrowth: { day: string; students: number }[];
  sessionsBreakdown: { name: string; value: number }[];
}

/* ======================
   MAIN COMPONENT
====================== */
export default function TutorDashboard() {
  const [data, setData] = useState<TutorData | null>(null);
  const [charts, setCharts] = useState<ChartData | null>(null);

  /* ======================
     FETCH BASIC DATA
  ====================== */
  useEffect(() => {
    fetch("/api/tutor/me")
      .then((res) => res.json())
      .then((d) => setData(d.tutor));
  }, []);

  /* ======================
     FETCH REAL CHART DATA
  ====================== */
  useEffect(() => {
    fetch("/api/tutor/dashboard")
      .then((res) => res.json())
      .then((d) => setCharts(d))
      .catch(() => {
        setCharts({
          weeklyEarnings: [],
          studentGrowth: [],
          sessionsBreakdown: [],
        });
      });
  }, []);

  if (!data || !charts) {
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

        {/* PLATFORM INFO */}
        <div className="mt-4 bg-[#E6F4F1] border border-[#BFE3DD] rounded-xl p-4 text-sm text-[#004B4B]">
          <p className="font-semibold mb-1">💡 TutorSewa Tip</p>
          <p>
            TutorSewa focuses on affordable learning. Lower pricing helps attract more students.
          </p>
          <p className="mt-2 text-xs">
            You earn <b>85%</b>. Platform fee: <b>15%</b>.
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-8">

          <StatCard title="Total Students" value={data.totalStudents ?? 0} />

          <StatCard
            title="Rating"
            value={data.rating ?? 0}
            suffix=" ⭐"
            decimals={1}
          />

          <div className="bg-white border p-6 rounded-2xl text-center">
            <div className="text-gray-500 text-sm mb-2">Experience</div>
            <div className="text-2xl font-bold text-[#004B4B]">
              {data.experience ?? "0 yrs"}
            </div>
          </div>

          <StatCard
            title="Total Subjects"
            value={data.subjects?.length ?? 0}
          />

        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* EARNINGS */}
          <motion.div className="bg-white rounded-2xl border p-6 lg:col-span-2">
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
                  <Line type="monotone" dataKey="earnings" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* SESSION BREAKDOWN */}
          <motion.div className="bg-white rounded-2xl border p-6">
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
        <motion.div className="mt-6 bg-white rounded-2xl border p-6">
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
                <Area type="monotone" dataKey="students" strokeWidth={3} />
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
    PENDING: { color: "bg-yellow-100", message: "⏳ Under review" },
    APPROVED: { color: "bg-green-100", message: "✔ Approved" },
    REJECTED: { color: "bg-red-100", message: "❌ Rejected" },
    SUSPENDED: { color: "bg-red-100", message: "🚫 Suspended" },
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
function StatCard({ title, value, suffix = "", decimals = 0 }: any) {
  return (
    <div className="bg-white border p-6 rounded-2xl text-center">
      <div className="text-gray-500 text-sm mb-2">{title}</div>
      <div className="text-2xl font-bold text-[#004B4B]">
        <CountUp end={value} duration={1.4} decimals={decimals} />
        {suffix}
      </div>
    </div>
  );
}
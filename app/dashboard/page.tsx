// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { signIn } from "next-auth/react";
// import Image from "next/image";
// import Topbar from "@/app/components/Topbar"; // ✅ fixed import
// import {
//   Home,
//   Calendar,
//   MessageSquare,
//   CreditCard,
//   ShoppingBag,
//   Settings,
//   Search,
// } from "lucide-react";

// export default function DashboardPage() {
//   const router = useRouter();

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const token = params.get("token");

//     if (token) {
//       signIn("credentials", { token, redirect: false }).then(() => {
//         router.replace("/dashboard");
//       });
//     }
//   }, [router]);

//   return (
//     <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
//       {/* ✅ Topbar */}
//       <Topbar />

//       <div className="flex flex-1">
//         {/* SIDEBAR */}
//         <aside className="w-64 bg-[#48A6A7] text-white flex flex-col">
//           <div className="flex items-center gap-2 px-6 py-4 border-b border-white/20">
           
//           </div>

//           <nav className="flex-1 mt-6 space-y-2 px-4 text-sm">
//             <button className="w-full flex items-center gap-3 px-3 py-2 bg-white/20 rounded-md font-medium">
//               <Home size={18} /> Dashboard
//             </button>
//             <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-md transition">
//               <Calendar size={18} /> My Sessions
//             </button>
//             <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-md transition">
//               <Search size={18} /> Browse Tutors
//             </button>
//             <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-md transition">
//               <MessageSquare size={18} /> Messages
//             </button>
//             <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-md transition">
//               <CreditCard size={18} /> Payments
//             </button>
//             <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-md transition">
//               <ShoppingBag size={18} /> Thrift Section
//             </button>
//             <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-md transition">
//               <Settings size={18} /> Settings
//             </button>
//           </nav>

//           <div className="px-6 py-4 border-t border-white/20">
//             <button className="w-full text-left text-sm text-white hover:underline">
//               Log Out
//             </button>
//           </div>
//         </aside>

//         {/* MAIN CONTENT */}
//         <main className="flex-1 flex flex-col items-center justify-center p-10 text-center">
//           <Image
//             src="/no-session.webp"
//             alt="No Session"
//             width={200}
//             height={200}
//             className="opacity-90"
//           />
//           <h2 className="text-lg font-semibold text-[#006A6A] mt-4">
//             No session yet!
//           </h2>
//         </main>
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Topbar from "@/app/components/Topbar";
import {
  Home,
  Calendar,
  MessageSquare,
  CreditCard,
  ShoppingBag,
  Settings,
  Search,
  Clock,
  User,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Dashboard");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      signIn("credentials", { token, redirect: false }).then(() => {
        router.replace("/dashboard");
      });
    }
  }, [router]);

  const menuItems = [
    { name: "Dashboard", icon: <Home size={18} /> },
    { name: "My Sessions", icon: <Calendar size={18} /> },
    { name: "Browse Tutors", icon: <Search size={18} /> },
    { name: "Messages", icon: <MessageSquare size={18} /> },
    { name: "Payments", icon: <CreditCard size={18} /> },
    { name: "Thrift Section", icon: <ShoppingBag size={18} /> },
    { name: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      {/* ✅ Topbar */}
      <Topbar />

      <div className="flex flex-1">
        {/* ✅ SIDEBAR */}
        <aside className="w-64 bg-[#48A6A7] text-white flex flex-col transition-all duration-300">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-white/20">
            {/* <Image
              src="/tutorsewa-logo.png"
              alt="TutorSewa"
              width={35}
              height={35}
              className="drop-shadow-sm"
            />
            <span className="text-xl font-semibold">TutorSewa</span> */}
          </div>

          <nav className="flex-1 mt-4 space-y-1 px-4 text-sm">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ${
                  activeTab === item.name
                    ? "bg-white text-[#006A6A] font-medium"
                    : "text-white hover:bg-white/20 hover:translate-x-1"
                }`}
              >
                {item.icon}
                {item.name}
              </button>
            ))}
          </nav>

         
        </aside>

        {/* ✅ MAIN CONTENT AREA */}
        <main className="flex-1 p-8">
          {/* Dashboard Overview Cards */}
          <h1 className="text-2xl font-bold text-[#006A6A] mb-6">
            Dashboard Overview
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {[
              {
                label: "Upcoming Sessions",
                value: "2",
                icon: <Calendar className="text-[#48A6A7]" size={24} />,
              },
              {
                label: "Total Hours",
                value: "14",
                icon: <Clock className="text-[#48A6A7]" size={24} />,
              },
              {
                label: "Tutors Connected",
                value: "5",
                icon: <User className="text-[#48A6A7]" size={24} />,
              },
              {
                label: "Pending Payments",
                value: "₨ 500",
                icon: <CreditCard className="text-[#48A6A7]" size={24} />,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow hover:shadow-md transition transform hover:scale-[1.02] p-4 flex items-center gap-4"
              >
                {item.icon}
                <div>
                  <h3 className="text-xl font-semibold text-[#004B4B]">
                    {item.value}
                  </h3>
                  <p className="text-sm text-gray-500">{item.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State Section */}
          <div className="mt-12 flex flex-col items-center justify-center text-center">
            <div className="bg-[#F2EFE7] p-10 rounded-xl shadow-inner max-w-md">
              <Image
                src="/no-session.webp"
                alt="No Session"
                width={180}
                height={180}
                className="mx-auto mb-6 opacity-90"
              />
              <h2 className="text-lg font-semibold text-[#004B4B]">
                No session yet!
              </h2>
              <p className="text-gray-600 mb-4">
                Start your first session and unlock your learning potential.
              </p>
              <button className="bg-[#006A6A] text-white px-5 py-2 rounded-md hover:bg-[#005454] transition">
                Browse Tutors
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

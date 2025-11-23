// "use client";

// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import Topbar from "@/app/components/Topbar";
// import {
//   Home,
//   Calendar,
//   MessageSquare,
//   CreditCard,
//   ShoppingBag,
//   Settings,
//   Search,
//   Clock,
//   User,
// } from "lucide-react";

// export default function DashboardPage() {
//   const router = useRouter();
//   const { data: session, status } = useSession();
//   const [activeTab, setActiveTab] = useState("Dashboard");

//   if (status === "loading") return <div>Loading...</div>;
//   if (!session) return null;

//   const menuItems = [
//     { name: "Dashboard", icon: <Home size={18} /> },
//     { name: "My Sessions", icon: <Calendar size={18} /> },
//     { name: "Browse Tutors", icon: <Search size={18} /> },
//     { name: "Messages", icon: <MessageSquare size={18} /> },
//     { name: "Payments", icon: <CreditCard size={18} /> },
//     { name: "Thrift Section", icon: <ShoppingBag size={18} /> },
//     { name: "Settings", icon: <Settings size={18} /> },
//   ];

//   return (
//     <div className="min-h-screen bg-[#F5F7FA] flex flex-col">

//       <Topbar />

//       <div className="flex flex-1">
        
//         {/* SIDEBAR */}
//         <aside className="w-64 bg-[#48A6A7] text-white flex flex-col">
//           <nav className="flex-1 mt-4 space-y-1 px-4 text-sm">
//             {menuItems.map((item) => (
//               <button
//                 key={item.name}
//                 onClick={() => setActiveTab(item.name)}
//                 className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition ${
//                   activeTab === item.name
//                     ? "bg-white text-[#006A6A] font-medium"
//                     : "hover:bg-white/20"
//                 }`}
//               >
//                 {item.icon}
//                 {item.name}
//               </button>
//             ))}
//           </nav>
//         </aside>

//         {/* MAIN CONTENT */}
//         <main className="flex-1 p-8">

//           <h1 className="text-2xl font-bold text-[#006A6A] mb-2">
//             Welcome back, {session.user?.name} 👋
//           </h1>

//           <p className="text-gray-600 mb-6">
//             Manage your sessions, tutors & learning progress
//           </p>

//           {/* STATS */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
//             {/* Static for now (replace later with real DB values) */}
//             {[
//               { label: "Upcoming Sessions", value: "2", icon: <Calendar className="text-[#48A6A7]" size={24} /> },
//               { label: "Total Hours", value: "14", icon: <Clock className="text-[#48A6A7]" size={24} /> },
//               { label: "Tutors Connected", value: "5", icon: <User className="text-[#48A6A7]" size={24} /> },
//               { label: "Pending Payments", value: "₨ 500", icon: <CreditCard className="text-[#48A6A7]" size={24} /> },
//             ].map((item, i) => (
//               <div key={i} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
//                 {item.icon}
//                 <div>
//                   <h3 className="text-xl font-semibold">{item.value}</h3>
//                   <p className="text-sm text-gray-500">{item.label}</p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* EMPTY STATE */}
//           <div className="mt-12 flex flex-col items-center text-center">
//             <div className="bg-[#F2EFE7] p-10 rounded-xl shadow-inner max-w-md">
//               <Image src="/no-session.webp" width={180} height={180} alt="No Session" />

//               <h2 className="text-lg font-semibold mt-6">No session yet!</h2>

//               <p className="text-gray-600 mb-4">
//                 Start your first session and unlock your learning potential.
//               </p>

//               <button className="bg-[#006A6A] text-white px-5 py-2 rounded-md">
//                 Browse Tutors
//               </button>
//             </div>
//           </div>

//         </main>
//       </div>
//     </div>
//   );
// }



"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Calendar, Clock, User, CreditCard } from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <>
      <h1 className="text-2xl font-bold text-[#006A6A] mb-2">
        Welcome back, {session?.user?.name} 👋
      </h1>

      <p className="text-gray-600 mb-6">
        Manage your sessions, tutors & learning progress
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {[
          { label: "Upcoming Sessions", value: "2", icon: <Calendar className="text-[#48A6A7]" size={24} /> },
          { label: "Total Hours", value: "14", icon: <Clock className="text-[#48A6A7]" size={24} /> },
          { label: "Tutors Connected", value: "5", icon: <User className="text-[#48A6A7]" size={24} /> },
          { label: "Pending Payments", value: "₨ 500", icon: <CreditCard className="text-[#48A6A7]" size={24} /> },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            {item.icon}
            <div>
              <h3 className="text-xl font-semibold">{item.value}</h3>
              <p className="text-sm text-gray-500">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center text-center">
        <div className="bg-[#F2EFE7] p-10 rounded-xl shadow-inner max-w-md">
          <Image src="/no-session.webp" width={180} height={180} alt="No Session" />
          <h2 className="text-lg font-semibold mt-6">No session yet!</h2>
          <p className="text-gray-600 mb-4">
            Start your first session and unlock your learning potential.
          </p>
          <button className="bg-[#006A6A] text-white px-5 py-2 rounded-md">
            Browse Tutors
          </button>
        </div>
      </div>
    </>
  );
}

// "use client";
// import { useSession } from "next-auth/react";
// import Image from "next/image";
// import { Calendar, Clock, User, CreditCard } from "lucide-react";

// export default function DashboardPage() {
//   const { data: session } = useSession();

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
//           { label: "Upcoming Sessions", value: "2", icon: <Calendar className="text-[#48A6A7]" size={24} /> },
//           { label: "Total Hours", value: "14", icon: <Clock className="text-[#48A6A7]" size={24} /> },
//           { label: "Tutors Connected", value: "5", icon: <User className="text-[#48A6A7]" size={24} /> },
//           { label: "Pending Payments", value: "₨ 500", icon: <CreditCard className="text-[#48A6A7]" size={24} /> },
//         ].map((item, i) => (
//           <div key={i} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
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
//           <Image src="/no-session.webp" width={180} height={180} alt="No Session" />
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
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 🚀 Redirect if profile incomplete
  useEffect(() => {
    if (status === "loading") return;

    if (session?.user?.profileIncomplete) {
      router.push("/complete-profile");
    }
  }, [session, status]);

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
          {
            label: "Upcoming Sessions",
            value: "2",
            icon: <Calendar className="text-[#48A6A7]" size={24} />
          },
          {
            label: "Total Hours",
            value: "14",
            icon: <Clock className="text-[#48A6A7]" size={24} />
          },
          {
            label: "Tutors Connected",
            value: "5",
            icon: <User className="text-[#48A6A7]" size={24} />
          },
          {
            label: "Pending Payments",
            value: "₨ 500",
            icon: <CreditCard className="text-[#48A6A7]" size={24} />
          },
        ].map((item, i) => (
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

      <div className="mt-12 flex flex-col items-center text-center">
        <div className="bg-[#F2EFE7] p-10 rounded-xl shadow-inner max-w-md">
          <Image
            src="/no-session.webp"
            width={180}
            height={180}
            alt="No Session"
          />
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

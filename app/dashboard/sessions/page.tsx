
// BEFORE JITSI VIDEO CALL

// "use client";

// import { useEffect, useState } from "react";

// interface Booking {
//   id: string;
//   status: string;
//   paymentStatus: "UNPAID" | "PARTIALLY_PAID" | "FULLY_PAID";
//   sessionType: "ONE_TO_ONE" | "GROUP";
//   bookingDate: string;
//   startTime: string;
//   subject: string;
//   level?: string;
//   meetingLink?: string | null;

//   tutor: {
//     name: string;
//     photo?: string | null;
//   };
// }

// /* ================= STATUS BADGE ================= */

// function getStatusBadge(status: string, paymentStatus: string) {
//   if (status === "COMPLETED") {
//     return { text: "COMPLETED", className: "bg-green-100 text-green-700" };
//   }

//   if (paymentStatus === "PARTIALLY_PAID") {
//     return { text: "PARTIALLY PAID", className: "bg-yellow-100 text-yellow-800" };
//   }

//   if (paymentStatus === "FULLY_PAID") {
//     return { text: "CONFIRMED", className: "bg-green-100 text-green-700" };
//   }

//   if (status === "PAYMENT_PENDING") {
//     return { text: "PAYMENT PENDING", className: "bg-yellow-100 text-yellow-700" };
//   }

//   if (status === "REJECTED") {
//     return { text: "REJECTED", className: "bg-red-100 text-red-700" };
//   }

//   if (status === "READY") {
//     return { text: "READY", className: "bg-purple-100 text-purple-700" };
//   }

//   return {
//     text: status.replace("_", " "),
//     className: "bg-gray-100 text-gray-700",
//   };
// }

// /* ================= PAGE ================= */

// export default function MySessionsPage() {
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);

//   /* ================= FETCH ================= */

//   useEffect(() => {
//     fetch("/api/bookings/student")
//       .then((res) => res.json())
//       .then((data) => setBookings(data.bookings || []))
//       .finally(() => setLoading(false));
//   }, []);

//   /* ================= LOADING ================= */

//   if (loading) {
//     return (
//       <p className="text-[#004B4B] font-medium">
//         Loading sessions...
//       </p>
//     );
//   }

//   /* ================= EMPTY ================= */

//   if (bookings.length === 0) {
//     return (
//       <p className="text-gray-600">
//         You have not booked any sessions yet.
//       </p>
//     );
//   }

//   /* ================= UI ================= */

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-semibold text-[#004B4B]">
//         My Sessions
//       </h1>

//       <div className="space-y-4">
//         {bookings.map((b) => {
//           const badge = getStatusBadge(b.status, b.paymentStatus);

//           return (
//             <div
//               key={b.id}
//               className="bg-white border rounded-xl p-5 flex justify-between items-center shadow-sm"
//             >
//               {/* LEFT */}
//               <div className="flex items-start gap-4">
//                 {b.tutor.photo ? (
//                   <img
//                     src={b.tutor.photo}
//                     className="w-12 h-12 rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
//                     {b.tutor.name.charAt(0)}
//                   </div>
//                 )}

//                 <div>
//                   <p className="font-semibold text-[#004B4B]">
//                     {b.tutor.name}
//                   </p>

//                   <p className="text-sm text-gray-600">
//                     {new Date(b.bookingDate).toLocaleDateString()} ·{" "}
//                     {new Date(b.startTime).toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })}
//                   </p>

//                   <div className="flex gap-2 mt-1">
//                     <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100">
//                       {b.subject}
//                       {b.level ? ` | ${b.level}` : ""}
//                     </span>

//                     <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
//                       {b.sessionType === "ONE_TO_ONE" ? "1-to-1" : "Group"}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* RIGHT */}
//               <div className="flex items-center gap-3">

//                 {/* JOIN */}
//                 {b.status === "READY" && b.meetingLink && (
//                   <button
//                     onClick={() => window.open(b.meetingLink!, "_blank")}
//                     className="px-4 py-2 rounded-full text-sm font-semibold bg-[#004B4B] text-white hover:bg-[#006666] transition"
//                   >
//                     Join Class
//                   </button>
//                 )}

//                 {/* WAITING */}
//                 {(b.paymentStatus === "PARTIALLY_PAID" ||
//                   b.paymentStatus === "FULLY_PAID") &&
//                   !b.meetingLink &&
//                   b.status !== "COMPLETED" && (
//                     <button
//                       disabled
//                       className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-500 cursor-not-allowed"
//                     >
//                       Waiting for tutor
//                     </button>
//                   )}

//                 {/* BADGE */}
//                 <span
//                   className={`px-3 py-1 text-xs rounded-full font-medium ${badge.className}`}
//                 >
//                   {badge.text}
//                 </span>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }




// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// interface Booking {
//   id: string;

//   status:
//     | "REQUESTED"
//     | "PAYMENT_PENDING"
//     | "READY"
//     | "COMPLETED"
//     | "REJECTED";

//   paymentStatus: "UNPAID" | "PARTIALLY_PAID" | "FULLY_PAID";

//   sessionType: "ONE_TO_ONE" | "GROUP";

//   bookingDate: string;
//   startTime: string;

//   subject: string;
//   level?: string;

//   meetingRoom?: string | null; // ✅ NEW (not meetingLink)

//   tutor: {
//     name: string;
//     photo?: string | null;
//   };
// }

// /* ================= STATUS BADGE ================= */

// function getStatusBadge(status: string, paymentStatus: string) {
//   if (status === "COMPLETED")
//     return { text: "COMPLETED", className: "bg-green-100 text-green-700" };

//   if (status === "READY")
//     return { text: "LIVE", className: "bg-purple-100 text-purple-700" };

//   if (paymentStatus === "PARTIALLY_PAID")
//     return { text: "PARTIALLY PAID", className: "bg-yellow-100 text-yellow-800" };

//   if (paymentStatus === "FULLY_PAID")
//     return { text: "CONFIRMED", className: "bg-green-100 text-green-700" };

//   if (status === "PAYMENT_PENDING")
//     return { text: "PAYMENT PENDING", className: "bg-yellow-100 text-yellow-700" };

//   if (status === "REJECTED")
//     return { text: "REJECTED", className: "bg-red-100 text-red-700" };

//   return {
//     text: status.replace("_", " "),
//     className: "bg-gray-100 text-gray-700",
//   };
// }

// /* ================= PAGE ================= */

// export default function MySessionsPage() {
//   const router = useRouter();

//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);

//   /* ================= FETCH ================= */

//   useEffect(() => {
//     fetch("/api/bookings/student")
//       .then((res) => res.json())
//       .then((data) => setBookings(data.bookings || []))
//       .finally(() => setLoading(false));
//   }, []);

//   /* ================= LOADING ================= */

//   if (loading)
//     return <p className="text-[#004B4B] font-medium">Loading sessions...</p>;

//   if (bookings.length === 0)
//     return <p className="text-gray-600">You have not booked any sessions yet.</p>;

//   /* ================= UI ================= */

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-semibold text-[#004B4B]">
//         My Sessions
//       </h1>

//       <div className="space-y-4">
//         {bookings.map((b) => {
//           const badge = getStatusBadge(b.status, b.paymentStatus);

//           return (
//             <div
//               key={b.id}
//               className="bg-white border rounded-xl p-5 flex justify-between items-center shadow-sm"
//             >
//               {/* LEFT */}
//               <div className="flex items-start gap-4">
//                 {b.tutor.photo ? (
//                   <img
//                     src={b.tutor.photo}
//                     className="w-12 h-12 rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
//                     {b.tutor.name.charAt(0)}
//                   </div>
//                 )}

//                 <div>
//                   <p className="font-semibold text-[#004B4B]">
//                     {b.tutor.name}
//                   </p>

//                   <p className="text-sm text-gray-600">
//                     {new Date(b.bookingDate).toLocaleDateString()} ·{" "}
//                     {new Date(b.startTime).toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })}
//                   </p>

//                   <div className="flex gap-2 mt-1">
//                     <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100">
//                       {b.subject}
//                       {b.level ? ` | ${b.level}` : ""}
//                     </span>

//                     <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
//                       {b.sessionType === "ONE_TO_ONE" ? "1-to-1" : "Group"}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* RIGHT */}
//               <div className="flex items-center gap-3">

//                 {/* JOIN CLASS (FIXED) */}
//                 {b.status === "READY" && b.meetingRoom && (
//                   <button
//                     // onClick={() => router.push(`/session/${b.meetingRoom}`)}
//                     onClick={() => router.push(`/session/${b.meetingRoom}?role=student`)}

//                     className="px-4 py-2 rounded-full text-sm font-semibold bg-[#004B4B] text-white hover:bg-[#006666] transition"
//                   >
//                     Join Class
//                   </button>
//                 )}

//                 {/* WAITING */}
//                 {(b.paymentStatus === "PARTIALLY_PAID" ||
//                   b.paymentStatus === "FULLY_PAID") &&
//                   !b.meetingRoom &&
//                   b.status !== "COMPLETED" && (
//                     <button
//                       disabled
//                       className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-500 cursor-not-allowed"
//                     >
//                       Waiting for tutor
//                     </button>
//                   )}

//                 {/* BADGE */}
//                 <span
//                   className={`px-3 py-1 text-xs rounded-full font-medium ${badge.className}`}
//                 >
//                   {badge.text}
//                 </span>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }






// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// interface Booking {
//   id: string;

//   status:
//     | "REQUESTED"
//     | "PAYMENT_PENDING"
//     | "READY"
//     | "COMPLETED"
//     | "REJECTED";

//   paymentStatus: "UNPAID" | "PARTIALLY_PAID" | "FULLY_PAID";

//   sessionType: "ONE_TO_ONE" | "GROUP";

//   bookingDate: string;
//   startTime: string;

//   subject: string;
//   level?: string;

//   meetingRoom?: string | null; // ✅ NEW (not meetingLink)

//   tutor: {
//     name: string;
//     photo?: string | null;
//   };
// }

// /* ================= STATUS BADGE ================= */

// function getStatusBadge(status: string, paymentStatus: string) {
//   if (status === "COMPLETED")
//     return { text: "COMPLETED", className: "bg-green-100 text-green-700" };

//   if (status === "READY")
//     return { text: "LIVE", className: "bg-purple-100 text-purple-700" };

//   if (paymentStatus === "PARTIALLY_PAID")
//     return { text: "PARTIALLY PAID", className: "bg-yellow-100 text-yellow-800" };

//   if (paymentStatus === "FULLY_PAID")
//     return { text: "CONFIRMED", className: "bg-green-100 text-green-700" };

//   if (status === "PAYMENT_PENDING")
//     return { text: "PAYMENT PENDING", className: "bg-yellow-100 text-yellow-700" };

//   if (status === "REJECTED")
//     return { text: "REJECTED", className: "bg-red-100 text-red-700" };

//   return {
//     text: status.replace("_", " "),
//     className: "bg-gray-100 text-gray-700",
//   };
// }

// /* ================= PAGE ================= */

// export default function MySessionsPage() {
//   const router = useRouter();

//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);

//   /* ================= FETCH ================= */

//   useEffect(() => {
//     fetch("/api/bookings/student")
//       .then((res) => res.json())
//       .then((data) => setBookings(data.bookings || []))
//       .finally(() => setLoading(false));
//   }, []);

//   /* ================= LOADING ================= */

//   if (loading)
//     return <p className="text-[#004B4B] font-medium">Loading sessions...</p>;

//   if (bookings.length === 0)
//     return <p className="text-gray-600">You have not booked any sessions yet.</p>;

//   /* ================= UI ================= */

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-semibold text-[#004B4B]">
//         My Sessions
//       </h1>

//       <div className="space-y-4">
//         {bookings.map((b) => {
//           const badge = getStatusBadge(b.status, b.paymentStatus);

//           return (
//             <div
//               key={b.id}
//               className="bg-white border rounded-xl p-5 flex justify-between items-center shadow-sm"
//             >
//               {/* LEFT */}
//               <div className="flex items-start gap-4">
//                 {b.tutor.photo ? (
//                   <img
//                     src={b.tutor.photo}
//                     className="w-12 h-12 rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
//                     {b.tutor.name.charAt(0)}
//                   </div>
//                 )}

//                 <div>
//                   <p className="font-semibold text-[#004B4B]">
//                     {b.tutor.name}
//                   </p>

//                   <p className="text-sm text-gray-600">
//                     {new Date(b.bookingDate).toLocaleDateString()} ·{" "}
//                     {new Date(b.startTime).toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })}
//                   </p>

//                   <div className="flex gap-2 mt-1">
//                     <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100">
//                       {b.subject}
//                       {b.level ? ` | ${b.level}` : ""}
//                     </span>

//                     <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
//                       {b.sessionType === "ONE_TO_ONE" ? "1-to-1" : "Group"}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* RIGHT */}
//               <div className="flex items-center gap-3">

//                 {/* JOIN CLASS (FIXED) */}
//                 {b.status === "READY" && b.meetingRoom && (
//                   <button
//                     // onClick={() => router.push(`/session/${b.meetingRoom}`)}
//                     onClick={() => router.push(`/session/${b.meetingRoom}?role=student`)}

//                     className="px-4 py-2 rounded-full text-sm font-semibold bg-[#004B4B] text-white hover:bg-[#006666] transition"
//                   >
//                     Join Class
//                   </button>
//                 )}

//                 {/* WAITING */}
//                 {(b.paymentStatus === "PARTIALLY_PAID" ||
//                   b.paymentStatus === "FULLY_PAID") &&
//                   !b.meetingRoom &&
//                   b.status !== "COMPLETED" && (
//                     <button
//                       disabled
//                       className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-500 cursor-not-allowed"
//                     >
//                       Waiting for tutor
//                     </button>
//                   )}

//                 {/* BADGE */}
//                 <span
//                   className={`px-3 py-1 text-xs rounded-full font-medium ${badge.className}`}
//                 >
//                   {badge.text}
//                 </span>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }




"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */

type BookingStatus =
  | "REQUESTED"
  | "PAYMENT_PENDING"
  | "READY"
  | "COMPLETED"
  | "REJECTED"
  | "EXPIRED";

type PaymentStatus = "UNPAID" | "PARTIALLY_PAID" | "FULLY_PAID";

type SessionType = "ONE_TO_ONE" | "GROUP";

interface Booking {
  id: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  sessionType: SessionType;

  bookingDate: string;
  startTime: string;

  subject: string;
  level?: string;

  meetingRoom?: string | null;

  tutor: {
    name: string;
    photo?: string | null;
  };
}

/* ================= HELPERS ================= */

function isExpired(b: Booking) {
  if (b.status === "COMPLETED" || b.status === "EXPIRED")
    return false;

  const now = new Date();
  const start = new Date(b.startTime);

  const sessionDurationMs = 2 * 60 * 60 * 1000; // 2 hours
  const end = new Date(start.getTime() + sessionDurationMs);

  return end.getTime() < now.getTime();
}


function getStatusBadge(status: BookingStatus, paymentStatus: PaymentStatus) {
  if (status === "COMPLETED")
    return { text: "COMPLETED", className: "bg-green-100 text-green-700" };

  if (status === "EXPIRED")
    return { text: "EXPIRED", className: "bg-gray-200 text-gray-600" };

  if (status === "READY")
    return { text: "LIVE", className: "bg-purple-100 text-purple-700" };

  if (paymentStatus === "PARTIALLY_PAID")
    return { text: "PARTIALLY PAID", className: "bg-yellow-100 text-yellow-800" };

  if (paymentStatus === "FULLY_PAID")
    return { text: "CONFIRMED", className: "bg-green-100 text-green-700" };

  if (status === "PAYMENT_PENDING")
    return { text: "PAYMENT PENDING", className: "bg-yellow-100 text-yellow-700" };

  if (status === "REJECTED")
    return { text: "REJECTED", className: "bg-red-100 text-red-700" };

  return {
    text: status.replace("_", " "),
    className: "bg-gray-100 text-gray-700",
  };
}

/* ================= PAGE ================= */

export default function MySessionsPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */

  useEffect(() => {
    fetch("/api/bookings/student", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setBookings(data.bookings || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="text-[#004B4B] font-medium">Loading sessions...</p>;

  if (bookings.length === 0)
    return <p className="text-gray-600">You have not booked any sessions yet.</p>;

  /* ================= UI ================= */

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#004B4B]">My Sessions</h1>

      <div className="space-y-4">
        {bookings.map((b) => {
          const expired = isExpired(b);
          const badge = getStatusBadge(
            expired ? "EXPIRED" : b.status,
            b.paymentStatus
          );

          return (
            <div
              key={b.id}
              className="bg-white border rounded-xl p-5 flex justify-between items-center shadow-sm"
            >
              {/* LEFT */}
              <div className="flex items-start gap-4">
                {b.tutor.photo ? (
                  <img
                    src={b.tutor.photo}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
                    {b.tutor.name.charAt(0)}
                  </div>
                )}

                <div>
                  <p className="font-semibold text-[#004B4B]">
                    {b.tutor.name}
                  </p>

                  <p className="text-sm text-gray-600">
                    {new Date(b.bookingDate).toLocaleDateString()} ·{" "}
                    {new Date(b.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  <div className="flex gap-2 mt-1">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100">
                      {b.subject}
                      {b.level ? ` | ${b.level}` : ""}
                    </span>

                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                      {b.sessionType === "ONE_TO_ONE" ? "1-to-1" : "Group"}
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-3">
                {/* ONE-TO-ONE JOIN (Half or Full) */}
{/* RIGHT */}
<div className="flex items-center gap-3">

  {/* ONE-TO-ONE JOIN (Half or Full) */}
  {!expired &&
    b.sessionType === "ONE_TO_ONE" &&
    b.status === "READY" &&
    b.meetingRoom &&
    (b.paymentStatus === "FULLY_PAID" ||
      b.paymentStatus === "PARTIALLY_PAID") && (
      <button
        onClick={() =>
          router.push(`/session/${b.meetingRoom}?role=student`)
        }
        className="px-4 py-2 rounded-full text-sm font-semibold bg-[#004B4B] text-white"
      >
        Join Class
      </button>
  )}

  {/* GROUP JOIN (Full Only) */}
  {!expired &&
    b.sessionType === "GROUP" &&
    b.status === "READY" &&
    b.meetingRoom &&
    b.paymentStatus === "FULLY_PAID" && (
      <button
        onClick={() =>
          router.push(`/session/${b.meetingRoom}?role=student`)
        }
        className="px-4 py-2 rounded-full text-sm font-semibold bg-[#004B4B] text-white"
      >
        Join Class
      </button>
  )}

  {/* GROUP HALF PAID MESSAGE */}
  {!expired &&
    b.sessionType === "GROUP" &&
    b.status === "READY" &&
    b.paymentStatus === "PARTIALLY_PAID" && (
      <span className="px-4 py-2 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700">
        Complete Payment to Join
      </span>
  )}

  {/* Waiting for tutor (room not created yet) */}
  {!expired &&
    b.status !== "COMPLETED" &&
    !b.meetingRoom &&
    (b.paymentStatus === "FULLY_PAID" ||
      (b.sessionType === "ONE_TO_ONE" &&
        b.paymentStatus === "PARTIALLY_PAID")) && (
      <button
        disabled
        className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-500"
      >
        Waiting for tutor
      </button>
  )}

  {/* Status Badge */}
  <span
    className={`px-3 py-1 text-xs rounded-full font-medium ${badge.className}`}
  >
    {badge.text}
  </span>
</div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

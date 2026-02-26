
// BEFORE JITSI VIDEO 

// "use client";

// import { useEffect, useState } from "react";

// type Booking = {
//   id: string;
//   status:
//     | "REQUESTED"
//     | "PAYMENT_PENDING"
//     | "READY"
//     | "COMPLETED"
//     | "REJECTED";

//   paymentStatus: "UNPAID" | "PARTIALLY_PAID" | "FULLY_PAID";

//   startTime: string;
//   sessionType: "ONE_TO_ONE" | "GROUP";
//   meetingLink?: string | null;

//   student?: {
//     name: string;
//     image?: string | null;
//   };
// };

// export default function TutorBookingsPage() {
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
//   const [meetingLink, setMeetingLink] = useState("");
//   const [meetingPlatform, setMeetingPlatform] = useState("GOOGLE_MEET");
//   const [saving, setSaving] = useState(false);

//   const [joinedSessionIds, setJoinedSessionIds] = useState<string[]>([]);
//   const [confirmBooking, setConfirmBooking] = useState<Booking | null>(null);
//   const [completing, setCompleting] = useState(false);

//   /* ================= FETCH BOOKINGS ================= */

//   const loadBookings = () => {
//     fetch("/api/tutor/bookings")
//       .then((res) => res.json())
//       .then((data) => setBookings(data.bookings || []))
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => {
//     loadBookings();
//   }, []);

//   /* ================= ACCEPT / REJECT ================= */

//   async function updateStatus(id: string, action: "ACCEPT" | "REJECT") {
//     const res = await fetch(`/api/tutor/bookings/${id}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ action }),
//     });

//     if (!res.ok) {
//       alert("Failed to update booking");
//       return;
//     }

//     loadBookings();
//   }

//   /* ================= SAVE MEETING ================= */

//   async function saveMeeting() {
//     if (!selectedBooking || !meetingLink.trim()) return;

//     setSaving(true);

//     const res = await fetch(
//       `/api/tutor/bookings/${selectedBooking.id}/meeting`,
//       {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           meetingLink,
//           meetingPlatform,
//         }),
//       }
//     );

//     setSaving(false);

//     if (!res.ok) {
//       alert("Failed to save meeting");
//       return;
//     }

//     loadBookings();
//     setSelectedBooking(null);
//     setMeetingLink("");
//   }

//   /* ================= COMPLETE ================= */

//   async function completeSession(id: string) {
//     const res = await fetch(`/api/tutor/bookings/${id}/complete`, {
//       method: "PATCH",
//     });

//     if (!res.ok) return;

//     loadBookings();
//   }

//   /* ================= LOADING ================= */

//   if (loading) return <p>Loading bookings...</p>;

//   /* ================= UI ================= */

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-semibold text-[#004B4B]">
//         Tutor Bookings
//       </h1>

//       {bookings.map((b) => {
//         const hasJoined = joinedSessionIds.includes(b.id);

//         return (
//           <div
//             key={b.id}
//             className="bg-white border rounded-2xl p-5 flex justify-between items-center shadow-sm"
//           >
//             {/* LEFT */}
//             <div className="flex gap-4 items-center">
//               {b.student?.image ? (
//                 <img
//                   src={b.student.image}
//                   className="w-12 h-12 rounded-full object-cover"
//                 />
//               ) : (
//                 <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
//                   {b.student?.name?.charAt(0) ?? "?"}
//                 </div>
//               )}

//               <div>
//                 <p className="font-semibold text-[#004B4B]">
//                   {b.student?.name ?? "Student"}
//                 </p>

//                 <p className="text-sm text-gray-600">
//                   {new Date(b.startTime).toLocaleString()}
//                 </p>

//                 <span className="inline-block mt-1 px-3 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
//                   {b.sessionType === "ONE_TO_ONE"
//                     ? "1-to-1 Session"
//                     : "Group Session"}
//                 </span>
//               </div>
//             </div>


// {/* ================= RIGHT ================= */}
// <div className="flex items-center gap-3">

//   {/* ================= REQUESTED ================= */}
//   {b.status === "REQUESTED" && (
//     <>
//       <button
//         onClick={() => updateStatus(b.id, "ACCEPT")}
//         className="px-4 py-2 rounded-full text-sm bg-green-100 text-green-700"
//       >
//         Accept
//       </button>

//       <button
//         onClick={() => updateStatus(b.id, "REJECT")}
//         className="px-4 py-2 rounded-full text-sm bg-red-100 text-red-700"
//       >
//         Reject
//       </button>
//     </>
//   )}

//   {/* ================= CREATE MEETING (after payment) ================= */}
//   {(b.paymentStatus === "PARTIALLY_PAID" ||
//     b.paymentStatus === "FULLY_PAID") &&
//     b.status === "PAYMENT_PENDING" &&
//     !b.meetingLink && (
//       <button
//         onClick={() => setSelectedBooking(b)}
//         className="px-4 py-2 rounded-full text-sm bg-[#004B4B] text-white"
//       >
//         Create Meeting
//       </button>
//     )}

//   {/* ================= JOIN SESSION ================= */}
//   {b.status === "READY" && b.meetingLink && !hasJoined && (
//     <button
//       onClick={() => {
//         window.open(b.meetingLink!, "_blank");
//         setJoinedSessionIds((prev) => [...prev, b.id]);
//       }}
//       className="px-4 py-2 rounded-full text-sm font-semibold bg-[#004B4B] text-white"
//     >
//       Join Class
//     </button>
//   )}

//   {/* ================= PAYMENT BADGE (ALWAYS SHOW) ================= */}
//   {b.paymentStatus === "UNPAID" && (
//     <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
//       WAITING PAYMENT
//     </span>
//   )}

//   {b.paymentStatus === "PARTIALLY_PAID" && (
//     <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
//       PARTIALLY PAID
//     </span>
//   )}

//   {b.paymentStatus === "FULLY_PAID" && (
//     <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
//       FULLY PAID
//     </span>
//   )}

//   {/* ================= STATUS BADGE (ALWAYS SHOW) ================= */}
//   {b.status === "PAYMENT_PENDING" && (
//     <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
//       WAITING FOR PAYMENT
//     </span>
//   )}

//   {b.status === "READY" && (
//     <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
//       SESSION READY
//     </span>
//   )}

//   {b.status === "COMPLETED" && (
//     <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
//       COMPLETED
//     </span>
//   )}

//   {b.status === "REJECTED" && (
//     <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700">
//       REJECTED
//     </span>
//   )}
// </div>

//           </div>
//         );
//       })}
//     </div>
//   );
// }







// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// type Booking = {
//   id: string;

//   status:
//     | "REQUESTED"
//     | "PAYMENT_PENDING"
//     | "READY"
//     | "COMPLETED"
//     | "REJECTED";

//   paymentStatus: "UNPAID" | "PARTIALLY_PAID" | "FULLY_PAID";

//   startTime: string;
//   sessionType: "ONE_TO_ONE" | "GROUP";

//   meetingRoom?: string | null;

//   student?: {
//     name: string;
//     image?: string | null;
//   };
// };

// export default function TutorBookingsPage() {
//   const router = useRouter();

//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);

//   /* ================= FETCH BOOKINGS ================= */

//   const loadBookings = async () => {
//     const res = await fetch("/api/tutor/bookings");
//     const data = await res.json();

//     setBookings(data.bookings || []);
//     setLoading(false);
//   };

//   useEffect(() => {
//     loadBookings();
//   }, []);

//   /* ================= ACCEPT / REJECT ================= */

//   async function updateStatus(id: string, action: "ACCEPT" | "REJECT") {
//     const res = await fetch(`/api/tutor/bookings/${id}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ action }),
//     });

//     if (!res.ok) return alert("Failed to update");

//     loadBookings();
//   }

//   /* ================= START SESSION ================= */

//   async function startSession(id: string) {
//     const res = await fetch(`/api/bookings/${id}/start-session`, {
//       method: "PATCH",
//     });

//     const data = await res.json();

//    router.push(`/session/${data.room}?role=tutor`);

//   }

//   /* ================= COMPLETE ================= */

//   async function completeSession(id: string) {
//     const res = await fetch(`/api/bookings/${id}/complete-session`, {
//       method: "PATCH",
//     });

//     if (!res.ok) return;

//     loadBookings();
//   }

//   /* ================= LOADING ================= */

//   if (loading) return <p>Loading bookings...</p>;

//   /* ================= UI ================= */

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-semibold text-[#004B4B]">
//         Tutor Bookings
//       </h1>

//       {bookings.map((b) => (
//         <div
//           key={b.id}
//           className="bg-white border rounded-2xl p-5 flex justify-between items-center shadow-sm"
//         >
//           {/* LEFT SIDE */}
//           <div className="flex gap-4 items-center">
//             {b.student?.image ? (
//               <img
//                 src={b.student.image}
//                 className="w-12 h-12 rounded-full object-cover"
//               />
//             ) : (
//               <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
//                 {b.student?.name?.charAt(0) ?? "?"}
//               </div>
//             )}

//             <div>
//               <p className="font-semibold text-[#004B4B]">
//                 {b.student?.name ?? "Student"}
//               </p>

//               <p className="text-sm text-gray-600">
//                 {new Date(b.startTime).toLocaleString()}
//               </p>

//               <span className="inline-block mt-1 px-3 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
//                 {b.sessionType === "ONE_TO_ONE"
//                   ? "1-to-1 Session"
//                   : "Group Session"}
//               </span>
//             </div>
//           </div>

//           {/* RIGHT SIDE */}
//           <div className="flex items-center gap-3">

//             {/* REQUESTED */}
//             {b.status === "REQUESTED" && (
//               <>
//                 <button
//                   onClick={() => updateStatus(b.id, "ACCEPT")}
//                   className="px-4 py-2 rounded-full text-sm bg-green-100 text-green-700"
//                 >
//                   Accept
//                 </button>

//                 <button
//                   onClick={() => updateStatus(b.id, "REJECT")}
//                   className="px-4 py-2 rounded-full text-sm bg-red-100 text-red-700"
//                 >
//                   Reject
//                 </button>
//               </>
//             )}

//             {/* START SESSION */}
//             {(b.paymentStatus === "PARTIALLY_PAID" ||
//               b.paymentStatus === "FULLY_PAID") &&
//               b.status === "PAYMENT_PENDING" && (
//                 <button
//                   onClick={() => startSession(b.id)}
//                   className="px-4 py-2 rounded-full bg-[#004B4B] text-white"
//                 >
//                   Start Session
//                 </button>
//               )}

//             {/* JOIN SESSION */}
//             {b.status === "READY" && b.meetingRoom && (
//               <button
//                 onClick={() => router.push(`/session/${b.meetingRoom}?role=tutor`)}
//                 className="px-4 py-2 rounded-full bg-[#004B4B] text-white"
//               >
//                 Join Class
//               </button>
//             )}

//             {/* COMPLETE */}
//             {b.status === "READY" && (
//               <button
//                 onClick={() => completeSession(b.id)}
//                 className="px-4 py-2 rounded-full bg-green-600 text-white"
//               >
//                 Complete
//               </button>
//             )}

//             {/* BADGES */}
//             {b.status === "COMPLETED" && (
//               <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
//                 COMPLETED
//               </span>
//             )}

//             {b.status === "REJECTED" && (
//               <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700">
//                 REJECTED
//               </span>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }








// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// /* ================= TYPES ================= */

// type BookingStatus =
//   | "REQUESTED"
//   | "PAYMENT_PENDING"
//   | "READY"
//   | "COMPLETED"
//   | "REJECTED"
//   | "EXPIRED";

// type PaymentStatus = "UNPAID" | "PARTIALLY_PAID" | "FULLY_PAID";

// type SessionType = "ONE_TO_ONE" | "GROUP";

// type Booking = {
//   id: string;
//   status: BookingStatus;
//   paymentStatus: PaymentStatus;
//   startTime: string;
//   sessionType: SessionType;
//   meetingRoom?: string | null;
//   student?: {
//     name: string;
//     image?: string | null;
//   };
// };

// /* ================= COMPONENT ================= */

// export default function TutorBookingsPage() {
//   const router = useRouter();

//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [tab, setTab] = useState<SessionType>("ONE_TO_ONE");

//   /* ================= HELPERS ================= */

//   function isExpired(b: Booking) {
//     if (b.status === "COMPLETED" || b.status === "REJECTED") return false;
//     const now = new Date();
//     const start = new Date(b.startTime);
//     return start.getTime() < now.getTime() && b.status !== "READY";
//   }

//   function paymentBadge(status: PaymentStatus) {
//     if (status === "FULLY_PAID")
//       return (
//         <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
//           FULL PAID
//         </span>
//       );

//     if (status === "PARTIALLY_PAID")
//       return (
//         <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
//           HALF PAID
//         </span>
//       );

//     return (
//       <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
//         UNPAID
//       </span>
//     );
//   }

//   /* ================= FETCH BOOKINGS ================= */

//  async function loadBookings() {
//   try {
//     setLoading(true);

//     const res = await fetch("/api/tutor/bookings", {
//       credentials: "include",
//     });

//     if (!res.ok) {
//       console.error("Failed to fetch bookings", res.status);
//       setBookings([]);
//       return;
//     }

//     const text = await res.text();
//     if (!text) {
//       setBookings([]);
//       return;
//     }

//     const data = JSON.parse(text);
//     setBookings(data.bookings || []);
//   } catch (err) {
//     console.error("BOOKING FETCH ERROR:", err);
//     setBookings([]);
//   } finally {
//     setLoading(false);
//   }
// }


//   useEffect(() => {
//     loadBookings();
//   }, []);

//   /* ================= ACTIONS ================= */

//   async function updateStatus(id: string, action: "ACCEPT" | "REJECT") {
//     const res = await fetch(`/api/tutor/bookings/${id}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ action }),
//       credentials: "include",
//     });

//     if (!res.ok) {
//       alert("Failed to update booking");
//       return;
//     }

//     loadBookings();
//   }

//   async function startSession(id: string) {
//     const res = await fetch(`/api/tutor/bookings/${id}/start-session`, {
//       method: "PATCH",
//       credentials: "include",
//     });

//     if (!res.ok) {
//       alert("Unable to start session");
//       return;
//     }

//     const data = await res.json();
//     router.push(`/session/${data.room}?role=tutor`);
//   }

//   async function completeSession(id: string) {
//     const res = await fetch(`/api/tutor/bookings/${id}/complete`, {
//       method: "PATCH",
//       credentials: "include",
//     });

//     if (!res.ok) {
//       alert("Failed to complete session");
//       return;
//     }

//     loadBookings();
//   }

//   /* ================= FILTERED BOOKINGS ================= */

//   const filteredBookings = bookings.filter(
//     (b) => b.sessionType === tab
//   );

//   /* ================= LOADING ================= */

//   if (loading) return <p>Loading bookings...</p>;

//   /* ================= UI ================= */

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-semibold text-[#004B4B]">
//         Tutor Bookings
//       </h1>

//       {/* ===== TABS ===== */}
//       <div className="flex gap-2">
//         <button
//           onClick={() => setTab("ONE_TO_ONE")}
//           className={`px-4 py-2 rounded-full text-sm font-medium ${
//             tab === "ONE_TO_ONE"
//               ? "bg-[#004B4B] text-white"
//               : "bg-gray-100 text-gray-600"
//           }`}
//         >
//           1-to-1 Online Class
//         </button>

//         <button
//           onClick={() => setTab("GROUP")}
//           className={`px-4 py-2 rounded-full text-sm font-medium ${
//             tab === "GROUP"
//               ? "bg-[#004B4B] text-white"
//               : "bg-gray-100 text-gray-600"
//           }`}
//         >
//           Group Online Class
//         </button>
//       </div>

//       {filteredBookings.length === 0 && (
//         <p className="text-gray-500">
//           No {tab === "ONE_TO_ONE" ? "1-to-1" : "group"} bookings found
//         </p>
//       )}

//       {filteredBookings.map((b) => {
//         const expired = isExpired(b);

//         return (
//           <div
//             key={b.id}
//             className="bg-white border rounded-2xl p-5 flex justify-between items-center shadow-sm"
//           >
//             {/* LEFT */}
//             <div className="flex gap-4 items-center">
//               {b.student?.image ? (
//                 <img
//                   src={b.student.image}
//                   className="w-12 h-12 rounded-full object-cover"
//                 />
//               ) : (
//                 <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
//                   {b.student?.name?.charAt(0) ?? "?"}
//                 </div>
//               )}

//               <div>
//                 <p className="font-semibold text-[#004B4B]">
//                   {b.student?.name ?? "Student"}
//                 </p>

//                 <p className="text-sm text-gray-600">
//                   {new Date(b.startTime).toLocaleString()}
//                 </p>

//                 <div className="flex gap-2 mt-1">
//                   <span className="px-3 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
//                     {b.sessionType === "ONE_TO_ONE"
//                       ? "1-to-1 Session"
//                       : "Group Session"}
//                   </span>

//                   {paymentBadge(b.paymentStatus)}
//                 </div>
//               </div>
//             </div>

//             {/* RIGHT */}
//             <div className="flex items-center gap-3">
//               {b.status === "REQUESTED" && (
//                 <>
//                   <button
//                     onClick={() => updateStatus(b.id, "ACCEPT")}
//                     className="px-4 py-2 rounded-full text-sm bg-green-100 text-green-700"
//                   >
//                     Accept
//                   </button>
//                   <button
//                     onClick={() => updateStatus(b.id, "REJECT")}
//                     className="px-4 py-2 rounded-full text-sm bg-red-100 text-red-700"
//                   >
//                     Reject
//                   </button>
//                 </>
//               )}

//               {!expired &&
//                 b.status === "PAYMENT_PENDING" &&
//                 (b.paymentStatus === "PARTIALLY_PAID" ||
//                   b.paymentStatus === "FULLY_PAID") && (
//                   <button
//                     onClick={() => startSession(b.id)}
//                     className="px-4 py-2 rounded-full bg-[#004B4B] text-white"
//                   >
//                     Start Session
//                   </button>
//                 )}

//               {!expired && b.status === "READY" && b.meetingRoom && (
//                 <button
//                   onClick={() =>
//                     router.push(`/session/${b.meetingRoom}?role=tutor`)
//                   }
//                   className="px-4 py-2 rounded-full bg-[#004B4B] text-white"
//                 >
//                   Join Class
//                 </button>
//               )}

//               {!expired && b.status === "READY" && (
//                 <button
//                   onClick={() => completeSession(b.id)}
//                   className="px-4 py-2 rounded-full bg-green-600 text-white"
//                 >
//                   Complete
//                 </button>
//               )}

//               {expired && (
//                 <span className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-600">
//                   EXPIRED
//                 </span>
//               )}

//               {b.status === "COMPLETED" && (
//                 <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
//                   COMPLETED
//                 </span>
//               )}

//               {b.status === "REJECTED" && (
//                 <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700">
//                   REJECTED
//                 </span>
//               )}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }







// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// /* ================= TYPES ================= */

// type BookingStatus =
//   | "REQUESTED"
//   | "PAYMENT_PENDING"
//   | "READY"
//   | "COMPLETED"
//   | "REJECTED"
//   | "EXPIRED";

// type PaymentStatus = "UNPAID" | "PARTIALLY_PAID" | "FULLY_PAID";

// type SessionType = "ONE_TO_ONE" | "GROUP";

// type Booking = {
//   id: string;
//   status: BookingStatus;
//   paymentStatus: PaymentStatus;
//   startTime: string;
//   sessionType: SessionType;
//   meetingRoom?: string | null;
//   student?: {
//     name: string;
//     image?: string | null;
//   };
// };

// export default function TutorBookingsPage() {
//   const router = useRouter();
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [tab, setTab] = useState<SessionType>("ONE_TO_ONE");

//   /* ================= HELPERS ================= */

// function isExpired(b: Booking) {
//   if (b.status === "COMPLETED" || b.status === "REJECTED")
//     return false;

//   const now = new Date();
//   const start = new Date(b.startTime);

//   const sessionDurationMs = 2 * 60 * 60 * 1000; // 2 hours
//   const end = new Date(start.getTime() + sessionDurationMs);

//   return end.getTime() < now.getTime();
// }



//   function paymentBadge(status: PaymentStatus) {
//     if (status === "FULLY_PAID")
//       return (
//         <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
//           FULL PAID
//         </span>
//       );

//     if (status === "PARTIALLY_PAID")
//       return (
//         <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
//           HALF PAID
//         </span>
//       );

//     return (
//       <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
//         UNPAID
//       </span>
//     );
//   }

//   async function loadBookings() {
//     try {
//       setLoading(true);
//       const res = await fetch("/api/tutor/bookings", {
//         credentials: "include",
//       });
//       const data = await res.json();
//       setBookings(data.bookings || []);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadBookings();
//   }, []);

//   async function updateStatus(id: string, action: "ACCEPT" | "REJECT") {
//     await fetch(`/api/tutor/bookings/${id}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ action }),
//       credentials: "include",
//     });
//     loadBookings();
//   }

//   async function startSession(id: string) {
//     const res = await fetch(`/api/tutor/bookings/${id}/start-session`, {
//       method: "PATCH",
//       credentials: "include",
//     });
//     const data = await res.json();
//     router.push(`/session/${data.room}?role=tutor`);
//   }

//   async function completeSession(id: string) {
//     await fetch(`/api/tutor/bookings/${id}/complete`, {
//       method: "PATCH",
//       credentials: "include",
//     });
//     loadBookings();
//   }

//   const filtered = bookings.filter((b) => b.sessionType === tab);

//   /* ================= GROUP MERGE ================= */

//   const groupedByTime =
//     tab === "GROUP"
//       ? filtered.reduce((acc, b) => {
//           const key = b.startTime;
//           if (!acc[key]) acc[key] = [];
//           acc[key].push(b);
//           return acc;
//         }, {} as Record<string, Booking[]>)
//       : {};

//   if (loading) return <p>Loading bookings...</p>;

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-semibold text-[#004B4B]">
//         Tutor Bookings
//       </h1>

//       {/* ===== TABS ===== */}
//       <div className="flex gap-2">
//         {["ONE_TO_ONE", "GROUP"].map((t) => (
//           <button
//             key={t}
//             onClick={() => setTab(t as SessionType)}
//             className={`px-4 py-2 rounded-full text-sm font-medium ${
//               tab === t
//                 ? "bg-[#004B4B] text-white"
//                 : "bg-gray-100 text-gray-600"
//             }`}
//           >
//             {t === "ONE_TO_ONE"
//               ? "1-to-1 Online Class"
//               : "Group Online Class"}
//           </button>
//         ))}
//       </div>

//       {/* ================= ONE TO ONE ================= */}
//       {tab === "ONE_TO_ONE" &&
//         filtered.map((b) => renderSingleCard(b))}

//       {/* ================= GROUP ================= */}
//       {tab === "GROUP" &&
//         Object.entries(groupedByTime).map(([time, list]) => {
//           const firstBooking = list[0];
//           const expired = isExpired(firstBooking);

//           return (
//             <div
//               key={time}
//               className="bg-white border rounded-2xl p-5 shadow-sm"
//             >
//               <h3 className="font-semibold text-[#004B4B]">
//                 Group Session
//               </h3>

//               <p className="text-sm text-gray-600 mb-4">
//                 {new Date(time).toLocaleString()}
//               </p>

//               {/* STUDENTS */}
//               {list.map((b) => (
//                 <div
//                   key={b.id}
//                   className="mb-3 border rounded-xl p-4 flex justify-between items-center"
//                 >
//                   {renderStudentInfo(b)}

//                   {b.status === "COMPLETED" && (
//                     <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
//                       COMPLETED
//                     </span>
//                   )}
//                 </div>
//               ))}

//               {/* GROUP ACTION BUTTONS */}
//               <div className="flex gap-3 justify-end mt-4">
//                 {!expired &&
//                   firstBooking.status === "PAYMENT_PENDING" &&
//                   firstBooking.paymentStatus !== "UNPAID" && (
//                     <button
//                       onClick={() => startSession(firstBooking.id)}
//                       className="px-5 py-2 rounded-full bg-[#004B4B] text-white"
//                     >
//                       Start
//                     </button>
//                   )}

//                 {!expired &&
//                   firstBooking.status === "READY" &&
//                   firstBooking.meetingRoom && (
//                     <>
//                       <button
//                         onClick={() =>
//                           router.push(
//                             `/session/${firstBooking.meetingRoom}?role=tutor`
//                           )
//                         }
//                         className="px-5 py-2 rounded-full bg-[#004B4B] text-white"
//                       >
//                         Join
//                       </button>

//                       <button
//                         onClick={() =>
//                           completeSession(firstBooking.id)
//                         }
//                         className="px-5 py-2 rounded-full bg-green-600 text-white"
//                       >
//                         Complete
//                       </button>
//                     </>
//                   )}

//                 {expired && (
//                   <span className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-600">
//                     EXPIRED
//                   </span>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//     </div>
//   );

//   /* ================= SINGLE CARD ================= */

//   function renderSingleCard(b: Booking) {
//     const expired = isExpired(b);

//     return (
//       <div
//         key={b.id}
//         className="bg-white border rounded-2xl p-5 flex justify-between items-center"
//       >
//         {renderStudentInfo(b)}

//         <div className="flex gap-2 items-center">
//           {b.status === "REQUESTED" && (
//             <>
//               <button
//                 onClick={() => updateStatus(b.id, "ACCEPT")}
//                 className="px-4 py-2 rounded-full bg-green-100 text-green-700"
//               >
//                 Accept
//               </button>
//               <button
//                 onClick={() => updateStatus(b.id, "REJECT")}
//                 className="px-4 py-2 rounded-full bg-red-100 text-red-700"
//               >
//                 Reject
//               </button>
//             </>
//           )}

//           {!expired &&
//             b.status === "PAYMENT_PENDING" &&
//             b.paymentStatus !== "UNPAID" && (
//               <button
//                 onClick={() => startSession(b.id)}
//                 className="px-4 py-2 rounded-full bg-[#004B4B] text-white"
//               >
//                 Start
//               </button>
//             )}

//           {!expired && b.status === "READY" && b.meetingRoom && (
//             <>
//               <button
//                 onClick={() =>
//                   router.push(`/session/${b.meetingRoom}?role=tutor`)
//                 }
//                 className="px-4 py-2 rounded-full bg-[#004B4B] text-white"
//               >
//                 Join
//               </button>

//               <button
//                 onClick={() => completeSession(b.id)}
//                 className="px-4 py-2 rounded-full bg-green-600 text-white"
//               >
//                 Complete
//               </button>
//             </>
//           )}

//           {expired && (
//             <span className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-600">
//               EXPIRED
//             </span>
//           )}

//           {b.status === "COMPLETED" && (
//             <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
//               COMPLETED
//             </span>
//           )}
//         </div>
//       </div>
//     );
//   }

//   /* ================= STUDENT INFO ================= */

//   function renderStudentInfo(b: Booking) {
//     return (
//       <div className="flex gap-4 items-center">
//         {b.student?.image ? (
//           <img
//             src={b.student.image}
//             className="w-12 h-12 rounded-full object-cover"
//           />
//         ) : (
//           <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
//             {b.student?.name?.charAt(0) ?? "?"}
//           </div>
//         )}

//         <div>
//           <p className="font-semibold text-[#004B4B]">
//             {b.student?.name}
//           </p>

//           <p className="text-sm text-gray-600">
//             {new Date(b.startTime).toLocaleString()}
//           </p>

//           <div className="flex gap-2 mt-1">
//             <span className="px-3 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
//               {b.sessionType === "ONE_TO_ONE"
//                 ? "1-to-1 Session"
//                 : "Group Session"}
//             </span>

//             {paymentBadge(b.paymentStatus)}
//           </div>
//         </div>
//       </div>
//     );
//   }
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

type Booking = {
  id: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  startTime: string;
  sessionType: SessionType;
  meetingRoom?: string | null;
  student?: {
    name: string;
    image?: string | null;
  };
};

export default function TutorBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<SessionType>("ONE_TO_ONE");

  /* ================= HELPERS ================= */

  function isExpired(b: Booking) {
    if (b.status === "COMPLETED" || b.status === "REJECTED")
      return false;

    const now = new Date();
    const start = new Date(b.startTime);

    const sessionDurationMs = 2 * 60 * 60 * 1000; // 2 hours
    const end = new Date(start.getTime() + sessionDurationMs);

    return end.getTime() < now.getTime();
  }

  function paymentBadge(status: PaymentStatus) {
    if (status === "FULLY_PAID")
      return (
        <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
          FULL PAID
        </span>
      );

    if (status === "PARTIALLY_PAID")
      return (
        <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700">
          HALF PAID
        </span>
      );

    return (
      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
        UNPAID
      </span>
    );
  }

  async function loadBookings() {
    setLoading(true);
    const res = await fetch("/api/tutor/bookings", {
      credentials: "include",
    });
    const data = await res.json();
    setBookings(data.bookings || []);
    setLoading(false);
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function updateStatus(id: string, action: "ACCEPT" | "REJECT") {
    await fetch(`/api/tutor/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
      credentials: "include",
    });
    loadBookings();
  }

  // async function startSession(id: string) {
  //   const res = await fetch(`/api/tutor/bookings/${id}/start-session`, {
  //     method: "PATCH",
  //     credentials: "include",
  //   });
  //   const data = await res.json();
  //   router.push(`/session/${data.room}?role=tutor`);
  // }

  async function startSession(id: string) {
  const res = await fetch(`/api/tutor/bookings/${id}/start-session`, {
    method: "PATCH",
    credentials: "include",
  });

  const data = await res.json();

  console.log("START RESPONSE:", data);  // 👈 ADD THIS

  if (!data.room) {
    alert("Room not created!");
    return;
  }

  router.push(`/session/${data.room}?role=tutor`);
}


  async function completeSession(id: string) {
    await fetch(`/api/tutor/bookings/${id}/complete`, {
      method: "PATCH",
      credentials: "include",
    });
    loadBookings();
  }

  const filtered = bookings.filter((b) => b.sessionType === tab);

  const groupedByTime =
    tab === "GROUP"
      ? filtered.reduce((acc, b) => {
          const key = b.startTime;
          if (!acc[key]) acc[key] = [];
          acc[key].push(b);
          return acc;
        }, {} as Record<string, Booking[]>)
      : {};

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#004B4B]">
        Tutor Bookings
      </h1>

      {/* TABS */}
      <div className="flex gap-2">
        {["ONE_TO_ONE", "GROUP"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as SessionType)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              tab === t
                ? "bg-[#004B4B] text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {t === "ONE_TO_ONE"
              ? "1-to-1 Online Class"
              : "Group Online Class"}
          </button>
        ))}
      </div>

      {/* ================= ONE TO ONE ================= */}

      {tab === "ONE_TO_ONE" &&
        filtered.map((b) => (
          <SingleCard
            key={b.id}
            b={b}
            isExpired={isExpired}
            updateStatus={updateStatus}
            startSession={startSession}
            completeSession={completeSession}
            router={router}
            paymentBadge={paymentBadge}
          />
        ))}

      {/* ================= GROUP ================= */}

      {tab === "GROUP" &&
        Object.entries(groupedByTime).map(([time, list]) => {
          const expired = isExpired(list[0]);

          const requested = list.filter(
            (b) => b.status === "REQUESTED"
          );

          const paid = list.filter(
            (b) =>
              b.status !== "REQUESTED" &&
              b.paymentStatus === "FULLY_PAID"
          );

          const unpaid = list.filter(
            (b) =>
              b.status !== "REQUESTED" &&
              b.paymentStatus !== "FULLY_PAID"
          );

          const groupLive = paid.some((b) => b.meetingRoom);

          return (
            <div
              key={time}
              className="bg-white border rounded-2xl p-5 shadow-sm"
            >
              <h3 className="font-semibold text-[#004B4B]">
                Group Session
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {new Date(time).toLocaleString()}
              </p>

              {/* REQUESTED */}
           {requested.length > 0 && (
  <>
    <p className="text-sm font-semibold text-gray-500 mb-2">
      Pending Approval
    </p>

    {requested.map((b) => (
      <div
        key={b.id}
        className="flex justify-between items-center border rounded-xl p-3 mb-2"
      >
        {/* LEFT SIDE (Photo + Name + Payment) */}
        <div className="flex items-center gap-3">
          {b.student?.image ? (
            <img
              src={b.student.image}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
              {b.student?.name?.charAt(0) ?? "?"}
            </div>
          )}

          <div>
            <p className="font-medium text-[#004B4B]">
              {b.student?.name}
            </p>

            <div className="flex gap-2 mt-1">
              {paymentBadge(b.paymentStatus)}

              {isExpired(b) && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-600">
                  EXPIRED
                </span>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (Buttons) */}
        <div className="flex gap-2">
          {!isExpired(b) && (
            <>
              <button
                onClick={() => updateStatus(b.id, "ACCEPT")}
                className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700"
              >
                Accept
              </button>

              <button
                onClick={() => updateStatus(b.id, "REJECT")}
                className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700"
              >
                Reject
              </button>
            </>
          )}
        </div>
      </div>
    ))}
  </>
)}


              {/* PAID */}
              {/* PAID STUDENTS */}
{paid.length > 0 && (
  <>
    <p className="text-sm font-semibold text-gray-500 mt-4 mb-2">
      Paid Students
    </p>

    {paid.map((b) => {
      const studentExpired = isExpired(b);

      return (
        <div
          key={b.id}
          className="flex justify-between items-center border rounded-xl p-4 mb-2"
        >
          <div className="flex gap-4 items-center">
            {b.student?.image ? (
              <img
                src={b.student.image}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
                {b.student?.name?.charAt(0) ?? "?"}
              </div>
            )}

            <div>
              <p className="font-semibold text-[#004B4B]">
                {b.student?.name}
              </p>

              <div className="flex gap-2 mt-1">
                {paymentBadge(b.paymentStatus)}

                {b.status === "COMPLETED" && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                    COMPLETED
                  </span>
                )}

                {studentExpired &&
                  b.status !== "COMPLETED" && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-600">
                      EXPIRED
                    </span>
                  )}
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </>
)}


              {/* UNPAID */}
             {/* UNPAID STUDENTS */}
{unpaid.length > 0 && (
  <>
    <p className="text-sm font-semibold text-gray-500 mt-4 mb-2">
      Waiting For Payment
    </p>

    {unpaid.map((b) => {
      const studentExpired = isExpired(b);

      return (
        <div
          key={b.id}
          className="flex justify-between items-center border rounded-xl p-4 mb-2"
        >
          <div className="flex gap-4 items-center">
            {b.student?.image ? (
              <img
                src={b.student.image}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
                {b.student?.name?.charAt(0) ?? "?"}
              </div>
            )}

            <div>
              <p className="font-semibold text-[#004B4B]">
                {b.student?.name}
              </p>

              <div className="flex gap-2 mt-1">
                {paymentBadge(b.paymentStatus)}

                {studentExpired && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-600">
                    EXPIRED
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </>
)}


             
             {/* GROUP BUTTONS */}
{paid.length > 0 && (
  <div className="flex gap-3 justify-end mt-5">

    {/* SESSION NOT STARTED */}
    {!expired && !list[0].meetingRoom && (
      <button
        onClick={() => startSession(paid[0].id)}
        className="px-5 py-2 rounded-full bg-[#004B4B] text-white"
      >
        Start
      </button>
    )}

    {/* SESSION STARTED */}
    {!expired && list[0].meetingRoom && (
      <>
        <button
          onClick={() =>
            router.push(`/session/${list[0].meetingRoom}?role=tutor`)
          }
          className="px-5 py-2 rounded-full bg-[#004B4B] text-white"
        >
          Join
        </button>

        <button
          onClick={() => completeSession(paid[0].id)}
          className="px-5 py-2 rounded-full bg-green-600 text-white"
        >
          Complete
        </button>
      </>
    )}

    {expired && (
      <span className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-600">
        EXPIRED
      </span>
    )}
  </div>
)}

            </div>
          );
        })}
    </div>
  );
}

/* ================= SINGLE CARD ================= */

function SingleCard({
  b,
  isExpired,
  updateStatus,
  startSession,
  completeSession,
  router,
  paymentBadge,
}: any) {
  const expired = isExpired(b);

  return (
    <div className="bg-white border rounded-2xl p-5 flex justify-between items-center">
      <div>
        <div className="flex gap-4 items-center">
  {b.student?.image ? (
    <img
      src={b.student.image}
      className="w-12 h-12 rounded-full object-cover"
    />
  ) : (
    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
      {b.student?.name?.charAt(0) ?? "?"}
    </div>
  )}

  <div>
    <p className="font-semibold text-[#004B4B]">
      {b.student?.name}
    </p>

    <p className="text-sm text-gray-600">
      {new Date(b.startTime).toLocaleString()}
    </p>

    <div className="flex gap-2 mt-1">
      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
        1-to-1 Session
      </span>

      {paymentBadge(b.paymentStatus)}
    </div>
  </div>
</div>

      </div>

      <div className="flex gap-2 items-center">
        {b.status === "REQUESTED" && (
          <>
            <button
              onClick={() => updateStatus(b.id, "ACCEPT")}
              className="px-4 py-2 rounded-full bg-green-100 text-green-700"
            >
              Accept
            </button>
            <button
              onClick={() => updateStatus(b.id, "REJECT")}
              className="px-4 py-2 rounded-full bg-red-100 text-red-700"
            >
              Reject
            </button>
          </>
        )}

       {!expired &&
  b.status === "PAYMENT_PENDING" &&
  (b.paymentStatus === "FULLY_PAID" ||
   b.paymentStatus === "PARTIALLY_PAID") && (

            <button
              onClick={() => startSession(b.id)}
              className="px-4 py-2 rounded-full bg-[#004B4B] text-white"
            >
              Start
            </button>
          )}

        {!expired && b.status === "READY" && b.meetingRoom && (
          <>
            <button
              onClick={() =>
                router.push(`/session/${b.meetingRoom}?role=tutor`)
              }
              className="px-4 py-2 rounded-full bg-[#004B4B] text-white"
            >
              Join
            </button>

            <button
              onClick={() => completeSession(b.id)}
              className="px-4 py-2 rounded-full bg-green-600 text-white"
            >
              Complete
            </button>
          </>
        )}

        {expired && (
          <span className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-600">
            EXPIRED
          </span>
        )}

        {b.status === "COMPLETED" && (
          <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
            COMPLETED
          </span>
        )}
      </div>
    </div>
  );
}

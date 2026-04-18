
// after cancel modal


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
//   | "EXPIRED"
//   | "CANCELLED";

// type PaymentStatus = "UNPAID" | "PARTIALLY_PAID" | "FULLY_PAID";

// type SessionType = "ONE_TO_ONE" | "GROUP";

// interface Booking {
//   id: string;
//   status: BookingStatus;
//   paymentStatus: PaymentStatus;
//   sessionType: SessionType;

//   bookingDate: string;
//   startTime: string;

//   subject: string;
//   level?: string;

//   meetingRoom?: string | null;
//   paymentDueAt?: string; 


//   tutor: {
//     name: string;
//     photo?: string | null;
//   };
// }

// /* ================= HELPERS ================= */

// function isExpired(b: Booking) {
//   return b.status === "EXPIRED";
// }

// function getRemainingTime(due: string) {
//   const now = new Date().getTime();
//   const end = new Date(due).getTime();

//   const diff = end - now;

//   if (diff <= 0) return "Expired";

//   const hours = Math.floor(diff / (1000 * 60 * 60));
//   const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

//   return `${hours}h ${mins}m left`;
// }

// function getStatusBadge(status: BookingStatus, paymentStatus: PaymentStatus) {

//   // 🔴 FINAL STATES (always highest priority)
//   if (status === "CANCELLED")
//     return { text: "CANCELLED", className: "bg-red-100 text-red-700" };

//   if (status === "REJECTED")
//     return { text: "REJECTED", className: "bg-red-100 text-red-700" };

//   if (status === "COMPLETED")
//     return { text: "COMPLETED", className: "bg-green-100 text-green-700" };

//   if (status === "EXPIRED")
//     return { text: "EXPIRED", className: "bg-gray-200 text-gray-600" };

//   // 🔥 PAYMENT STATUS (before normal status)
//   if (paymentStatus === "PARTIALLY_PAID")
//     return { text: "HALF PAID", className: "bg-yellow-100 text-yellow-800" };

//   if (paymentStatus === "FULLY_PAID" && status !== "READY")
//     return { text: "CONFIRMED", className: "bg-green-100 text-green-700" };

//   // 🟣 ACTIVE SESSION
//   if (status === "READY")
//     return { text: "LIVE", className: "bg-purple-100 text-purple-700" };

//   // 🟡 STILL UNPAID
//   if (status === "PAYMENT_PENDING")
//     return { text: "PAYMENT REQUIRED", className: "bg-yellow-100 text-yellow-700" };

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
//   const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
//   const [currentPage, setCurrentPage] = useState(1); // 👈 FIX
// const itemsPerPage = 9; 

//   /* ================= FETCH ================= */

//   useEffect(() => {
//     fetch("/api/bookings/student", { credentials: "include" })
//       .then((res) => res.json())
//      .then((data) =>
//  setBookings(data.bookings || [])
// )
//       .finally(() => setLoading(false));
//   }, []);

// async function cancelBooking(id: string) {
//   const res = await fetch(`/api/bookings/${id}/cancel`, {
//     method: "PATCH",
//     credentials: "include",
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     alert(data.error || "Failed to cancel booking");
//     return;
//   }

//  if (data.type === "FULL") {
//   alert(`Booking cancelled. NPR ${data.refundAmount} has been credited to your wallet.`);
// } 
// else if (data.type === "PARTIAL") {
//   alert(`Booking cancelled. NPR ${data.refundAmount} has been credited to your wallet (50% refund).`);
// } 
// else if (data.type === "NONE") {
//   alert("Booking cancelled. This cancellation is not eligible for refund.");
// } 
// else if (data.type === "STARTED") {
//   alert("This session had already started, so it was marked as completed.");
// }

//   setBookings((prev) => prev.filter((b) => b.id !== id));
// }

//   if (loading)
//     return <p className="text-[#004B4B] font-medium">Loading sessions...</p>;

//   if (bookings.length === 0)
//     return <p className="text-gray-600">You have not booked any sessions yet.</p>;


  
//   const totalItems = bookings.length;
// const totalPages = Math.ceil(totalItems / itemsPerPage);

// const startIndex = (currentPage - 1) * itemsPerPage;
// const paginatedBookings = bookings.slice(
//   startIndex,
//   startIndex + itemsPerPage
// );

//   /* ================= UI ================= */

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-semibold text-[#004B4B]">My Sessions</h1>

//       <div className="space-y-4">
//        {paginatedBookings.map((b) => {
//           const expired = isExpired(b);
//           const effectiveStatus = b.status;

// const badge = getStatusBadge(effectiveStatus, b.paymentStatus);

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

//             {/* RIGHT (CLEAN VERSION) */}
// <div className="flex flex-col items-end gap-2">

//   {/* ================= PRIMARY ACTION ================= */}

//   {/* JOIN (highest priority) */}
//   {!expired &&
//     b.status === "READY" &&
//     b.meetingRoom &&
//     (
//       (b.sessionType === "ONE_TO_ONE" &&
//         (b.paymentStatus === "FULLY_PAID" ||
//          b.paymentStatus === "PARTIALLY_PAID")) ||

//       (b.sessionType === "GROUP" &&
//         b.paymentStatus === "FULLY_PAID")
//     ) && (
//       <button
//         onClick={() =>
//           router.push(`/session/${b.meetingRoom}?role=student`)
//         }
//         className="px-4 py-2 rounded-full text-sm font-semibold bg-[#004B4B] text-white"
//       >
//         Join
//       </button>
//   )}

//   {/* ================= INFO STATES ================= */}

//   {/* GROUP HALF PAID */}
//   {!expired &&
//     b.sessionType === "GROUP" &&
//     b.status === "READY" &&
//     b.paymentStatus === "PARTIALLY_PAID" && (
//       <span className="text-sm text-yellow-600 font-medium">
//         Complete payment to join
//       </span>
//   )}

//   {/* WAITING + CANCEL TOGETHER */}
// {!expired &&
//   !["COMPLETED", "CANCELLED", "REJECTED", "EXPIRED"].includes(b.status) &&
//   !b.meetingRoom &&
//   (
//     b.paymentStatus === "FULLY_PAID" ||
//     (b.sessionType === "ONE_TO_ONE" &&
//       b.paymentStatus === "PARTIALLY_PAID")
//   ) && (
//     <div className="flex items-center gap-3 text-sm">
//       <span className="text-gray-400">
//         Waiting for tutor to start
//       </span>

//       <button
//         onClick={() => setConfirmCancelId(b.id)}
//         className="text-red-400 hover:text-red-600 text-xs"
//       >
//         Cancel
//       </button>
//     </div>
// )}

//   {/* WAITING */}
// {/* {!expired &&
//   !["COMPLETED", "CANCELLED", "REJECTED", "EXPIRED"].includes(b.status) &&
//   !b.meetingRoom &&
//   (
//     b.paymentStatus === "FULLY_PAID" ||
//     (b.sessionType === "ONE_TO_ONE" &&
//       b.paymentStatus === "PARTIALLY_PAID")
//   ) && (
//     <span className="text-sm text-gray-500">
//       Tutor will start the session soon...
//     </span>
// )} */}


//   {/* ================= REVIEW (CLEAN ADDITION) ================= */}

//   {b.status === "COMPLETED" && (
//     <button
//       onClick={() => router.push(`/dashboard/review/${b.id}`)}
//       className="px-3 py-1 text-sm rounded-full bg-[#E6F9F5] text-[#004B4B] font-medium"
//     >
//       Review
//     </button>
//   )}

//   {/* ================= PAYMENT DEADLINE ================= */}

//   {b.status === "COMPLETED" &&
//     b.paymentStatus === "PARTIALLY_PAID" &&
//     b.paymentDueAt && (
//       <button
//         onClick={() => router.push(`/dashboard/payments/${b.id}`)}
//         className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700"
//       >
//         ⏳ {getRemainingTime(b.paymentDueAt)}
//       </button>
//   )}

//   {/* ================= CANCEL ================= */}

//   {/* {!expired &&
//     b.status !== "COMPLETED" &&
//     b.status !== "REJECTED" &&
//     b.status !== "CANCELLED" && (
//       <button
//         onClick={() => setConfirmCancelId(b.id)}
//         className="text-xs text-red-500 hover:underline"
//       >
//         Cancel
//       </button>
//   )} */}

//   {/* ================= STATUS ================= */}

//   <span
//     className={`px-3 py-1 text-xs rounded-full font-medium ${badge.className}`}
//   >
//     {badge.text}
//   </span>

// </div>   
//   </div>
  
//           );
//         })}
        
//       </div>
// {totalPages > 1 && (
//   <div className="flex justify-between items-center mt-4 text-sm">
//     <button
//       onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//       disabled={currentPage === 1}
//       className="px-4 py-2 rounded-full border disabled:opacity-50"
//     >
//       Prev
//     </button>

//     <span className="text-gray-600">
//       Page {currentPage} of {totalPages}
//     </span>

//     <button
//       onClick={() =>
//         setCurrentPage((p) => Math.min(p + 1, totalPages))
//       }
//       disabled={currentPage === totalPages}
//       className="px-4 py-2 rounded-full border disabled:opacity-50"
//     >
//       Next
//     </button>
//   </div>
// )}
      
//       {confirmCancelId && (
//   <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//     <div className="bg-white rounded-xl p-6 w-[350px] shadow-lg">

//       <h2 className="text-lg font-semibold text-[#004B4B] mb-2">
//         Cancel Booking?
//       </h2>

//       <p className="text-sm text-gray-600 mb-4">
//         Are you sure you want to cancel this booking?
//       </p>

//       <div className="text-xs text-gray-500 space-y-1 mb-5">
//         <p>• More than 12 hours before → Full refund</p>
//         <p>• Within 12 hours → 50% refund</p>
//         <p>• After session starts → No refund (marked completed)</p>
//       </div>

//       <div className="flex justify-end gap-3">
//         <button
//           onClick={() => setConfirmCancelId(null)}
//           className="px-3 py-1 text-sm rounded bg-gray-200"
//         >
//           No
//         </button>

//         <button
//           onClick={() => {
//             cancelBooking(confirmCancelId);
//             setConfirmCancelId(null);
//           }}
//           className="px-3 py-1 text-sm rounded bg-red-500 text-white"
//         >
//           Yes, Cancel
//         </button>
//       </div>
//     </div>
//   </div>
// )}

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
  | "EXPIRED"
  | "CANCELLED";

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
  paymentDueAt?: string;

  tutor: {
    name: string;
    photo?: string | null;
  };
}

/* ================= HELPERS ================= */

function isExpired(b: Booking) {
  return b.status === "EXPIRED";
}

function getRemainingTime(due: string) {
  const now = new Date().getTime();
  const end = new Date(due).getTime();

  const diff = end - now;

  if (diff <= 0) return "Expired";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${mins}m left`;
}

function getStatusBadge(status: BookingStatus, paymentStatus: PaymentStatus) {
  if (status === "CANCELLED")
    return { text: "CANCELLED", className: "bg-red-100 text-red-700" };

  if (status === "REJECTED")
    return { text: "REJECTED", className: "bg-red-100 text-red-700" };

  if (status === "COMPLETED")
    return { text: "COMPLETED", className: "bg-green-100 text-green-700" };

  if (status === "EXPIRED")
    return { text: "EXPIRED", className: "bg-gray-200 text-gray-600" };

  if (paymentStatus === "PARTIALLY_PAID")
    return { text: "HALF PAID", className: "bg-yellow-100 text-yellow-800" };

  if (paymentStatus === "FULLY_PAID" && status !== "READY")
    return { text: "CONFIRMED", className: "bg-green-100 text-green-700" };

  if (status === "READY")
    return { text: "LIVE", className: "bg-purple-100 text-purple-700" };

  if (status === "PAYMENT_PENDING")
    return { text: "PAYMENT REQUIRED", className: "bg-yellow-100 text-yellow-700" };

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
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [statusFilter, setStatusFilter] = useState<"ALL" | BookingStatus>("ALL");
const [paymentFilter, setPaymentFilter] = useState<"ALL" | PaymentStatus>("ALL");

  useEffect(() => {
    fetch("/api/bookings/student", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setBookings(data.bookings || []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
  setCurrentPage(1);
}, [statusFilter, paymentFilter]);

  async function cancelBooking(id: string) {
    const res = await fetch(`/api/bookings/${id}/cancel`, {
      method: "PATCH",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to cancel booking");
      return;
    }

    if (data.type === "FULL") {
      alert(`Booking cancelled. NPR ${data.refundAmount} has been credited to your wallet.`);
    } else if (data.type === "PARTIAL") {
      alert(`Booking cancelled. NPR ${data.refundAmount} has been credited to your wallet (50% refund).`);
    } else if (data.type === "NONE") {
      alert("Booking cancelled. This cancellation is not eligible for refund.");
    } else if (data.type === "STARTED") {
      alert("This session had already started, so it was marked as completed.");
    }

    setBookings((prev) => prev.filter((b) => b.id !== id));
  }

  if (loading)
    return <p className="text-[#004B4B] font-medium">Loading sessions...</p>;

  if (bookings.length === 0)
    return <p className="text-gray-600">You have not booked any sessions yet.</p>;
const filteredBookings = bookings.filter((b) => {
  const statusMatch =
    statusFilter === "ALL" || b.status === statusFilter;

  const paymentMatch =
    paymentFilter === "ALL" || b.paymentStatus === paymentFilter;

  return statusMatch && paymentMatch;
});

const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

const startIndex = (currentPage - 1) * itemsPerPage;

const paginatedBookings = filteredBookings.slice(
  startIndex,
  startIndex + itemsPerPage
);


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#004B4B]">My Sessions</h1>

<div className="flex items-center gap-6 flex-wrap mt-2">

  {/* STATUS */}
  <div className="flex items-center gap-2">
    <span className="text-xs text-gray-500">Status:</span>

    {["ALL", "COMPLETED", "CANCELLED", "EXPIRED"].map((s) => (
      <button
        key={s}
        onClick={() => setStatusFilter(s as any)}
        className={`px-3 py-1 text-xs rounded-full border ${
          statusFilter === s
            ? "bg-[#004B4B] text-white"
            : "bg-white text-gray-600"
        }`}
      >
        {s}
      </button>
    ))}
  </div>

  {/* PAYMENT */}
  <div className="flex items-center gap-2">
    <span className="text-xs text-gray-500">Payment:</span>

    {["ALL", "PARTIALLY_PAID", "FULLY_PAID"].map((p) => (
      <button
        key={p}
        onClick={() => setPaymentFilter(p as any)}
        className={`px-3 py-1 text-xs rounded-full border ${
          paymentFilter === p
            ? "bg-yellow-500 text-white"
            : "bg-white text-gray-600"
        }`}
      >
        {p === "PARTIALLY_PAID"
          ? "HALF"
          : p === "FULLY_PAID"
          ? "FULL"
          : "ALL"}
      </button>
    ))}
  </div>

</div>

<div className="border-b my-3" />


{/* SESSION LIST */}
      <div className="space-y-4">
        {paginatedBookings.map((b) => {
          const expired = isExpired(b);
          const badge = getStatusBadge(b.status, b.paymentStatus);

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

              {/* RIGHT (UPDATED CLEAN UI) */}
              <div className="flex flex-col items-end gap-2">

                {/* JOIN */}
                {!expired &&
                  b.status === "READY" &&
                  b.meetingRoom &&
                  (
                    (b.sessionType === "ONE_TO_ONE" &&
                      (b.paymentStatus === "FULLY_PAID" ||
                        b.paymentStatus === "PARTIALLY_PAID")) ||
                    (b.sessionType === "GROUP" &&
                      b.paymentStatus === "FULLY_PAID")
                  ) && (
                    <button
                      onClick={() =>
                        router.push(`/session/${b.meetingRoom}?role=student`)
                      }
                      className="px-4 py-2 rounded-full text-sm font-semibold bg-[#004B4B] text-white"
                    >
                      Join
                    </button>
                )}

                {/* REVIEW */}
                {b.status === "COMPLETED" && (
                  <button
                    onClick={() => router.push(`/dashboard/review/${b.id}`)}
                    className="px-3 py-1 text-sm rounded-full bg-[#E6F9F5] text-[#004B4B] font-medium"
                  >
                    Review
                  </button>
                )}

                {/* VIEW DETAILS (NEW MAIN BUTTON) */}
                <button
  onClick={() => router.push(`/dashboard/sessions/${b.id}`)}
  className="text-sm font-medium text-[#004B4B] hover:underline"
>
  View Details →
</button>

                {/* STATUS ONLY */}
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${badge.className}`}
                >
                  {badge.text}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* PAGINATION (UNCHANGED) */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-full border disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-full border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* CANCEL MODAL (UNCHANGED) */}
      {confirmCancelId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[350px] shadow-lg">
            <h2 className="text-lg font-semibold text-[#004B4B] mb-2">
              Cancel Booking?
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to cancel this booking?
            </p>

            <div className="text-xs text-gray-500 space-y-1 mb-5">
              <p>• More than 12 hours before → Full refund</p>
              <p>• Within 12 hours → 50% refund</p>
              <p>• After session starts → No refund</p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmCancelId(null)}
                className="px-3 py-1 text-sm rounded bg-gray-200"
              >
                No
              </button>

              <button
                onClick={() => {
                  cancelBooking(confirmCancelId);
                  setConfirmCancelId(null);
                }}
                className="px-3 py-1 text-sm rounded bg-red-500 text-white"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
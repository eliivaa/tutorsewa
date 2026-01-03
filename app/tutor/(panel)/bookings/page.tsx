// "use client";

// import { useEffect, useState } from "react";

// export default function TutorBookingsPage() {
//   const [bookings, setBookings] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("/api/tutor/bookings")
//       .then((res) => res.json())
//       .then((data) => setBookings(data.bookings || []))
//       .finally(() => setLoading(false));
//   }, []);

//   async function updateStatus(id: string, status: string) {
//     await fetch(`/api/tutor/bookings/${id}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ status }),
//     });

//     setBookings((prev) =>
//       prev.map((b) => (b.id === id ? { ...b, status } : b))
//     );
//   }

//   if (loading) return <p>Loading bookings...</p>;

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-semibold">Bookings</h1>

//       {bookings.map((b) => (
//         <div key={b.id} className="border rounded-xl p-4 bg-white">
//           <p className="font-semibold">{b.student.name}</p>
//           <p className="text-sm text-gray-600">
//             {new Date(b.startTime).toLocaleString()} • {b.sessionType}
//           </p>
//           <p className="text-sm text-gray-500">{b.note}</p>

//           {b.status === "REQUESTED" && (
//             <div className="mt-3 flex gap-2">
//               <button
//                 onClick={() => updateStatus(b.id, "CONFIRMED")}
//                 className="px-3 py-1 bg-green-500 text-white rounded"
//               >
//                 Accept
//               </button>
//               <button
//                 onClick={() => updateStatus(b.id, "REJECTED")}
//                 className="px-3 py-1 bg-red-500 text-white rounded"
//               >
//                 Reject
//               </button>
//             </div>
//           )}

//           <span className="text-xs text-gray-600 mt-2 block">
//             Status: {b.status}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";

export default function TutorBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tutor/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data.bookings || []))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/tutor/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  }

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#004B4B]">
        Booking Requests
      </h1>

      {bookings.map((b) => (
        <div
          key={b.id}
          className="bg-white border rounded-2xl p-5 flex justify-between items-center"
        >
          {/* LEFT */}
          <div className="flex gap-4 items-center">
            {/* Avatar */}
            <img
              src={b.student.image || "/avatar.png"}
              alt="Student"
              className="w-12 h-12 rounded-full object-cover"
            />

            <div>
              <p className="font-semibold text-[#004B4B]">
                {b.student.name}
              </p>

              <p className="text-sm text-gray-600">
                {new Date(b.startTime).toLocaleString()}
              </p>

              {/* Session type pill */}
              <span
                className={`inline-block mt-1 px-3 py-0.5 text-xs rounded-full font-medium
                ${
                  b.sessionType === "ONE_TO_ONE"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {b.sessionType === "ONE_TO_ONE"
                  ? "1-to-1 Session"
                  : "Group Session"}
              </span>
            </div>
          </div>

          {/* RIGHT */}
         {/* RIGHT */}
<div className="flex items-center gap-3">
  {b.status === "REQUESTED" ? (
    <>
      {/* ACCEPT */}
      <button
        onClick={() => updateStatus(b.id, "CONFIRMED")}
        className="
          px-5 py-2 rounded-full text-sm font-semibold
          bg-green-100 text-green-700
          hover:bg-green-200 transition
          focus:outline-none
        "
      >
        Accept
      </button>

      {/* REJECT */}
      <button
        onClick={() => updateStatus(b.id, "REJECTED")}
        className="
          px-5 py-2 rounded-full text-sm font-semibold
          bg-red-100 text-red-600
          hover:bg-red-200 transition
          focus:outline-none
        "
      >
        Reject
      </button>
    </>
  ) : (
    <span
      className={`px-5 py-2 rounded-full text-xs font-semibold ${
        b.status === "CONFIRMED"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {b.status}
    </span>
  )}
</div>

        </div>
      ))}
    </div>
  );
}

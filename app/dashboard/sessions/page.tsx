// "use client";

// import { useEffect, useState } from "react";

// interface Booking {
//   id: string;
//   status: string;
//   sessionType: string;
//   bookingDate: string;
//   startTime: string;
//   durationMin: number;
//   tutor: {
//     name: string;
//   };
// }

// export default function MySessionsPage() {
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("/api/bookings/student") 
//       .then((res) => res.json())
//       .then((data) => setBookings(data.bookings || []))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) {
//     return <p className="text-[#004B4B]">Loading sessions...</p>;
//   }

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-semibold text-[#004B4B]">
//         My Sessions
//       </h1>

//       {bookings.length === 0 ? (
//         <p className="text-gray-600">
//           You have not booked any sessions yet.
//         </p>
//       ) : (
//         <div className="space-y-4">
//           {bookings.map((b) => (
//             <div
//               key={b.id}
//               className="bg-white border rounded-xl p-5 flex justify-between items-center"
//             >
//               <div>
//                 <p className="font-semibold text-[#004B4B]">
//                   {b.tutor.name}
//                 </p>

//                 <p className="text-sm text-gray-600">
//                   {new Date(b.bookingDate).toDateString()} •{" "}
//                   {new Date(b.startTime).toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </p>

//                 <p className="text-sm text-gray-500">
//                   {b.sessionType === "ONE_TO_ONE"
//                     ? "1-to-1 Session"
//                     : "Group Session"}{" "}
//                   • {b.durationMin} min
//                 </p>
//               </div>

//               <span
//                 className={`px-3 py-1 text-xs rounded-full font-medium ${
//                   b.status === "CONFIRMED"
//                     ? "bg-green-100 text-green-700"
//                     : b.status === "PAYMENT_PENDING"
//                     ? "bg-yellow-100 text-yellow-700"
//                     : b.status === "REJECTED"
//                     ? "bg-red-100 text-red-600"
//                     : "bg-gray-100 text-gray-600"
//                 }`}
//               >
//                 {b.status.replace("_", " ")}
//               </span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";

interface Booking {
  id: string;
  status: string;
  sessionType: "ONE_TO_ONE" | "GROUP";
  bookingDate: string;
  startTime: string;
  durationMin: number;
  tutor: {
    name: string;
    photo?: string | null;
  };
}

export default function MySessionsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings/student")
      .then((res) => res.json())
      .then((data) => setBookings(data.bookings || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-[#004B4B]">Loading sessions...</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#004B4B]">
        My Sessions
      </h1>

      {bookings.length === 0 ? (
        <p className="text-gray-600">
          You have not booked any sessions yet.
        </p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white border rounded-xl p-5 flex justify-between items-center hover:shadow-md transition"
            >
              {/* LEFT: Tutor avatar + session info */}
              <div className="flex items-start gap-4">
                {/* Tutor Avatar */}
                <img
                  src={b.tutor.photo || "/avatar.png"}
                  alt={b.tutor.name}
                  className="w-12 h-12 rounded-full object-cover border"
                />

                {/* Session Details */}
                <div>
                  <p className="font-semibold text-[#004B4B]">
                    {b.tutor.name}
                  </p>

                  <p className="text-sm text-gray-600">
                    {new Date(b.bookingDate).toDateString()} •{" "}
                    {new Date(b.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    {/* Session Type Pill */}
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        b.sessionType === "ONE_TO_ONE"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {b.sessionType === "ONE_TO_ONE"
                        ? "1-to-1 Session"
                        : "Group Session"}
                    </span>

                    <span className="text-sm text-gray-500">
                      {b.durationMin} min
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT: Status */}
              <span
                className={`px-3 py-1 text-xs rounded-full font-medium ${
                  b.status === "CONFIRMED"
                    ? "bg-green-100 text-green-700"
                    : b.status === "PAYMENT_PENDING"
                    ? "bg-yellow-100 text-yellow-700"
                    : b.status === "REJECTED"
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {b.status.replace("_", " ")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

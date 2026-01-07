"use client";

import { useEffect, useState } from "react";

interface Booking {
  id: string;
  status: string;
  sessionType: "ONE_TO_ONE" | "GROUP";
  bookingDate: string;
  startTime: string;
  subject: string; // ✅ ADD THIS
  level?: string; 
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
              {/* LEFT */}
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
      {new Date(b.bookingDate).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}{" "}
      ·{" "}
      {new Date(b.startTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </p>

    <div className="flex items-center gap-2 mt-1">
      {/* Subject + Grade */}
     <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
  {b.subject}
  {b.level ? ` | ${b.level}` : ""}
</span>


      {/* Session Type */}
      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
        {b.sessionType === "ONE_TO_ONE" ? "1-to-1" : "Group"}
      </span>
    </div>
  </div>
</div>


              {/* STATUS */}
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

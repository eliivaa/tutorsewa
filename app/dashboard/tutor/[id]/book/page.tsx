"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

/* ======================
   TYPES
====================== */

type SessionType = "ONE_TO_ONE" | "GROUP";

type AvailabilitySlot = {
  id: string;
  date: string;
  subject: string;
  level?: string | null;
  startTime: string;
  endTime: string;
  durationMin: number;
  sessionType: SessionType;
  maxStudents?: number | null;
};

/* ======================
   HELPERS
====================== */

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* ======================
   COMPONENT
====================== */

export default function BookSessionPage() {
  const { id: tutorId } = useParams();
  const router = useRouter();

  const [sessionType, setSessionType] =
    useState<SessionType>("ONE_TO_ONE");

  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [subject, setSubject] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] =
    useState<AvailabilitySlot | null>(null);

  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  /* ======================
     LOAD AVAILABILITY
  ====================== */

  async function loadAvailability() {
    setSelectedDate(null);
    setSelectedSlot(null);

    const res = await fetch(
      `/api/tutor/availability/${tutorId}?sessionType=${sessionType}`,
      { cache: "no-store" }
    );

    const data = await res.json();
    if (!res.ok) {
      alert(data?.error || "Failed to load availability");
      return;
    }

    setSlots(data.slots || []);

    // auto-pick first subject
    const subjects = Array.from(
      new Set((data.slots || []).map((s: AvailabilitySlot) => s.subject))
    );
   setSubject((subjects[0] || null) as string | null);

  }

  useEffect(() => {
    loadAvailability();
  }, [sessionType]);

  /* ======================
     SUBJECT FILTER
  ====================== */

  const subjects = useMemo(() => {
    return Array.from(new Set(slots.map((s) => s.subject)));
  }, [slots]);

  const subjectSlots = slots.filter(
    (s) => !subject || s.subject === subject
  );

  /* ======================
     GROUP BY DATE
  ====================== */

  const groupedByDate = useMemo(() => {
    const map: Record<string, AvailabilitySlot[]> = {};
    for (const slot of subjectSlots) {
      (map[slot.date] ||= []).push(slot);
    }
    return map;
  }, [subjectSlots]);

  const availableDates = Object.keys(groupedByDate).sort();

  /* ======================
     SUBMIT BOOKING
  ====================== */

  async function submitBooking() {
  if (!selectedSlot) {
    alert("Please select a time slot");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tutorId,
        availabilityId: selectedSlot.id,
        sessionType,
        subject: selectedSlot.subject, // ✅ FIX
        level: selectedSlot.level,     // ✅ FIX
        note,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data?.error || "Booking failed");
      return;
    }

    router.push("/dashboard/sessions");
  } finally {
    setLoading(false);
  }
}

  /* ======================
     UI
  ====================== */

  return (
    <div className="max-w-4xl space-y-6">

      <h1 className="text-2xl font-semibold text-[#004B4B]">
        Book a Session
      </h1>

      {/* SESSION TYPE */}
      <div className="bg-white border rounded-xl p-5">
        <p className="font-medium mb-3">Session type</p>
        <div className="flex gap-3">
          {(["ONE_TO_ONE", "GROUP"] as SessionType[]).map((type) => (
            <button
              key={type}
              onClick={() => setSessionType(type)}
              className={`px-4 py-2 rounded-lg border ${
                sessionType === type
                  ? "bg-[#4CB6B6] text-white"
                  : "hover:bg-[#E6F9F5]"
              }`}
            >
              {type === "ONE_TO_ONE" ? "1-to-1 Online Class" : "Group Online Class"}
            </button>
          ))}
        </div>
      </div>

      {/* SUBJECT */}
      {subjects.length > 0 && (
        <div className="bg-white border rounded-xl p-5">
          <p className="font-medium mb-3">Choose subject</p>
          <div className="flex gap-2 flex-wrap">
            {subjects.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSubject(s);
                  setSelectedDate(null);
                  setSelectedSlot(null);
                }}
                className={`px-4 py-2 rounded-lg border ${
                  subject === s
                    ? "bg-[#4CB6B6] text-white"
                    : "hover:bg-[#E6F9F5]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* DATES */}
      <div className="bg-white border rounded-xl p-5">
        <p className="font-medium mb-3">Available dates</p>

        {availableDates.length === 0 ? (
          <p className="text-sm text-gray-500">No slots available.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availableDates.map((date) => (
              <button
                key={date}
                onClick={() => {
                  setSelectedDate(date);
                  setSelectedSlot(null);
                }}
                className={`px-4 py-2 rounded-lg border ${
                  selectedDate === date
                    ? "bg-[#4CB6B6] text-white"
                    : "hover:bg-[#E6F9F5]"
                }`}
              >
                {formatDate(date)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TIME SLOTS */}
      {selectedDate && (
        <div className="bg-white border rounded-xl p-5">
          <p className="font-medium mb-3">Available time slots</p>

          <div className="flex flex-wrap gap-2">
            {groupedByDate[selectedDate]?.map((slot) => (
              <button
                key={slot.id}
                onClick={() => setSelectedSlot(slot)}
                className={`px-4 py-2 text-sm rounded-lg border ${
                  selectedSlot?.id === slot.id
                    ? "bg-[#4CB6B6] text-white"
                    : "hover:bg-[#E6F9F5]"
                }`}
              >
                {slot.startTime} – {slot.endTime}
                {slot.level && (
                  <span className="ml-1 text-xs opacity-80">
                    ({slot.level})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* NOTE */}
      <div className="bg-white border rounded-xl p-5">
        <p className="font-medium mb-2">Note (optional)</p>
        <textarea
          className="w-full border rounded-lg p-3 text-sm"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {/* ACTION */}
      <div className="flex justify-end">
        <button
          onClick={submitBooking}
          disabled={loading || !selectedSlot}
          className="px-6 py-2 bg-[#4CB6B6] text-white rounded-lg disabled:opacity-50"
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}

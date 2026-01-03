"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

/* ======================
   TYPES
====================== */

type SessionType = "ONE_TO_ONE" | "GROUP";

type AvailabilitySlot = {
  id: string;
  dayOfWeek:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
  startTime: string; // HH:MM
  endTime: string;
  durationMin: number;
  sessionType: SessionType;
  maxStudents?: number | null;
};

const DAY_LABEL: Record<string, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

export default function BookSessionPage() {
  const { id: tutorId } = useParams();
  const router = useRouter();

  const [sessionType, setSessionType] =
    useState<SessionType>("ONE_TO_ONE");

  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedSlot, setSelectedSlot] =
    useState<AvailabilitySlot | null>(null);

  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  /* ======================
     LOAD AVAILABILITY
  ====================== */

  async function loadAvailability(type: SessionType) {
    setSelectedSlot(null);

    try {
      const res = await fetch(
        `/api/tutor/availability/${tutorId}?sessionType=${type}`,
        { cache: "no-store" }
      );

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      if (!res.ok) {
        alert(data?.error || "Failed to load availability");
        setSlots([]);
        return;
      }

      setSlots(data?.slots || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load availability");
      setSlots([]);
    }
  }

  useEffect(() => {
    loadAvailability(sessionType);
  }, [sessionType]);

  /* ======================
     GROUP BY DAY
  ====================== */

  const grouped = useMemo(() => {
    const map: Record<string, AvailabilitySlot[]> = {};
    for (const s of slots) {
      (map[s.dayOfWeek] ||= []).push(s);
    }
    return map;
  }, [slots]);

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
    await fetch("/api/bookings", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    tutorId,
    availabilityId: selectedSlot.id, // ✅ REQUIRED (MAIN FIX)
    sessionType,
    subject: "General",
    bookingDate: new Date().toISOString().split("T")[0],
    startTime: selectedSlot.startTime,
    durationMin: selectedSlot.durationMin,
    packageType: "SINGLE_SESSION",
    maxStudents:
      sessionType === "GROUP"
        ? selectedSlot.maxStudents
        : 1,
    note,
  }),
});


      router.push("/dashboard/sessions");
    } catch (err) {
      console.error(err);
      alert("Booking failed");
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
        <p className="font-medium mb-3">Choose session type</p>

        <div className="flex gap-3">
          {(["ONE_TO_ONE", "GROUP"] as SessionType[]).map((type) => (
            <button
              key={type}
              onClick={() => setSessionType(type)}
              className={`px-4 py-2 rounded-lg border transition ${
                sessionType === type
                  ? "bg-[#4CB6B6] text-white"
                  : "hover:bg-[#E6F9F5]"
              }`}
            >
              {type === "ONE_TO_ONE"
                ? "1-to-1 Online Class"
                : "Group Online Class"}
            </button>
          ))}
        </div>
      </div>

      {/* AVAILABILITY */}
      <div className="bg-white border rounded-xl p-5">
        <p className="font-medium mb-3">Available time slots</p>

        {slots.length === 0 ? (
          <p className="text-sm text-gray-500">
            No availability for this session type.
          </p>
        ) : (
          <div className="space-y-4">
            {Object.keys(grouped).map((day) => (
              <div key={day}>
                <p className="font-medium text-[#004B4B] mb-2">
                  {DAY_LABEL[day]}
                </p>

                <div className="flex flex-wrap gap-2">
                  {grouped[day].map((slot) => {
                    const active =
                      selectedSlot?.id === slot.id;

                    return (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot)}
                        className={`px-4 py-2 text-sm rounded-lg border transition ${
                          active
                            ? "bg-[#4CB6B6] text-white"
                            : "hover:bg-[#E6F9F5]"
                        }`}
                      >
                        {slot.startTime} – {slot.endTime}{" "}
                        {slot.sessionType === "GROUP" &&
                          slot.maxStudents && (
                            <span className="ml-1 text-xs opacity-80">
                              (max {slot.maxStudents})
                            </span>
                          )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* NOTE */}
      <div className="bg-white border rounded-xl p-5">
        <p className="font-medium mb-2">Additional note (optional)</p>
        <textarea
          className="w-full border rounded-lg p-3 text-sm"
          placeholder="Briefly describe your goals..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {/* ACTION */}
      <div className="flex justify-end">
        <button
          onClick={submitBooking}
          disabled={loading || !selectedSlot}
          className="px-6 py-2 bg-[#4CB6B6] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Booking..." : "Confirm & Continue"}
        </button>
      </div>
    </div>
  );
}

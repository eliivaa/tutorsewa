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

type TabType = "REQUESTS" | "ONE_TO_ONE" | "GROUP" | "HISTORY";

type Booking = {
  id: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  startTime: string;
  sessionType: SessionType;
  meetingRoom?: string | null;
  durationMin?: number;
  student?: {
    name: string;
    image?: string | null;
  };
};

export default function TutorBookingsPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabType>("REQUESTS");
 const [confirmCancel, setConfirmCancel] = useState<{
  id: string;
  paymentStatus: PaymentStatus;
} | null>(null);

  /* ================= HELPERS ================= */

function isExpired(b: Booking) {
  const now = new Date();
  const start = new Date(b.startTime);

  const duration = b.durationMin ?? 120; // fallback
  const end = new Date(start.getTime() + duration * 60000);

  return now > end;
}

  function paymentBadge(status: PaymentStatus) {
    if (status === "FULLY_PAID") {
      return (
        <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
          FULL PAID
        </span>
      );
    }

    if (status === "PARTIALLY_PAID") {
      return (
        <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700">
          HALF PAID
        </span>
      );
    }

    return (
      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
        UNPAID
      </span>
    );
  }

  /* ================= FETCH ================= */

  async function loadBookings() {
    try {
      setLoading(true);

      const res = await fetch("/api/tutor/bookings", {
        credentials: "include",
      });

      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error("LOAD BOOKINGS ERROR:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  /* ================= ACTIONS ================= */

 async function updateStatus(id: string, action: "ACCEPT" | "REJECT") {
  try {
    console.log("CLICK:", id, action);

    const res = await fetch(`/api/tutor/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
      credentials: "include",
    });

    const data = await res.json();

    console.log("API RESPONSE:", data);

    if (!res.ok) {
      alert(data.error || "Failed to update booking");
      return;
    }

    loadBookings();
  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);
  }
}

  async function startSession(id: string) {
    try {
      const res = await fetch(`/api/tutor/bookings/${id}/start-session`, {
        method: "PATCH",
        credentials: "include",
      });

      const data = await res.json();

      console.log("START RESPONSE:", data);

      if (!data.room) {
       alert(data.error || "Room not created!");
        return;
      }

      router.push(`/session/${data.room}?role=tutor`);
    } catch (error) {
      console.error("START SESSION ERROR:", error);
      alert("Failed to start session");
    }
  }

  async function completeSession(id: string) {
    try {
      await fetch(`/api/tutor/bookings/${id}/complete`, {
        method: "PATCH",
        credentials: "include",
      });

      loadBookings();
    } catch (error) {
      console.error("COMPLETE SESSION ERROR:", error);
    }
  }
async function cancelSession(
  id: string,
  paymentStatus: PaymentStatus
) {
  try {
    const res = await fetch(`/api/tutor/bookings/${id}/cancel`, {
      method: "PATCH",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to cancel session");
      return;
    }

    if (paymentStatus === "UNPAID") {
      alert("Session cancelled. No payment was made.");
    } else {
      alert("Session cancelled. Full refund has been credited to the student.");
    }

    loadBookings();
  } catch (error) {
    console.error("CANCEL SESSION ERROR:", error);
    alert("Something went wrong");
  }
}

  /* ================= FILTERS ================= */

  // REQUEST TAB:
  // show actual requests + rejected history + accepted history
  const requests = bookings.filter(
    (b) =>
      b.status === "REQUESTED" ||
      b.status === "REJECTED" ||
      b.status === "PAYMENT_PENDING" ||
      b.status === "READY"
  );

  // ACTIVE 1-TO-1 TAB
  const oneToOneBookings = bookings.filter(
    (b) =>
      b.sessionType === "ONE_TO_ONE" &&
      (b.status === "PAYMENT_PENDING" || b.status === "READY")
  );

  // ACTIVE GROUP TAB
  const groupBookings = bookings.filter(
    (b) =>
      b.sessionType === "GROUP" &&
      (b.status === "PAYMENT_PENDING" || b.status === "READY")
  );

  // HISTORY TAB
  const history = bookings.filter(
    (b) =>
      b.status === "CANCELLED" ||
      b.status === "COMPLETED" ||
      b.status === "EXPIRED"
  );

  // GROUP BY TIME FOR GROUP TAB
  const groupedByTime =
    tab === "GROUP"
      ? groupBookings.reduce((acc, b) => {
          const key = b.startTime;
          if (!acc[key]) acc[key] = [];
          acc[key].push(b);
          return acc;
        }, {} as Record<string, Booking[]>)
      : {};

  // GROUP BY TIME FOR HISTORY TAB
  const groupHistory = history.filter((b) => b.sessionType === "GROUP");
  const oneToOneHistory = history.filter(
    (b) => b.sessionType === "ONE_TO_ONE"
  );

  const groupedHistoryByTime =
    tab === "HISTORY"
      ? groupHistory.reduce((acc, b) => {
          const key = b.startTime;
          if (!acc[key]) acc[key] = [];
          acc[key].push(b);
          return acc;
        }, {} as Record<string, Booking[]>)
      : {};

  if (loading) {
    return <p>Loading bookings...</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#004B4B]">
        Tutor Bookings
      </h1>

      {/* TABS */}
      <div className="flex gap-2 flex-wrap">
        {["REQUESTS", "ONE_TO_ONE", "GROUP", "HISTORY"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as TabType)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              tab === t
                ? "bg-[#004B4B] text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {t === "REQUESTS"
              ? "Booking Requests"
              : t === "ONE_TO_ONE"
              ? "1-to-1 Online Class"
              : t === "GROUP"
              ? "Group Online Class"
              : "History"}
          </button>
        ))}
      </div>

      {/* ================= REQUESTS ================= */}

      {tab === "REQUESTS" && requests.length === 0 && (
        <p className="text-gray-500">No booking requests found.</p>
      )}

      {tab === "REQUESTS" &&
        requests.map((b) => (
          <SingleCard
            key={b.id}
            tab={tab}
            b={b}
            isExpired={isExpired}
            updateStatus={updateStatus}
            startSession={startSession}
            completeSession={completeSession}
            cancelSession={cancelSession}
            router={router}
            paymentBadge={paymentBadge}
            setConfirmCancel={setConfirmCancel}
          />
        ))}

      {/* ================= ONE TO ONE ================= */}

      {tab === "ONE_TO_ONE" && oneToOneBookings.length === 0 && (
        <p className="text-gray-500">No 1-to-1 active sessions found.</p>
      )}

      {tab === "ONE_TO_ONE" &&
        oneToOneBookings.map((b) => (
          <SingleCard
          tab={tab}
            key={b.id}
            b={b}
            isExpired={isExpired}
            updateStatus={updateStatus}
            startSession={startSession}
            completeSession={completeSession}
            cancelSession={cancelSession}
            router={router}
            paymentBadge={paymentBadge}
            setConfirmCancel={setConfirmCancel}
          />
        ))}

      {/* ================= GROUP ================= */}

      {tab === "GROUP" && Object.keys(groupedByTime).length === 0 && (
        <p className="text-gray-500">No group active sessions found.</p>
      )}

      {tab === "GROUP" &&
        Object.entries(groupedByTime).map(([time, list]) => {
          const expired = isExpired(list[0]);

          const requested = list.filter((b) => b.status === "REQUESTED");

          const paid = list.filter(
            (b) =>
              b.status !== "REQUESTED" &&
              b.status !== "REJECTED" &&
              b.status !== "CANCELLED" &&
              b.status !== "EXPIRED" &&
              b.paymentStatus === "FULLY_PAID"
          );

          const unpaid = list.filter(
            (b) =>
              b.status !== "REQUESTED" &&
              b.status !== "REJECTED" &&
              b.status !== "CANCELLED" &&
              b.status !== "EXPIRED" &&
              b.paymentStatus !== "FULLY_PAID"
          );

          const activeStudents = list.filter(
            (b) =>
              b.status !== "REQUESTED" &&
              b.status !== "REJECTED" &&
              b.status !== "CANCELLED" &&
              b.status !== "EXPIRED" &&
              (b.paymentStatus === "FULLY_PAID" ||
                b.paymentStatus === "PARTIALLY_PAID")
          );

          return (
            <div
              key={time}
              className="bg-white border rounded-2xl p-5 shadow-sm"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-[#004B4B]">
                  Group Session
                </h3>

                {expired && (
                  <span className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-600">
                    EXPIRED
                  </span>
                )}
              </div>

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
                      <div className="flex items-center gap-3">
                        {b.student?.image ? (
                          <img
                            src={b.student.image}
                            className="w-10 h-10 rounded-full object-cover"
                            alt={b.student?.name || "student"}
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

                            {b.status === "CANCELLED" && (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700">
                                CANCELLED
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

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
                              alt={b.student?.name || "student"}
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

                              {studentExpired && b.status !== "COMPLETED" && (
                                <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-600">
                                  EXPIRED
                                </span>
                              )}

                              {b.status === "CANCELLED" && (
                                <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700">
                                  CANCELLED
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
                              alt={b.student?.name || "student"}
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

                              {b.status === "CANCELLED" && (
                                <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700">
                                  CANCELLED
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
              {activeStudents.length > 0 && !expired && (
                <div className="flex gap-3 justify-end mt-5">
                  {!list[0].meetingRoom && (
                    <>
                      <button
                        onClick={() => startSession(activeStudents[0].id)}
                        className="px-5 py-2 rounded-full bg-[#004B4B] text-white"
                      >
                        Start
                      </button>

                    <button
 onClick={() =>
  setConfirmCancel({
    id: activeStudents[0].id,
    paymentStatus: activeStudents[0].paymentStatus,
  })
}
  className="px-5 py-2 rounded-full bg-red-100 text-red-700"
>
  Cancel Session
</button>
                    </>
                  )}

                  {list[0].meetingRoom && (
                    <>
                      <button
                        onClick={() =>
                          router.push(
                            `/session/${list[0].meetingRoom}?role=tutor`
                          )
                        }
                        className="px-5 py-2 rounded-full bg-[#004B4B] text-white"
                      >
                        Join
                      </button>

                      <button
                        onClick={() => completeSession(activeStudents[0].id)}
                        className="px-5 py-2 rounded-full bg-green-600 text-white"
                      >
                        Complete
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}

      {/* ================= HISTORY ================= */}

      {tab === "HISTORY" && history.length === 0 && (
        <p className="text-gray-500">No history found.</p>
      )}

      {tab === "HISTORY" &&
        Object.keys(groupedHistoryByTime).length > 0 &&
        Object.entries(groupedHistoryByTime).map(([time, list]) => {
          const allCompleted = list.every((b) => b.status === "COMPLETED");
          const allCancelled = list.every((b) => b.status === "CANCELLED");
          const allExpired = list.every((b) => b.status === "EXPIRED");

          return (
            <div
              key={time}
              className="bg-white border rounded-2xl p-5 shadow-sm"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-[#004B4B]">
                  Group Session
                </h3>

                <div className="flex gap-2 flex-wrap">
                  <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                    {list.length} Students
                  </span>

                  {allCompleted && (
                    <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                      COMPLETED
                    </span>
                  )}

                  {allCancelled && (
                    <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700">
                      CANCELLED
                    </span>
                  )}

                  {allExpired && (
                    <span className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-600">
                      EXPIRED
                    </span>
                  )}

                  {!allCompleted && !allCancelled && !allExpired && (
                    <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                      MIXED
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                {new Date(time).toLocaleString()}
              </p>

              {list.map((b) => (
                <div
                  key={b.id}
                  className="flex justify-between items-center border rounded-xl p-4 mb-2"
                >
                  <div className="flex gap-4 items-center">
                    {b.student?.image ? (
                      <img
                        src={b.student.image}
                        className="w-12 h-12 rounded-full object-cover"
                        alt={b.student?.name || "student"}
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

                      <div className="flex gap-2 mt-1 flex-wrap">
                        {paymentBadge(b.paymentStatus)}

                        {b.status === "COMPLETED" && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                            COMPLETED
                          </span>
                        )}

                        {b.status === "CANCELLED" && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700">
                            CANCELLED
                          </span>
                        )}

                        {b.status === "EXPIRED" && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-600">
                            EXPIRED
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}

      {tab === "HISTORY" &&
        oneToOneHistory.map((b) => (
          <SingleCard
          tab={tab}
            key={b.id}
            b={b}
            isExpired={isExpired}
            updateStatus={updateStatus}
            startSession={startSession}
            completeSession={completeSession}
            cancelSession={cancelSession}
            router={router}
            paymentBadge={paymentBadge}
            setConfirmCancel={setConfirmCancel}
          />
        ))}

        {confirmCancel && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
    <div className="bg-white rounded-xl p-6 w-[360px] shadow-lg">
      <h2 className="text-lg font-semibold text-[#004B4B] mb-2">
        Cancel Session?
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        Are you sure you want to cancel this session?
      </p>

      <div className="text-xs text-gray-500 space-y-1 mb-5">
  {confirmCancel.paymentStatus === "UNPAID" ? (
    <p>• No payment has been made. No refund involved.</p>
  ) : (
    <p>• The student will receive a full refund.</p>
  )}
  <p>• This action cannot be undone</p>
</div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setConfirmCancel(null)}
          className="px-3 py-1 text-sm rounded bg-gray-200"
        >
          No
        </button>

        <button
          onClick={async () => {
          await cancelSession(
  confirmCancel!.id,
  confirmCancel!.paymentStatus
);;
            setConfirmCancel(null);
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

/* ================= SINGLE CARD ================= */

function SingleCard({
  b,
  tab,
  isExpired,
  updateStatus,
  startSession,
  completeSession,
  cancelSession,
  router,
  paymentBadge,
  setConfirmCancel,
}: {
  b: Booking;
 tab: TabType;
  isExpired: (b: Booking) => boolean;
  updateStatus: (id: string, action: "ACCEPT" | "REJECT") => Promise<void>;
  startSession: (id: string) => Promise<void>;
  completeSession: (id: string) => Promise<void>;
 cancelSession: (
  id: string,
  paymentStatus: PaymentStatus
) => Promise<void>;
  router: ReturnType<typeof useRouter>;
  paymentBadge: (status: PaymentStatus) => JSX.Element;
 setConfirmCancel: (data: {
  id: string;
  paymentStatus: PaymentStatus;
}) => void;
}) {
  const expired = isExpired(b);

  return (
    <div className="bg-white border rounded-2xl p-5 flex justify-between items-center">
      <div>
        <div className="flex gap-4 items-center">
          {b.student?.image ? (
            <img
              src={b.student.image}
              className="w-12 h-12 rounded-full object-cover"
              alt={b.student?.name || "student"}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
              {b.student?.name?.charAt(0) ?? "?"}
            </div>
          )}

          <div>
            <p className="font-semibold text-[#004B4B]">{b.student?.name}</p>

            <p className="text-sm text-gray-600">
              {new Date(b.startTime).toLocaleString()}
            </p>

            <div className="flex gap-2 mt-1 flex-wrap">
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${
                  b.sessionType === "GROUP"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {b.sessionType === "GROUP" ? "Group Session" : "1-to-1 Session"}
              </span>

              {paymentBadge(b.paymentStatus)}

              {b.status === "REJECTED" && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-600">
                  REJECTED
                </span>
              )}

              {b.status === "CANCELLED" && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700">
                  CANCELLED
                </span>
              )}

              {b.status === "COMPLETED" && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                  COMPLETED
                </span>
              )}

              {expired && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-600">
                  EXPIRED
                </span>
              )}

              {b.status === "PAYMENT_PENDING" && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-50 text-yellow-700">
                  ACCEPTED
                </span>
              )}

              {b.status === "READY" && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700">
                  READY
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 items-center flex-wrap justify-end">
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

    {/* {tab !== "REQUESTS" &&   //  ADD THIS LINE
  !expired &&
  (b.status === "READY" || b.status === "PAYMENT_PENDING") &&
  b.paymentStatus !== "UNPAID" && (
    <button
      onClick={() => startSession(b.id)}
      className="px-4 py-2 rounded-full bg-[#004B4B] text-white"
    >
      Start
    </button>
)} */}

{tab !== "REQUESTS" &&
  !expired &&
  (b.status === "READY" || b.status === "PAYMENT_PENDING") &&
  b.paymentStatus !== "UNPAID" &&
  !b.meetingRoom && ( 
    <button
      onClick={() => startSession(b.id)}
      className="px-4 py-2 rounded-full bg-[#004B4B] text-white"
    >
      Start
    </button>
)}

      {tab !== "REQUESTS" &&
  !expired &&
  b.status === "READY" &&
  b.meetingRoom &&
  b.paymentStatus !== "UNPAID" && (

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

       {(tab === "ONE_TO_ONE" || tab === "GROUP") &&   // ✅ TAB CONTROL
  !expired &&
  b.status !== "COMPLETED" &&
  b.status !== "REQUESTED" &&
  b.status !== "REJECTED" &&
  b.status !== "CANCELLED" && (
    <button
 onClick={() =>
  setConfirmCancel({
    id: b.id,
    paymentStatus: b.paymentStatus,
  })
}
  className="px-4 py-2 rounded-full bg-red-100 text-red-700"
>
  Cancel
</button>
)}



      </div>
      
    </div>
  );
}
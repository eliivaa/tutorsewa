"use client";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#f4f5f1] px-6 md:px-20 py-10 text-[#004B4B]">

      <h1 className="text-3xl font-bold mb-6">Help Center</h1>

      {/* INTRO */}
      <p className="mb-8 max-w-2xl">
        Welcome to TutorSewa Help Center. Here you can find answers to common
        questions about booking sessions, payments, and using the platform.
      </p>

      {/* BOOKINGS */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">📅 Booking a Session</h2>
        <p className="text-sm opacity-90">
          Students can request a session with a tutor. Once accepted, the booking
          moves to payment stage.
        </p>
      </div>

      {/* PAYMENTS */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">💳 Payments</h2>
        <p className="text-sm opacity-90">
          You can pay fully or partially to join a session. For group sessions,
          full payment is required before joining.
        </p>
      </div>

      {/* JOIN SESSION */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">🎥 Joining a Session</h2>
        <p className="text-sm opacity-90">
          Once the tutor starts the session, a Join button will appear. Click it
          to enter the live class.
        </p>
      </div>

      {/* CANCELLATION */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">❌ Cancellation & Refund</h2>
        <p className="text-sm opacity-90">
          If you cancel early, you may receive a full or partial refund in your
          wallet depending on the timing.
        </p>
      </div>

      {/* CONTACT */}
      <div className="mt-10 p-5 bg-white rounded-xl shadow-sm">
        <h2 className="font-semibold mb-2">Still need help?</h2>
        <p className="text-sm mb-3">
          If your issue is not listed here, feel free to contact us.
        </p>

        <a
          href="/#contact-us"
          className="inline-block px-4 py-2 bg-[#004B4B] text-white rounded-md text-sm"
        >
          Contact Support
        </a>
      </div>

    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

type PaymentItem = {
  paidAmount: number;
  status: "PENDING" | "HALF_PAID" | "FULL_PAID" | "FAILED" | "REMAINING_DUE";
};

type Booking = {
  id: string;
  subject: string;
  totalAmount: number;
  paymentStatus: "UNPAID" | "PARTIALLY_PAID" | "FULLY_PAID";
  payments?: PaymentItem[];
};

export default function PaymentPage() {
  const params = useParams();
  const searchParams = useSearchParams()!;

 const bookingId = params?.bookingId as string;

  const status = searchParams.get("status");
  const rawUuid = searchParams.get("uuid");
  const uuid = rawUuid?.split("?")[0] ?? null;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [useWallet, setUseWallet] = useState(false);

  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  /* ================= FETCH ================= */
  async function fetchData() {
  try {
    console.log("STEP 1: Fetch booking");

    const res1 = await fetch(`/api/bookings/${bookingId}`);

    console.log("STEP 2: Status =", res1.status);

    if (!res1.ok) {
      const err = await res1.text();
      console.error("BOOKING API ERROR:", err);
      throw new Error("Booking fetch failed");
    }

    const data1 = await res1.json();

    console.log("STEP 3: Booking data =", data1);

    // 🔥 FIX HERE (IMPORTANT)
    if (!data1.booking) {
      throw new Error("Booking missing in response");
    }

    setBooking(data1.booking);

   const res2 = await fetch(`/api/wallet`);

if (!res2.ok) {
  const text = await res2.text();
  console.error("WALLET ERROR RAW:", text);
  throw new Error("Wallet fetch failed");
}

const contentType = res2.headers.get("content-type");

if (!contentType?.includes("application/json")) {
  const text = await res2.text();
  console.error("WALLET RETURNED HTML:", text);
  throw new Error("Wallet returned HTML instead of JSON");
}

const data2 = await res2.json();

setWalletBalance(data2.walletBalance || 0);
  } catch (err) {
    console.error("FETCH ERROR:", err);
  } finally {
    console.log("STEP 4: Done loading");
    setLoading(false);
  }
}
/* ================= VERIFY ================= */
async function verifyPayment() {
  if (!uuid) return;

  setVerifying(true);

  try {
    const res = await fetch(
      `/api/payments/esewa/verify?uuid=${uuid}`
    );

    const contentType = res.headers.get("content-type");

    if (!res.ok || !contentType?.includes("application/json")) {
      const text = await res.text();
      console.error("VERIFY ERROR RAW:", text);
      return;
    }

    const data = await res.json();

    if (data.success) {
      setShowSuccess(true);
      await fetchData();
    }
  } catch (err) {
    console.error("VERIFY ERROR:", err);
  } finally {
    setVerifying(false);
  }
}

/* ================= EFFECT ================= */
useEffect(() => {
  if (!bookingId) return;

  fetchData();

  if (status === "success") {
    verifyPayment();
  }
}, [bookingId, status]);

/* ================= LOADING ================= */
if (loading) return <p className="p-6">Loading...</p>;
if (!booking) return <p className="p-6 text-red-500">Invalid booking</p>;

/* ================= CALC ================= */

function calculateAmounts(payMode: "HALF" | "FULL") {
  if (!booking) {
    return { baseAmount: 0, walletUsed: 0, remainingAmount: 0 };
  }

  const totalPaid =
    booking.payments
      ?.filter(
        (p) =>
          p.status === "HALF_PAID" ||
          p.status === "FULL_PAID" ||
          p.status === "REMAINING_DUE"
      )
      .reduce((sum, p) => sum + Number(p.paidAmount), 0) || 0;

  const actualRemaining = Math.max(booking.totalAmount - totalPaid, 0);

  let baseAmount = 0;

  if (booking.paymentStatus === "PARTIALLY_PAID") {
    // already paid something → only remaining is payable
    baseAmount = actualRemaining;
  } else {
    // first payment screen
    baseAmount =
      payMode === "HALF"
        ? Math.ceil(booking.totalAmount / 2)
        : booking.totalAmount;
  }

  const walletUsed = useWallet
    ? Math.min(walletBalance, baseAmount)
    : 0;

  const remainingAmount = baseAmount - walletUsed;

  return { baseAmount, walletUsed, remainingAmount };
}

/* ================= PAYMENT ================= */

async function initiatePayment(payMode: "HALF" | "FULL") {
  try {
    const { baseAmount, walletUsed, remainingAmount } =
      calculateAmounts(payMode);

    console.log("BASE:", baseAmount);
    console.log("WALLET USED:", walletUsed);
    console.log("ESEWA AMOUNT:", remainingAmount);

    const res = await fetch("/api/payments/esewa/initiate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookingId,
        payMode,
        useWallet,
      }),
    });

  const data = await res.json();

console.log("INIT RESPONSE:", data);

if (!res.ok) {
  console.error("INIT ERROR:", data);
  alert(data.error || "Payment initiation failed");
  return;
}

    /* ===== WALLET ONLY CASE ===== */
    if (data.success) {
      alert("Paid using wallet");
      window.location.href = "/dashboard/sessions";
      return;
    }

    /* ===== ESEWA REDIRECT ===== */

    if (!data.esewaUrl || !data.formData) {
      console.error("Invalid eSewa response:", data);
      alert("Payment setup failed");
      return;
    }

    const form = document.createElement("form");
    document.body.appendChild(form);

    form.method = "POST";
    form.action = String(data.esewaUrl).trim();
    form.style.display = "none";
    form.target = "_self";

    Object.entries(data.formData).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });

    console.log("Submitting to:", form.action);

    setTimeout(() => {
      form.submit();
    }, 100);

  } catch (err) {
    console.error("PAYMENT ERROR:", err);
    alert("Something went wrong");
  }
}

  /* ================= UI ================= */
const totalPaid =
  booking.payments
    ?.filter(
      (p) =>
        p.status === "HALF_PAID" ||
        p.status === "FULL_PAID" ||
        p.status === "REMAINING_DUE"
    )
    .reduce((sum, p) => sum + Number(p.paidAmount), 0) || 0;

const actualRemaining = Math.max(
  booking.totalAmount - totalPaid,
  0
);

const preview =
  booking.paymentStatus === "PARTIALLY_PAID"
    ? calculateAmounts("FULL") // only remaining
    : {
        baseAmount: booking.totalAmount,
        walletUsed: useWallet
          ? Math.min(walletBalance, booking.totalAmount)
          : 0,
        remainingAmount:
          booking.totalAmount -
          (useWallet
            ? Math.min(walletBalance, booking.totalAmount)
            : 0),
      };

  return (
    <>
      <div className="max-w-xl mx-auto space-y-6 p-6">
        <h1 className="text-2xl font-semibold text-[#004B4B]">
          Complete Payment
        </h1>

        {/* BOOKING */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500">Subject</p>
          <p className="font-medium">{booking.subject}</p>

          <p className="text-sm text-gray-500 mt-4">Total</p>
          <p className="text-xl font-bold text-[#004B4B]">
            NPR {booking.totalAmount}
          </p>
        </div>

        {/* WALLET */}
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Use Wallet</p>

            <input
              type="checkbox"
              checked={useWallet}
              onChange={() => setUseWallet(!useWallet)}
              className="w-5 h-5"
            />
          </div>

          <p className="text-xs text-gray-500">
            Balance: NPR {walletBalance}
          </p>

        {useWallet && (
  <p className="text-sm text-green-600">
    Using NPR {preview.walletUsed}
  </p>
)}
        </div>

        {/* SUMMARY */}
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-2">
          <div className="flex justify-between">
  <span>Total</span>
  <span>NPR {booking.totalAmount}</span>
</div>

{totalPaid > 0 && (
  <div className="flex justify-between text-blue-600">
    <span>Already Paid</span>
    <span>NPR {totalPaid}</span>
  </div>
)}

{useWallet && (
  <div className="flex justify-between text-green-600">
    <span>Wallet</span>
    <span>- NPR {preview.walletUsed}</span>
  </div>
)}

<div className="flex justify-between font-semibold text-lg">
  <span>To Pay</span>
  <span>
    NPR {booking.paymentStatus === "PARTIALLY_PAID" ? preview.remainingAmount : booking.totalAmount - preview.walletUsed}
  </span>
</div>
        </div>

        {/* ⚠ PAYMENT RULE NOTICE */}
<div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 text-sm text-gray-700">
  <p className="font-semibold text-[#004B4B] mb-1">
    Payment Policy
  </p>

  <ul className="list-disc pl-5 space-y-1">
    <li>You can join a session by paying half.</li>
    <li>Remaining must be paid within 24 hours after session.</li>
    <li>If not paid, you cannot book, join, or chat.</li>
    <li>After 3 unpaid cases, your account will be suspended.</li>
  </ul>
</div>

       {/* BUTTONS */}
{booking.paymentStatus === "UNPAID" && (
  <div className="space-y-3">
    
    {/* HALF PAYMENT */}
    <button
      onClick={() => initiatePayment("HALF")}
      className="
        w-full py-3 rounded-full
        bg-yellow-100 text-yellow-800 font-semibold
        transition-all duration-200
        hover:bg-yellow-50 hover:shadow-md hover:-translate-y-[1px]
        active:scale-95
      "
    >
      Pay 50% (Remaining due after session)
    </button>

    {/* FULL PAYMENT */}
    <button
      onClick={() => initiatePayment("FULL")}
      className="
        w-full py-3 rounded-full
        bg-[#004B4B] text-white font-semibold
        transition-all duration-200
        hover:bg-[#006A6A] hover:shadow-md hover:-translate-y-[1px]
        active:scale-95
      "
    >
      Pay Full
    </button>

  </div>
)}

        {booking.paymentStatus === "PARTIALLY_PAID" && (
          <button
            onClick={() => initiatePayment("FULL")}
            className="w-full py-3 bg-[#004B4B] text-white rounded-full"
          >
            Pay Remaining
          </button>
        )}

        {booking.paymentStatus === "FULLY_PAID" && (
          <p className="text-green-600 text-center font-semibold">
            Payment completed ✔
          </p>
        )}

        {verifying && (
          <p className="text-sm text-gray-500 text-center">
            Verifying payment...
          </p>
        )}
      </div>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl text-center">
            <h2 className="text-green-600 text-xl font-semibold">
              Payment Successful ✔
            </h2>

            <button
              onClick={() =>
                window.location.replace("/dashboard/payments")
              }
              className="mt-4 px-6 py-2 bg-[#006A6A] text-white rounded-full"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
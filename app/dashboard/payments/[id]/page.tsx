// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";

// export default function PaymentPage({ params }: { params: { id: string } }) {
//   const searchParams = useSearchParams();
//   const status = searchParams.get("status");
//  const rawUuid = searchParams.get("uuid");

// const uuid = rawUuid
//   ? rawUuid.split("?")[0] // ✅ STRIP eSewa junk
//   : null;


//   const [loading, setLoading] = useState(false);
//   const [verified, setVerified] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);

//   /* ================= VERIFY PAYMENT ================= */
//   async function verifyPayment() {
//     if (!uuid || verified) return;

//     try {
//       setLoading(true);
//       const res = await fetch(`/api/payments/esewa/verify?uuid=${uuid}`);
//       if (res.ok) {
//         setVerified(true);
//         setShowSuccess(true);
//       }
//     } catch (err) {
//       console.error("Payment verification failed", err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//   if (status === "success" && uuid && !verified) {
//     verifyPayment();
//   }
// }, [status, uuid, verified]);

//   /* ================= INITIATE PAYMENT ================= */
//   async function initiatePayment(payMode: "HALF" | "FULL") {
//     const res = await fetch("/api/payments/esewa/initiate", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         bookingId: params.id,
//         payMode,
//       }),
//     });

//     const data = await res.json();

//     if (!res.ok || !data?.payload || !data?.formUrl) {
//       alert(data?.error || "Payment initiation failed");
//       return;
//     }

//     submitToEsewa(data);
//   }

//   /* ================= SUBMIT TO ESEWA ================= */
//   function submitToEsewa(data: any) {
//     const form = document.createElement("form");
//     form.method = "POST";
//     form.action = data.formUrl;

//     Object.entries(data.payload).forEach(([key, value]) => {
//       const input = document.createElement("input");
//       input.type = "hidden";
//       input.name = key;
//       input.value = String(value);
//       form.appendChild(input);
//     });

//     document.body.appendChild(form);
//     form.submit();
//   }

//   /* ================= FAILED UI ================= */
//   if (status === "failed") {
//     return (
//       <div className="max-w-xl mx-auto mt-20 bg-white p-8 rounded-2xl border text-center">
//         <h1 className="text-xl font-semibold text-red-600">
//           Payment Failed
//         </h1>
//         <p className="text-gray-600 mt-2">
//           Payment could not be completed. Please try again.
//         </p>

//         <button
//           onClick={() =>
//             (window.location.href = `/dashboard/payments/${params.id}`)
//           }
//           className="mt-6 px-6 py-2 rounded-full bg-[#006A6A] text-white"
//         >
//           Retry Payment
//         </button>
//       </div>
//     );
//   }

//   /* ================= DEFAULT UI ================= */
//   return (
//     <>
//       <div className="max-w-xl mx-auto mt-20 bg-white p-8 rounded-2xl border">
//         <h1 className="text-2xl font-semibold text-[#004B4B] mb-4">
//           Complete Payment
//         </h1>

//         <p className="text-gray-600 mb-6">
//           Pay securely with eSewa to confirm your booking.
//         </p>

//         <div className="space-y-3">
//           <button
//             onClick={() => initiatePayment("HALF")}
//             className="w-full py-3 rounded-full bg-yellow-100 text-yellow-800 font-semibold"
//           >
//             Pay 50% with eSewa
//           </button>

//           <button
//             onClick={() => initiatePayment("FULL")}
//             className="w-full py-3 rounded-full bg-[#48A6A7] text-white font-semibold"
//           >
//             Pay Full Amount with eSewa
//           </button>
//         </div>

//         {loading && (
//           <p className="mt-4 text-sm text-gray-500 text-center">
//             Verifying payment, please wait...
//           </p>
//         )}
//       </div>

//       {/* ================= SUCCESS MODAL ================= */}
//       {showSuccess && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white p-8 rounded-2xl text-center w-[90%] max-w-md">
//             <div className="text-green-600 text-3xl mb-2">✔</div>
//             <h2 className="text-xl font-semibold text-green-600">
//               Payment Successful
//             </h2>
//             <p className="text-gray-600 mt-2">
//               Your payment has been verified successfully.
//             </p>

//             <button
//               onClick={() =>
//                 window.location.replace("/dashboard/sessions")
//               }
//               className="mt-6 px-6 py-2 rounded-full bg-[#006A6A] text-white"
//             >
//               OK
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type PaymentStatus = "UNPAID" | "PARTIALLY_PAID" | "FULLY_PAID";

export default function PaymentPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const rawUuid = searchParams.get("uuid");
  const uuid = rawUuid ? rawUuid.split("?")[0] : null;

  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatus>("UNPAID");

  /* ================= FETCH BOOKING PAYMENT STATUS ================= */
  async function fetchPaymentStatus() {
    try {
      const res = await fetch(`/api/bookings/${params.id}`);
      const data = await res.json();

      if (data?.booking?.paymentStatus) {
        setPaymentStatus(data.booking.paymentStatus);
      }
    } catch (err) {
      console.error("Failed to fetch payment status");
    }
  }

  /* ================= VERIFY PAYMENT ================= */
  async function verifyPayment() {
    if (!uuid || verified) return;

    try {
      setLoading(true);
      const res = await fetch(
        `/api/payments/esewa/verify?uuid=${uuid}`
      );

      if (res.ok) {
        setVerified(true);
        setShowSuccess(true);
        await fetchPaymentStatus();
      }
    } catch (err) {
      console.error("Payment verification failed", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPaymentStatus();

    if (status === "success" && uuid && !verified) {
      verifyPayment();
    }
  }, [status, uuid, verified]);

  /* ================= INITIATE PAYMENT ================= */
  async function initiatePayment(payMode: "HALF" | "FULL") {
    try {
      const res = await fetch("/api/payments/esewa/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: params.id,
          payMode,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.payload || !data?.formUrl) {
        alert(data?.error || "Payment initiation failed");
        return;
      }

      submitToEsewa(data);
    } catch (err) {
      console.error("Initiate payment error", err);
    }
  }

  /* ================= SUBMIT TO ESEWA ================= */
  function submitToEsewa(data: any) {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = data.formUrl;

    Object.entries(data.payload).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  }

  /* ================= FAILED UI ================= */
  if (status === "failed") {
    return (
      <div className="max-w-xl mx-auto mt-20 bg-white p-8 rounded-2xl border text-center">
        <h1 className="text-xl font-semibold text-red-600">
          Payment Failed
        </h1>
        <p className="text-gray-600 mt-2">
          Payment could not be completed. Please try again.
        </p>

        <button
          onClick={() =>
            (window.location.href = `/dashboard/payments/${params.id}`)
          }
          className="mt-6 px-6 py-2 rounded-full bg-[#006A6A] text-white"
        >
          Retry Payment
        </button>
      </div>
    );
  }

  /* ================= MAIN UI ================= */
  return (
    <>
      <div className="max-w-xl mx-auto mt-20 bg-white p-8 rounded-2xl border">
        <h1 className="text-2xl font-semibold text-[#004B4B] mb-4">
          Complete Payment
        </h1>

        <p className="text-gray-600 mb-6">
          Pay securely with eSewa to confirm your booking.
        </p>

        <div className="space-y-3">
          {/* FIRST PAYMENT */}
          {paymentStatus === "UNPAID" && (
            <>
              <button
                onClick={() => initiatePayment("HALF")}
                className="w-full py-3 rounded-full bg-yellow-100 text-yellow-800 font-semibold"
              >
                Pay 50% with eSewa
              </button>

              <button
                onClick={() => initiatePayment("FULL")}
                className="w-full py-3 rounded-full bg-[#48A6A7] text-white font-semibold"
              >
                Pay Full Amount with eSewa
              </button>
            </>
          )}

          {/* SECOND PAYMENT */}
          {paymentStatus === "PARTIALLY_PAID" && (
            <button
              onClick={() => initiatePayment("FULL")}
              className="w-full py-3 rounded-full bg-[#48A6A7] text-white font-semibold"
            >
              Pay Remaining Amount
            </button>
          )}

          {/* COMPLETED */}
          {paymentStatus === "FULLY_PAID" && (
            <p className="text-green-600 text-center font-semibold">
              Payment completed ✔
            </p>
          )}
        </div>

        {loading && (
          <p className="mt-4 text-sm text-gray-500 text-center">
            Verifying payment, please wait...
          </p>
        )}
      </div>

      {/* ================= SUCCESS MODAL ================= */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl text-center w-[90%] max-w-md">
            <div className="text-green-600 text-3xl mb-2">✔</div>
            <h2 className="text-xl font-semibold text-green-600">
              Payment Successful
            </h2>
            <p className="text-gray-600 mt-2">
              Your payment has been verified successfully.
            </p>

            <button
              onClick={() =>
                window.location.replace("/dashboard/payments")
              }
              className="mt-6 px-6 py-2 rounded-full bg-[#006A6A] text-white"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}

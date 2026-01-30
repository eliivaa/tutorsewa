// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";

// type PaymentStatus = "UNPAID" | "PARTIALLY_PAID" | "FULLY_PAID";

// export default function PaymentPage({ params }: { params: { id: string } }) {
//   const searchParams = useSearchParams();
//   const status = searchParams.get("status");
//   const uuid = searchParams.get("uuid");

//   const [paymentStatus, setPaymentStatus] =
//     useState<PaymentStatus>("UNPAID");
//   const [loading, setLoading] = useState(false);
//   const [verified, setVerified] = useState(false);

//   async function fetchPaymentStatus() {
//     const res = await fetch(`/api/bookings/${params.id}`);
//     const data = await res.json();
//     if (data?.booking?.paymentStatus) {
//       setPaymentStatus(data.booking.paymentStatus);
//     }
//   }

//   async function verifyPayment() {
//     if (!uuid || verified) return;
//     setLoading(true);
//     await fetch(`/api/payments/esewa/verify?uuid=${uuid}`);
//     setVerified(true);
//     await fetchPaymentStatus();
//     setLoading(false);
//   }

//   useEffect(() => {
//     fetchPaymentStatus();
//     if (status === "success") verifyPayment();
//   }, [status]);

//   async function initiatePayment(payMode: "HALF" | "FULL") {
//     const res = await fetch("/api/payments/esewa/initiate", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         bookingId: params.id,
//         payMode,
//       }),
//     });

//     const html = await res.text(); // ✅ IMPORTANT
//     document.open();
//     document.write(html);
//     document.close();
//   }

//   if (status === "failed") {
//     return (
//       <div className="max-w-xl mx-auto mt-20 bg-white p-8 rounded-xl text-center">
//         <h1 className="text-red-600 text-xl font-semibold">Payment Failed</h1>
//         <button
//           onClick={() => window.location.replace(`/dashboard/payments/${params.id}`)}
//           className="mt-6 px-6 py-2 rounded-full bg-[#006A6A] text-white"
//         >
//           Retry Payment
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-xl mx-auto mt-20 bg-white p-8 rounded-xl">
//       <h1 className="text-2xl font-semibold mb-4">Complete Payment</h1>

//       {paymentStatus === "UNPAID" && (
//         <>
//           <button
//             onClick={() => initiatePayment("HALF")}
//             className="w-full py-3 mb-3 bg-yellow-100 rounded-full"
//           >
//             Pay 50% with eSewa
//           </button>
//           <button
//             onClick={() => initiatePayment("FULL")}
//             className="w-full py-3 bg-[#48A6A7] text-white rounded-full"
//           >
//             Pay Full Amount with eSewa
//           </button>
//         </>
//       )}

//       {paymentStatus === "PARTIALLY_PAID" && (
//         <button
//           onClick={() => initiatePayment("FULL")}
//           className="w-full py-3 bg-[#48A6A7] text-white rounded-full"
//         >
//           Pay Remaining Amount
//         </button>
//       )}

//       {paymentStatus === "FULLY_PAID" && (
//         <p className="text-green-600 font-semibold text-center">
//           Payment completed ✔
//         </p>
//       )}

//       {loading && (
//         <p className="mt-4 text-sm text-gray-500 text-center">
//           Verifying payment...
//         </p>
//       )}
//     </div>
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

  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatus>("UNPAID");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  async function fetchPaymentStatus() {
    const res = await fetch(`/api/bookings/${params.id}`);
    const data = await res.json();
    if (data?.booking?.paymentStatus) {
      setPaymentStatus(data.booking.paymentStatus);
    }
  }

  async function verifyPayment() {
    if (!uuid || verified) return;

    setLoading(true);
    const res = await fetch(
      `/api/payments/esewa/verify?uuid=${uuid}`
    );

    if (res.ok) {
      setVerified(true);
      setShowSuccess(true);
      await fetchPaymentStatus();
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchPaymentStatus();
    if (status === "success") verifyPayment();
  }, [status]);

  async function initiatePayment(payMode: "HALF" | "FULL") {
    const res = await fetch("/api/payments/esewa/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingId: params.id,
        payMode,
      }),
    });

    const html = await res.text();
    document.open();
    document.write(html);
    document.close();
  }

  return (
    <>
      <div className="max-w-xl mx-auto mt-20 bg-white p-8 rounded-xl">
        <h1 className="text-2xl font-semibold mb-4">Complete Payment</h1>

        {paymentStatus === "UNPAID" && (
          <>
            <button
              onClick={() => initiatePayment("HALF")}
              className="w-full py-3 mb-3 bg-yellow-100 rounded-full"
            >
              Pay 50% with eSewa
            </button>

            <button
              onClick={() => initiatePayment("FULL")}
              className="w-full py-3 bg-[#48A6A7] text-white rounded-full"
            >
              Pay Full Amount with eSewa
            </button>
          </>
        )}

        {paymentStatus === "PARTIALLY_PAID" && (
          <button
            onClick={() => initiatePayment("FULL")}
            className="w-full py-3 bg-[#48A6A7] text-white rounded-full"
          >
            Pay Remaining Amount
          </button>
        )}

        {paymentStatus === "FULLY_PAID" && (
          <p className="text-green-600 font-semibold text-center">
            Payment completed ✔
          </p>
        )}

        {loading && (
          <p className="mt-4 text-sm text-gray-500 text-center">
            Verifying payment...
          </p>
        )}
      </div>

      {/* ✅ SUCCESS POPUP */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl text-center w-[90%] max-w-md">
            <div className="text-green-600 text-3xl mb-2">✔</div>
            <h2 className="text-xl font-semibold text-green-600">
              Payment Successful
            </h2>
            <p className="text-gray-600 mt-2">
              Your payment has been completed successfully.
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

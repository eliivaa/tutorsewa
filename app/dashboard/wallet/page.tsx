// "use client";

// import { useEffect, useState } from "react";

// type Transaction = {
//   id: string;
//   amount: number;
//   type: "CREDIT" | "DEBIT";
//   reason?: string;
//   createdAt: string;

//   booking?: {
//     subject?: string;
//     bookingDate?: string;
//     tutor?: {
//       name?: string;
//     };
//   } | null;
// };


// type WalletData = {
//   walletBalance: number;
//   walletTransactions: Transaction[];
// };

// export default function WalletPage() {
//   const [wallet, setWallet] = useState<WalletData | null>(null);
//   const [loading, setLoading] = useState(true);

//  useEffect(() => {
//   fetch("/api/wallet")
//     .then((res) => res.json())
//     .then((data) => {
//       console.log("TRANSACTIONS:", data.walletTransactions);
//       setWallet(data);
//     })
//     .finally(() => setLoading(false));
// }, []);



//   if (loading) return <p className="p-6">Loading wallet...</p>;
//   if (!wallet) return <p className="p-6">Failed to load wallet</p>;

//   return (
//     <div className="space-y-6 p-6">

//       <h1 className="text-2xl font-semibold text-[#004B4B]">
//         My Wallet
//       </h1>

//       {/* BALANCE */}
//       <div className="bg-white border rounded-2xl p-6 shadow-sm">
//         <p className="text-sm text-gray-500">Wallet Balance</p>

//         <p className="text-3xl font-bold text-[#004B4B] mt-2">
//           NPR {wallet.walletBalance}
//         </p>
//       </div>

//       {/* TRANSACTIONS */}
//       <div className="bg-white border rounded-2xl p-6 shadow-sm">

//         <h2 className="font-semibold mb-4">Transactions</h2>

//         {wallet.walletTransactions.length === 0 && (
//           <p className="text-gray-500">No transactions</p>
//         )}

//         <div className="space-y-3">
//           {wallet.walletTransactions.map((t) => (
//             <div
//               key={t.id}
//            className="flex justify-between border-b pb-3"
//             >
//               <div>
//                 <div>
//   {/* MAIN TITLE */}
//   <p className="text-sm font-medium text-[#004B4B]">
//     {t.booking?.tutor?.name || "Platform"}
//   </p>

//   {/* SUBJECT OR REASON */}
//   <p className="text-xs text-gray-600">
//     {t.booking?.subject || t.reason || "Wallet activity"}
//   </p>

//   <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded">
//   Session
// </span>

//   {/* DATE */}
//   <p className="text-xs text-gray-400">
//     {new Date(t.createdAt).toLocaleString()}
//   </p>
// </div>

//                 <p className="text-xs text-gray-400">
//                   {new Date(t.createdAt).toLocaleString()}
//                 </p>
//               </div>

//               <span
//                 className={`font-semibold ${
//                   t.type === "CREDIT"
//                     ? "text-green-600"
//                     : "text-red-600"
//                 }`}
//               >
//                 {t.type === "CREDIT" ? "+" : "-"} NPR {t.amount}
//               </span>
//             </div>
//           ))}
//         </div>

//       </div>

//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";

/* ================= TYPES ================= */

type Transaction = {
  id: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  reason?: string;
  createdAt: string;

  booking?: {
    subject?: string;
    tutorName?: string;
    cancelType?: string;
    cancelTiming?: string;
  } | null;
};

type WalletData = {
  walletBalance: number;
  walletTransactions: Transaction[];
};

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */

  useEffect(() => {
    fetch("/api/wallet")
      .then((res) => res.json())
      .then((data) => {
        console.log("TRANSACTIONS:", data.walletTransactions);
        setWallet(data);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ================= STATES ================= */

  if (loading) return <p className="p-6">Loading wallet...</p>;
  if (!wallet) return <p className="p-6">Failed to load wallet</p>;

  /* ================= UI ================= */

  return (
    <div className="space-y-6 p-6">
      {/* TITLE */}
      <h1 className="text-2xl font-semibold text-[#004B4B]">
        My Wallet
      </h1>

      {/* BALANCE */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <p className="text-sm text-gray-500">Wallet Balance</p>

        <p className="text-3xl font-bold text-[#004B4B] mt-2">
          NPR {wallet.walletBalance}
        </p>
      </div>

      {/* TRANSACTIONS */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold mb-4">Transactions</h2>

{/* REFUND NOTE */}

<div className="text-sm text-gray-700 space-y-1 mb-5 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
  <p className="font-semibold text-yellow-800">Refund Policy</p>

  <p>• More than 12 hours before → Full refund</p>
  <p>• Within 12 hours → 50% refund</p>
  <p>• After session starts → No refund</p>
</div>

<div className="border-t border-gray-200 mb-4"></div>

        {wallet.walletTransactions.length === 0 && (
          <p className="text-gray-500">No transactions</p>
        )}

        <div className="space-y-4">
          {wallet.walletTransactions.map((t) => (
            <div
              key={t.id}
              className="flex justify-between border-b pb-4"
            >
              {/* LEFT SIDE */}
              <div className="space-y-1">
                {/* TYPE (Refund / Payment / etc) */}
               <p className="text-sm font-medium text-[#004B4B]">
  {t.reason || "Transaction"}
</p>

                {/* WHO */}
                <p className="text-xs text-gray-600">
                  {t.booking?.tutorName || "Platform"}
                </p>

                {/* SUBJECT */}
                {t.booking?.subject && (
                  <p className="text-xs text-gray-500">
                    {t.booking.subject}
                  </p>
                )}

                {/* TAGS */}
                <div className="flex gap-2 mt-1 flex-wrap">
                  {t.booking?.cancelType && (
                    <span className="text-[10px] px-2 py-0.5 bg-yellow-100 rounded">
                      {t.booking.cancelType}
                    </span>
                  )}

                  {t.booking?.cancelTiming && (
                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded">
                      {t.booking.cancelTiming}
                    </span>
                  )}
                </div>

                {/* DATE */}
                <p className="text-xs text-gray-400">
                  {new Date(t.createdAt).toLocaleString()}
                </p>
              </div>

              {/* RIGHT SIDE (AMOUNT) */}
              <span
                className={`font-semibold text-sm ${
                  t.type === "CREDIT"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {t.type === "CREDIT" ? "+" : "-"} NPR {t.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
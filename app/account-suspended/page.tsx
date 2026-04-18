

"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AccountSuspendedPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const suspendedBy = (session?.user as any)?.suspendedBy;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">

        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Account Suspended
        </h1>

        {/* DYNAMIC MESSAGE */}
        <p className="text-gray-600 mb-6">
          {suspendedBy === "ADMIN" ? (
            <>
              Your account has been temporarily suspended by the admin.
              <br />
              If you think this is a mistake, please contact support.
            </>
          ) : (
            <>
              Your account has been deactivated by you.
              <br />
              Please contact admin if you want to reactivate your account.
            </>
          )}
        </p>

        <button
          onClick={() => router.push("/login")}
          className="px-5 py-2 bg-[#004B4B] text-white rounded-lg hover:bg-[#003636]"
        >
          Back to Login
        </button>

      </div>

    </div>
  );
}
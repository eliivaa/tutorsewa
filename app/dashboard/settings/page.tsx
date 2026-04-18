"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function SettingsPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [password, setPassword] = useState({
    old: "",
    new: "",
  });

  const [saving, setSaving] = useState(false);

  const [notifications, setNotifications] = useState({
    booking: true,
    payment: true,
    message: true,
  });

  const [notifSaving, setNotifSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /* ================= LOAD USER ================= */
  useEffect(() => {
    fetch("/api/profile")
      .then(res => res.json())
      .then(data => {
        const u = data.user || data;

        setUser(u);

        setNotifications({
          booking: u.notifyBooking ?? true,
          payment: u.notifyPayment ?? true,
          message: u.notifyMessage ?? true,
        });

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* ================= SAVE NOTIFICATIONS ================= */
  const saveNotifications = async (updated: any) => {
    setNotifications(updated);
    setNotifSaving(true);

    try {
      await fetch("/api/user/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error("Failed to save notification settings");
    } finally {
      setNotifSaving(false);
    }
  };

  /* ================= CHANGE PASSWORD ================= */
  const changePassword = async () => {
    if (!password.old || !password.new) {
      alert("Fill all fields");
      return;
    }

    if (password.new.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setSaving(true);

    const res = await fetch("/api/user/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(password),
    });

    const data = await res.json();

    setSaving(false);

    if (res.ok) {
      alert("Password updated successfully");
      setPassword({ old: "", new: "" });
    } else {
      alert(data.error || "Failed to update password");
    }
  };

  /* ================= DELETE ACCOUNT ================= */
 const deleteAccount = async () => {
  const res = await fetch("/api/user/delete", {
    method: "DELETE",
  });

  if (res.ok) {
    await fetch("/api/logout");
    alert("Account deleted");
    router.push("/login");
  } else {
    alert("Failed to delete account");
  }
};

  if (loading) return <p className="p-6">Loading settings...</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* ================= HEADER ================= */}
      <h1 className="text-2xl font-bold text-[#004B4B]">
        Settings
      </h1>

      {/* ================= ACCOUNT ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold text-[#004B4B] mb-4">
          Account
        </h2>

        <p className="text-sm text-gray-500">Email</p>
        <p className="mb-4">{user?.email}</p>

        <p className="text-sm text-gray-500">Name</p>
        <p>{user?.name}</p>

        <button
          onClick={() => router.push("/dashboard/profile")}
          className="mt-4 text-sm text-[#004B4B] underline"
        >
          Edit Profile
        </button>
      </div>

      {/* ================= CHANGE PASSWORD ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold text-[#004B4B] mb-4">
          Change Password
        </h2>

        <input
          type="password"
          placeholder="Current Password"
          className="w-full border rounded p-2 mb-3"
          value={password.old}
          onChange={(e) =>
            setPassword({ ...password, old: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full border rounded p-2 mb-3"
          value={password.new}
          onChange={(e) =>
            setPassword({ ...password, new: e.target.value })
          }
        />

        <button
          onClick={changePassword}
          disabled={saving}
          className="bg-[#004B4B] text-white px-4 py-2 rounded hover:bg-[#003636]"
        >
          {saving ? "Updating..." : "Update Password"}
        </button>
      </div>

      {/* ================= NOTIFICATIONS ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold text-[#004B4B] mb-4">
          Notifications
        </h2>

        {notifSaving && (
          <p className="text-sm text-gray-500 mb-2">
            Saving...
          </p>
        )}

        <div className="space-y-3">

          {/* BOOKING */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={notifications.booking}
              onChange={() =>
                saveNotifications({
                  ...notifications,
                  booking: !notifications.booking,
                })
              }
            />
            Booking Updates
          </label>

          {/* PAYMENT */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={notifications.payment}
              onChange={() =>
                saveNotifications({
                  ...notifications,
                  payment: !notifications.payment,
                })
              }
            />
            Payment Alerts
          </label>

          {/* MESSAGE */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={notifications.message}
              onChange={() =>
                saveNotifications({
                  ...notifications,
                  message: !notifications.message,
                })
              }
            />
            Messages
          </label>

        </div>
      </div>

      {/* ================= PAYMENTS ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold text-[#004B4B] mb-4">
          Payments & Wallet
        </h2>

        <p className="mb-3">
          Wallet Balance:{" "}
          <strong>₨ {user?.walletBalance || 0}</strong>
        </p>

        <button
          onClick={() => router.push("/dashboard/payments")}
          className="px-4 py-2 bg-[#004B4B] text-white rounded hover:bg-[#003636]"
        >
          View Payments
        </button>
      </div>

      {/* ================= DANGER ZONE ================= */}
     <div className="bg-red-50 p-6 rounded-xl border border-red-200">

  {/* TITLE */}
  <h2 className="text-lg font-semibold text-red-600 mb-2">
    Danger Zone
  </h2>

  {/* DESCRIPTION */}
  <p className="text-sm text-red-600 mb-5 leading-relaxed">
    When you delete your account, it will be <strong>temporarily suspended</strong>.
    You will lose access to your dashboard, bookings, and messages.
    <br /><br />
    Your data can be restored later by contacting
    <span className="font-medium"> support or the system administrator</span>.
  </p>

  {/* ACTION */}
  <button
    onClick={() => setShowDeleteModal(true)}
    className="bg-red-600 text-white px-5 py-2 rounded-md font-medium hover:bg-red-700 transition"
  >
    Delete Account
  </button>

</div>

      {showDeleteModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white rounded-2xl p-6 w-[350px] shadow-xl animate-fadeIn">

      <h2 className="text-lg font-semibold text-[#004B4B] mb-2">
        Delete Account
      </h2>

      <p className="text-sm text-gray-600 mb-6">
        Are you sure? This action cannot be undone.
      </p>

      <div className="flex justify-end gap-3">

        {/* CANCEL */}
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
        >
          Cancel
        </button>

        {/* DELETE */}
        <button
          onClick={async () => {
            setShowDeleteModal(false);
            await deleteAccount();
          }}
          className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
        >
          Delete
        </button>

      </div>

    </div>
  </div>
)}
    </div>
    
  );
}
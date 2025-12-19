"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdmin() {
      try {
        const res = await fetch("/api/admin/me");
        if (res.status === 401) {
          window.location.href = "api/admin/login";
          return;
        }

        const data = await res.json();
        setAdmin(data);
        setLoading(false);
      } catch (error) {
        console.error("ADMIN FETCH ERROR:", error);
        window.location.href = "/admin/login";
      }
    }

    loadAdmin();
  }, []);

  if (loading)
    return (
      <p className="text-gray-500 text-sm">Checking admin authentication...</p>
    );

  return (
    <div className="text-[#004B4B]">
      <h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>

      <p className="text-lg mb-6">
        Welcome ADMIN
      </p>

      <div className="bg-white border shadow p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-3">System Overview</h2>
        <p className="text-gray-600 text-sm">
          This will later include charts & statistics.
        </p>
      </div>
    </div>
  );
}

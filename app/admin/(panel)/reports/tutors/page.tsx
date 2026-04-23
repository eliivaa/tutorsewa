"use client";

import { useEffect, useState } from "react";

export default function TutorReportsPage() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/tutor-reports")
      .then(res => res.json())
      .then(data => setReports(data.reports || []));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Tutor Reports</h1>

      {reports.map(r => (
        <div key={r.id} className="border p-4 mb-3 rounded">

          <p><b>Tutor:</b> {r.tutor.name}</p>
          <p><b>Reason:</b> {r.reason}</p>
          <p><b>Details:</b> {r.details}</p>

          <div className="mt-3 flex gap-2">

            <div className="mt-3 flex gap-2">

  {/* ⚠️ WARN */}
  <button
    onClick={async () => {
      await fetch(`/api/admin/tutor-reports/${r.id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "WARN" }),
      });

      alert("Warning sent");
    }}
    className="px-3 py-1 bg-yellow-500 text-white rounded"
  >
    Warn
  </button>

  {/* 🚫 SUSPEND */}
  <button
    onClick={async () => {
      await fetch(`/api/admin/tutor-reports/${r.id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "SUSPEND" }),
      });

      alert("Tutor suspended");
    }}
    className="px-3 py-1 bg-red-600 text-white rounded"
  >
    Suspend
  </button>

</div>

          </div>
        </div>
      ))}
    </div>
  );
}
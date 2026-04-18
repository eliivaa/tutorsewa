// "use client";

// import { useEffect, useState } from "react";
// import { Bell } from "lucide-react";
// import { useRouter } from "next/navigation";
// import {
//   formatNotificationTime,
//   getNotificationIcon,
// } from "@/lib/notificationHelpers";

// type Notification = {
//   id: string;
//   title: string;
//   message: string;
//   type?: string;
//   isRead: boolean;
//   createdAt: string;
//   actionUrl?: string | null;
// };

// export default function NotificationsPage() {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [selected, setSelected] = useState<string[]>([]);
//   const [filter, setFilter] = useState("all");
//   const [sort, setSort] = useState("latest");
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(false);
//  const router = useRouter();

//   async function fetchNotifications() {
//     const res = await fetch(
//       `/api/notifications?page=${page}&limit=10&filter=${filter}&sort=${sort}`,
//       { cache: "no-store" }
//     );

//     const data = await res.json();
//     setNotifications(data.notifications || []);
//     setHasMore(Boolean(data.hasMore));
//   }

//   useEffect(() => {
//     fetchNotifications();
//   }, [filter, sort, page]);

//   function toggleSelect(id: string) {
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   }

//   async function markSelectedRead() {
//     if (selected.length === 0) return;

//     await fetch("/api/notifications/bulk", {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ action: "mark-read", ids: selected }),
//     });

//     setSelected([]);
//     fetchNotifications();
//   }

//   async function deleteSelected() {
//     if (selected.length === 0) return;

//     await fetch("/api/notifications/bulk", {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ action: "delete", ids: selected }),
//     });

//     setSelected([]);
//     fetchNotifications();
//   }

//   async function markAllRead() {
//     await fetch("/api/notifications/bulk", {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ action: "mark-all-read" }),
//     });

//     setSelected([]);
//     fetchNotifications();
//   }

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold text-[#004B4B]">Notifications</h1>
//       <p className="text-sm text-gray-500 mb-4">Manage your notification history</p>

//       <div className="flex flex-wrap items-center gap-3 mb-6">
//         <select
//           value={filter}
//           onChange={(e) => {
//             setFilter(e.target.value);
//             setPage(1);
//           }}
//          className="px-4 py-2 rounded-xl border bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0F9D8A]/30"
//         >
//           <option value="all">All</option>
//           <option value="unread">Unread</option>
//           <option value="read">Read</option>
//         </select>

//         <select
//           value={sort}
//           onChange={(e) => {
//             setSort(e.target.value);
//             setPage(1);
//           }}
//           className="px-4 py-2 rounded-xl border bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0F9D8A]/30"
//         >
//           <option value="latest">Latest</option>
//           <option value="oldest">Oldest</option>
//         </select>
//       </div>

//      <div className="flex flex-wrap items-center gap-3 mb-6">
//         <button
//           onClick={markSelectedRead}
//           className="px-4 py-2 bg-[#0F9D8A] text-white rounded-xl text-sm font-medium shadow-sm hover:bg-[#0c8575] hover:scale-[1.03] transition"
//         >
//           Mark selected read
//         </button>

//         <button
//           onClick={markAllRead}
//           className="px-3 py-2 bg-[#0F9D8A] text-white rounded-lg text-sm"
//         >
//           Mark all read
//         </button>

//         <button
//           onClick={deleteSelected}
//          className="px-4 py-2 bg-red-100 text-red-600 rounded-xl text-sm font-medium hover:bg-red-200 transition"
//         >
//           Delete selected
//         </button>
//       </div>

//       <div className="border rounded-lg overflow-hidden bg-white">
//         {notifications.length === 0 ? (
//           <div className="p-8 text-center text-gray-500">
//             <Bell className="mx-auto mb-2" />
//             <p>No notifications found</p>
//           </div>
//         ) : (
//           notifications.map((n) => {
//             const Icon = getNotificationIcon(n.type);

//             return (
//              <div
//   key={n.id}
//   onClick={async () => {
//     // mark as read
//     await fetch("/api/notifications/read", {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id: n.id }),
//     });

//     // navigate
//     if (n.actionUrl) {
//       router.push(n.actionUrl);
//     }
//   }}
//   className={`flex items-start gap-4 p-4 rounded-xl border shadow-sm transition cursor-pointer ${
//     !n.isRead
//       ? "border-l-4 border-l-[#0F9D8A] bg-[#F0FDFA]"
//       : "bg-white hover:bg-gray-50"
//   }`}
// >
//   <input
//     type="checkbox"
//     checked={selected.includes(n.id)}
//     onClick={(e) => e.stopPropagation()}  // 🔥 IMPORTANT
//     onChange={() => toggleSelect(n.id)}
//     className="mt-1"
//   />

//                 <Icon className="text-[#0F9D8A] mt-1" size={18} />

//                 <div className="flex-1">
//                   <p className="font-semibold">{n.title}</p>
//                   <p className="text-sm text-gray-700 mt-1">{n.message}</p>
//                   <p className="text-xs text-gray-400 mt-1">
//                     {formatNotificationTime(n.createdAt)}
//                   </p>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>

//       <div className="flex justify-between mt-4">
//         <button
//           disabled={page === 1}
//           onClick={() => setPage((p) => p - 1)}
//           className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50 disabled:opacity-40"
//         >
//           Previous
//         </button>

//         <button
//           disabled={!hasMore}
//           onClick={() => setPage((p) => p + 1)}
//           className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50 disabled:opacity-40"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  formatNotificationTime,
  getNotificationIcon,
} from "@/lib/notificationHelpers";

type Notification = {
  id: string;
  title: string;
  message: string;
  type?: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string | null;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const router = useRouter();

  async function fetchNotifications() {
    const res = await fetch(
      `/api/notifications?page=${page}&limit=10&filter=${filter}&sort=${sort}`,
      { cache: "no-store" }
    );

    const data = await res.json();
    setNotifications(data.notifications || []);
    setHasMore(Boolean(data.hasMore));
  }

  useEffect(() => {
    fetchNotifications();
  }, [filter, sort, page]);

  function toggleSelect(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function markSelectedRead() {
    if (selected.length === 0) return;

    await fetch("/api/notifications/bulk", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "mark-read", ids: selected }),
    });

    setSelected([]);
    fetchNotifications();
  }

  async function deleteSelected() {
    if (selected.length === 0) return;

    await fetch("/api/notifications/bulk", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", ids: selected }),
    });

    setSelected([]);
    fetchNotifications();
  }

  async function markAllRead() {
    await fetch("/api/notifications/bulk", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "mark-all-read" }),
    });

    setSelected([]);
    fetchNotifications();
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* HEADER */}
      <h1 className="text-2xl font-bold text-[#004B4B]">Notifications</h1>
      <p className="text-sm text-gray-500 mb-6">
        Manage your notification history
      </p>

      {/* FILTERS */}
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">

  {/* LEFT SIDE (FILTERS) */}
  <div className="flex items-center gap-3">
    <select
      value={filter}
      onChange={(e) => {
        setFilter(e.target.value);
        setPage(1);
      }}
      className="px-4 py-2 rounded-xl border bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0F9D8A]/30"
    >
      <option value="all">All</option>
      <option value="unread">Unread</option>
      <option value="read">Read</option>
    </select>

    <select
      value={sort}
      onChange={(e) => {
        setSort(e.target.value);
        setPage(1);
      }}
      className="px-4 py-2 rounded-xl border bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0F9D8A]/30"
    >
      <option value="latest">Latest</option>
      <option value="oldest">Oldest</option>
    </select>
  </div>

  {/* RIGHT SIDE (BUTTONS) */}
  <div className="flex items-center gap-3">
    <button
      onClick={markSelectedRead}
      className="px-4 py-2 bg-[#0F9D8A] text-white rounded-xl text-sm font-medium shadow-sm hover:bg-[#0c8575] hover:scale-[1.03] transition"
    >
      Mark selected read
    </button>

    <button
      onClick={markAllRead}
      className="px-4 py-2 bg-[#0F9D8A] text-white rounded-xl text-sm font-medium shadow-sm hover:bg-[#0c8575] hover:scale-[1.03] transition"
    >
      Mark all read
    </button>

    <button
      onClick={deleteSelected}
      className="px-4 py-2 bg-red-100 text-red-600 rounded-xl text-sm font-medium hover:bg-red-200 transition"
    >
      Delete selected
    </button>
  </div>

</div>
      {/* LIST */}
      <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="mx-auto mb-2" />
            <p>No notifications found</p>
          </div>
        ) : (
          notifications.map((n) => {
            const Icon = getNotificationIcon(n.type);

            return (
              <div
                key={n.id}
                onClick={async () => {
                  await fetch("/api/notifications/read", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: n.id }),
                  });

                  if (n.actionUrl) {
                    router.push(n.actionUrl);
                  }
                }}
                className={`flex items-start gap-4 p-4 border-b last:border-none transition cursor-pointer ${
                  !n.isRead
                    ? "border-l-4 border-l-[#0F9D8A] bg-[#F0FDFA]"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(n.id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => toggleSelect(n.id)}
                  className="mt-1"
                />

                <Icon className="text-[#0F9D8A] mt-1" size={18} />

                <div className="flex-1">
                  <p className="font-semibold text-[#004B4B]">
                    {n.title}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    {n.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatNotificationTime(n.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 rounded-xl border bg-white text-sm font-medium shadow-sm hover:bg-gray-50 hover:scale-[1.03] transition disabled:opacity-40"
        >
          Previous
        </button>

        <button
          disabled={!hasMore}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 rounded-xl border bg-white text-sm font-medium shadow-sm hover:bg-gray-50 hover:scale-[1.03] transition disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
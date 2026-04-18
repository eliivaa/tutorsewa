// "use client";

// import { useEffect, useState } from "react";
// import { Bell } from "lucide-react";
// import {
//   formatNotificationTime,
//   getNotificationIcon,
// } from "@/lib/notificationHelpers";

// export default function TutorNotificationsPage() {
//   const [notifications, setNotifications] = useState<any[]>([]);
//   const [selected, setSelected] = useState<string[]>([]);
//   const [filter, setFilter] = useState("all");
//   const [sort, setSort] = useState("latest");
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(false);

//   const fetchNotifications = async () => {
//     const res = await fetch(
//       `/api/notifications?tutor=true&page=${page}&limit=10&filter=${filter}&sort=${sort}`
//     );

//     const data = await res.json();
//     setNotifications(data.notifications || []);
//     setHasMore(data.hasMore);
//   };

//   useEffect(() => {
//     fetchNotifications();
//   }, [filter, sort, page]);

//   const toggle = (id: string) => {
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   const markRead = async () => {
//     await fetch("/api/notifications/bulk", {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ action: "mark-read", ids: selected }),
//     });
//     setSelected([]);
//     fetchNotifications();
//   };

//   const deleteItems = async () => {
//     await fetch("/api/notifications/bulk", {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ action: "delete", ids: selected }),
//     });
//     setSelected([]);
//     fetchNotifications();
//   };

//   return (
//     <div className="p-6 max-w-5xl mx-auto">

//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-[#004B4B]">
//           Tutor Notifications
//         </h1>

//         <div className="flex gap-3">

//           <select
//             className="border rounded-lg px-3 py-2 text-sm"
//             onChange={(e) => setFilter(e.target.value)}
//           >
//             <option value="all">All</option>
//             <option value="unread">Unread</option>
//           </select>

//           <button
//             onClick={markRead}
//             className="px-4 py-2 text-sm rounded-lg bg-[#E6F9F5] text-[#0F9D8A] hover:bg-[#d6f3ee]"
//           >
//             Mark Read
//           </button>

//           <button
//             onClick={deleteItems}
//             className="px-4 py-2 text-sm rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
//           >
//             Delete
//           </button>

//         </div>
//       </div>

//       {/* LIST */}
//       <div className="space-y-3">

//         {notifications.length === 0 ? (
//           <div className="text-center text-gray-500 py-10">
//             <Bell className="mx-auto mb-2" />
//             <p>You’re all caught up</p>
//           </div>
//         ) : (
//           notifications.map((n) => {
//             const Icon = getNotificationIcon(n.type);

//             return (
//               <div
//                 key={n.id}
//                 className={`flex items-start gap-4 p-4 rounded-xl border shadow-sm transition ${
//                   !n.isRead
//                     ? "border-l-4 border-l-[#0F9D8A] bg-[#F0FDFA]"
//                     : "bg-white hover:bg-gray-50"
//                 }`}
//               >
//                 {/* CHECKBOX */}
//                 <input
//                   type="checkbox"
//                   checked={selected.includes(n.id)}
//                   onChange={() => toggle(n.id)}
//                   className="mt-1"
//                 />

//                 {/* ICON */}
//                 <Icon className="text-[#0F9D8A] mt-1" size={18} />

//                 {/* CONTENT */}
//                 <div className="flex-1">
//                   <p className="font-semibold text-[#004B4B]">
//                     {n.title}
//                   </p>

//                   <p className="text-sm text-gray-700 mt-1">
//                     {n.message}
//                   </p>

//                   <p className="text-xs text-gray-400 mt-1">
//                     {formatNotificationTime(n.createdAt)}
//                   </p>
//                 </div>
//               </div>
//             );
//           })
//         )}

//       </div>

//       {/* PAGINATION */}
//       <div className="flex justify-between items-center mt-6">
//         <button
//           disabled={page === 1}
//           onClick={() => setPage((p) => p - 1)}
//           className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50 disabled:opacity-40"
//         >
//           Prev
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

export default function TutorNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const router = useRouter();
  
  async function fetchNotifications() {
    const res = await fetch(
      `/api/notifications?tutor=true&page=${page}&limit=10&filter=${filter}&sort=${sort}`,
      { cache: "no-store" }
    );

    const data = await res.json();
    setNotifications(data.notifications || []);
    setHasMore(Boolean(data.hasMore));
  }

  useEffect(() => {
    fetchNotifications();
  }, [filter, sort, page]);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function markRead() {
    if (selected.length === 0) return;

    await fetch("/api/notifications/bulk", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "mark-read", ids: selected }),
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

  async function deleteItems() {
    if (selected.length === 0) return;

    await fetch("/api/notifications/bulk", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", ids: selected }),
    });

    setSelected([]);
    fetchNotifications();
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#004B4B]">Tutor Notifications</h1>

        <div className="flex gap-3">
          <select
            className="border rounded-lg px-3 py-2 text-sm"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>

          <select
            className="border rounded-lg px-3 py-2 text-sm"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>

          <button
            onClick={markRead}
            className="px-4 py-2 text-sm rounded-lg bg-[#E6F9F5] text-[#0F9D8A] hover:bg-[#d6f3ee]"
          >
            Mark selected read
          </button>

          <button
            onClick={markAllRead}
            className="px-4 py-2 text-sm rounded-lg bg-[#0F9D8A] text-white hover:opacity-90"
          >
            Mark all read
          </button>

          <button
            onClick={deleteItems}
            className="px-4 py-2 text-sm rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
          >
            Delete selected
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <Bell className="mx-auto mb-2" />
            <p>You’re all caught up</p>
          </div>
        ) : (
          notifications.map((n) => {
            const Icon = getNotificationIcon(n.type);

            return (
            <div
  key={n.id}
  onClick={async () => {
    // mark as read
    await fetch("/api/notifications/read", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: n.id }),
    });

    // navigate
    if (n.actionUrl) {
      router.push(n.actionUrl);
    }
  }}
  className={`flex items-start gap-4 p-4 rounded-xl border shadow-sm transition cursor-pointer ${
    !n.isRead
      ? "border-l-4 border-l-[#0F9D8A] bg-[#F0FDFA]"
      : "bg-white hover:bg-gray-50"
  }`}
>
  <input
    type="checkbox"
    checked={selected.includes(n.id)}
    onClick={(e) => e.stopPropagation()}  // 🔥 IMPORTANT
    onChange={() => toggle(n.id)}
    className="mt-1"
  />

                <Icon className="text-[#0F9D8A] mt-1" size={18} />

                <div className="flex-1">
                  <p className="font-semibold text-[#004B4B]">{n.title}</p>
                  <p className="text-sm text-gray-700 mt-1">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatNotificationTime(n.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50 disabled:opacity-40"
        >
          Prev
        </button>

        <button
          disabled={!hasMore}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
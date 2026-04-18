// "use client";

// import { useEffect, useRef, useState } from "react";
// import { io, Socket } from "socket.io-client";
// import { useSession } from "next-auth/react";
// import { useSearchParams } from "next/navigation";


// /* ================= UPDATED TYPE ================= */
// type Conversation = {
//   id: string;
//   unread: number;
//   allowed: boolean;
//   type: "TUTOR_SESSION" | "THRIFT";

//   person: {
//     id?: string;
//     name?: string | null;
//     photo?: string | null;
//   } | null;
// };


// type Msg = {
//   id?: string;
//   content: string;
//   senderUserId?: string | null;
//   senderTutorId?: string | null;
//   createdAt: string;
//   conversationId: string;
//   clientTempId?: string;
// };

// /* ================= HELPER ================= */
// function getPerson(c: Conversation | null) {
//   if (!c?.person) {
//     return {
//       name: "User",
//       photo: "/default-avatar.png",
//       label: "",
//     };
//   }

//   return {
//     name: c.person.name || "User",
//     photo: c.person.photo || "/default-avatar.png",
//     label: c.type === "THRIFT" ? "🛒 Thrift Inquiry" : "Tutor Chat",
//   };
// }


// export default function StudentMessagesPage() {
//   const { data: session, status } = useSession();

//   const userId = session?.user?.id || null;

//   const [convos, setConvos] = useState<Conversation[]>([]);
//   const [active, setActive] = useState<Conversation | null>(null);
//   const [messages, setMessages] = useState<Msg[]>([]);
//   const [text, setText] = useState("");
//   const [socket, setSocket] = useState<Socket | null>(null);

//   const bottomRef = useRef<HTMLDivElement | null>(null);
//   const activeIdRef = useRef<string | null>(null);
//   const joinedRoomRef = useRef<string | null>(null);
//   const searchParams = useSearchParams();
// const conversationIdFromUrl = searchParams?.get("conversationId");



//   /* ================= SOCKET INIT ================= */
//   useEffect(() => {
//     let s: Socket | null = null;

//     (async () => {
//       await fetch("/api/socket/io");

//       s = io({
//         path: "/api/socket/io",
//         transports: ["websocket"],
//       });

//       s.on("receive-message", (data: Msg) => {
//         if (data?.conversationId && data.conversationId === activeIdRef.current) {
//           setMessages((prev) => {
//             if (data.clientTempId && prev.some((p) => p.clientTempId === data.clientTempId)) {
//               return prev;
//             }
//             return [...prev, data];
//           });
//         }
//       });

//       setSocket(s);
//     })();

//     return () => {
//       if (s) s.disconnect();
//     };
//   }, []);

//   /* ================= LOAD CONVERSATIONS ================= */
//  useEffect(() => {
//   (async () => {
//     const res = await fetch("/api/messages/conversations");
//     const data = await res.json();

//     const list = data.conversations || [];
//     setConvos(list);

//     // 🧠 open the correct conversation from URL
//     if (conversationIdFromUrl) {
//       const match = list.find((c: any) => c.id === conversationIdFromUrl);
//       if (match) {
//         setActive(match);
//         return;
//       }
//     }

//     // fallback (first chat)
//     if (list.length) setActive(list[0]);
//   })();
// }, [conversationIdFromUrl]);


//   /* ================= JOIN ROOM ================= */
//   useEffect(() => {
//     if (!active || !socket) return;

//     const conversationId = active.id;
//     activeIdRef.current = conversationId;

//     if (joinedRoomRef.current && joinedRoomRef.current !== conversationId) {
//       socket.emit("leave-room", joinedRoomRef.current);
//     }

//     socket.emit("join-room", conversationId);
//     joinedRoomRef.current = conversationId;

//     (async () => {
//       const res = await fetch(`/api/messages/${conversationId}`);
//       const data = await res.json();
//       setMessages(data.messages || []);

//       await fetch(`/api/messages/${conversationId}/read`, { method: "POST" });
//     })();
//   }, [active, socket]);

//   /* ================= SEND ================= */
//   async function send() {
//   if (!active?.allowed) return;
//   if (!text.trim()) return;
//   if (!socket) return;
//   if (!active) return;
//   if (!userId) return;

//   const clientTempId = crypto.randomUUID();

//   const temp: Msg = {
//     conversationId: active.id,
//     content: text,
//     senderUserId: userId,
//     createdAt: new Date().toISOString(),
//     clientTempId,
//   };

//   // ✅ optimistic UI (show message first)
//   setMessages((prev) => [...prev, temp]);
//   setText("");

//   try {
//     const res = await fetch(`/api/messages/${active.id}/send`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ content: temp.content }),
//     });

//     const data = await res.json();

//     // ❌ HANDLE BLOCK
//     if (!res.ok) {

//       // 🔥 PAYMENT OVERDUE CASE
//       if (data.error === "PAYMENT_OVERDUE") {
//         alert(data.message || "Please complete your payment first.");

//         // ❌ remove fake message
//         setMessages((prev) =>
//           prev.filter((m) => m.clientTempId !== clientTempId)
//         );

//         // 👉 redirect to payment page
//         window.location.href = "/dashboard/payments";
//         return;
//       }

//       // other errors
//       alert(data.error || "Failed to send message");

//       // ❌ remove fake message
//       setMessages((prev) =>
//         prev.filter((m) => m.clientTempId !== clientTempId)
//       );

//       return;
//     }

//     // ✅ success → emit socket
//     socket.emit("send-message", temp);

//   } catch (err) {
//     console.error("SEND ERROR:", err);

//     // ❌ remove fake message
//     setMessages((prev) =>
//       prev.filter((m) => m.clientTempId !== clientTempId)
//     );

//     alert("Something went wrong");
//   }
// }
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   if (status === "loading" || !userId) return null;

//   return (
//     <div className="h-[80vh] bg-white border rounded-2xl flex">
//       {/* LEFT */}
//       <div className="w-[340px] border-r bg-[#F7FAFA] p-4 space-y-2 overflow-auto">
//         {convos.map((c) => {
//           const person = getPerson(c);

//           return (
//             <button
//               key={c.id}
//               onClick={() => setActive(c)}
//               className={`w-full text-left p-3 rounded-xl border ${
//                 active?.id === c.id ? "bg-white border-[#4CB6B6]" : "bg-white/60"
//               }`}
//             >
//               <div className="flex items-center gap-3">
//                 <img
//                   src={person.photo}
//                   className="w-10 h-10 rounded-full object-cover"
//                   alt="user"
//                 />
//                 <div className="flex-1 flex justify-between">
//                   <div>
//                     <p className="font-medium">{person.name}</p>
//                     <p className="text-xs text-gray-500">{person.label}</p>
//                   </div>
//                   {c.unread > 0 && (
//                     <span className="min-w-[22px] h-[22px] flex items-center justify-center text-[11px] bg-red-500 text-white rounded-full">
//   {c.unread}
// </span>

//                   )}
//                 </div>
//               </div>
//             </button>
//           );
//         })}
//       </div>

//       {/* RIGHT */}
//       <div className="flex-1 flex flex-col">
//         <div className="p-4 border-b flex items-center gap-3 bg-white">
//           {active ? (
//             (() => {
//               const person = getPerson(active);
//               return (
//                 <>
//                   <img src={person.photo} className="w-10 h-10 rounded-full object-cover" />
//                   <div>
//                     <p className="font-semibold text-[#004B4B]">{person.name}</p>
//                     <p className="text-xs text-gray-500">{person.label}</p>
//                   </div>
//                 </>
//               );
//             })()
//           ) : (
//             <p className="font-semibold text-gray-500">Select chat</p>
//           )}
//         </div>

//         <div className="flex-1 p-4 overflow-auto space-y-2">
//           {messages.map((m, i) => {
//             const mine = m.senderUserId === userId;
//             const person = getPerson(active);

//             return (
//               <div
//                 key={m.id ?? m.clientTempId ?? i}
//                 className={`flex items-end gap-2 ${mine ? "justify-end" : "justify-start"}`}
//               >
//                 {!mine && (
//                   <img src={person.photo} className="w-8 h-8 rounded-full object-cover" />
//                 )}

//                 <div
//                   className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
//                     mine ? "bg-[#4CB6B6] text-white" : "bg-white border"
//                   }`}
//                 >
//                   {m.content}
//                 </div>
//               </div>
//             );
//           })}

//           <div ref={bottomRef} />
//         </div>

//         <div className="p-3 border-t flex gap-2">
//           <input
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             disabled={!active?.allowed}
//             className="flex-1 border rounded-xl px-3 py-2"
//             placeholder={
//   !active?.allowed
//     ? "Complete payment to continue chatting"
//     : "Type a message..."
// }
//           />
//           <button
//             onClick={send}
//             disabled={!active?.allowed}
//             className="px-4 py-2 bg-[#004B4B] text-white rounded-xl disabled:opacity-50"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

/* ================= TYPES ================= */
type Conversation = {
  id: string;
  unread: number;
  allowed: boolean;
  type: "TUTOR_SESSION" | "THRIFT";
  lastMessage?: string;
  lastMessageTime?: string | null;

  person: {
    id?: string;
    name?: string | null;
    photo?: string | null;
  } | null;
};

type Msg = {
  id?: string;
  content: string;
  senderUserId?: string | null;
  senderTutorId?: string | null;
  createdAt: string;
  conversationId: string;
  clientTempId?: string;
};

type ChatItem =
  | { type: "date"; label: string; key: string }
  | { type: "message"; key: string; message: Msg };

/* ================= HELPERS ================= */
function getPerson(c: Conversation | null) {
  if (!c?.person) {
    return {
      name: "User",
      photo: "/default-avatar.png",
      label: "",
    };
  }

  return {
    name: c.person.name || "User",
    photo: c.person.photo || "/default-avatar.png",
    label: c.type === "THRIFT" ? "🛒 Thrift Inquiry" : "Tutor Chat",
  };
}

function formatListTime(dateString?: string | null) {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();

  const isSameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isSameDay) {
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
  });
}

function formatBubbleTime(dateString?: string | null) {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getDateLabel(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thatDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffMs = today.getTime() - thatDay.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  return date.toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function buildChatItems(messages: Msg[]): ChatItem[] {
  const items: ChatItem[] = [];
  let lastLabel = "";

  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    const label = getDateLabel(m.createdAt);

    if (label !== lastLabel) {
      items.push({
        type: "date",
        label,
        key: `date-${label}-${i}`,
      });
      lastLabel = label;
    }

    items.push({
      type: "message",
      key: m.id ?? m.clientTempId ?? `msg-${i}`,
      message: m,
    });
  }

  return items;
}

/* ================= PAGE ================= */
export default function StudentMessagesPage() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id || null;

  const [convos, setConvos] = useState<Conversation[]>([]);
  const [active, setActive] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const joinedRoomRef = useRef<string | null>(null);

  const searchParams = useSearchParams();
  const conversationIdFromUrl = searchParams?.get("conversationId");

  /* ================= SOCKET INIT ================= */
  useEffect(() => {
    let s: Socket | null = null;

    (async () => {
      await fetch("/api/socket/io");

      s = io({
        path: "/api/socket/io",
        transports: ["websocket"],
      });

      s.on("receive-message", (data: Msg) => {
        if (!data?.conversationId) return;

        if (data.conversationId === activeIdRef.current) {
          setMessages((prev) => {
            if (
              data.clientTempId &&
              prev.some((p) => p.clientTempId === data.clientTempId)
            ) {
              return prev;
            }
            return [...prev, data];
          });

          setConvos((prev) =>
            prev.map((c) =>
              c.id === data.conversationId
                ? {
                    ...c,
                    unread: 0,
                    lastMessage: data.content,
                    lastMessageTime: data.createdAt,
                  }
                : c
            )
          );
        } else {
          setConvos((prev) =>
            prev.map((c) =>
              c.id === data.conversationId
                ? {
                    ...c,
                    unread: c.unread + 1,
                    lastMessage: data.content,
                    lastMessageTime: data.createdAt,
                  }
                : c
            )
          );
        }
      });

      setSocket(s);
    })();

    return () => {
      if (s) s.disconnect();
    };
  }, []);

  /* ================= LOAD CONVERSATIONS ================= */
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/messages/conversations");
      const data = await res.json();

      const list = data.conversations || [];
      setConvos(list);

      if (conversationIdFromUrl) {
        const match = list.find((c: Conversation) => c.id === conversationIdFromUrl);
        if (match) {
          setActive(match);
          return;
        }
      }

      if (list.length) {
        setActive(list[0]);
      }
    })();
  }, [conversationIdFromUrl]);

  /* ================= JOIN ROOM ================= */
  useEffect(() => {
    if (!active || !socket) return;

    const conversationId = active.id;
    activeIdRef.current = conversationId;

    if (joinedRoomRef.current && joinedRoomRef.current !== conversationId) {
      socket.emit("leave-room", joinedRoomRef.current);
    }

    socket.emit("join-room", conversationId);
    joinedRoomRef.current = conversationId;

    (async () => {
      const res = await fetch(`/api/messages/${conversationId}`);
      const data = await res.json();
      setMessages(data.messages || []);

      await fetch(`/api/messages/${conversationId}/read`, {
        method: "POST",
      });
// 🔥 notify sidebar instantly
window.dispatchEvent(new Event("messages-updated"));

      setConvos((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                unread: 0,
              }
            : c
        )
      );
    })();
  }, [active, socket]);

  /* ================= SEND ================= */
  async function send() {
    if (!active?.allowed) return;
    if (!text.trim()) return;
    if (!socket) return;
    if (!active) return;
    if (!userId) return;

    const clientTempId = crypto.randomUUID();

    const temp: Msg = {
      conversationId: active.id,
      content: text,
      senderUserId: userId,
      createdAt: new Date().toISOString(),
      clientTempId,
    };

    setMessages((prev) => [...prev, temp]);

    setConvos((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? {
              ...c,
              lastMessage: temp.content,
              lastMessageTime: temp.createdAt,
            }
          : c
      )
    );

    setText("");

    try {
      const res = await fetch(`/api/messages/${active.id}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: temp.content }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "PAYMENT_OVERDUE") {
          alert(data.message || "Please complete your payment first.");

          setMessages((prev) =>
            prev.filter((m) => m.clientTempId !== clientTempId)
          );

          window.location.href = "/dashboard/payments";
          return;
        }

        alert(data.error || "Failed to send message");

        setMessages((prev) =>
          prev.filter((m) => m.clientTempId !== clientTempId)
        );

        return;
      }

      socket.emit("send-message", temp);
    } catch (err) {
      console.error("SEND ERROR:", err);

      setMessages((prev) =>
        prev.filter((m) => m.clientTempId !== clientTempId)
      );

      alert("Something went wrong");
    }
  }

  const chatItems = useMemo(() => buildChatItems(messages), [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (status === "loading" || !userId) return null;

  return (
    <div className="h-[80vh] bg-white border rounded-2xl flex overflow-hidden">
      {/* LEFT */}
      <div className="w-[360px] border-r bg-[#F7FAFA] overflow-auto">
        <div className="p-4 border-b bg-white">
          <h2 className="text-2xl font-bold text-[#004B4B]">Messages</h2>
        </div>

        <div className="p-3 space-y-2">
          {convos.map((c) => {
            const person = getPerson(c);

            return (
              <button
                key={c.id}
                onClick={() => setActive(c)}
                className={`w-full text-left p-3 rounded-2xl border transition ${
                  active?.id === c.id
                    ? "bg-white border-[#004B4B] shadow-sm"
                    : "bg-white/70 border-transparent hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={person.photo}
                    className="w-12 h-12 rounded-full object-cover"
                    alt={person.name}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-sm text-gray-900 truncate">
                        {person.name}
                      </p>

                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatListTime(c.lastMessageTime)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 mt-1">
                      <p className="text-xs text-gray-500 truncate">
                        {c.lastMessage || person.label || "No messages yet"}
                      </p>

                      {c.unread > 0 && (
                        <span className="min-w-[22px] h-[22px] flex items-center justify-center text-[11px] font-semibold bg-[#004B4B] text-white rounded-full">
                          {c.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex items-center gap-3 bg-white">
          {active ? (
            (() => {
              const person = getPerson(active);

              return (
                <>
                  <img
                    src={person.photo}
                    className="w-10 h-10 rounded-full object-cover"
                    alt={person.name}
                  />
                  <div>
                    <p className="font-semibold text-[#004B4B]">{person.name}</p>
                    <p className="text-xs text-gray-500">{person.label}</p>
                  </div>
                </>
              );
            })()
          ) : (
            <p className="font-semibold text-gray-500">Select chat</p>
          )}
        </div>

        <div className="flex-1 p-4 overflow-auto space-y-3 bg-[#FAFCFC]">
          {chatItems.map((item) => {
            if (item.type === "date") {
              return (
                <div key={item.key} className="flex justify-center">
                  <span className="px-3 py-1 rounded-full text-xs bg-[#E7F1F1] text-[#004B4B] border">
                    {item.label}
                  </span>
                </div>
              );
            }

            const m = item.message;
            const mine = m.senderUserId === userId;
            const person = getPerson(active);

            return (
              <div
                key={item.key}
                className={`flex items-end gap-2 ${
                  mine ? "justify-end" : "justify-start"
                }`}
              >
                {!mine && (
                  <img
                    src={person.photo}
                    className="w-8 h-8 rounded-full object-cover"
                    alt={person.name}
                  />
                )}

                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                    mine
                      ? "bg-[#4CB6B6] text-white"
                      : "bg-white border text-gray-800"
                  }`}
                >
                  <p>{m.content}</p>
                  <p
                    className={`mt-1 text-[11px] text-right ${
                      mine ? "text-white/80" : "text-gray-400"
                    }`}
                  >
                    {formatBubbleTime(m.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        <div className="p-3 border-t flex gap-2 bg-white">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
            disabled={!active?.allowed}
            className="flex-1 border rounded-xl px-3 py-2"
            placeholder={
              !active?.allowed
                ? "Complete payment to continue chatting"
                : "Type a message..."
            }
          />

          <button
            onClick={send}
            disabled={!active?.allowed}
            className="px-4 py-2 bg-[#004B4B] text-white rounded-xl disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
// "use client";

// import { useEffect, useRef, useState } from "react";
// import { io, Socket } from "socket.io-client";

// type Conversation = {
//   id: string;
//   unread: number;
//   booking: {
//     status: string;
//     student: {
//       name: string;
//       image?: string | null;
//     };
//   };
// };

// type Msg = {
//   id?: string;
//   content: string;
//   senderTutorId?: string | null;
//   senderUserId?: string | null;
//   createdAt: string;
//   conversationId: string;
//   clientTempId?: string;
// };

// export default function TutorMessagesPage() {
//   const [tutorId, setTutorId] = useState<string | null>(null);

//   const [convos, setConvos] = useState<Conversation[]>([]);
//   const [active, setActive] = useState<Conversation | null>(null);
//   const [messages, setMessages] = useState<Msg[]>([]);
//   const [text, setText] = useState("");
//   const [socket, setSocket] = useState<Socket | null>(null);

//   const bottomRef = useRef<HTMLDivElement | null>(null);
//   const activeIdRef = useRef<string | null>(null);
//   const joinedRoomRef = useRef<string | null>(null);

//   /* ================= GET TUTOR ID ================= */
//   useEffect(() => {
//     async function loadTutor() {
//       try {
//         const res = await fetch("/api/tutor/me");
//         const data = await res.json();

//         console.log("Tutor API response:", data);

//        if (data?.tutor?.id) {
//   setTutorId(data.tutor.id);
// }
//       } catch (err) {
//         console.error("Tutor fetch error:", err);
//       }
//     }

//     loadTutor();
//   }, []);

//   /* ================= SOCKET INIT ================= */
//   useEffect(() => {
//     let s: Socket | null = null;

//     (async () => {
//       try {
//         await fetch("/api/socket/io");

//        s = io("http://localhost:3000", {
//   path: "/api/socket/io",
//   transports: ["websocket"],
// });

//         s.on("receive-message", (data: Msg) => {
//           if (data.conversationId === activeIdRef.current) {
//             setMessages((prev) => {
//               if (
//                 data.clientTempId &&
//                 prev.some((p) => p.clientTempId === data.clientTempId)
//               ) {
//                 return prev;
//               }
//               return [...prev, data];
//             });
//           }
//         });

//         setSocket(s);
//       } catch (err) {
//         console.error("Socket error:", err);
//       }
//     })();

//     return () => {
//       if (s) s.disconnect();
//     };
//   }, []);

//   /* ================= LOAD CONVERSATIONS ================= */
//   useEffect(() => {
//     (async () => {
//       const res = await fetch("/api/tutor/messages/conversations");
//       const data = await res.json();

//       setConvos(data.conversations || []);

//       if (data.conversations?.length) {
//         setActive(data.conversations[0]);
//       }
//     })();
//   }, []);

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

//     async function openConversation() {
//       const res = await fetch(`/api/tutor/messages/${conversationId}`);
//       const data = await res.json();
//       setMessages(data.messages || []);

//       await fetch(`/api/tutor/messages/${conversationId}/read`, {
//         method: "POST",
//       });

//       const cRes = await fetch("/api/tutor/messages/conversations");
//       const cData = await cRes.json();
//       setConvos(cData.conversations || []);
//     }

//     openConversation();
//   }, [active, socket]);

//   /* ================= SEND ================= */
//   async function send() {
//     if (!text.trim() || !active || !socket || !tutorId) return;

//     const clientTempId = crypto.randomUUID();

//     const temp: Msg = {
//       conversationId: active.id,
//       content: text,
//       senderTutorId: tutorId,
//       createdAt: new Date().toISOString(),
//       clientTempId,
//     };

//     setMessages((prev) => [...prev, temp]);
//     setText("");

//     await fetch(`/api/tutor/messages/${active.id}/send`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ content: temp.content }),
//     });

//     socket.emit("send-message", temp);
//   }

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   if (!tutorId) {
//     return <div className="p-6">Loading tutor messages...</div>;
//   }

//   return (
//     <div className="h-[80vh] bg-white border rounded-2xl flex overflow-hidden">
//       {/* LEFT */}
//       <div className="w-[340px] border-r bg-gray-50 p-3 space-y-2 overflow-auto">
//         {convos.map((c) => (
//           <button
//             key={c.id}
//             onClick={() => setActive(c)}
//             className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${
//               active?.id === c.id
//                 ? "bg-white border border-black"
//                 : "hover:bg-white"
//             }`}
//           >
//             {c.booking?.student?.image ? (
//               <img
//                 src={c.booking.student.image}
//                 className="w-10 h-10 rounded-full object-cover"
//               />
//             ) : (
//               <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
//                 {c.booking?.student?.name?.charAt(0)}
//               </div>
//             )}

//             <div className="flex-1 text-left">
//               <p className="font-medium text-sm">
//                 {c.booking?.student?.name}
//               </p>
//               <p className="text-xs text-gray-500">
//                 {c.booking?.status}
//               </p>
//             </div>
//           </button>
//         ))}
//       </div>

//       {/* RIGHT */}
//       <div className="flex-1 flex flex-col">
//         <div className="p-4 border-b flex items-center gap-3">
//           {active?.booking?.student?.image && (
//             <img
//               src={active.booking.student.image}
//               className="w-9 h-9 rounded-full object-cover"
//             />
//           )}

//           <div>
//             <p className="font-semibold">
//               {active?.booking?.student?.name}
//             </p>
//             <p className="text-xs text-gray-500">
//               {active?.booking?.status}
//             </p>
//           </div>
//         </div>

//         <div className="flex-1 p-4 overflow-auto space-y-3 bg-gray-50">
//           {messages.map((m, i) => {
//             const mine = m.senderTutorId === tutorId;

//             return (
//               <div
//                 key={m.id ?? m.clientTempId ?? i}
//                 className={`flex items-end gap-2 ${
//                   mine ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 {!mine && (
//                   active?.booking?.student?.image ? (
//                     <img
//                       src={active.booking.student.image}
//                       className="w-8 h-8 rounded-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold">
//                       {active?.booking?.student?.name?.charAt(0)}
//                     </div>
//                   )
//                 )}

//                 <div
//                   className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
//                     mine ? "bg-black text-white" : "bg-white border"
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
//             className="flex-1 border rounded-xl px-3 py-2 text-sm"
//             placeholder="Type a message..."
//           />

//           <button
//             onClick={send}
//             className="px-4 py-2 bg-[#004B4B] text-white rounded-xl"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

type Conversation = {
  id: string;
  unread: number;
  allowed: boolean;
  lastMessage?: string;
  lastMessageTime?: string | null;
  booking: {
    status: string;
    student: {
      id?: string;
      name: string;
      image?: string | null;
    };
  };
};

type Msg = {
  id?: string;
  content: string;
  senderTutorId?: string | null;
  senderUserId?: string | null;
  createdAt: string;
  conversationId: string;
  clientTempId?: string;
};

function formatListTime(dateString?: string | null) {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();

  const sameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (sameDay) {
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

function formatDateLabel(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  const isToday =
    date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    date.toDateString() === yesterday.toDateString();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";

  return date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}


export default function TutorMessagesPage() {
  const [tutorId, setTutorId] = useState<string | null>(null);

  const [convos, setConvos] = useState<Conversation[]>([]);
  const [active, setActive] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const joinedRoomRef = useRef<string | null>(null);

  /* ================= GET TUTOR ID ================= */
  useEffect(() => {
    async function loadTutor() {
      try {
        const res = await fetch("/api/tutor/me");
        const data = await res.json();

        if (data?.tutor?.id) {
          setTutorId(data.tutor.id);
        }
      } catch (err) {
        console.error("Tutor fetch error:", err);
      }
    }

    loadTutor();
  }, []);

  /* ================= SOCKET INIT ================= */
  useEffect(() => {
    let s: Socket | null = null;

    (async () => {
      try {
        await fetch("/api/socket/io");

        s = io("http://localhost:3000", {
          path: "/api/socket/io",
          transports: ["websocket"],
        });

        s.on("receive-message", (data: Msg) => {
          // if active chat, append message live
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

            // active row unread should remain 0
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
            // other chat gets unread + last message update
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
      } catch (err) {
        console.error("Socket error:", err);
      }
    })();

    return () => {
      if (s) s.disconnect();
    };
  }, []);

  /* ================= LOAD CONVERSATIONS ================= */
  useEffect(() => {
    async function loadConversations() {
      const res = await fetch("/api/tutor/messages/conversations");
      const data = await res.json();

      const list = data.conversations || [];
      setConvos(list);

      if (list.length) {
        setActive((prev) => prev ?? list[0]);
      }
    }

    loadConversations();
  }, []);

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

    async function openConversation() {
      const res = await fetch(`/api/tutor/messages/${conversationId}`);
      const data = await res.json();
      setMessages(data.messages || []);

      await fetch(`/api/tutor/messages/${conversationId}/read`, {
        method: "POST",
      });

      // ✅ instantly remove unread from clicked row
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
    }

    openConversation();
  }, [active, socket]);

  /* ================= SEND ================= */
  async function send() {
    if (!text.trim() || !active || !socket || !tutorId) return;

    const clientTempId = crypto.randomUUID();

    const temp: Msg = {
      conversationId: active.id,
      content: text,
      senderTutorId: tutorId,
      createdAt: new Date().toISOString(),
      clientTempId,
    };

    setMessages((prev) => [...prev, temp]);

    // update left panel preview immediately
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
      await fetch(`/api/tutor/messages/${active.id}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: temp.content }),
      });

      socket.emit("send-message", temp);
    } catch (err) {
      console.error("Send error:", err);
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!tutorId) {
    return <div className="p-6">Loading tutor messages...</div>;
  }

  return (
    <div className="h-[80vh] bg-white border rounded-2xl flex overflow-hidden">
      {/* LEFT */}
      <div className="w-[360px] border-r bg-gray-50 overflow-auto">
        <div className="p-4 border-b bg-white">
          <h2 className="text-2xl font-bold text-[#004B4B]">Messages</h2>
        </div>

        <div className="p-3 space-y-2">
          {convos.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl transition border ${
                active?.id === c.id
                  ? "bg-white border-[#004B4B] shadow-sm"
                  : "bg-transparent border-transparent hover:bg-white"
              }`}
            >
              {c.booking?.student?.image ? (
                <img
                  src={c.booking.student.image}
                  className="w-12 h-12 rounded-full object-cover"
                  alt={c.booking.student.name}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#0B7A75] text-white flex items-center justify-center font-semibold text-base">
                  {c.booking?.student?.name?.charAt(0)?.toUpperCase()}
                </div>
              )}

              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-sm text-gray-900 truncate">
                    {c.booking?.student?.name}
                  </p>

                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {formatListTime(c.lastMessageTime)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 mt-1">
                  <p className="text-xs text-gray-500 truncate">
                    {c.lastMessage || c.booking?.status || "No messages yet"}
                  </p>

                  {c.unread > 0 && (
                   <span className="min-w-[22px] h-[22px] flex items-center justify-center text-[11px] font-semibold bg-[#004B4B] text-white rounded-full">
  {c.unread}
</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex items-center gap-3 bg-white">
          {active?.booking?.student?.image ? (
            <img
              src={active.booking.student.image}
              className="w-10 h-10 rounded-full object-cover"
              alt={active.booking.student.name}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#0B7A75] text-white flex items-center justify-center font-semibold">
              {active?.booking?.student?.name?.charAt(0)?.toUpperCase()}
            </div>
          )}

          <div>
            <p className="font-semibold text-[#004B4B]">
              {active?.booking?.student?.name}
            </p>
            <p className="text-xs text-gray-500">
              {active?.booking?.status}
            </p>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-auto space-y-3 bg-gray-50">
         {messages.map((m, i) => {
  const mine = m.senderTutorId === tutorId;

  // 👉 previous message
  const prev = messages[i - 1];

  const showDate =
    i === 0 ||
    new Date(prev.createdAt).toDateString() !==
      new Date(m.createdAt).toDateString();

  return (
    <div key={m.id ?? m.clientTempId ?? i}>
      
      {/* 🔥 DATE SEPARATOR */}
      {showDate && (
        <div className="flex justify-center my-4">
          <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
            {formatDateLabel(m.createdAt)}
          </span>
        </div>
      )}

      {/* MESSAGE */}
      <div
        className={`flex items-end gap-2 ${
          mine ? "justify-end" : "justify-start"
        }`}
      >
        {!mine &&
          (active?.booking?.student?.image ? (
            <img
              src={active.booking.student.image}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold">
              {active?.booking?.student?.name
                ?.charAt(0)
                ?.toUpperCase()}
            </div>
          ))}

        <div
          className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
            mine ? "bg-[#004B4B] text-white" : "bg-white border"
          }`}
        >
          <p>{m.content}</p>

          <p
            className={`mt-1 text-[11px] ${
              mine ? "text-white/80" : "text-gray-400"
            } text-right`}
          >
            {formatBubbleTime(m.createdAt)}
          </p>
        </div>
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
            className="flex-1 border rounded-xl px-3 py-2 text-sm"
            placeholder="Type a message..."
          />

          <button
            onClick={send}
            className="px-5 py-2 bg-[#004B4B] text-white rounded-xl font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
// "use client";

// import { useEffect, useRef, useState } from "react";
// import { io, Socket } from "socket.io-client";
// import { useSession } from "next-auth/react";

// type Conversation = {
//   id: string;
//   unread: number;
//   allowed: boolean;

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
//   conversationId?: string;
// };

// export default function TutorMessagesPage() {
//   const { data: session } = useSession();
//   const tutorId = session?.user?.id;

//   const [convos, setConvos] = useState<Conversation[]>([]);
//   const [active, setActive] = useState<Conversation | null>(null);
//   const [messages, setMessages] = useState<Msg[]>([]);
//   const [text, setText] = useState("");
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const bottomRef = useRef<HTMLDivElement | null>(null);

//   /* ================= SOCKET ================= */

//   useEffect(() => {
//   let socketInstance: Socket;

//   async function init() {
//     await fetch("/api/socket/io");

//     socketInstance = io({
//       path: "/api/socket/io",
//       transports: ["websocket"],
//     });

//     setSocket(socketInstance);

//     socketInstance.on("receive-message", (data: Msg) => {
//       setMessages((prev) => {
//         // Only append if this conversation is open
//         if (data.conversationId === active?.id) {
//           return [...prev, data];
//         }
//         return prev;
//       });
//     });
//   }

//   init();

//   return () => {
//     socketInstance?.disconnect();
//   };
// }, []);   // 🔥 REMOVE active?.id dependency

//   /* ================= LOAD CONVERSATIONS ================= */

//   async function loadConvos() {
//     const res = await fetch("/api/tutor/messages/conversations");
//     const data = await res.json();
//     setConvos(data.conversations || []);
//     if (!active && data.conversations?.length) {
//       setActive(data.conversations[0]);
//     }
//   }

//   /* ================= LOAD MESSAGES ================= */

//   async function loadMessages(id: string) {
//     const res = await fetch(`/api/tutor/messages/${id}`);
//     const data = await res.json();
//     setMessages(data.messages || []);

//     await fetch(`/api/tutor/messages/${id}/read`, {
//       method: "POST",
//     });
//   }

//   /* ================= SEND ================= */

//   async function send() {
//     if (!text.trim() || !active) return;

//     const temp: Msg = {
//       conversationId: active.id,
//       content: text,
//       senderTutorId: tutorId,
//       createdAt: new Date().toISOString(),
//     };

//     setMessages((prev) => [...prev, temp]);
//     setText("");

//     await fetch(`/api/tutor/messages/${active.id}/send`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ content: temp.content }),
//     });

//     socket?.emit("send-message", temp);
//   }

//   /* ================= EFFECTS ================= */

//   useEffect(() => {
//     loadConvos();
//   }, []);

//   useEffect(() => {
//     if (active && socket) {
//       socket.emit("join-room", active.id);
//       loadMessages(active.id);
//     }
//   }, [active?.id, socket]);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   /* ================= UI ================= */

//   return (
//     <div className="h-[80vh] bg-white border rounded-2xl flex overflow-hidden">

//       {/* LEFT SIDE */}
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
//             {/* PROFILE IMAGE */}
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

//             {c.unread > 0 && (
//               <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
//                 {c.unread}
//               </span>
//             )}
//           </button>
//         ))}
//       </div>

//       {/* RIGHT SIDE */}
//       <div className="flex-1 flex flex-col">

//         {/* HEADER */}
//         <div className="p-4 border-b flex items-center gap-3">
//           {active?.booking?.student?.image ? (
//             <img
//               src={active.booking.student.image}
//               className="w-9 h-9 rounded-full object-cover"
//             />
//           ) : (
//             <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
//               {active?.booking?.student?.name?.charAt(0)}
//             </div>
//           )}

//           <div>
//             <p className="font-semibold">
//               {active?.booking?.student?.name || "Select chat"}
//             </p>
//             <p className="text-xs text-gray-500">
//               {active?.booking?.status}
//             </p>
//           </div>
//         </div>

//         {/* CHAT AREA */}
//         <div className="flex-1 p-4 overflow-auto space-y-3 bg-gray-50">

//           {messages.map((m, i) => {
//             const mine = !!m.senderTutorId;


//             return (
//               <div
//                 key={i}
//                 className={`flex items-end gap-2 ${
//                   mine ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 {/* RECEIVER AVATAR */}
//                 {!mine && active?.booking?.student?.image && (
//                   <img
//                     src={active.booking.student.image}
//                     className="w-7 h-7 rounded-full object-cover"
//                   />
//                 )}

//                 <div
//                   className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
//                     mine
//                       ? "bg-black text-white"
//                       : "bg-white border"
//                   }`}
//                 >
//                   {m.content}
//                 </div>
//               </div>
//             );
//           })}

//           <div ref={bottomRef} />
//         </div>

//         {/* INPUT */}
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
  booking: {
    status: string;
    student: {
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
      const res = await fetch("/api/tutor/me");
      if (res.ok) {
        const data = await res.json();
        setTutorId(data.tutorId);
      }
    }
    loadTutor();
  }, []);

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
      const res = await fetch("/api/tutor/messages/conversations");
      const data = await res.json();

      setConvos(data.conversations || []);
      if (data.conversations?.length) {
        setActive(data.conversations[0]);
      }
    })();
  }, []);

  /* ================= JOIN ROOM ================= */
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
    // 1️⃣ Load messages
    const res = await fetch(`/api/tutor/messages/${conversationId}`);
    const data = await res.json();
    setMessages(data.messages || []);

    // 2️⃣ 🔥 MARK AS READ (THIS WAS MISSING)
    await fetch(`/api/tutor/messages/${conversationId}/read`, {
      method: "POST",
    });

    // 3️⃣ Refresh conversation list (remove red dot)
    const cRes = await fetch("/api/tutor/messages/conversations");
    const cData = await cRes.json();
    setConvos(cData.conversations || []);

    // 4️⃣ Refresh sidebar badge counter
    await fetch("/api/tutor/messages/unread-count");
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
    setText("");

    await fetch(`/api/tutor/messages/${active.id}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: temp.content }),
    });

    socket.emit("send-message", temp);
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!tutorId) return null;

  return (
    <div className="h-[80vh] bg-white border rounded-2xl flex overflow-hidden">
      {/* LEFT */}
      <div className="w-[340px] border-r bg-gray-50 p-3 space-y-2 overflow-auto">
        {convos.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${
              active?.id === c.id
                ? "bg-white border border-black"
                : "hover:bg-white"
            }`}
          >
            {c.booking?.student?.image ? (
              <img
                src={c.booking.student.image}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
                {c.booking?.student?.name?.charAt(0)}
              </div>
            )}

            <div className="flex-1 text-left">
              <p className="font-medium text-sm">
                {c.booking?.student?.name}
              </p>
              <p className="text-xs text-gray-500">
                {c.booking?.status}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* RIGHT */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex items-center gap-3">
          {active?.booking?.student?.image && (
            <img
              src={active.booking.student.image}
              className="w-9 h-9 rounded-full object-cover"
            />
          )}

          <div>
            <p className="font-semibold">
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

  return (
    <div
      key={m.id ?? m.clientTempId ?? i}
      className={`flex items-end gap-2 ${
        mine ? "justify-end" : "justify-start"
      }`}
    >
      {/* 👤 STUDENT AVATAR (left side only) */}
      {!mine && (
        active?.booking?.student?.image ? (
          <img
            src={active.booking.student.image}
            className="w-8 h-8 rounded-full object-cover"
            alt="student"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold">
            {active?.booking?.student?.name?.charAt(0)}
          </div>
        )
      )}

      {/* 💬 MESSAGE BUBBLE */}
      <div
        className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
          mine
            ? "bg-black text-white"
            : "bg-white border"
        }`}
      >
        {m.content}
      </div>
    </div>
  );
})}


          <div ref={bottomRef} />
        </div>

        <div className="p-3 border-t flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 border rounded-xl px-3 py-2 text-sm"
            placeholder="Type a message..."
          />

          <button
            onClick={send}
            className="px-4 py-2 bg-[#004B4B] text-white rounded-xl"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useEffect, useRef, useState } from "react";
// import { io, Socket } from "socket.io-client";
// import { useSession } from "next-auth/react";
// import { useSearchParams } from "next/navigation";
// import Image from "next/image";


// type Conversation = {
//   id: string;
//   bookingId: string;
//   unread: number;
//   allowed: boolean;
//   booking: {
//     status: string;
//     startTime: string;
//     tutor: { name: string; photo?: string | null };
//   };
// };

// type Msg = {
//   id?: string;
//   content: string;
//   senderUserId?: string | null;
//   senderTutorId?: string | null;
//   createdAt: string;
//   bookingId?: string;
// };

// export default function StudentMessagesPage() {
//   const { data: session } = useSession();
//   const userId = session?.user?.id;

//   const [convos, setConvos] = useState<Conversation[]>([]);
//   const [active, setActive] = useState<Conversation | null>(null);
//   const [messages, setMessages] = useState<Msg[]>([]);
//   const [text, setText] = useState("");
//   const [socket, setSocket] = useState<Socket | null>(null);

//   const bottomRef = useRef<HTMLDivElement | null>(null);

//  const searchParams = useSearchParams();
// const bookingFromUrl = searchParams?.get("bookingId") || null;



//   /* ================= SOCKET INIT ================= */

//   useEffect(() => {
//     let socketInstance: Socket;

//     async function init() {
//       await fetch("/api/socket/io");

//       socketInstance = io({
//         path: "/api/socket/io",
//         transports: ["websocket"],
//       });

//       setSocket(socketInstance);

//      socketInstance.on("receive-message", (data: Msg) => {
//   if (data.bookingId === active?.bookingId) {
//     setMessages((prev) => {
//       const exists = prev.some(
//         (m) =>
//           m.createdAt === data.createdAt &&
//           m.content === data.content
//       );
//       if (exists) return prev;

//       return [...prev, data];
//     });
//   }

//   // 🔥 IMPORTANT: refresh sidebar + unread badge
//   loadConvos();
// });
//     }

//     return () => {
//       socketInstance?.disconnect();
//     };
//   }, [active?.bookingId]);

//   /* ================= LOAD CONVERSATIONS ================= */

//   async function loadConvos() {
//     const res = await fetch("/api/messages/conversations");
//     const data = await res.json();
//     setConvos(data.conversations || []);

//     if (bookingFromUrl) {
//   const found = data.conversations.find(
//     (c: any) => c.bookingId === bookingFromUrl
//   );
//   if (found) {
//     setActive(found);
//     return;
//   }
// }

// // If no booking in URL → DO NOT auto select

//   }

//   /* ================= LOAD MESSAGES ================= */

//   async function loadMessages(bookingId: string) {
//     const res = await fetch(`/api/messages/${bookingId}`);
//     const data = await res.json();
//     setMessages(data.messages || []);

//     await fetch(`/api/messages/${bookingId}/read`, {
//       method: "POST",
//     });
//   }

//   /* ================= SEND MESSAGE ================= */

//   async function send() {
//     if (!active?.allowed || !socket) {
//       alert("Messaging not allowed yet.");
//       return;
//     }

//     if (!text.trim()) return;

//     const tempMessage: Msg = {
//       bookingId: active.bookingId,
//       content: text,
//       senderUserId: userId,
//       createdAt: new Date().toISOString(),
//     };

//     // 1️⃣ Immediately update UI
//     setMessages((prev) => [...prev, tempMessage]);
//     setText("");

//     // 2️⃣ Save to DB
//     await fetch(`/api/messages/${active.bookingId}/send`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ content: tempMessage.content }),
//     });

//     // 3️⃣ Emit realtime
//     socket.emit("send-message", tempMessage);
//   }

//   /* ================= JOIN ROOM WHEN ACTIVE CHANGES ================= */

//   useEffect(() => {
//     if (active && socket) {
//       socket.emit("join-room", active.bookingId);
//       loadMessages(active.bookingId);
//     }
//   }, [active?.bookingId, socket]);

//   /* ================= INITIAL LOAD ================= */

//   useEffect(() => {
//     loadConvos();
//   }, []);

//   /* ================= AUTO SCROLL ================= */

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   return (
//     <div className="h-[80vh] bg-white border rounded-2xl overflow-hidden flex">

//       {/* LEFT LIST */}
//       <div className="w-[340px] border-r bg-[#F7FAFA]">
//         <div className="p-4 font-semibold text-[#004B4B]">
//           Messages
//         </div>

//         <div className="px-3 space-y-2 overflow-auto h-[calc(80vh-60px)]">
//           {convos.map((c) => (
//             <button
//               key={c.id}
//               onClick={() => setActive(c)}
//               className={`w-full text-left p-3 rounded-xl border transition ${
//                 active?.bookingId === c.bookingId
//                   ? "bg-white border-[#4CB6B6]"
//                   : "bg-white/60 hover:bg-white"
//               }`}
//             >
//               <div className="flex items-center gap-3">
//                 <img
//                   src={c.booking.tutor.photo || "/default-avatar.png"}
//                   className="w-10 h-10 rounded-full object-cover"
//                   alt=""
//                 />

//                 <div className="flex-1">
//                   <div className="flex justify-between items-center">
//                     <p className="font-medium text-[#004B4B]">
//                       {c.booking.tutor.name}
//                     </p>

//                     {c.unread > 0 && (
//                       <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
//                         {c.unread}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {!c.allowed && (
//                 <p className="text-[11px] text-orange-600 mt-2">
//                   Enabled after tutor accepts booking
//                 </p>
//               )}
//             </button>
//           ))}
//         </div>
//       </div>

//      {/* RIGHT CHAT */}
// <div className="flex-1 flex flex-col">

//   {!active ? (

//     /* ================= DEFAULT SCREEN ================= */
//    <div className="flex-1 flex items-center justify-center bg-[#F8F6EF]">
//   <div className="text-center space-y-6">

//     {/* LOGO */}
//     <div className="flex justify-center">
//       <Image
//         src="/tutorsewa-logo.png"
//         alt="TutorSewa Logo"
//         width={100}
//         height={100}
//         className="drop-shadow-lg"
//       />
//     </div>

//     {/* BRAND NAME */}
//     <div className="text-3xl font-bold tracking-wide">
//       <span className="text-[#48A6A7]">TUTOR</span>
//       <span className="text-[#006A6A]">SEWA</span>
//     </div>

//     {/* MESSAGE BOX */}
//     <div className="border-2 border-[#006A6A] px-8 py-3 text-[#006A6A] font-medium rounded-lg inline-block">
//       Chat with tutors for more inquiries!
//     </div>

//   </div>
// </div>


//   ) : (

//     /* ================= ACTIVE CHAT ================= */
//     <>
//       {/* HEADER */}
//       <div className="p-4 border-b bg-white">
//         <p className="font-semibold text-[#004B4B]">
//           {active.booking.tutor.name}
//         </p>

//         <p className="text-xs text-gray-500">
//           Status: {active.booking.status}
//         </p>
//       </div>

//       {/* MESSAGE AREA */}
//       <div className="flex-1 p-4 overflow-auto space-y-2 bg-[#FAFBFC]">
//         {messages.map((m, index) => {
//           const mine = m.senderUserId === userId;

//           return (
//             <div
//               key={index}
//               className={`flex ${
//                 mine ? "justify-end" : "justify-start"
//               }`}
//             >
//               <div
//                 className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
//                   mine
//                     ? "bg-[#4CB6B6] text-white"
//                     : "bg-white border"
//                 }`}
//               >
//                 {m.content}
//               </div>
//             </div>
//           );
//         })}

//         <div ref={bottomRef} />
//       </div>

//       {/* INPUT AREA */}
//       <div className="p-3 border-t flex gap-2 bg-white">
//         <input
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           placeholder={
//             active.allowed
//               ? "Type a message..."
//               : "Chat locked until accepted"
//           }
//           className="flex-1 border rounded-xl px-3 py-2 text-sm"
//           disabled={!active.allowed}
//         />

//         <button
//           onClick={send}
//           disabled={!active.allowed}
//           className="px-4 py-2 rounded-xl bg-[#004B4B] text-white disabled:opacity-40"
//         >
//           Send
//         </button>
//       </div>
//     </>
//   )}

// </div>

//       </div>
    
//   );
// }







// "use client";

// import { useEffect, useRef, useState } from "react";
// import { io, Socket } from "socket.io-client";
// import { useSession } from "next-auth/react";

// type Conversation = {
//   id: string; // conversationId
//   unread: number;
//   allowed: boolean;
//   tutor: {
//     id: string;
//     name: string;
//     photo?: string | null;
//   };
// };

// type Msg = {
//   id?: string;
//   content: string;
//   senderUserId?: string | null;
//   senderTutorId?: string | null;
//   createdAt: string;
//   conversationId?: string;
// };

// export default function StudentMessagesPage() {
//   const { data: session } = useSession();
//   const userId = session?.user?.id;

//   const [convos, setConvos] = useState<Conversation[]>([]);
//   const [active, setActive] = useState<Conversation | null>(null);
//   const [messages, setMessages] = useState<Msg[]>([]);
//   const [text, setText] = useState("");
//   const [socket, setSocket] = useState<Socket | null>(null);

//   const bottomRef = useRef<HTMLDivElement | null>(null);

//   /* ================= SOCKET INIT ================= */

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
//     const res = await fetch("/api/messages/conversations");
//     const data = await res.json();

//     setConvos(data.conversations || []);

//     if (!active && data.conversations?.length) {
//       setActive(data.conversations[0]);
//     }
//   }

//   /* ================= LOAD MESSAGES ================= */

//   async function loadMessages(conversationId: string) {
//     const res = await fetch(`/api/messages/${conversationId}`);
//     const data = await res.json();
//     setMessages(data.messages || []);

//     await fetch(`/api/messages/${conversationId}/read`, {
//       method: "POST",
//     });
//   }

//   /* ================= SEND ================= */

//   async function send() {
//     if (!active?.allowed || !socket) return;
//     if (!text.trim()) return;

//     const temp: Msg = {
//       conversationId: active.id,
//       content: text,
//       senderUserId: userId,
//       createdAt: new Date().toISOString(),
//     };

//     setMessages((prev) => [...prev, temp]);
//     setText("");

//     await fetch(`/api/messages/${active.id}/send`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ content: temp.content }),
//     });

//     socket.emit("send-message", temp);
//   }

//   /* ================= JOIN ROOM ================= */

//   useEffect(() => {
//     if (active && socket) {
//       socket.emit("join-room", active.id);
//       loadMessages(active.id);
//     }
//   }, [active?.id, socket]);

//   /* ================= INIT ================= */

//   useEffect(() => {
//     loadConvos();
//   }, []);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   return (
//     <div className="h-[80vh] bg-white border rounded-2xl flex">

//       {/* LEFT */}
//       <div className="w-[340px] border-r bg-[#F7FAFA] p-4 space-y-2 overflow-auto">
//         {convos.map((c) => (
//           <button
//             key={c.id}
//             onClick={() => setActive(c)}
//             className={`w-full text-left p-3 rounded-xl border ${
//               active?.id === c.id
//                 ? "bg-white border-[#4CB6B6]"
//                 : "bg-white/60"
//             }`}
//           >
//             <div className="flex items-center gap-3">
//               <img
//                 src={c.tutor.photo || "/default-avatar.png"}
//                 className="w-10 h-10 rounded-full"
//               />
//               <div className="flex-1 flex justify-between">
//                 <p className="font-medium">{c.tutor.name}</p>
//                 {c.unread > 0 && (
//                   <span className="text-xs bg-red-500 text-white px-2 rounded-full">
//                     {c.unread}
//                   </span>
//                 )}
//               </div>
//             </div>
//           </button>
//         ))}
//       </div>

      
//       {/* RIGHT */}
// <div className="flex-1 flex flex-col">

//   {/* ✅ CHAT HEADER WITH PHOTO */}
//   <div className="p-4 border-b flex items-center gap-3 bg-white">
//     {active ? (
//       <>
//         <img
//           src={active.tutor.photo || "/default-avatar.png"}
//           className="w-10 h-10 rounded-full object-cover"
//         />

//         <div>
//           <p className="font-semibold text-[#004B4B]">
//             {active.tutor.name}
//           </p>
//           <p className="text-xs text-gray-500">
//             Chat conversation
//           </p>
//         </div>
//       </>
//     ) : (
//       <p className="font-semibold text-gray-500">
//         Select chat
//       </p>
//     )}
//   </div>


//         <div className="flex-1 p-4 overflow-auto space-y-2">
//           {messages.map((m, i) => {
//   const mine = m.senderUserId === userId;

//   return (
//     <div
//       key={i}
//       className={`flex items-end gap-2 ${
//         mine ? "justify-end" : "justify-start"
//       }`}
//     >
//       {/* 👤 Tutor Avatar (left side messages only) */}
//       {!mine && (
//         <img
//           src={active?.tutor.photo || "/default-avatar.png"}
//           className="w-8 h-8 rounded-full object-cover"
//         />
//       )}

//       {/* 💬 Message Bubble */}
//       <div
//         className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
//           mine
//             ? "bg-[#4CB6B6] text-white"
//             : "bg-white border"
//         }`}
//       >
//         {m.content}
//       </div>
//     </div>
//   );
// })}

//           <div ref={bottomRef} />
//         </div>

//         <div className="p-3 border-t flex gap-2">
//           <input
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             disabled={!active?.allowed}
//             className="flex-1 border rounded-xl px-3 py-2"
//           />
//           <button
//             onClick={send}
//             disabled={!active?.allowed}
//             className="px-4 py-2 bg-[#004B4B] text-white rounded-xl"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }







// "use client";

// import { useEffect, useRef, useState } from "react";
// import { io, Socket } from "socket.io-client";
// import { useSession } from "next-auth/react";

// type Conversation = {
//   id: string;
//   unread: number;
//   allowed: boolean;
//   tutor: {
//     id: string;
//     name: string;
//     photo?: string | null;
//   };
// };

// type Msg = {
//   id?: string;
//   content: string;
//   senderUserId?: string | null;
//   senderTutorId?: string | null;
//   createdAt: string;
//   conversationId?: string;
// };

// export default function StudentMessagesPage() {
//   const { data: session } = useSession();
//   const userId = session?.user?.id;

//   const [convos, setConvos] = useState<Conversation[]>([]);
//   const [active, setActive] = useState<Conversation | null>(null);
//   const [messages, setMessages] = useState<Msg[]>([]);
//   const [text, setText] = useState("");
//   const [socket, setSocket] = useState<Socket | null>(null);

//   const activeRef = useRef<string | null>(null);
//   const bottomRef = useRef<HTMLDivElement | null>(null);

//   /* ================= SOCKET INIT ================= */

//   useEffect(() => {
//     let socketInstance: Socket;

//     async function init() {
//       await fetch("/api/socket/io");

//       socketInstance = io({
//         path: "/api/socket/io",
//         transports: ["websocket"],
//       });

//       setSocket(socketInstance);

//       socketInstance.on("receive-message", (data: Msg) => {
//         // Only append if current room matches
//         if (data.conversationId === activeRef.current) {
//           setMessages((prev) => {
//             // Prevent duplicates
//             if (prev.find((m) => m.id === data.id)) return prev;
//             return [...prev, data];
//           });
//         }
//       });
//     }

//     init();

//     return () => {
//       socketInstance?.disconnect();
//     };
//   }, []);

//   /* ================= LOAD CONVERSATIONS ================= */

//   useEffect(() => {
//     async function load() {
//       const res = await fetch("/api/messages/conversations");
//       const data = await res.json();
//       setConvos(data.conversations || []);

//       if (data.conversations?.length) {
//         setActive(data.conversations[0]);
//       }
//     }

//     load();
//   }, []);

//   /* ================= LOAD MESSAGES ================= */

//   useEffect(() => {
//     if (!active || !socket) return;

//     const conversationId = active.id; // ✅ FIXED

//     activeRef.current = conversationId;

//     socket.emit("join-room", conversationId);

//     async function load() {
//       const res = await fetch(`/api/messages/${conversationId}`);
//       const data = await res.json();
//       setMessages(data.messages || []);
//     }

//     load();
//   }, [active, socket]);

//   /* ================= SEND ================= */

//   async function send() {
//     if (!text.trim() || !active || !socket || !userId) return;

//     const conversationId = active.id;

//     const temp: Msg = {
//       conversationId,
//       content: text,
//       senderUserId: userId,
//       createdAt: new Date().toISOString(),
//     };

//     // Instant UI update
//     setMessages((prev) => [...prev, temp]);
//     setText("");

//     // Save in DB
//     const res = await fetch(`/api/messages/${conversationId}/send`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ content: temp.content }),
//     });

//     const saved = await res.json();

//     // Emit saved message (with real id)
//     socket.emit("send-message", saved.message);
//   }

//   /* ================= AUTO SCROLL ================= */

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   /* ================= UI ================= */

//   return (
//     <div className="h-[80vh] bg-white border rounded-2xl flex">

//       {/* LEFT PANEL */}
//       <div className="w-[340px] border-r bg-[#F7FAFA] p-4 space-y-2 overflow-auto">
//         {convos.map((c) => (
//           <button
//             key={c.id}
//             onClick={() => setActive(c)}
//             className={`w-full text-left p-3 rounded-xl border ${
//               active?.id === c.id
//                 ? "bg-white border-[#4CB6B6]"
//                 : "bg-white/60"
//             }`}
//           >
//             <div className="flex items-center gap-3">
//               <img
//                 src={c.tutor.photo || "/default-avatar.png"}
//                 className="w-10 h-10 rounded-full"
//               />
//               <div className="flex-1 flex justify-between">
//                 <p className="font-medium">{c.tutor.name}</p>
//                 {c.unread > 0 && (
//                   <span className="text-xs bg-red-500 text-white px-2 rounded-full">
//                     {c.unread}
//                   </span>
//                 )}
//               </div>
//             </div>
//           </button>
//         ))}
//       </div>

//       {/* RIGHT PANEL */}
//       <div className="flex-1 flex flex-col">

//         {/* HEADER */}
//         <div className="p-4 border-b flex items-center gap-3 bg-white">
//           {active ? (
//             <>
//               <img
//                 src={active.tutor.photo || "/default-avatar.png"}
//                 className="w-10 h-10 rounded-full object-cover"
//               />
//               <div>
//                 <p className="font-semibold text-[#004B4B]">
//                   {active.tutor.name}
//                 </p>
//                 <p className="text-xs text-gray-500">
//                   Chat conversation
//                 </p>
//               </div>
//             </>
//           ) : (
//             <p className="font-semibold text-gray-500">
//               Select chat
//             </p>
//           )}
//         </div>

//         {/* CHAT AREA */}
//         <div className="flex-1 p-4 overflow-auto space-y-2 bg-gray-50">
//           {messages.map((m, i) => {
//             const mine = m.senderUserId === userId;

//             return (
//               <div
//                 key={i}
//                 className={`flex items-end gap-2 ${
//                   mine ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 {!mine && (
//                   <img
//                     src={active?.tutor.photo || "/default-avatar.png"}
//                     className="w-8 h-8 rounded-full object-cover"
//                   />
//                 )}

//                 <div
//                   className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
//                     mine
//                       ? "bg-[#4CB6B6] text-white"
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
//             disabled={!active?.allowed}
//             className="flex-1 border rounded-xl px-3 py-2"
//             placeholder="Type a message..."
//           />
//           <button
//             onClick={send}
//             disabled={!active?.allowed}
//             className="px-4 py-2 bg-[#004B4B] text-white rounded-xl"
//           >
//             Send
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }



// "use client";

// import { useEffect, useRef, useState } from "react";
// import { io, Socket } from "socket.io-client";
// import { useSession } from "next-auth/react";

// // type Conversation = {
// //   id: string;
// //   unread: number;
// //   allowed: boolean;
// //   tutor: {
// //     id: string;
// //     name: string;
// //     photo?: string | null;
// //   };
// // };


// // added thrift

// type Conversation = {
//   id: string;
//   unread: number;
//   allowed: boolean;
//   type: "TUTOR_SESSION" | "THRIFT";
//   tutor: {
//     id: string;
//     name: string;
//     photo?: string | null;
//   };
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

//   /* ================= SOCKET INIT (ONLY ONCE) ================= */
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
//   useEffect(() => {
//     (async () => {
//       const res = await fetch("/api/messages/conversations");
//       const data = await res.json();

//       setConvos(data.conversations || []);

//       if (!active && data.conversations?.length) {
//         setActive(data.conversations[0]);
//       }
//     })();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   /* ================= JOIN + LOAD MESSAGES WHEN ACTIVE CHANGES ================= */
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
//     if (!active?.allowed) return;
//     if (!text.trim()) return;
//     if (!socket) return;
//     if (!active) return;
//     if (!userId) return;

//     const clientTempId = crypto.randomUUID();

//     const temp: Msg = {
//       conversationId: active.id,
//       content: text,
//       senderUserId: userId,
//       createdAt: new Date().toISOString(),
//       clientTempId,
//     };

//     setMessages((prev) => [...prev, temp]);
//     setText("");

//     await fetch(`/api/messages/${active.id}/send`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ content: temp.content }),
//     });

//     socket.emit("send-message", temp);
//   }

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//    if (status === "loading") {
//   return null;
// }

// if (!userId) {
//   return null;
// }
//   return (
//     <div className="h-[80vh] bg-white border rounded-2xl flex">
//       {/* LEFT */}
//       <div className="w-[340px] border-r bg-[#F7FAFA] p-4 space-y-2 overflow-auto">
//         {convos.map((c) => (
//           <button
//             key={c.id}
//             onClick={() => setActive(c)}
//             className={`w-full text-left p-3 rounded-xl border ${
//               active?.id === c.id ? "bg-white border-[#4CB6B6]" : "bg-white/60"
//             }`}
//           >
//             <div className="flex items-center gap-3">
//               <img
//                 src={c.tutor.photo || "/default-avatar.png"}
//                 className="w-10 h-10 rounded-full object-cover"
//                 alt="tutor"
//               />
//               <div className="flex-1 flex justify-between">
//                 <p className="font-medium">{c.tutor.name}</p>
//                 {c.unread > 0 && (
//                   <span className="text-xs bg-red-500 text-white px-2 rounded-full">
//                     {c.unread}
//                   </span>
//                 )}
//               </div>
//             </div>
//           </button>
//         ))}
//       </div>

//       {/* RIGHT */}
//       <div className="flex-1 flex flex-col">
//         {/* HEADER WITH PHOTO */}
//         <div className="p-4 border-b flex items-center gap-3 bg-white">
//           {active ? (
//             <>
//               <img
//                 src={active.tutor.photo || "/default-avatar.png"}
//                 className="w-10 h-10 rounded-full object-cover"
//                 alt="tutor"
//               />
//               <div>
//   <p className="font-semibold text-[#004B4B]">{active.tutor.name}</p>

//   <p className="text-xs text-gray-500">
//     {active?.type === "THRIFT"
//       ? "🛒 Thrift Inquiry"
//       : "TutorChat"}
//   </p>
// </div>

//             </>
//           ) : (
//             <p className="font-semibold text-gray-500">Select chat</p>
//           )}
//         </div>

//         <div className="flex-1 p-4 overflow-auto space-y-2">
//           {messages.map((m, i) => {
//             const mine = m.senderUserId === userId;

//             return (
//               <div
//                 key={m.id ?? m.clientTempId ?? i}
//                 className={`flex items-end gap-2 ${mine ? "justify-end" : "justify-start"}`}
//               >
//                 {!mine && (
//                   <img
//                     src={active?.tutor.photo || "/default-avatar.png"}
//                     className="w-8 h-8 rounded-full object-cover"
//                     alt="tutor"
//                   />
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
//             placeholder={!active?.allowed ? "Messaging not allowed" : "Type a message..."}
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

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";


/* ================= UPDATED TYPE ================= */
type Conversation = {
  id: string;
  unread: number;
  allowed: boolean;
  type: "TUTOR_SESSION" | "THRIFT";

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

/* ================= HELPER ================= */
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
        if (data?.conversationId && data.conversationId === activeIdRef.current) {
          setMessages((prev) => {
            if (data.clientTempId && prev.some((p) => p.clientTempId === data.clientTempId)) {
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
    const res = await fetch("/api/messages/conversations");
    const data = await res.json();

    const list = data.conversations || [];
    setConvos(list);

    // 🧠 open the correct conversation from URL
    if (conversationIdFromUrl) {
      const match = list.find((c: any) => c.id === conversationIdFromUrl);
      if (match) {
        setActive(match);
        return;
      }
    }

    // fallback (first chat)
    if (list.length) setActive(list[0]);
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

      await fetch(`/api/messages/${conversationId}/read`, { method: "POST" });
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
    setText("");

    await fetch(`/api/messages/${active.id}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: temp.content }),
    });

    socket.emit("send-message", temp);
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (status === "loading" || !userId) return null;

  return (
    <div className="h-[80vh] bg-white border rounded-2xl flex">
      {/* LEFT */}
      <div className="w-[340px] border-r bg-[#F7FAFA] p-4 space-y-2 overflow-auto">
        {convos.map((c) => {
          const person = getPerson(c);

          return (
            <button
              key={c.id}
              onClick={() => setActive(c)}
              className={`w-full text-left p-3 rounded-xl border ${
                active?.id === c.id ? "bg-white border-[#4CB6B6]" : "bg-white/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={person.photo}
                  className="w-10 h-10 rounded-full object-cover"
                  alt="user"
                />
                <div className="flex-1 flex justify-between">
                  <div>
                    <p className="font-medium">{person.name}</p>
                    <p className="text-xs text-gray-500">{person.label}</p>
                  </div>
                  {c.unread > 0 && (
                    <span className="min-w-[22px] h-[22px] flex items-center justify-center text-[11px] bg-red-500 text-white rounded-full">
  {c.unread}
</span>

                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* RIGHT */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex items-center gap-3 bg-white">
          {active ? (
            (() => {
              const person = getPerson(active);
              return (
                <>
                  <img src={person.photo} className="w-10 h-10 rounded-full object-cover" />
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

        <div className="flex-1 p-4 overflow-auto space-y-2">
          {messages.map((m, i) => {
            const mine = m.senderUserId === userId;
            const person = getPerson(active);

            return (
              <div
                key={m.id ?? m.clientTempId ?? i}
                className={`flex items-end gap-2 ${mine ? "justify-end" : "justify-start"}`}
              >
                {!mine && (
                  <img src={person.photo} className="w-8 h-8 rounded-full object-cover" />
                )}

                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                    mine ? "bg-[#4CB6B6] text-white" : "bg-white border"
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
            disabled={!active?.allowed}
            className="flex-1 border rounded-xl px-3 py-2"
            placeholder={!active?.allowed ? "Messaging not allowed" : "Type a message..."}
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

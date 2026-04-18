// "use client";

// import { useEffect, useState } from "react";
// import {
//   useParams,
//   useRouter,
//   useSearchParams,
// } from "next/navigation";
// import {
//   LiveKitRoom,
//   VideoConference,
// } from "@livekit/components-react";

// import "@livekit/components-styles";

// export default function SessionRoom() {
//   const params = useParams();
//   const room = params?.room as string;

//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const role = searchParams?.get("role") || "student";

//   const [token, setToken] = useState<string | null>(null);
//   const [identity, setIdentity] = useState("");

//   useEffect(() => {
//     async function getToken() {
//       const res = await fetch("/api/livekit/token", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ room, role }),
//       });

//       const data = await res.json();
//       setToken(data.token);

//       // 👇 Extract identity (nice UI label)
//       if (data.identity) {
//         setIdentity(data.identity);
//       } else {
//         setIdentity(role + "_" + Date.now());
//       }
//     }

//     if (room) getToken();
//   }, [room, role]);

//   /* ================= LOADING UI ================= */

//   if (!token) {
//     return (
//       <div className="h-screen w-screen flex items-center justify-center bg-black text-white text-lg font-semibold">
//         Connecting to session...
//       </div>
//     );
//   }

//   return (

//       <>
//   <style jsx global>{`
//   /* Hide any button that has "Chat" text */
//   button:has(span:contains("Chat")) {
//     display: none !important;
//   }
// `}</style>

//     <div className="h-screen w-screen bg-black text-white flex flex-col">

//       {/* ================= TOP BAR ================= */}
//       <div className="flex items-center justify-between px-6 py-3 bg-black/70 backdrop-blur border-b border-gray-800">


//         <div className="font-semibold text-lg">
//           TutorSewa Live Session
//         </div>

//         <div className="text-sm text-gray-300">
//           Room: <span className="text-white font-medium">{room}</span>
//         </div>

//         <div className="text-sm bg-[#006A6A] px-3 py-1 rounded-full">
//           {role.toUpperCase()}
//         </div>
//       </div>

//       {/* ================= VIDEO AREA ================= */}
//       <div className="flex-1 relative">

//         <LiveKitRoom
//           token={token}
//           serverUrl="http://localhost:7880"
//           connect={true}
//           video={true}
//           audio={true}
//           onDisconnected={() => {
//             if (role === "tutor") {
//               router.push("/tutor/bookings");
//             } else {
//               router.push("/dashboard/sessions");
//             }
//           }}
//         >
//           <VideoConference />
//         </LiveKitRoom>

//       </div>

//     </div>
//     </>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import {
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  ControlBar,
  useTracks,
} from "@livekit/components-react";

import { Track } from "livekit-client";

import "@livekit/components-styles";

export default function SessionRoom() {
  const params = useParams();
  const room = params?.room as string;

  const router = useRouter();
  const searchParams = useSearchParams();

  const role = searchParams?.get("role") || "student";

  const [token, setToken] = useState<string | null>(null);
  const [identity, setIdentity] = useState("");

  /* ================= TOKEN ================= */
  useEffect(() => {
    async function getToken() {
      const res = await fetch("/api/livekit/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ room, role }),
      });

      const data = await res.json();
      setToken(data.token);
      setIdentity(data.identity || "Guest");
    }

    if (room) getToken();
  }, [room, role]);

  /* ================= LOADING ================= */
  if (!token) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black text-white text-lg font-semibold">
        Connecting to session...
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col overflow-hidden">

      {/* ================= TOP BAR ================= */}
      <div className="flex items-center justify-between px-6 py-3 bg-black/80 border-b border-gray-800">
        <div className="font-semibold text-lg">
          TutorSewa Live Session
        </div>

        <div className="text-sm text-gray-300">
          Room: <span className="text-white">{room}</span>
        </div>

        <div className="text-sm bg-[#006A6A] px-3 py-1 rounded-full">
          {role.toUpperCase()}
        </div>
      </div>

      {/* ================= VIDEO ================= */}
      <div className="flex-1 flex items-center justify-center p-4">

        <div className="w-full h-full max-w-[1200px] max-h-[calc(100vh-80px)] bg-black rounded-xl overflow-hidden flex flex-col">

          <LiveKitRoom
            token={token}
            serverUrl="http://localhost:7880"
            connect={true}
            video={true}
            audio={true}
            onDisconnected={() => {
              if (role === "tutor") {
                router.push("/tutor/bookings");
              } else {
                router.push("/dashboard/sessions");
              }
            }}
          >
            <RoomContent />
          </LiveKitRoom>

        </div>

      </div>

    </div>
  );
}

/* ================= ROOM CONTENT ================= */
function RoomContent() {
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);

  return (
    <>
      {/* 🎥 VIDEO GRID */}
      <div className="flex-1 min-h-0">
        <GridLayout tracks={tracks}>
          <ParticipantTile />
        </GridLayout>
      </div>

      {/* 🎛 CONTROLS */}
      <div className="pb-4">
        <ControlBar
          controls={{
            microphone: true,
            camera: true,
            screenShare: true,
            chat: false, // ❌ removed chat
            leave: true,
          }}
        />
      </div>
    </>
  );
}
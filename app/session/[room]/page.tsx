// iframe not external api

// export default function SessionRoom({ params }: any) {
//   const room = params.room;

//   return (
//     <iframe
//       src={`https://meet.jit.si/${room}`}
//       allow="camera; microphone; fullscreen; display-capture"
//       className="w-full h-screen border-0"
//     />
//   );
// }







"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

export default function SessionRoom() {
  const { room } = useParams();
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);

  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://127.0.0.1:8443/external_api.js";
    script.async = true;

    script.onload = () => {
      const domain = "127.0.0.1:8443";

      const api = new (window as any).JitsiMeetExternalAPI(domain, {
        roomName: room,
        parentNode: containerRef.current,
        width: "100%",
        height: "100%",
      });

      apiRef.current = api;

      api.addEventListener("readyToClose", cleanupAndRedirect);
      api.addEventListener("videoConferenceLeft", cleanupAndRedirect);
      api.addEventListener("conferenceTerminated", cleanupAndRedirect);
    };

    document.body.appendChild(script);

    return () => {
      apiRef.current?.dispose();
    };
  }, [room]);

  function cleanupAndRedirect() {
    apiRef.current?.dispose();

    const params = new URLSearchParams(window.location.search);
    const role = params.get("role");

    if (role === "tutor") {
      router.replace("/tutor/bookings");
    } else {
      router.replace("/dashboard/sessions");
    }
  }

  return <div ref={containerRef} className="fixed inset-0 bg-black" />;
}







// after group


// "use client";

// import { useEffect, useRef } from "react";
// import { useParams, useRouter, useSearchParams } from "next/navigation";

// declare global {
//   interface Window {
//     JitsiMeetExternalAPI?: any;
//   }
// }

// export default function SessionRoom() {
//   const { room } = useParams<{ room: string }>();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const role = searchParams.get("role") || "student";

//   const containerRef = useRef<HTMLDivElement>(null);
//   const apiRef = useRef<any>(null);

//   useEffect(() => {
//     if (!room) return;

//     const domain = "127.0.0.1:8443"; // ✅ your self-hosted domain

//     // ✅ IMPORTANT: script path must be: https://<domain>/external_api.js
//     const scriptUrl = `https://${domain}/external_api.js`;

//     function cleanup() {
//       apiRef.current?.dispose();
//       apiRef.current = null;

//       if (role === "tutor") router.replace("/tutor/bookings");
//       else router.replace("/dashboard/sessions");
//     }

//     // If already created, do nothing
//     if (apiRef.current) return;

//     // ✅ Load script only once
//     const existingScript = document.querySelector(
//       `script[src="${scriptUrl}"]`
//     ) as HTMLScriptElement | null;

//     const loadScript = () =>
//       new Promise<void>((resolve, reject) => {
//         if (window.JitsiMeetExternalAPI) return resolve();

//         const s = document.createElement("script");
//         s.src = scriptUrl;
//         s.async = true;

//         s.onload = () => resolve();
//         s.onerror = () => reject(new Error("Failed to load Jitsi external_api.js"));

//         document.body.appendChild(s);
//       });

//     loadScript()
//       .then(() => {
//         if (!window.JitsiMeetExternalAPI) {
//           throw new Error("JitsiMeetExternalAPI not found after script load");
//         }

//         const api = new window.JitsiMeetExternalAPI(domain, {
//           roomName: room, // ✅ must be same for everyone
//           parentNode: containerRef.current,
//           width: "100%",
//           height: "100%",
//           userInfo: {
//             displayName: role === "tutor" ? "Tutor" : "Student",
//           },
//           configOverwrite: {
//             prejoinPageEnabled: false,
//           },
//         });

//         apiRef.current = api;

//         api.addEventListener("readyToClose", cleanup);
//         api.addEventListener("videoConferenceLeft", cleanup);
//         api.addEventListener("conferenceTerminated", cleanup);
//       })
//       .catch((err) => {
//         console.error("JITSI INIT ERROR:", err);
//         alert(
//           "Jitsi failed to load. Make sure your self-hosted Jitsi is running and HTTPS is trusted in the browser."
//         );
//         cleanup();
//       });

//     return () => cleanup();
//   }, [room]);

//   return <div ref={containerRef} className="fixed inset-0 bg-black" />;
// }

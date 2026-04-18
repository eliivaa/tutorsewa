

// // after thrift

// import { Server as IOServer } from "socket.io";
// import type { NextApiRequest, NextApiResponse } from "next";
// import type { Server as HTTPServer } from "http";

// /* ------------------ TYPE EXTENSION ------------------ */
// type NextApiResponseServerIO = NextApiResponse & {
//   socket: {
//     server: HTTPServer & {
//       io?: IOServer;
//     };
//   };
// };

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// let io: IOServer;

// export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
//   if (!res.socket.server.io) {
//     console.log("🧠 Creating persistent Socket.IO server");

//     io = new IOServer(res.socket.server, {
//       path: "/api/socket/io",
//       addTrailingSlash: false,
//       cors: {
//         origin: "*",
//         methods: ["GET", "POST"],
//       },
//     });

//     res.socket.server.io = io;

//     io.on("connection", (socket) => {
//       console.log("✅ Connected:", socket.id);

//       socket.on("join-room", (room: string) => {
//         socket.join(room);
//         console.log("➡ join", room);
//       });

//       socket.on("leave-room", (room: string) => {
//         socket.leave(room);
//         console.log("⬅ leave", room);
//       });

//       socket.on("send-message", (data) => {
//         if (!data?.conversationId) return;

//         console.log("📨 broadcast to:", data.conversationId);
//         io.to(data.conversationId).emit("receive-message", data);
//       });

//       socket.on("disconnect", () => {
//         console.log("❌ Disconnected:", socket.id);
//       });
//     });
//   }

//   res.end();
// }



import { Server as IOServer } from "socket.io";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Server as HTTPServer } from "http";

type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: HTTPServer & {
      io?: IOServer;
    };
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    console.log("🧠 Creating persistent Socket.IO server");

    const io = new IOServer(res.socket.server, {
      path: "/api/socket/io",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("✅ Connected:", socket.id);

      socket.on("join-room", (room: string) => {
        socket.join(room);
        console.log("➡ join", room);
      });

      socket.on("leave-room", (room: string) => {
        socket.leave(room);
        console.log("⬅ leave", room);
      });

      socket.on("send-message", (data) => {
        if (!data?.conversationId) return;

        console.log("📨 broadcast to:", data.conversationId);
        io.to(data.conversationId).emit("receive-message", data);
      });

      socket.on("disconnect", () => {
        console.log("❌ Disconnected:", socket.id);
      });
    });
  }

  res.end();
}
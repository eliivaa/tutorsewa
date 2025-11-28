"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#006A6A",
            color: "#fff",
            fontSize: "14px",
          },
          duration: 2500,
          success: {
            iconTheme: {
              primary: "#48A6A7",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </SessionProvider>
  );
}

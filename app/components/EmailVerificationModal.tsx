"use client";
import { motion, AnimatePresence } from "framer-motion";

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
  onResend?: () => void;
}

export default function EmailVerificationModal({
  isOpen,
  onClose,
  email,
  onResend,
}: EmailVerificationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-xl shadow-xl w-[90%] max-w-md p-6 text-center"
          >
            <h2 className="text-2xl font-bold text-[#006A6A] mb-3">
              Verify your email
            </h2>
            <p className="text-gray-600 mb-6">
              Hi <strong>{email?.split("@")[0]}</strong>, please verify your email
              address by clicking the link sent to{" "}
              <strong className="text-[#48A6A7]">{email}</strong>.
            </p>

            {/* <button
              onClick={onResend}
              className="bg-[#006A6A] text-white px-6 py-2 rounded-md shadow-md hover:bg-[#005454] transition"
            >
              Resend Verification Email
            </button> */}

            <button
              onClick={onClose}
              className="mt-6 text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

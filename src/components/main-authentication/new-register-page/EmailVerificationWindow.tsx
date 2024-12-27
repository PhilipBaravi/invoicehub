import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, RefreshCw, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmailVerificationWindowProps } from "./types";

const EmailVerificationWindow: React.FC<EmailVerificationWindowProps> = ({
  email,
  onClose,
}) => {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleResend = async () => {
    setIsResending(true);
    setResendSuccess(false);

    try {
      // Later implement the resend email logic here
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulating API call

      setResendSuccess(true);
      // Reset success message after 3 seconds
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (error) {
      console.error("Error resending verification email:", error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm"
      >
        <Card className="w-full max-w-md overflow-hidden bg-white dark:bg-stone-800 shadow-xl">
          <CardHeader className="bg-stone-100 dark:bg-stone-700 pb-6 pt-8">
            <CardTitle className="flex items-center justify-center text-2xl font-bold text-stone-800 dark:text-stone-100">
              <Mail className="mr-2 h-6 w-6" />
              Email Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <p className="mb-4 text-lg text-stone-700 dark:text-stone-300">
              We've sent a verification email to:
              <br />
              <span className="font-semibold text-stone-900 dark:text-stone-100">
                {email}
              </span>
            </p>
            <p className="mb-6 text-stone-600 dark:text-stone-400">
              Please check your email and click the verification link to
              complete the process.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center space-x-4 bg-stone-100 dark:bg-stone-700 p-6">
            <Button
              onClick={handleResend}
              disabled={isResending}
              className={`bg-stone-700 text-stone-100 hover:bg-stone-600 dark:bg-stone-600 dark:hover:bg-stone-500 transition-colors ${
                resendSuccess ? "bg-green-600 hover:bg-green-700" : ""
              }`}
            >
              {isResending ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : resendSuccess ? (
                <CheckCircle className="mr-2 h-4 w-4" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              {isResending
                ? "Resending..."
                : resendSuccess
                ? "Email Resent!"
                : "Resend Email"}
            </Button>
            <Button
              onClick={onClose}
              className="bg-stone-200 text-stone-800 hover:bg-stone-300 dark:bg-stone-600 dark:text-stone-100 dark:hover:bg-stone-500 transition-colors"
            >
              Close
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmailVerificationWindow;

import { useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "@/lib/utils/constants";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VerificationState {
  isLoading: boolean;
  isError: boolean;
  data: any | null;
}

const Verification = () => {
  const [searchParams] = useSearchParams();
  const [verificationState, setVerificationState] = useState<VerificationState>(
    {
      isLoading: true,
      isError: false,
      data: null,
    }
  );
  const [showContent, setShowContent] = useState(false);
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}register/activate?email=${email}&token=${token}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Verification failed");
      }
      const data = await response.json();
      if (data.length === 0) {
        throw new Error("No data received");
      }
      setVerificationState({ isLoading: false, isError: false, data });
    } catch (e: unknown) {
      console.error(e);
      setVerificationState({ isLoading: false, isError: true, data: null });
    }
  };

  const handleRedirect = () => {
    navigate("/login");
  };

  useEffect(() => {
    handleVerify();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    if (verificationState.isLoading) {
      return (
        <p className="text-center text-gray-600">Verifying your email...</p>
      );
    }

    if (verificationState.isError) {
      return (
        <>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex justify-center"
          >
            <AlertCircle className="w-16 h-16 text-red-500" />
          </motion.div>
          <CardTitle className="text-2xl font-bold text-center mt-4 text-red-600">
            Verification Failed
          </CardTitle>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-gray-600 mt-4"
          >
            We're sorry, but something went wrong during the email verification
            process. Please try again or contact support.
          </motion.p>
        </>
      );
    }

    return (
      <>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="flex justify-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500" />
        </motion.div>
        <CardTitle className="text-2xl font-bold text-center mt-4">
          Email Verified!
        </CardTitle>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-gray-600 mt-4"
        >
          Your email has been successfully verified. Thank you for confirming
          your account.
        </motion.p>
      </>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-900 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>{showContent && renderContent()}</CardHeader>
        <CardContent>{/* Content is now in the header */}</CardContent>
        <CardFooter className="flex justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Button
              className={`mt-4 ${
                verificationState.isError ? "bg-red-500 hover:bg-red-600" : ""
              }`}
              onClick={handleRedirect}
            >
              {verificationState.isError ? "Try Again" : "Continue to Login"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Verification;

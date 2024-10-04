import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

const EmailVerification: FC = () => {
  const [code, setCode] = useState<string[]>(["", "", "", ""]); // Holds the 4-digit code
  const [errorMessage, setErrorMessage] = useState<string>(""); // Error message
  const navigate = useNavigate();

  // Handle input change for each field
  const handleChange = (index: number, value: string) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setErrorMessage(""); // Reset the error message when user starts typing again
  };

  // Handle form submission for verification
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const verificationCode = code.join(""); // Combine the 4 digits into a single string

    // Ensure all digits are filled
    if (code.some((digit) => digit === "")) {
      setErrorMessage("Please fill in all the fields.");
      return;
    }

    // Check if the entered code matches "1,2,3,4"
    if (verificationCode === "1234") {
      navigate("/account-details"); // Navigate to the success page
    } else {
      setErrorMessage("The code is incorrect. Please try again.");
    }
  };

  // Handle resend verification logic (for future backend integration)
  const handleResendVerification = () => {
    console.log("Resend verification email clicked");
    // Future logic to resend email
  };

  return (
    <div className="w-full h-screen bg-brightBlue flex flex-col justify-center items-center">
      <div className="w-[90%] md:w-[70%] lg:w-[50%] xl:w-[35%] border rounded-lg bg-white flex flex-col items-center p-8 shadow-lg">
        <h2 className="text-2xl font-bold">Verify Your Email</h2>
        <p className="text-gray-700 mt-2 mb-4 text-center">
          We’ve sent a verification code to <strong>your-email@example.com</strong>. Enter the code to continue your setup.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="flex gap-2 mb-4">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-[50px] h-[50px] text-center text-2xl border border-gray-300 rounded-lg focus:outline-none focus:border-brightBlue"
              />
            ))}
          </div>
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>} {/* Display error message if any */}
          <button
  type="submit"
  className="bg-brightBlue text-white py-2 px-6 rounded-lg font-semibold hover:bg-white hover:text-brightBlue hover:border-brightBlue"
>
  Verify Email
</button>

        </form>
        <p className="text-gray-700 mt-4">
          Didn’t Receive Email?{" "}
          <button onClick={handleResendVerification} className="text-brightBlue hover:underline">
            Resend Email Verification
          </button>
        </p>
      </div>
    </div>
  );
};

export default EmailVerification;

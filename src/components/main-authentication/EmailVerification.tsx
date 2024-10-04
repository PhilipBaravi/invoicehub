import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

const EmailVerification: FC = () => {
  const [code, setCode] = useState<string[]>(["", "", "", ""]); 
  const [errorMessage, setErrorMessage] = useState<string>(""); 
  const navigate = useNavigate();

  // Handle input change for each field
  const handleChange = (index: number, value: string) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setErrorMessage(""); 
  };

  // Handle form submission for verification
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const verificationCode = code.join(""); 

    // Ensure all digits are filled
    if (code.some((digit) => digit === "")) {
      setErrorMessage("გთხოვთ შეავსოთ ყველა ველი.");
      return;
    }

    // Check if the entered code matches "1,2,3,4"
    if (verificationCode === "1234") {
      navigate("/account-details"); 
    } else {
      setErrorMessage("კოდი არასწორია. სცადეთ თავიდან.");
    }
  };

  // Handle resend verification logic (for future backend integration)
  const handleResendVerification = () => {
    console.log("ელ.ფოსტის გადაგზავნის მოთხოვნა");
    // Future logic to resend email
  };

  return (
    <div className="w-full h-screen bg-brightBlue flex flex-col justify-center items-center font-georgian">
      <div className="w-[90%] md:w-[70%] lg:w-[50%] xl:w-[35%] border rounded-lg bg-white flex flex-col items-center p-8 shadow-lg">
        <h2 className="text-2xl font-bold">ელ.ფოსტის ვალიდაცია</h2>
        <p className="text-gray-700 mt-2 mb-4 text-center">
          კოდი გაიგზავნა <strong>your-email@example.com</strong>. შეიყვანეთ კოდი, რათა დაასრულოთ თქვენი დაყენება.
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
          {errorMessage && <p className="text-red-500 mb-4 font-georgian">{errorMessage}</p>} 
          <button
            type="submit"
            className="bg-brightBlue text-white py-2 px-6 rounded-lg font-semibold hover:bg-white hover:text-brightBlue hover:border-brightBlue font-georgian"
          >
            ელ.ფოსტის ვალიდაცია
          </button>
        </form>
        <p className="text-gray-700 mt-4">
          ელ.ფოსტა არ მიგიღიათ?{" "}
          <button onClick={handleResendVerification} className="text-brightBlue hover:underline">
            ხელახლა გაგზავნა
          </button>
        </p>
      </div>
    </div>
  );
};

export default EmailVerification;

import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../AuthForm";

const RegisterPageForm: FC = () => {
  const [registerName, setRegisterName] = useState<string>("");
  const [registerPassword, setRegisterPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  const getRegisterNameDetails = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterName(e.target.value);
  };

  const getRegisterPasswordDetails = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterPassword(e.target.value);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePassword(registerPassword)) {
      setErrorMessage(
        "პაროლი უნდა შედგებოდეს მინიმუმ 8 სიმბოლოსგან, შეიცავდეს ერთ დიდ ასოს, ერთ პატარა ასოს, ერთ ციფრს და ერთ სპეციალურ სიმბოლოს."
      );
      return;
    }

    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:9090/api/v1/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: registerName,
          password: registerPassword,
        }),
      });

      if (response.ok) {
        navigate("/email-verification");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Something went wrong.");
      }
    } catch (error) {
      setErrorMessage("Network error, please try again later.");
    }
  };

  return (
    <div className="w-[100%] mt-[30px] flex flex-col justify-center items-center">
      <AuthForm
        onSubmitFunction={handleSubmit}
        onChangeFunctionName={getRegisterNameDetails}
        onChangeFunctionPassword={getRegisterPasswordDetails}
        inputNameValue={registerName}
        inputPasswordValue={registerPassword}
        errorMessage={errorMessage}
        showTerms={true}
        authButtonText="რეგისტრაცია"
      />
    </div>
  );
};

export default RegisterPageForm;

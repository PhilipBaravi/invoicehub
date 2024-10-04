import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../AuthForm";

const RegisterPageForm: FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  const getUsernameDetails = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const getPasswordDetails = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePassword(password)) {
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
          name: username,
          password: password,
        }),
      });

      if (response.ok) {
        navigate("/email-verification");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Something went wrong.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Network error, please try again later.");
      }
    }
  };

  return (
    <div className="w-[100%] mt-[30px] flex flex-col justify-center items-center">
      <AuthForm
        onSubmitFunction={handleSubmit}
        onChangeFunctionName={getUsernameDetails}
        onChangeFunctionPassword={getPasswordDetails}
        inputNameValue={username}
        inputPasswordValue={password}
        errorMessage={errorMessage}
        showTerms={true}
        authButtonText="რეგისტრაცია"
      />
    </div>
  );
};

export default RegisterPageForm;

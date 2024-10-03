import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../AuthForm";

const LoginPageForm: FC = () => {
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();

  const getEmailDetails = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginEmail(e.target.value);
  };

  const getPasswordDetails = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const correctEmail = "bob@gmail.com";
    const correctPassword = "Bobishere123!";

    if (loginEmail === correctEmail && loginPassword === correctPassword) {
      setErrorMessage("");
      console.log("Login successful!");
      navigate("/success");
    } else {
      setErrorMessage("Invalid email or password.");
    }
  };

  return (
    <div className="w-[100%] mt-[30px] flex flex-col justify-center items-center">
      <AuthForm
        onSubmitFunction={handleSubmit}
        onChangeFunctionName={getEmailDetails}
        onChangeFunctionPassword={getPasswordDetails}
        inputNameValue={loginEmail}
        inputPasswordValue={loginPassword}
        errorMessage={errorMessage}
        showTerms={false}
        authButtonText="შესვლა"
      />
    </div>
  );
};

export default LoginPageForm;

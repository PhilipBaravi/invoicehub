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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePassword(registerPassword)) {
      setErrorMessage(
        "პაროლი უნდა შედგებოდეს მინიმუმ 8 სიმბოლოსგან, შეიცავდეს ერთ დიდ ასოს, ერთ პატარა ასოს, ერთ ციფრს და ერთ სპეციალურ სიმბოლოს."
      );
      return;
    }

    setErrorMessage(""); 

    // Mock successful registration and redirect to the EmailVerification page
    console.log("Register Name:", registerName);
    console.log("Register Password:", registerPassword);

    navigate("/email-verification");
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

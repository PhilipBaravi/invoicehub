import { FC } from "react";
import TermsAndConditions from "./TermsAndConditions";

type AuthFormProps = {
  onSubmitFunction: (e: React.FormEvent<HTMLFormElement>) => void;
  onChangeFunctionName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeFunctionPassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputNameValue: string;
  inputPasswordValue: string;
  errorMessage: string;
  showTerms: boolean;
  authButtonText: string;
};

const AuthForm: FC<AuthFormProps> = ({
  onSubmitFunction,
  onChangeFunctionName,
  onChangeFunctionPassword,
  inputNameValue,
  inputPasswordValue,
  errorMessage,
  showTerms,
  authButtonText,
}) => {
  return (
    <form className="flex flex-col justify-center items-center gap-[0.5rem]" onSubmit={onSubmitFunction}>
      <input
        type="email"
        value={inputNameValue}
        required
        onChange={onChangeFunctionName}
        placeholder="ელ.ფოსტა"
        className="w-[350px]  p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brightBlue transition-all duration-300 text-black font-georgian text-lg"
      />
      <input
        type="password"
        value={inputPasswordValue}
        required
        onChange={onChangeFunctionPassword}
        placeholder="პაროლი"
        className="w-[350px]  p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brightBlue transition-all duration-300 text-black font-georgian text-lg"
      />
      {errorMessage && <p className="text-red-500 text-sm mt-2 w-[75%]">{errorMessage}</p>} {/* Error message for invalid password */}
      
      {showTerms && <TermsAndConditions />}
      
      <button
        type="submit"
        className="mt-[15px] w-[250px] md:w-[60%] p-3 bg-brightBlue text-white border border-transparent rounded-lg font-georgian text-lg transition-all duration-300 hover:bg-white hover:text-brightBlue hover:border-black"
      >
        {authButtonText}
      </button>
    </form>
  );
};

export default AuthForm;

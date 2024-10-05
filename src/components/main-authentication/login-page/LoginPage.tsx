import { FC } from "react";
import LoginPageForm from "./LoginPageForm";
import LogInnOptions from "./LogInOptions";

const LoginPage: FC = () => {
  return (
    <div className="relative w-full min-h-screen bg-brightBlue flex flex-col lg:flex-row justify-center items-center gap-[50px] overflow-hidden">
      {/* Background shapes */}
      <div className="absolute top-0 left-0 w-[60%] h-[60%] bg-blue-700 rounded-full translate-x-[-25%] translate-y-[-25%]"></div>
      <div className="absolute bottom-0 right-0 w-[70%] h-[70%] bg-blue-600 rounded-full translate-x-[25%] translate-y-[25%]"></div>

      {/* Login card */}
      <div className="relative z-10 w-[90%] md:w-[60%] lg:w-[40%] xl:w-[32%] min-h-[90%] h-auto border rounded-[2.125rem] bg-white flex flex-col justify-center items-center py-[30px]">
        <div className="w-[70%] flex flex-col justify-center items-center gap-[0.6rem]">
          <h1 className="font-georgian text-[1.3rem] font-[750] leading-normal tracking-wider text-black text-center">
            ელექტრონული ინვოისების სერვისი
          </h1>
          <p className="font-georgian text-[0.9rem] font-[600] leading-normal text-black text-center">
            შესვლა
          </p>
        </div>

        <LoginPageForm />
        <hr className="w-[75%] h-[2px] bg-gray-500 my-[25px]" />
        <div className="w-[90%] flex flex-col justify-center items-center">
          <LogInnOptions />
        </div>
      </div>

      {/* Login illustration */}
      <div className="relative hidden lg:flex w-[90%] md:w-[60%] lg:w-[40%] xl:w-[32%] justify-center items-center">
        <img src="/images/loginperson.png" alt="Login Illustration" className="w-auto h-auto" />
      </div>
    </div>
  );
};

export default LoginPage;

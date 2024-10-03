import { FC } from "react";
import LoginPageForm from "./LoginPageForm";
import LogInnOptions from "./LogInOptions";

const LoginPage: FC = () => {
  return (
    <div className="w-full h-screen bg-brightBlue flex flex-col justify-center items-center">
      <div className="w-[90%] md:w-[70%] lg:w-[50%] xl:w-[35%] h-[90%] border rounded-[2.125rem] bg-white flex flex-col justify-center items-center">
        <div className="w-[70%] flex flex-col justify-center items-center gap-[0.6rem]">
          <h1 className="font-georgian text-[1.3rem] font-[750] leading-normal tracking-wider text-black text-center">
            ელექტრონული ინვოისების სერვისი
          </h1>
          <p className="font-georgian text-[0.9rem] font-[600] leading-normal text-black text-center">შესვლა</p>
        </div>

        {/* Login Form */}
        <LoginPageForm />
        <hr className="w-[75%] h-[2px] bg-gray-500 my-[25px]" />
        <div className="w-[90%] flex flex-col justify-center items-center">
          <LogInnOptions />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

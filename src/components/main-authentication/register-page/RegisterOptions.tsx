import { FC } from "react";
import { Link } from "react-router-dom";  
import AuthOptions from "../AuthOptions";

const RegisterOptions: FC = () => {
  return (
    <>
      <AuthOptions googleIconText="რეგისტრაცია Google-ის გამოყენებით" appleIconText="რეგისტრაცია Apple-ის გამოყენებით" showHelpOptions={false} />
      <p className="text-sm font-medium text-gray-700 mt-[20px] font-georgian">
        უკვე გაქვთ ანგარიში?{" "}
        <Link to="/login" className="text-brightBlue hover:underline">
          შესვლა
        </Link>
      </p>
    </>
  );
};

export default RegisterOptions;
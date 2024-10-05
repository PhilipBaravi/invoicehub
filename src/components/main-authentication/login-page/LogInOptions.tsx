import { FC } from "react";
import { Link } from "react-router-dom";
import AuthOptions from "../AuthOptions";

const LogInnOptions: FC = () => {
  return (
    <>
      <AuthOptions googleIconText="შესვლა Google-ის გამოყენებით" appleIconText="შესვლა Apple-ის გამოყენებით" showHelpOptions={true} />
      <Link to="/register" className="text-brightBlue hover:underline mt-[30px] font-medium font-georgian">
        რეგისტრაცია
      </Link>
    </>
  );
};

export default LogInnOptions;
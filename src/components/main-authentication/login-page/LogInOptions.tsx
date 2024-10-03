import { FC } from "react";
import { Link } from "react-router-dom";
import AuthOptions from "../AuthOptions";

const LogInnOptions: FC = () => {
  return (
    <>
      <AuthOptions googleIconText="Sign in with Google" appleIconText="Sign in with Apple" showHelpOptions={true} />
      <Link to="/register" className="text-brightBlue hover:underline mt-[30px] font-medium">
        Sign Up
      </Link>
    </>
  );
};

export default LogInnOptions;

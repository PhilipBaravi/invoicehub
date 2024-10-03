import { FC } from "react";
import { Link } from "react-router-dom";  // Import Link from react-router-dom
import AuthOptions from "../AuthOptions";

const RegisterOptions: FC = () => {
  return (
    <>
      <AuthOptions googleIconText="Sign up with Google" appleIconText="Sign up with Apple" showHelpOptions={false} />
      <p className="text-sm font-medium text-gray-700 mt-[20px]">
        Already have an account?{" "}
        <Link to="/login" className="text-brightBlue hover:underline">
          Log In
        </Link>
      </p>
    </>
  );
};

export default RegisterOptions;

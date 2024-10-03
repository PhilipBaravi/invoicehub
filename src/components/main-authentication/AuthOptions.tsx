import { FC } from "react";
import GoogleIcon from "./GoogleIcon";
import AppleIcon from "./AppleIcon";

//Add functions to buttons, for login page and registration page to handle functionality

type AuthOptionsProps = {
    googleIconText: string,
    appleIconText: string
    showHelpOptions: boolean,
}

const AuthOptions: FC<AuthOptionsProps> = ({googleIconText, appleIconText, showHelpOptions}) => {
    return(
        <>
        {/* Sign in with Google and Apple */}
        <div className="flex justify-center gap-4 mb-4">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition hover:bg-gray-100">
            <GoogleIcon />
            {googleIconText}
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition hover:bg-gray-100">
            <AppleIcon />
            {appleIconText}
          </button>
        </div>
        {showHelpOptions && <div className="flex justify-between items-center my-[0.1rem] w-[75%]">
        <a href="#" className="text-brightBlue hover:underline">Forgot Your Password?</a>
        <a href="#" className="text-brightBlue hover:underline">Can't log in</a>
      </div>}
        
        </>
    )
}

export default AuthOptions
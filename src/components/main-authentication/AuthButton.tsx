import { FC } from "react";

type AuthButtonProps = {
    authButtonText: string
}

const AuthButton: FC<AuthButtonProps> = ({authButtonText}) => {
    return(
        <button
        type="submit"
        className="mt-[15px] w-[250px] md:w-[60%] p-3 bg-brightBlue text-white border border-transparent rounded-lg font-georgian text-lg transition-all duration-300 hover:bg-white hover:text-brightBlue hover:border-black"
      >
        {authButtonText}
      </button>
    )
}

export default AuthButton
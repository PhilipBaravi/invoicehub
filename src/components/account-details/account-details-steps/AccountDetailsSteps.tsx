import { FC } from "react";
import ContactSupportIcon from "./ContactSupportIcon";
import LogOutIcon from "./LogOutIcon";

const AccountDetailsSteps: FC = () => {
    return(
        <div className="w-full mx-auto h-[4.375rem] flex justify-center items-center bg-brightBlue">
            <div className="w-[90%] flex justify-between items-center">
            <div className="flex items-center gap-[10px]">
                <h2 className="w-[30px] text-[1.2rem] text-center bg-white border rounded-[50%]">
                    1
                </h2>
                <p className="text-white text-[1.3rem] font-[500] leading-normal tracking wider">Profile</p>
            </div>
            <div className="flex items-center gap-[15px]">
                <div className="flex items-center gap-[8px]">
                <ContactSupportIcon />
                <p className="text-white text-[1rem] font-[400] leading-normal  hover:underline cursor-pointer">Contact Support</p>
                </div>
                <div className="flex items-center gap-[8px]">
                <LogOutIcon />
                <button className="text-white text-[1rem] font-[400] leading-normal border border-none bg-brightBlue hover:underline">Log Out</button>
                </div>
            </div>
            </div>
        </div>
    )
}

export default AccountDetailsSteps
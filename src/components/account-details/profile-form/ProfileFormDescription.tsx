import { FC, memo } from "react";

const ProfileFormDescription: FC = () => {
    return(
        <div className="w-[90%] flex flex-col items-start mt-[1rem]">
            <h1 className="text-black text-[1.3rem] font-[700] leading-normal tracking-wider">Logo</h1>
            <h2 className="text-black text-[1.2rem] font-[500] leading-normal mt-[1rem]">Welcome!</h2>
            <p className="text-black text-[1.2rem] font-[500] leading-normal mt-[0.5rem]">Let's Get You Set Up</p>
        </div>
    )
}

export default memo(ProfileFormDescription)
import { FC, memo } from "react";

const ProfileFormDescription: FC = () => {
  return (
    <div className="w-[90%] flex flex-col items-start mt-[1rem] font-georgian">
      <h1 className="text-black text-[1.3rem] font-[700] leading-normal tracking-wider">
        ლოგო
      </h1>
      <h2 className="text-black text-[1.2rem] font-[500] leading-normal mt-[1rem]">
        კეთილი იყოს თქვენი მობრძანება!
      </h2>
      <p className="text-black text-[1.2rem] font-[500] leading-normal mt-[0.5rem]">
        დავიწყოთ სისტემის დაყენება
      </p>
    </div>
  );
};

export default memo(ProfileFormDescription);
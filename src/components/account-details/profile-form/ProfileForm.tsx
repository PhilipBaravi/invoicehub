import { FC } from "react";
import ProfileFormDescription from "./ProfileFormDescription";
import ProfileSetUpForm from "./ProfileSetUpForm";

const ProfileForm: FC = () => {
    return(
        <div className="w-full flex flex-col justify-center items-center">
            <ProfileFormDescription profileHeading="კეთილი იყოს თქვენი მობრძანება!" profileLogo="ლოგო" profileParagraph="დავიწყოთ სისტემის დაყენება"/>
            <ProfileSetUpForm />
        </div>
    )
}

export default ProfileForm
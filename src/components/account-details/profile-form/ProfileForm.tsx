import { FC } from "react";
import ProfileFormDescription from "./ProfileFormDescription";
import ProfileSetUpForm from "./ProfileSetUpForm";

const ProfileForm: FC = () => {
    return(
        <div className="w-full flex flex-col justify-center items-center">
            <ProfileFormDescription />
            <ProfileSetUpForm />
        </div>
    )
}

export default ProfileForm
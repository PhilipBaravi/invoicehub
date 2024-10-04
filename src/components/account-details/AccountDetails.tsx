import { FC } from "react";
import AccountDetailsSteps from "./account-details-steps/AccountDetailsSteps";
import ProfileForm from "./profile-form/ProfileForm";

const AccountDetails : FC = () => {
    return(
        <div className="w-full h-screen bg-white flex flex-col">
            <AccountDetailsSteps />
            <ProfileForm />
        </div>
    )
}

export default AccountDetails
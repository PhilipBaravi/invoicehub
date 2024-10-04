import { FC } from "react";
import AccountDetailsSteps from "./account-details-steps/AccountDetailsSteps";
import ProfileForm from "./profile-form/ProfileForm";

const AccountDetails : FC = () => {
    const steps = [
        { number: 1, label: 'შეიყვანეთ თქვენი პროფილის ინფორმაცია' },
        { number: 2, label: 'გვიამბეთ თქვენს ბიზნესზე' },
        { number: 3, label: 'გვიამბეთ რა მიზნით ხართ აქ' },
      ];
      
    return(
        <div className="w-full h-screen bg-white flex flex-col md:flex-row">
            <AccountDetailsSteps steps={steps}/>
            <ProfileForm />
        </div>
    )
}

export default AccountDetails
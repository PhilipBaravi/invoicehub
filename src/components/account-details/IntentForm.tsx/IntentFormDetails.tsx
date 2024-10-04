import { FC } from "react";
import AccountDetailsSteps from "../account-details-steps/AccountDetailsSteps";
import ProfileFormDescription from "../profile-form/ProfileFormDescription";
import IntentSetUpForm from "./IntentSetUpForm";

const IntentFormDetails: FC = () => {
    const steps = [
        { number: 1, label: 'შეიყვანეთ თქვენი პროფილის ინფორმაცია' },
        { number: 2, label: 'გვიამბეთ თქვენს ბიზნესზე' },
        { number: 3, label: 'გვიამბეთ რა მიზნით ხართ აქ' },
      ];
    return(
        <div className="w-full h-screen bg-white flex flex-col md:flex-row">
        <AccountDetailsSteps steps={steps}/>
        <div className="w-full flex flex-col justify-center items-center">
            <ProfileFormDescription profileLogo='ლოგო' profileHeading="რა არის თქვენი მთავარი პრიორიტეტი?" profileParagraph="ჩვენ გამოვიყენებთ ამ ინფორმაციას, რათა დაგეხმაროთ დასაწყისში."/>
            <IntentSetUpForm />
        </div>
    </div>
    )
}

export default IntentFormDetails
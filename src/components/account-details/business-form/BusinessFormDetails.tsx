import { FC } from "react";
import AccountDetailsSteps from "../account-details-steps/AccountDetailsSteps";
import ProfileFormDescription from "../profile-form/ProfileFormDescription";
import BusinessSetUpForm from "./BusinessSetUpForm";

const BusinessFormDetails:FC = () => {
    const steps = [
        { number: 1, label: 'შეიყვანეთ თქვენი პროფილის ინფორმაცია', check: true },
        { number: 2, label: 'გვიამბეთ თქვენს ბიზნესზე', check: false },
        { number: 3, label: 'გვიამბეთ რა მიზნით ხართ აქ', check: false },
      ];
    return(
        
        <div className="w-full h-screen bg-white flex flex-col md:flex-row">
        <AccountDetailsSteps steps={steps}/>
        <div className="w-full flex flex-col justify-center items-center">
            <ProfileFormDescription profileLogo='ლოგო' profileHeading="გვითხარით თქვენს ბიზნესზე, რომ ჩვენ შევძლოთ თქვენი გამოცდილების ინდივიდუალურად მორგება." profileParagraph=""/>
            <BusinessSetUpForm />
        </div>
    </div>
    )
}

export default BusinessFormDetails
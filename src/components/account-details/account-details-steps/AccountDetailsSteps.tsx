import { FC } from "react";
import ContactSupportIcon from "./ContactSupportIcon";
import LogOutIcon from "./LogOutIcon";
import { useNavigate } from "react-router-dom";
import CheckIcon from "./CheckIcon";

type Step = {
  number: number;
  label: string;
  check: boolean;
};

type AccountDetailsStepsProps = {
  steps: Step[];
};

const AccountDetailsSteps: FC<AccountDetailsStepsProps> = ({ steps }) => {
  const navigate = useNavigate();

  const handleMain = () => {
    navigate("/");
  };

  // Determine the current step
  let currentStepIndex = steps.findIndex(step => !step.check);
  if (currentStepIndex === -1) {
    currentStepIndex = steps.length - 1;
  }

  return (
    <div className="relative w-full min-h-[280px] md:h-screen flex items-center justify-center bg-brightBlue p-4 overflow-hidden font-georgian">
      <div className="w-[90%] bg-blue-800 rounded-lg p-8 max-w-md lg:scale-[1.2] xl:scale-[1.35]">
        <div className="relative z-10 space-y-12">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`flex items-start ${index !== currentStepIndex ? 'hidden md:flex' : ''}`}
            >
              <div className="flex-shrink-0 relative">
                {index > 0 && (
                  <div className="absolute top-0 left-1/2 w-0.5 bg-white h-[5rem] -mt-[4.5rem] transform -translate-x-1/2 hidden md:block" />
                )}
                <div className="bg-white rounded-full h-8 w-8 flex items-center justify-center text-blue-700 font-bold z-10 relative mt-[10px] md:mt-0">
                  {step.check ? <CheckIcon /> : step.number}
                </div>
              </div>
              <div className="ml-4 md:mt-1 mt-[10px]">
                <p className="text-white font-medium">{step.label}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-between">
          <button className="text-white flex items-center">
            <ContactSupportIcon />
            კონტაქტი
          </button>
          <button className="text-white flex items-center" onClick={handleMain}>
            <LogOutIcon />
            გასვლა
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsSteps;

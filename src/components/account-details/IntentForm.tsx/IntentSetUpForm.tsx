import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthButton from "../../main-authentication/AuthButton";
import InvoiceClientsIcon from "./intent-form-icons/InvoiceClientsIcon";
import CollaborationIcon from "./intent-form-icons/CollaborationIcon";
import LearnIcon from "./intent-form-icons/LearnIcon";
import MonitorIcon from "./intent-form-icons/MonitorIcon";
import OrganizeIcon from "./intent-form-icons/OrganizeIcon";
import TrackIcon from "./intent-form-icons/TrackIcon";

const IntentSetUpForm: FC = () => {
    const [priority, setPriority] = useState<string>("");
    const navigate = useNavigate();

    const options = [
        {
            description: "ინვოისების გამოგზავნა და გადახდა",
            icon: <InvoiceClientsIcon />
        },
        {
            description: "ბუღალტრული აღრიცხვისა და ხარჯების მართვა",
            icon: <OrganizeIcon />
        },
        {
            description: "გუნდის თანამშრომლობა და სახელფასო განყოფილების მართვა",
            icon: <CollaborationIcon />
        },
        {
            description: "ფინანსების მონიტორინგი და ნაღდი ფულის ნაკადის კონტროლი",
            icon: <MonitorIcon />
        },
        {
            description: "დროის აღრიცხვა და პროექტების მართვა",
            icon: <TrackIcon />
        },
        {
            description: "FreshBooks-ის შესწავლა პირადად",
            icon: <LearnIcon />
        }
    ];

    const handleOptionClick = (description: string) => {
        setPriority(description);
    };

    const handleNext = () => {
        if (!priority) {
            alert("გთხოვთ აირჩიოთ თქვენი მთავარი პრიორიტეტი.");
            return;
        }
        console.log("Selected priority:", priority);
        navigate("/next-page");
    };

    const handlePrev = () => {
        navigate("/business-details");
    };

    return (
        <div className="w-[90%] flex flex-col items-start mt-[1.5rem]">
            <h2 className="text-black text-2xl font-bold font-georgian">რა არის თქვენი მთავარი პრიორიტეტი?</h2>
            <p className="text-gray-600 mb-[1rem] font-georgian">ამ ინფორმაციას გამოვიყენებთ, რათა დაგეხმაროთ უკეთესი დასაწყისისთვის.</p>
            <form className="flex flex-col items-start gap-[1.2rem] w-full">
                {options.map((option, i) => (
                    <button
                        key={i + option.description}
                        type="button"
                        onClick={() => handleOptionClick(option.description)}
                        className={`w-full flex items-center gap-[15px] p-3 border border-gray-300 rounded-lg focus:outline-none transition-all duration-300 text-black text-lg font-georgian ${
                            priority === option.description ? "bg-brightBlue text-white" : ""
                        }`}
                    >
                        {option.icon}
                        {option.description}
                    </button>
                ))}

<div className="flex md:flex-col items-start w-full mt-4 gap-[20px] pb-[30px]">
                    <AuthButton authButtonText="შენახვა და დასრულება" navigatePage={handleNext} />
                    <AuthButton authButtonText="უკან" navigatePage={handlePrev} />
                </div>
            </form>
        </div>
    );
};

export default IntentSetUpForm;

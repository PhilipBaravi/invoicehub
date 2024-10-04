import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthButton from "../../main-authentication/AuthButton";

const IntentSetUpForm: FC = () => {
    const [priority, setPriority] = useState<string>("");
    const navigate = useNavigate();

    const options = [
        "ინვოისების გამოგზავნა და გადახდა",
        "ბუღალტრული აღრიცხვისა და ხარჯების მართვა",
        "გუნდის თანამშრომლობა და სახელფასო განყოფილების მართვა",
        "ფინანსების მონიტორინგი და ნაღდი ფულის ნაკადის კონტროლი",
        "დროის აღრიცხვა და პროექტების მართვა",
        "FreshBooks-ის შესწავლა პირადად"
    ];

    const handleOptionClick = (option: string) => {
        setPriority(option);
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
        navigate('/business-details');
    };

    return (
        <div className="w-[90%] flex flex-col items-start mt-[1.5rem]">
            <h2 className="text-black text-2xl font-bold font-georgian">რა არის თქვენი მთავარი პრიორიტეტი?</h2>
            <p className="text-gray-600 mb-[1rem] font-georgian">ამ ინფორმაციას გამოვიყენებთ, რათა დაგეხმაროთ უკეთესი დასაწყისისთვის.</p>
            <form className="flex flex-col items-start gap-[0.5rem] w-full">
                {options.map((option) => (
                    <button
                        key={option}
                        type="button"
                        onClick={() => handleOptionClick(option)}
                        className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none transition-all duration-300 text-black text-lg font-georgian ${
                            priority === option ? 'bg-brightBlue text-white' : ''
                        }`}
                    >
                        {option}
                    </button>
                ))}

                <div className="flex flex-col items-start w-full mt-4">
                    <AuthButton authButtonText="შენახვა და დასრულება" navigatePage={handleNext} />
                    <AuthButton authButtonText="უკან" navigatePage={handlePrev} />
                </div>
            </form>
        </div>
    );
};

export default IntentSetUpForm;

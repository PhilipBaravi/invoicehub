import { FC, useState } from "react";
import AuthButton from "../../main-authentication/AuthButton";
import { useNavigate } from "react-router-dom";

const BusinessSetUpForm: FC = () => {
    const [companyName, setCompanyName] = useState<string>("");
    const [businessType, setBusinessType] = useState<string>("");
    const [businessDescription, setBusinessDescription] = useState<string>("");
    const [estimatedRevenue, setEstimatedRevenue] = useState<string>("");
    const [serviceCompletionTime, setServiceCompletionTime] = useState<string>("");
    const [billingMethod, setBillingMethod] = useState<string>("");
    const [customizationOption, setCustomizationOption] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const navigate = useNavigate();

    const handlePrev = () => {
        navigate('/account-details/');
    }

    // Form validation and submission
    const handleSubmit = () => {
        if (!companyName || !businessType || !businessDescription || !estimatedRevenue || !serviceCompletionTime || !billingMethod || !customizationOption) {
            setErrorMessage("გთხოვთ შეავსოთ ყველა ველი.");
            return false;
        }

        setErrorMessage("");
        console.log("Business form submitted with the following data:", {
            companyName,
            businessType,
            businessDescription,
            estimatedRevenue,
            serviceCompletionTime,
            billingMethod,
            customizationOption
        });
        return true;
    };

    const handleNext = () => {
        if (handleSubmit()) {
            navigate("/intent-details/");
        }
    };

    return (
        <div className="w-[90%] flex flex-col items-start mt-[1.5rem]">
            <form className="flex flex-col items-start gap-[0.5rem] w-full">
                <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="რა ჰქვია თქვენს კომპანიას? *"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brightBlue transition-all duration-300 text-black text-lg"
                    required
                />

                <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brightBlue transition-all duration-300 text-black text-lg"
                    required
                >
                    <option value="">რა საქმიანობითაა დაკავებული თქვენი ბიზნესი? *</option>
                    <option value="Construction, Trades and Home Services">სამშენებლო და სახლის სერვისები</option>
                    <option value="Consulting and Professional Services">კონსულტაციები და პროფესიული სერვისები</option>
                    <option value="Retail and E-commerce">საყიდლები და ელექტრონული კომერცია</option>
                    <option value="Other">სხვა</option>
                </select>

                <select
                    value={businessDescription}
                    onChange={(e) => setBusinessDescription(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brightBlue transition-all duration-300 text-black text-lg"
                    required
                >
                    <option value="">როგორ აღწერთ თქვენს ბიზნესს? *</option>
                    <option value="Full-time or main income">სრული განაკვეთით ან მთავარი შემოსავალი</option>
                    <option value="Part-time or supplements main income">ნახევარ განაკვეთით ან დამატებითი შემოსავალი</option>
                </select>

                <select
                    value={estimatedRevenue}
                    onChange={(e) => setEstimatedRevenue(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brightBlue transition-all duration-300 text-black text-lg"
                    required
                >
                    <option value="">როგორია თქვენი წლიური შემოსავალი? *</option>
                    <option value="$0 to $10,000">$0-დან $10,000-მდე</option>
                    <option value="$10,000 to $50,000">$10,000-დან $50,000-მდე</option>
                    <option value="$50,000 to $100,000">$50,000-დან $100,000-მდე</option>
                    <option value="$100,000+">$100,000+</option>
                </select>

                <select
                    value={serviceCompletionTime}
                    onChange={(e) => setServiceCompletionTime(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brightBlue transition-all duration-300 text-black text-lg"
                    required
                >
                    <option value="">რამდენ ხანში ასრულებთ სერვისს? *</option>
                    <option value="Less than a week">ნაკლები ვიდრე ერთი კვირა</option>
                    <option value="1-2 weeks">1-2 კვირა</option>
                    <option value="More than 2 weeks">2 კვირაზე მეტი</option>
                </select>

                <select
                    value={billingMethod}
                    onChange={(e) => setBillingMethod(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brightBlue transition-all duration-300 text-black text-lg"
                    required
                >
                    <option value="">რით ახდენთ კლიენტების დასაფარებას? *</option>
                    <option value="Pen and paper">კალამი და ქაღალდი</option>
                    <option value="Billing software">ბილინგის პროგრამა</option>
                    <option value="Other">სხვა</option>
                </select>

                <label className="text-black text-lg mt-2">
                    რამდენად ინდივიდუალურია თქვენი შეთავაზება კლიენტებისთვის? *
                </label>
                <div className="w-full flex items-start gap-[30px]">
                    <button
                        type="button"
                        onClick={() => setCustomizationOption("More or less the same")}
                        className={`p-3 border border-gray-300 rounded-lg focus:outline-none text-black text-lg transition-all duration-300 ${customizationOption === "More or less the same" ? 'bg-brightBlue text-white' : ''}`}
                    >
                        თითქმის იგივე
                    </button>
                    <button
                        type="button"
                        onClick={() => setCustomizationOption("Different or customized")}
                        className={`p-3 border border-gray-300 rounded-lg focus:outline-none text-black text-lg transition-all duration-300 ${customizationOption === "Different or customized" ? 'bg-brightBlue text-white' : ''}`}
                    >
                        განსხვავებული ან ინდივიდუალური
                    </button>
                </div>

                {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}

                <div className="flex flex-col items-start w-full mt-4">
                <AuthButton authButtonText="შემდეგი" navigatePage={handleNext} />
                    <AuthButton authButtonText="უკან" navigatePage={handlePrev} />
                </div>
            </form>
        </div>
    );
};

export default BusinessSetUpForm;

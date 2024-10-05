import { FC, memo } from "react";

const RegisterPageAbout: FC = () => {
    return(
        <div className="relative w-[45%] h-screen flex flex-col items-start gap-[20px] text-white p-8 justify-center opacity-100">
            <div className="absolute inset-0 bg-brightBlue opacity-100 z-[-1]"></div>

            <h1 className="text-3xl font-bold">დაზოგეთ $7,000 წელიწადში ბილინგის საათებში</h1>
            <p>პოპულარულია ბიზნესის მფლობელებში, მათ გუნდებში და ბუღალტრებში.</p>
            <ul className="list-none">
                <li className="flex items-center gap-2">
                    <span className="text-green-400">&#10004;</span>გადმოიტანეთ თქვენი არსებული პროგრამული უზრუნველყოფიდან მარტივად
                </li>
                <li className="flex items-center gap-2">
                    <span className="text-green-400">&#10004;</span>თქვენი მონაცემები უსაფრთხოდაა დაცული
                </li>
                <li className="flex items-center gap-2">
                    <span className="text-green-400">&#10004;</span>მიიღეთ პირდაპირი მომხმარებელთა მხარდაჭერა
                </li>
            </ul>

            <hr className="w-full h-[2px] bg-white my-4" />

            <h1 className="text-2xl font-bold">გამოიყენეთ უფასოდ 30 დღის განმავლობაში.</h1>
            <p>არ არის საჭირო საკრედიტო ბარათი. შეწყვეტა ნებისმიერ დროს შესაძლებელია.</p>

            <hr className="w-full h-[2px] bg-white my-4" />

            <p className="italic">
                “E-Invoices მნიშვნელოვნად გააუმჯობესებს ნაღდი ფულის მართვას. ჩვენ მივიღეთ ანგარიშების
                მიღება გაცილებით მაღალი პროცენტით, ვიდრე ადრე. მრავალი კლიენტი კარგად გამოეხმაურა E-Inovices.”
            </p>

            <div className="w-full flex items-center gap-[30px] mt-4">
                <div className="w-[100px] h-[100px] rounded-full bg-gray-300 overflow-hidden">
                    <img src="/images/person.jpg" alt="ჯესიკა მაკკორმიკი" />
                </div>
                <div className="flex flex-col gap-[5px] items-start">
                    <p className="font-bold">ჯესიკა მაკკორმიკი</p>
                    <p>McCormick Tax Group-ის მფლობელი</p>
                </div>
            </div>
        </div>
    );
};

export default memo(RegisterPageAbout);

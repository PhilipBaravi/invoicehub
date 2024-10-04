import { FC, memo } from "react";

const TermsAndConditions: FC = () => {
  return (
    <>
      <div className="flex items-center mt-4 w-[350px] justify-between items-center font-georgian">
        <input
          id="terms-checkbox"
          type="checkbox"
          className="w-8 h-8 text-brightBlue border-gray-300 rounded focus:ring-brightBlue"
          required
        />
        <label
          htmlFor="terms-checkbox"
          className="ml-2 text-sm font-medium text-gray-700 font-georgian"
        >
          ვადასტურებ, რომ გავეცანი და ვეთანხმები{" "}
          <a href="#" className="text-brightBlue hover:underline">
            მომსახურების პირობებს
          </a>{" "}
          და{" "}
          <a href="#" className="text-brightBlue hover:underline">
            კონფიდენციალურობის პოლიტიკას
          </a>
          .
        </label>
      </div>
    </>
  );
};

export default memo(TermsAndConditions);
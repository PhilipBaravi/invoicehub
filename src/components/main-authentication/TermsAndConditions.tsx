import { FC, memo} from "react";




const TermsAndConditions: FC = () => {

    return(
      <>
      <div className="flex items-center  mt-4 w-[350px] justify-between items-center">
          <input
            id="terms-checkbox"
            type="checkbox"
            className="w-8 h-8 text-brightBlue border-gray-300 rounded focus:ring-brightBlue"
            required
          />
          <label
            htmlFor="terms-checkbox"
            className="ml-2 text-sm font-medium text-gray-700"
          >
            I confirm that I have read and agree to{" "}
            <a href="#" className="text-brightBlue hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-brightBlue hover:underline">
              Privacy Policy
            </a>
            .
          </label>
        </div>
      
      </>
        
    )
}

export default memo(TermsAndConditions)
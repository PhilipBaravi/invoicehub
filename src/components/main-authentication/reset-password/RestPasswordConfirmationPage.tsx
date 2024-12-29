import { FC } from "react";
import LoginRegisterLayout from "../LoginRegisterLayout";
import ResetPasswordConfirmationForm from "./RestPasswordConfirmation";

const ResetPasswordConfirmationPage: FC = () => {
  return (
    <LoginRegisterLayout
      title="Reset password"
      subtitle="Fill in details to reset password"
    >
      <ResetPasswordConfirmationForm />
    </LoginRegisterLayout>
  );
};

export default ResetPasswordConfirmationPage;

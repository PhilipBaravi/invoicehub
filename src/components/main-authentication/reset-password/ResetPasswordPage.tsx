import { FC } from "react";
import LoginRegisterLayout from "../LoginRegisterLayout";
import ResetPasswordForm from "./ResetPasswordForm";

const ResetPasswordPage: FC = () => {
  return (
    <LoginRegisterLayout
      title="Reset password"
      subtitle="Fill in details to reset password"
    >
      <ResetPasswordForm />
    </LoginRegisterLayout>
  );
};

export default ResetPasswordPage;

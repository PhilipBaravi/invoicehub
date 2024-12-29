import { FC } from "react";
import LoginRegisterLayout from "../LoginRegisterLayout";
import ResetPasswordForm from "./ResetPasswordForm";

const ResetPasswordPage: FC = () => {
  return (
    <LoginRegisterLayout
      title="Reset password"
      subtitle="Fill in email to receive password recovery link."
    >
      <ResetPasswordForm />
    </LoginRegisterLayout>
  );
};

export default ResetPasswordPage;

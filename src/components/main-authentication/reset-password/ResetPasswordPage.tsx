import { FC } from "react";
import LoginRegisterLayout from "../LoginRegisterLayout";
import ResetPasswordForm from "./ResetPasswordForm";
import { useTranslation } from "react-i18next";

const ResetPasswordPage: FC = () => {
  const { t } = useTranslation();
  return (
    <LoginRegisterLayout
      title={t("reset.password.title")}
      subtitle={t("reset.password.subtitle")}
    >
      <ResetPasswordForm />
    </LoginRegisterLayout>
  );
};

export default ResetPasswordPage;

import { FC } from "react";
import LoginRegisterLayout from "../LoginRegisterLayout";
import ResetPasswordConfirmationForm from "./RestPasswordConfirmation";
import { useTranslation } from "react-i18next";

const ResetPasswordConfirmationPage: FC = () => {
  const { t } = useTranslation();
  return (
    <LoginRegisterLayout
      title={t("reset.password.title")}
      subtitle={t("reset.password.passwordSubtitle")}
    >
      <ResetPasswordConfirmationForm />
    </LoginRegisterLayout>
  );
};

export default ResetPasswordConfirmationPage;

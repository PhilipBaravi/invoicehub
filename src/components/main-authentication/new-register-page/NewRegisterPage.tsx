import RegisterForm from "./RegisterForm";
import LoginRegisterLayout from "../LoginRegisterLayout";
import { useTranslation } from "react-i18next";
import { RegisterFormProps } from "./types";

const NewRegisterPage: React.FC<RegisterFormProps> = ({ setUserDetails }) => {
  const { t } = useTranslation();

  return (
    <LoginRegisterLayout title={t("signUpForm.title")} subtitle="">
      <RegisterForm setUserDetails={setUserDetails} />
    </LoginRegisterLayout>
  );
};

export default NewRegisterPage;

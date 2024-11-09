import RegisterForm from './RegisterForm';
import LoginRegisterLayout from '../LoginRegisterLayout';
import { useTranslation } from 'react-i18next';

interface UserFormValues {
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface NewRegisterPageProps {
  setUserDetails: (details: UserFormValues) => void;
}

const NewRegisterPage: React.FC<NewRegisterPageProps> = ({ setUserDetails }) => {
  const { t } = useTranslation();
  
  return (
    <LoginRegisterLayout title={t('signUpForm.title')} subtitle="">
      <RegisterForm setUserDetails={setUserDetails} />
    </LoginRegisterLayout>
  );
};

export default NewRegisterPage;

import RegisterForm from './RegisterForm';
import LoginRegisterLayout from '../LoginRegisterLayout';

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
  return (
    <LoginRegisterLayout title="Create a New Account" subtitle="">
      <RegisterForm setUserDetails={setUserDetails} />
    </LoginRegisterLayout>
  );
};

export default NewRegisterPage;

import LoginRegisterLayout from '../LoginRegisterLayout';
import LoginForm from './LoginForm';

const NewLoginPage = () => {
  return (
    <LoginRegisterLayout
      title="Login to your account"
      subtitle="Enter your email and password to access your account"
    >
      <LoginForm />
    </LoginRegisterLayout>
  );
};

export default NewLoginPage;

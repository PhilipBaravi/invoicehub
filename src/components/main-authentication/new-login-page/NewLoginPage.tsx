import LoginRegisterLayout from '../LoginRegisterLayout';
import LoginForm from './LoginForm';
import { useTranslation } from 'react-i18next';

const NewLoginPage = () => {
  const { t } = useTranslation();

  return (
    <LoginRegisterLayout
      title={t('loginRegisterLayout.title')}
      subtitle={t('loginRegisterLayout.subtitle')}
    >
      <LoginForm />
    </LoginRegisterLayout>
  );
};

export default NewLoginPage;

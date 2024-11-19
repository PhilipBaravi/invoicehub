import { useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import GoogleIcon from '../GoogleIcon';
import AppleIcon from '../AppleIcon';
import { useTranslation } from 'react-i18next';

const LoginForm = () => {
  const { t } = useTranslation();
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const { keycloak } = useKeycloak();

  const handleKeycloakLogin = async () => {
    if (keycloak) {
      try {
        await keycloak.login({
          redirectUri: `${window.location.origin}/dashboard`,
        });
      } catch (error) {
        console.error('Error logging in with Keycloak:', error);
      }
    } else {
      console.error('Keycloak instance not found');
    }
  };

  return (
    <>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            {t('loginForm.email')}
          </label>
          <Input
            id="email"
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full bg-stone-100 border-stone-300 dark:bg-stone-800 dark:border-stone-700"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            {t('loginForm.password')}
          </label>
          <Input
            id="password"
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-stone-100 border-stone-300 dark:bg-stone-800 dark:border-stone-700"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" required />
          <Link to="/privacy-policy">
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 underline cursor-pointer"
          >
            {t('loginForm.privacyPolicy')}
          </label>
          </Link>
        </div>
        <Button className="w-full" onClick={handleKeycloakLogin}>
          {t('loginForm.loginBtn')}
        </Button>
      </form>

      <div className="mt-6 pb-6 text-center text-sm text-stone-500 dark:text-stone-400">
        {t('loginForm.continueWith')}
      </div>

      <Button className="w-full mb-4">
        <GoogleIcon />
        {t('loginForm.loginGoogle')}
      </Button>
      <Button className="w-full">
        <AppleIcon />
        {t('loginForm.loginApple')}
      </Button>

      <p className="mt-6 text-center text-xs text-stone-500 dark:text-stone-400">
        {t('loginForm.haveAnAccount')}{' '}
        <Link to="/register" className="underline hover:text-stone-300">
          {t('loginForm.signUp')}
        </Link>
      </p>
    </>
  );
};

export default LoginForm;

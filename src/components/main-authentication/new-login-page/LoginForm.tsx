import { useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import GoogleIcon from '../GoogleIcon';
import AppleIcon from '../AppleIcon';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { directLogin } from '@/utils/keycloak';

const LoginForm = () => {
  const { t } = useTranslation();
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDirectLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const tokens = await directLogin(loginEmail, loginPassword);
      if (tokens.access_token) {
        toast({
          title: "Success",
          description: "Successfully logged in!",
          duration: 3000,
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "Invalid username or password",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'apple') => {
    keycloak.login({
      idpHint: provider,
      redirectUri: `${window.location.origin}/dashboard`,
    }).catch((error) => {
      console.error(`${provider} login error:`, error);
      toast({
        title: "Error",
        description: `Failed to login with ${provider}. Please try again.`,
        variant: "destructive",
        duration: 3000,
      });
    });
  };

  return (
    <>
      <form onSubmit={handleDirectLogin} className="space-y-4">
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
            required
            disabled={isLoading}
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
            required
            disabled={isLoading}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <Link to="/privacy-policy">
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 underline cursor-pointer"
            >
              {t('loginForm.privacyPolicy')}
            </label>
          </Link>
        </div>
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? t('loginForm.loggingIn') : t('loginForm.loginBtn')}
        </Button>
      </form>

      <div className="mt-6 pb-6 text-center text-sm">
        {t('loginForm.continueWith')}
      </div>

      <Button 
        type="button"
        className="w-full mb-4" 
        onClick={() => handleSocialLogin('google')}
        disabled={isLoading}
      >
        <GoogleIcon />
        {t('loginForm.loginGoogle')}
      </Button>
      
      <Button 
        type="button"
        className="w-full"
        onClick={() => handleSocialLogin('apple')}
        disabled={isLoading}
      >
        <AppleIcon />
        {t('loginForm.loginApple')}
      </Button>

      <p className="mt-6 text-center text-xs">
        {t('loginForm.haveAnAccount')}{' '}
        <Link to="/register" className="underline">
          {t('loginForm.signUp')}
        </Link>
      </p>
    </>
  );
};

export default LoginForm;
